import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
// Import all engines to trigger registration (side effects in cheerio.ts)
import '../engine'
import { FetchEngine } from './base'
import { FetchEngineContext } from '../core/context'

const TEST_TIMEOUT = 20000
// The slow endpoint never sends a byte before this delay; a request bounded
// only by the (much larger) timeoutMs / requestHandlerTimeoutSecs would hang
// well past it, which is exactly the regression this suite guards against.
const SLOW_DELAY_MS = 4000

describe('Cheerio Engine: firstByteMs (time-to-first-byte timeout)', () => {
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
    const id = `test-cheerio-ttfb-${Date.now()}-${Math.random()}`
    const context: FetchEngineContext = {
      id,
      engine: 'cheerio' as any,
      retries: 0,
      throwHttpErrors: true,
    } as any
    const engine = await FetchEngine.create(context, {
      engine: 'cheerio',
      ...opts,
    })
    if (!engine) throw new Error(`Failed to create Cheerio engine (id=${id})`)
    return engine as FetchEngine
  }

  it('should fail a stuck-connecting request at firstByteMs, not at timeoutMs', async () => {
    const engine = await createEngine({ firstByteMs: 500, timeoutMs: 20000 })
    try {
      const start = Date.now()
      await expect(engine.goto(`${baseUrl}/slow-ttfb`)).rejects.toThrow()
      const elapsed = Date.now() - start
      // firstByteMs (500ms) decides, not the 4s server delay nor the 20s
      // request timeout — and certainly not Crawlee's 300s default.
      expect(elapsed).toBeLessThan(SLOW_DELAY_MS)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)

  it('should not affect a healthy request that responds within firstByteMs', async () => {
    const engine = await createEngine({ firstByteMs: 500, timeoutMs: 20000 })
    try {
      const res = await engine.goto(`${baseUrl}/fast`)
      expect(res?.statusCode).toBe(200)
      expect(res?.text).toContain('<h1>fast</h1>')
      // The engine reported activity once the response was built.
      expect(engine.lastActivityAt).greaterThan(0)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)

  it('should fall back to timeoutMs alone when firstByteMs is disabled', async () => {
    const engine = await createEngine({ firstByteMs: 0, timeoutMs: 800 })
    try {
      const start = Date.now()
      await expect(engine.goto(`${baseUrl}/slow-ttfb`)).rejects.toThrow()
      const elapsed = Date.now() - start
      // No response tier: only timeout.request (800ms) bounds the request.
      expect(elapsed).toBeLessThan(SLOW_DELAY_MS)
    } finally {
      await engine.dispose()
    }
  }, TEST_TIMEOUT)
})
