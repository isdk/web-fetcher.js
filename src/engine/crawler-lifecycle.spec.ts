/**
 * Regression tests for the crawler teardown / storage lifecycle.
 *
 * Root cause distilled (full write-up in `dev.md`, "Crawler 生命周期陷阱"):
 *
 * 1. **`AutoscaledPool.abort()` is a no-op unless the pool's own `run()` has
 *    already started.** `BasicCrawler.run()` starts the pool only after
 *    `await this._init()`, and `_init()` awaits `SessionPool.open()`. A
 *    teardown inside that window — which is exactly what happens when a search
 *    race aborts a freshly created loser engine — aborts a not-yet-running
 *    pool: nothing resolves the pool promise, but `isStopped` is still flipped,
 *    so once the pool starts it never finishes (`_maybeRunTask` bails on
 *    `isStopped` and never calls `_maybeFinish`). `crawler.run()` never
 *    settles and the crawler keeps the event loop alive for minutes: a zombie.
 *
 * 2. **`abort()` deliberately does not wait for the tasks that are already
 *    running** (Crawlee: "no abortion is attempted and some of the tasks may
 *    finish, while others may not"). Those tasks still touch the request queue
 *    after the user handler returns (`markRequestHandled` / `reclaimRequest`),
 *    and the session pool still persists its state to the key-value store.
 *    Dropping those storages while a task is in flight therefore makes the
 *    settling task fail with `Request queue ... does not exist` — retried 3x,
 *    then "crawling will be terminated" — poisoning every subsequent search.
 *    Note that polling the queue state is *not* a valid signal here:
 *    `_fetchNextRequest` removes the request from the queue at the *start* of
 *    a task, so an in-flight queue reports `isEmpty() === true`.
 *
 * Both bugs only reproduce when a session is torn down while the crawler is
 * starting or while a request is in flight, so these tests deliberately
 * dispose/abort mid-flight and then assert on the *aftermath*.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'

import '../engine'
import '../action/definitions' // registers the actions used below
import { FetchEngine } from './base'
import { CheerioFetchEngine } from './cheerio'
import { FetchSession } from '../core/session'

const TEST_TIMEOUT = 30000
const storageDir = path.join(os.tmpdir(), 'isdk-web-fetcher-crawler-lifecycle-spec')

const createTestServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: false })
  server.get('/', (req, reply) => {
    reply.type('text/html').send('<html><body><h1>Welcome</h1></body></html>')
  })
  // Slow enough to still be in flight when the test aborts the session.
  server.get('/slow', (req, reply) => {
    setTimeout(() => {
      reply.type('text/html').send('<html><body><h1>Slow Page</h1></body></html>')
    }, 2000)
  })
  return server
}

/** Fails with `message` if `promise` does not settle within `timeoutMs`. */
const expectToSettle = async (
  promise: Promise<any>,
  timeoutMs: number,
  message: string
) => {
  let settled = false
  const sentinel = new Promise((_, reject) =>
    setTimeout(() => settled || reject(new Error(message)), timeoutMs)
  )
  await expect(
    Promise.race([
      promise.then(() => {
        settled = true
      }),
      sentinel,
    ])
  ).resolves.toBeUndefined()
}

/**
 * Collects everything Crawlee's logger prints (it routes through
 * `console.log`/`console.warn`/`console.error`), so the tests can assert on
 * the storage-access errors the buggy teardown produces.
 */
const captureOutput = () => {
  const lines: string[] = []
  const record = (...args: any[]) => lines.push(args.map(String).join(' '))
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(record)
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(record)
  const logSpy = vi.spyOn(console, 'log').mockImplementation(record)
  return {
    lines,
    /** Messages that prove the storages were dropped while still in use. */
    storageErrors: () =>
      lines.filter((line) =>
        /Request queue with id|Key-value store with id|An exception occurred during handling/.test(
          line
        )
      ),
    restore: () => {
      errorSpy.mockRestore()
      warnSpy.mockRestore()
      logSpy.mockRestore()
    },
  }
}

describe('crawler lifecycle', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    fs.rmSync(storageDir, { recursive: true, force: true })
    fs.mkdirSync(storageDir, { recursive: true })
    server = await createTestServer()
    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  }, TEST_TIMEOUT)

  afterAll(async () => {
    ;(server.server as any).closeAllConnections?.()
    await server.close()
  })

  // Bug 1: teardown during the crawler's own startup window leaves a zombie.
  it(
    'settles crawler.run() when the engine is disposed while the crawler is still starting',
    async () => {
      // `FetchEngine.create()` only returns once `initialize()` finishes, so
      // capture the instance the moment its crawler is created instead.
      let createdEngine: any
      let resumeCrawlerRun!: () => void
      const crawlerRunGate = new Promise<void>(
        (resolve) => (resumeCrawlerRun = resolve)
      )
      let gateHit = false
      const originalCreateCrawler = CheerioFetchEngine.prototype._createCrawler
      const createCrawlerSpy = vi
        .spyOn(CheerioFetchEngine.prototype, '_createCrawler' as any)
        .mockImplementation(function (this: any, ...args: any[]) {
          createdEngine = this
          const crawler = originalCreateCrawler.apply(this, args)
          // Hold `crawler.run()` open at `stats.startCapturing()`: by then
          // `_init()` has finished (session pool open, autoscaled pool created)
          // while the pool's own `run()` — the one that assigns `pool.resolve` —
          // has not started yet. That is exactly the window in which a
          // `teardown()` reaches `autoscaledPool.abort()` too early: the abort
          // cannot resolve the pool but still flips `isStopped`.
          const stats = crawler.stats
          const originalStartCapturing = stats.startCapturing.bind(stats)
          stats.startCapturing = async (...startArgs: any[]) => {
            gateHit = true
            await crawlerRunGate
            return originalStartCapturing(...startArgs)
          }
          return crawler
        })

      const engine = await FetchEngine.create({
        id: `lifecycle-${Date.now()}`,
        engine: 'http',
      } as any)
      // Wait until the crawler is suspended in the window: pool created, but
      // `pool.run()` (and therefore `pool.resolve`) not started yet.
      await vi.waitFor(
        () => {
          if (!gateHit) throw new Error('crawler never reached the pool window')
        },
        { timeout: 5000, pollInterval: 10 }
      )
      const crawler = createdEngine.crawler
      const pool = crawler.autoscaledPool
      expect(pool).toBeDefined()
      // `null` (not a function) proves the pool's own `run()` has not started
      // yet — this is exactly the window where `abort()` cannot resolve it.
      expect(pool.resolve).toBeNull()
      const crawlerRunPromise = createdEngine.crawlerRunPromise
      expect(crawlerRunPromise).toBeDefined()

      // Tear the engine down while the crawler is held in that window. The
      // unfixed teardown runs `sessionPool.teardown()` -> `events.close()` ->
      // `autoscaledPool.abort()`, and that abort finds `resolve === null`: it
      // flips `isStopped` and resolves nothing. The fixed code waits for the
      // pool to actually start before tearing down, so `isStopped` stays
      // `false` until the gate below is released.
      const disposePromise = engine.dispose()
      await vi
        .waitFor(
          () => {
            if (!pool.isStopped) throw new Error('teardown has not aborted yet')
          },
          { timeout: 500, pollInterval: 5 }
        )
        .catch(() => {
          /* fixed: the pool is not aborted until it has started */
        })
      resumeCrawlerRun()
      await disposePromise

      // Without the fix, the pool that starts a moment later sees `isStopped`,
      // bails out of `_maybeRunTask` and never calls `_maybeFinish`, so
      // `run()` never settles and the crawler outlived the engine (and the
      // search that created it) — the intervals it started keep the process
      // alive, which is what made the whole search hang for minutes.
      await expectToSettle(
        crawlerRunPromise,
        15_000,
        'crawler.run() never settled after dispose: zombie crawler'
      )

      createCrawlerSpy.mockRestore()
    },
    TEST_TIMEOUT
  )

  // Bug 2: dropping the storages while a task is still in flight.
  it(
    'does not drop the storages while a request is still in flight (search-race abort)',
    async () => {
      const output = captureOutput()
      const session = new FetchSession({
        engine: 'http',
        storage: { config: { localDataDirectory: storageDir } },
      })

      // Start a slow navigation and abort it mid-flight, exactly like the
      // search race aborts a loser engine while its request is still in flight.
      const pending = session
        .executeAll([{ id: 'goto', params: { url: `${baseUrl}/slow` } }])
        .catch(() => {
          /* AbortError is expected; the point is what happens afterwards */
        })
      await new Promise((resolve) => setTimeout(resolve, 300))
      await session.abort('race: superseded by another engine')
      await pending

      // The underlying request is still in flight and only settles once the
      // slow endpoint responds; give the task chain and the (deferred) storage
      // drop enough time to run before asserting.
      await new Promise((resolve) => setTimeout(resolve, 3000))
      output.restore()

      expect(output.storageErrors()).toEqual([])
    },
    TEST_TIMEOUT
  )

  it(
    'aborted engines do not leak zombie crawlers across repeated races',
    async () => {
      // The original bug only surfaced after *several* searches, because each
      // zombie kept running (and touching dropped storages) into the next one.
      for (let i = 0; i < 3; i++) {
        const output = captureOutput()
        const session = new FetchSession({
          engine: 'http',
          storage: { config: { localDataDirectory: storageDir } },
        })
        const pending = session
          .executeAll([{ id: 'goto', params: { url: `${baseUrl}/slow` } }])
          .catch(() => {})
        await new Promise((resolve) => setTimeout(resolve, 150))
        await session.abort(`race ${i}`)
        await pending
        await new Promise((resolve) => setTimeout(resolve, 2500))
        output.restore()
        expect(output.storageErrors()).toEqual([])
      }
    },
    TEST_TIMEOUT
  )
})
