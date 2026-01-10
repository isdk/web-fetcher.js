import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import formbody from '@fastify/formbody'
import { AddressInfo } from 'net'
import * as cheerio from 'cheerio'

import '../engine'
// The things to test
import { FetchSession } from './session'

// Dependencies for testing
import '../action/definitions' // to register all actions
import { FetcherOptions } from './types'
import { FetchActionResultStatus } from '../action/fetch-action'

const TEST_TIMEOUT = 10000 // 10s, increased for playwright

// 1. 本地测试服务器 (copied from action.spec.ts)
const createTestServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: false })
  server.register(formbody as any)

  // 首页
  server.get('/', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Welcome</h1>
        <a href="/page2">Go to Page 2</a>
        <form action="/submit" method="post">
          <input type="text" name="test_input" value="initial" />
          <input type="submit" value="Submit" />
        </form>
      </body>
      </html>
    `)
  })

  // 第二页
  server.get('/page2', (req, reply) => {
    reply.type('text/html').send('<h2>Page 2</h2>')
  })

  // 表单提交
  server.post('/submit', (req, reply) => {
    const body = req.body as { test_input: string }
    reply
      .type('text/html')
      .send(`<html><body>Submitted: ${body.test_input}</body></html>`)
  })

  return server
}

// 2. 可复用的测试套件
const sessionTestSuite = (engineName: 'cheerio' | 'playwright') => {
  describe.sequential(`FetchSession: ${engineName}`, () => {
    let server: FastifyInstance
    let baseUrl: string

    beforeAll(async () => {
      server = await createTestServer()
      await server.listen({ port: 0 })
      const address = server.server.address() as AddressInfo
      baseUrl = `http://localhost:${address.port}`
    }, TEST_TIMEOUT)

    afterAll(async () => {
      await server.close()
    })

    let session: FetchSession
    const createSession = (options: FetcherOptions = {}) => {
      session = new FetchSession({
        engine: engineName, // Use the engine for the current test suite
        ...options,
      })
    }

    afterEach(async () => {
      if (session) {
        // console.log(`[TEST END] ${engineName}: disposing session ${session.id}`);
        await session.dispose()
      }
    })

    // Debugging logs to track test execution
    // (it.todo or it.skip can be used to isolate specific tests)
    // import { currentTestName } from 'vitest';
    // but we can just use a simple beforeEach
    // vi.onTestStart((test) => { console.log(`[TEST START] ${test.name}`); });
    // actually, vi.onTestStart is not available in all vitest versions easily.
    // Let's just use it('...', () => { console.log('...') }) or a hook if possible.
    // Wait, vitest doesn't have an easy way to get current test name in beforeEach without injecting.

    // Instead, I'll add logs inside the 'it' blocks of the problematic tests or all of them.
    // For now, let's just log in afterEach too to see when it finishes.

    /*
    beforeEach((context) => {
      console.log(`\n[TEST START] ${engineName}: ${context.task.name}`);
    });
    */

    it('should create a session with a context', () => {
      createSession()
      expect(session).toBeInstanceOf(FetchSession)
      expect(session.id).toBeTypeOf('string')
      expect(session.context).toBeDefined()
      expect(session.context.id).toBe(session.id)
    })

    it(
      'should execute a single "goto" action and initialize engine',
      async () => {
        createSession()
        const result = await session.execute({
          name: 'goto',
          params: { url: baseUrl },
        })

        expect(result.status).toBe(FetchActionResultStatus.Success)
        expect(result.returnType).toBe('response')
        expect(result.result!.statusCode).toBe(200)

        // Check if engine is initialized and has content
        const content = await session.context.internal.engine!.getContent()
        expect(content.html).toContain('<h1>Welcome</h1>')
      },
      TEST_TIMEOUT
    )

    if (engineName === 'cheerio')
      it(
        'should fill an input field and update the state',
        async () => {
          createSession()
          await session.execute({ name: 'goto', params: { url: baseUrl } })

          // Execute the fill action
          await session.execute({
            name: 'fill',
            params: {
              selector: 'input[name="test_input"]',
              value: 'new_value',
            },
          })

          // Get the content and check if the input value has changed
          const content = await session.context.internal.engine!.getContent()

          // The HTML should reflect the change
          const $ = cheerio.load(content.html as string)
          const inputValue = $('input[name="test_input"]').val()
          expect(inputValue).toBe('new_value')
        },
        TEST_TIMEOUT
      )

    it('should throw when executing on a closed session', async () => {
      createSession()
      await session.dispose()
      await expect(
        session.execute({ name: 'goto', params: { url: baseUrl } })
      ).rejects.toThrow('Session is closed')
    })

    it('should throw for an unknown action', async () => {
      createSession()
      await expect(
        session.execute({ name: 'nonexistent-action' })
      ).rejects.toThrow('Unknown action: nonexistent-action')
    })

    it(
      'should execute a sequence of actions with executeAll',
      async () => {
        createSession()
        const { result, outputs } = await session.executeAll([
          { name: 'goto', params: { url: baseUrl } },
          {
            name: 'fill',
            params: {
              selector: 'input[name="test_input"]',
              value: 'session_test',
            },
          },
          { name: 'submit', params: { selector: 'form' } },
        ])

        expect(result).toBeDefined()
        expect(result!.contentType).toBe('text/html')
        expect(result!.text).toContain('Submitted: session_test')
        expect(outputs).toEqual({})

        const content = await session.context.internal.engine!.getContent()
        expect(content.text).toContain('Submitted: session_test')
      },
      TEST_TIMEOUT
    )

    it(
      'should emit action:start and action:end events',
      async () => {
        createSession()
        const startListener = vi.fn()
        const endListener = vi.fn()
        session.context.eventBus.on('action:start', startListener)
        session.context.eventBus.on('action:end', endListener)

        await session.execute({ name: 'goto', params: { url: baseUrl } })

        expect(startListener).toHaveBeenCalledOnce()
        expect(startListener).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({ id: session.id }),
            action: expect.objectContaining({ id: 'goto' }),
          })
        )

        expect(endListener).toHaveBeenCalledOnce()
        expect(endListener).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({ id: session.id }),
            action: expect.objectContaining({ id: 'goto' }),
            result: expect.any(Object),
          })
        )
        const [event] = endListener.mock.calls[0]
        expect(event).not.toHaveProperty('error')
      },
      TEST_TIMEOUT
    )

    it('should emit session:closing and session:closed events on dispose', async () => {
      createSession()
      const closingListener = vi.fn()
      const closedListener = vi.fn()
      session.context.eventBus.on('session:closing', closingListener)
      session.context.eventBus.on('session:closed', closedListener)

      await session.dispose()

      expect(closingListener).toHaveBeenCalledOnce()
      expect(closingListener).toHaveBeenCalledWith({ sessionId: session.id })

      expect(closedListener).toHaveBeenCalledOnce()
      expect(closedListener).toHaveBeenCalledWith({ sessionId: session.id })
    })

    it(
      'should handle action execution error',
      async () => {
        createSession()
        const endListener = vi.fn()
        session.context.eventBus.on('action:end', endListener)

        const action = {
          name: 'goto',
          params: { url: 'http://localhost:9999/invalid' },
          failOnError: true,
        }
        await expect(session.execute(action)).rejects.toThrow()

        expect(endListener).toHaveBeenCalledOnce()
        expect(endListener).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({ id: session.id }),
            action: expect.objectContaining({ id: 'goto' }),
            result: expect.objectContaining({ error: expect.any(Error) }),
            error: expect.any(Error),
          })
        )
      },
      TEST_TIMEOUT
    )

    it(
      'should store and retrieve outputs',
      async () => {
        createSession()
        const { outputs } = await session.executeAll([
          { name: 'goto', params: { url: baseUrl } },
          {
            name: 'getContent',
            storeAs: 'content1',
          },
        ])

        expect(outputs).toHaveProperty('content1')
        expect(outputs.content1.html).toContain('<h1>Welcome</h1>')

        // Also check that getOutputs() returns the same
        const sessionOutputs = session.getOutputs()
        expect(sessionOutputs).toEqual(outputs)
      },
      TEST_TIMEOUT
    )

    it('should run multiple sessions in parallel without RequestQueue collisions', async () => {
      // Use a separate high concurrency test within the suite context
      // Note: We create sessions manually here, separate from the 'beforeEach' session
      const CONCURRENCY = 10
      const tasks = Array.from({ length: CONCURRENCY }).map(async (_, i) => {
        const localSession = new FetchSession({
          engine: engineName,
          headers: { 'x-id': String(i) },
        })
        console.log(
          `[TEST CONCURRENCY] ${engineName}: starting localSession ${localSession.id}`
        )

        try {
          // Trigger engine initialization (which opens RequestQueue)
          // Just initialization is enough to test the collision on storage opening
          // But running a quick action confirms it works.
          // Using a simple action that doesn't require a real URL to fail with "RequestQueue" error if bug exists
          await localSession.execute({ name: 'getContent' })
        } catch (error: any) {
          if (
            error.message.includes('Request queue') ||
            error.message.includes('does not exist')
          ) {
            throw error // This is the error we want to prevent
          }
          // Ignore other expected errors (like "No content fetched yet")
        } finally {
          console.log(
            `[TEST CONCURRENCY] ${engineName}: disposing localSession ${localSession.id}`
          )
          await localSession.dispose()
        }
      })

      await Promise.all(tasks)
    }, 20000) // Higher timeout for concurrency

    it('should support temporary context override in executeAll', async () => {
      createSession({ headers: { 'x-global': 'true' } })
      const actionListener = vi.fn()
      session.context.eventBus.on('action:start', actionListener)

      // Execute with temporary override
      await session.executeAll([{ name: 'goto', params: { url: baseUrl } }], {
        headers: { 'x-global': 'false', 'x-temp': 'active' },
      })

      // 1. Check if the action received the overridden context
      expect(actionListener).toHaveBeenCalled()
      const eventContext = actionListener.mock.calls[0][0].context
      expect(eventContext.headers).toEqual(
        expect.objectContaining({
          'x-global': 'false',
          'x-temp': 'active',
        })
      )

      // 2. Check if the original session context is untouched
      expect(session.context.headers).toEqual(
        expect.objectContaining({
          'x-global': 'true',
        })
      )
      expect(session.context.headers).not.toHaveProperty('x-temp')
    })

    it('should initialize engine based on temporary context override if not yet initialized', async () => {
      // Create a session without specifying engine (defaults to auto/http logic)
      const session = new FetchSession({})

      // Execute with a context override that forces 'browser' (or checking a property that implies it)
      // Since we can't easily check "browser" vs "cheerio" instance without imports,
      // we check the context.internal.engine.mode if available, or just rely on the fact
      // that maybeCreateEngine uses the context.
      // A better way for this unit test is to pass a distinct 'engine' option if we had a mock engine,
      // but here we are using real engines.

      // Let's force 'cheerio' explicitly in override on a generic session
      await session.execute(
        { name: 'goto', params: { url: baseUrl } },
        { ...session.context, engine: 'cheerio' } // Force cheerio via override
      )

      const engine = session.context.internal.engine
      expect(engine).toBeDefined()
      expect(engine!.mode).toBe('http')

      await session.dispose()
    })

    it('should respect temporary context in single execute', async () => {
      createSession({ headers: { 'x-base': '1' } })
      const actionListener = vi.fn()
      session.context.eventBus.on('action:start', actionListener)

      const overrideContext = { ...session.context, headers: { 'x-base': '2' } }
      await session.execute(
        { name: 'goto', params: { url: baseUrl } },
        overrideContext
      )

      expect(actionListener).toHaveBeenCalled()
      const eventContext = actionListener.mock.calls[0][0].context
      expect(eventContext.headers['x-base']).toBe('2')
      // Original should be unchanged
      expect(session.context.headers!['x-base']).toBe('1')
    })

    it('should track actionIndex correctly across multiple execute calls', async () => {
      createSession()
      const actionListener = vi.fn()
      session.context.eventBus.on('action:start', actionListener)

      // First call (automatic 0-based index)
      await session.execute({ name: 'goto', params: { url: baseUrl } })
      expect(actionListener).toHaveBeenCalledTimes(1)
      expect(actionListener.mock.calls[0][0].index).toBe(0)

      // Second call (automatic increment)
      await session.execute({ name: 'getContent' })
      expect(actionListener).toHaveBeenCalledTimes(2)
      expect(actionListener.mock.calls[1][0].index).toBe(1)

      // Third call (explicit override)
      await session.execute({ name: 'getContent', index: 10 })
      expect(actionListener).toHaveBeenCalledTimes(3)
      expect(actionListener.mock.calls[2][0].index).toBe(10)

      // Fourth call (increment from last override)
      await session.execute({ name: 'getContent' })
      expect(actionListener).toHaveBeenCalledTimes(4)
      expect(actionListener.mock.calls[3][0].index).toBe(11)

      // Verify context.internal.actionIndex matches
      expect(session.context.internal.actionIndex).toBe(12)
    })

    it('should support starting index in executeAll', async () => {
      createSession()
      const actionListener = vi.fn()
      session.context.eventBus.on('action:start', actionListener)

      const actions = [
        { name: 'getContent' }, // Index 0: would fail if executed first
        { name: 'goto', params: { url: baseUrl } }, // Index 1
        { name: 'getContent' }, // Index 2
      ]

      // Start from index 1 (the 'goto' action)
      await session.executeAll(actions, { index: 1 })

      // Should have executed: actions[1], actions[2], and the final auto-getContent (index 3)
      expect(actionListener).toHaveBeenCalledTimes(3)
      expect(actionListener.mock.calls[0][0].index).toBe(1)
      expect(actionListener.mock.calls[0][0].action.id).toBe('goto')

      expect(actionListener.mock.calls[1][0].index).toBe(2)
      expect(actionListener.mock.calls[1][0].action.id).toBe('getContent')

      expect(actionListener.mock.calls[2][0].index).toBe(3)
      expect(actionListener.mock.calls[2][0].action.id).toBe('getContent')
    })

    it('should attach actionIndex to error even with temporary context', async () => {
      createSession()
      const actions = [
        { name: 'goto', params: { url: baseUrl } },
        { name: 'unknown-action-XYZ', params: {} }, // Should fail with "Unknown action"
      ]

      try {
        await session.executeAll(actions, { timeoutMs: 5000 })
        expect.fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.message).toContain('Unknown action')
        expect(error.actionIndex).toBe(1)
      }
    })
  })
}

// 3. 运行测试
sessionTestSuite('cheerio')
sessionTestSuite('playwright')

describe('FetchSession Engine Selection and Persistence', () => {
  it('should prioritize explicit engine in constructor', async () => {
    const session = new FetchSession({ engine: 'http' })
    await session.execute({ name: 'getContent' }).catch(() => {}) // trigger engine init, ignore 'no content' error
    expect(session.context.internal.engine).toBeDefined()
    expect(session.context.internal.engine!.mode).toBe('http')
    await session.dispose()
  })

  it('should throw error if explicitly requested engine is not found', async () => {
    const session = new FetchSession({ engine: 'non-existent-engine' })
    await expect(session.execute({ name: 'getContent' })).rejects.toThrow(
      'Engine "non-existent-engine" is not available'
    )
    await session.dispose()
  })

  it('should prioritize site-matched engine in auto mode', async () => {
    const session = new FetchSession({
      engine: 'auto',
      sites: [{ domain: 'example.com', engine: 'http' }],
    })
    // Use a URL that matches the site. Note: we don't need a real connection to check engine selection
    await session
      .execute({ name: 'goto', params: { url: 'http://example.com' } })
      .catch(() => {})
    expect(session.context.internal.engine).toBeDefined()
    expect(session.context.internal.engine!.mode).toBe('http')
    await session.dispose()
  })

  it('should reuse the same engine instance across multiple actions', async () => {
    const session = new FetchSession({ engine: 'http' })
    await session.execute({ name: 'getContent' }).catch(() => {})
    const firstEngine = session.context.internal.engine
    expect(firstEngine).toBeDefined()

    await session.execute({ name: 'getContent' }).catch(() => {})
    const secondEngine = session.context.internal.engine
    expect(secondEngine).toBe(firstEngine)

    await session.dispose()
  })

  it('should allow engine override in executeAll via temporary context', async () => {
    const session = new FetchSession({ engine: 'http' })
    // First init with http
    await session.execute({ name: 'getContent' }).catch(() => {})
    expect(session.context.internal.engine!.mode).toBe('http')

    // Currently, once engine is initialized, it's fixed in context.internal.engine.
    // If we want to test that it respects 'engine' in context IF not yet initialized:
    const session2 = new FetchSession({ engine: 'http' })
    await session2
      .executeAll([{ name: 'getContent' }], { engine: 'playwright' })
      .catch(() => {})
    expect(session2.context.internal.engine!.mode).toBe('browser')
    await session2.dispose()
    await session.dispose()
  })
})
