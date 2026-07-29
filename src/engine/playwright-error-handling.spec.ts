import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
import formbody from '@fastify/formbody'
// Import all engines to trigger registration (side effects in playwright.ts)
import '../engine'
import { FetchEngine } from './base'
import { FetchEngineContext } from '../core/context'

const TEST_TIMEOUT = 15000

const createTestServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: false })
  server.register(formbody as any)

  server.get('/', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head><title>Test Page</title></head>
      <body>
        <h1>Welcome</h1>
        <form id="myForm" action="/submit" method="post">
          <input type="text" name="username" />
          <input type="submit" value="Go" />
        </form>
        <div id="clickable">Click me</div>
        <span id="not-interactive">Just text</span>
      </body>
      </html>
    `)
  })

  server.post('/submit', (req, reply) => {
    reply.send('Submitted OK')
  })

  return server
}

describe('Playwright Engine Error Handling', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    server = await createTestServer()
    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  })

  afterAll(async () => {
    await server.close()
  })

  async function createEngine(): Promise<FetchEngine> {
    const id = `test-pw-err-${Date.now()}-${Math.random()}`
    const context: FetchEngineContext = {
      id,
      engine: 'playwright' as any,
      retries: 0,
      throwHttpErrors: true,
    } as any
    const engine = await FetchEngine.create(context, {
      engine: 'playwright',
      antibot: false,
      // Set a short timeout for fill/click element-not-found tests
      timeoutMs: 2000,
    })
    if (!engine) throw new Error(`Failed to create Playwright engine (id=${id})`)
    return engine as FetchEngine
  }

  // ─── fill error paths ───────────────────────────────────────────

  describe('fill', () => {
    it('should throw when selector is not found', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        await engine.fill('#non-existent-input', 'value')
        expect.fail('Should have thrown')
      } catch (e: any) {
        // Playwright waits for the element and times out
        expect(e.message).toMatch(/(Timeout|waiting for)/i)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should throw when element is not an input', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        // h1 is not an <input>/<textarea>/[contenteditable]
        await engine.fill('h1', 'some value')
        expect.fail('Should have thrown')
      } catch (e: any) {
        // Playwright throws "Element is not an <input>"
        expect(e.message).toMatch(/not an <input>|not an input/i)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })

  // ─── click error paths ─────────────────────────────────────────

  describe('click', () => {
    it('should throw when selector is not found', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        await engine.click('#non-existent-element')
        expect.fail('Should have thrown')
      } catch (e: any) {
        // Playwright waits for the element and times out
        expect(e.message).toMatch(/(Timeout|waiting for)/i)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })

  // ─── submit error paths ────────────────────────────────────────

  describe('submit', () => {
    it('should throw when form selector is not found', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        await engine.submit('#non-existent-form')
        expect.fail('Should have thrown')
      } catch (e: any) {
        expect(e.message).toMatch(/not found|could not find/i)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })
})
