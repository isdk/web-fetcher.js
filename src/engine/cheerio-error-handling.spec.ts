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
// Import all engines to trigger registration (side effects in cheerio.ts, playwright.ts)
import '../engine'
import { FetchEngine } from './base'
import { FetchEngineContext } from '../core/context'

const TEST_TIMEOUT = 10000

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

describe('Cheerio Engine Error Handling', () => {
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
    const id = `test-cheerio-err-${Date.now()}-${Math.random()}`
    const context: FetchEngineContext = {
      id,
      engine: 'cheerio' as any,
      retries: 0,
      throwHttpErrors: true,
    } as any
    const engine = await FetchEngine.create(context, { engine: 'cheerio' })
    if (!engine) throw new Error(`Failed to create Cheerio engine (id=${id})`)
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
        expect(e.message).toContain('fill: selector not found')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should throw when element is not a form field', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        await engine.fill('h1', 'some value')
        expect.fail('Should have thrown')
      } catch (e: any) {
        expect(e.message).toContain('fill: not a form field')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })

  // ─── click error paths ─────────────────────────────────────────

  describe('click', () => {
    it('should throw when element is unsupported for http simulate', async () => {
      const engine = await createEngine()
      try {
        await engine.goto(baseUrl)
        // #clickable is a <div> — not an <a>, not a submit button
        await engine.click('#clickable')
        expect.fail('Should have thrown')
      } catch (e: any) {
        expect(e.message).toContain('click: unsupported element for http simulate')
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
