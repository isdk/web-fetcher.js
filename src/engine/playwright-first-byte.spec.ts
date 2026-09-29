import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
// Import all engines to trigger registration (side effects in playwright.ts)
import '../engine'
import { FetchEngine } from './base'
import { FetchEngineContext } from '../core/context'

const TEST_TIMEOUT = 30000
// The slow endpoint never sends a byte before this delay; a navigation bounded
// only by the (much larger) timeoutMs / navigationTimeoutSecs would hang
// well past it, which is exactly the regression this suite guards against.
const SLOW_DELAY_MS = 6000

describe('Playwright Engine: firstByteMs (time-to-first-byte timeout)', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    server = fastify({ logger: false })
    server.get('/fast', async (req, reply) => {
      reply
        .type('text/html')
        .send('<html><body><h1>fast</h1></body></html>')
    })
    // Connected, but deliberately sends no data for SLOW_DELAY_MS — the
    // "waiting for the server to start responding" hang.
    server.get('/slow-ttfb', async (req, reply) => {
      await new Promise((r) => setTimeout(r, SLOW_DELAY_MS))
      reply
        .type('text/html')
        .send('<html><body><h1>slow</h1></body></html>')
    })
    await server.listen({ port: 0 })
    baseUrl = `http://localhost:${(server.server.address() as AddressInfo).port}`
  })

  afterAll(async () => {
    await server.close()
  })

  async function createEngine(opts: {
    firstByteMs?: number
    timeoutMs?: number
  }): Promise<FetchEngine> {
    const id = `test-playwright-ttfb-${Date.now()}-${Math.random()}`
    const context: FetchEngineContext = {
      id,
      engine: 'playwright' as any,
      retries: 0,
      throwHttpErrors: true,
    } as any
    const engine = await FetchEngine.create(context, {
      engine: 'playwright',
      antibot: false,
      ...opts,
    })
    if (!engine)
      throw new Error(`Failed to create Playwright engine (id=${id})`)
    return engine as FetchEngine
  }

  it('should fail a stuck-connecting navigation at firstByteMs, not at timeoutMs', async () => {
    const engine = await createEngine({ firstByteMs: 2000, timeoutMs: 20000 })
    try {
      const start = Date.now()
      await expect(engine.goto(`${baseUrl}/slow-ttfb`)).rejects.toThrow(/timed out/)
      const elapsed = Date.now() - start
      // firstByteMs (2s) decides, not the 6s server delay nor the 20s
      // navigation timeout — and certainly not Crawlee's 300s default.
      expect(elapsed).toBeLessThan(SLOW_DELAY_MS)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)

  it('should not affect a healthy navigation that responds within firstByteMs', async () => {
    const engine = await createEngine({ firstByteMs: 5000, timeoutMs: 20000 })
    try {
      const res = await engine.goto(`${baseUrl}/fast`)
      expect(res?.statusCode).toBe(200)
      // playwright 的 text 是 page.textContent('body')（纯文本），HTML 在 html 字段。
      expect(res?.html).toContain('<h1>fast</h1>')
      expect(res?.text).toContain('fast')
      // The engine reported activity once the response headers arrived.
      expect(engine.lastActivityAt).greaterThan(0)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)

  it('should fall back to timeoutMs alone when firstByteMs is disabled', async () => {
    const engine = await createEngine({ firstByteMs: 0, timeoutMs: 3000 })
    try {
      const start = Date.now()
      await expect(engine.goto(`${baseUrl}/slow-ttfb`)).rejects.toThrow()
      const elapsed = Date.now() - start
      // No first-byte tier: only the navigation timeout (3s) bounds the request.
      expect(elapsed).toBeGreaterThanOrEqual(3000)
      expect(elapsed).toBeLessThan(SLOW_DELAY_MS + 5000)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT + 5000)

  it('should apply firstByteMs to navigate actions on an active page too', async () => {
    const engine = await createEngine({ firstByteMs: 2000, timeoutMs: 20000 })
    try {
      // Establish the active page context with a healthy navigation first.
      const first = await engine.goto(`${baseUrl}/fast`)
      expect(first?.statusCode).toBe(200)

      const start = Date.now()
      await expect(
        engine.goto(`${baseUrl}/slow-ttfb`, { waitUntil: 'commit' })
      ).rejects.toThrow(/timed out/)
      const elapsed = Date.now() - start
      expect(elapsed).toBeLessThan(SLOW_DELAY_MS)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)
})
