import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
import { FetchEngine } from './base'
import './playwright' // 触发引擎注册
import { FetchEngineContext } from '../core/context'

const TEST_TIMEOUT = 15000

const CUSTOM_UA = 'web-fetcher/1.0 (playwright-headers-spec)'

// 专用测试服务器：回显请求头，并提供一个会被拦截的样式表用来验证路由合并
const createTestServer = async (): Promise<
  FastifyInstance & { getStyleRequestCount: () => number }
> => {
  const server = fastify({ logger: false }) as FastifyInstance & {
    getStyleRequestCount: () => number
  }
  let styleRequestCount = 0
  server.decorate('getStyleRequestCount', () => styleRequestCount)

  // 回显 user-agent 与自定义请求头
  server.get('/echo-headers', (req, reply) => {
    reply.type('application/json').send(
      JSON.stringify({
        ua: req.headers['user-agent'] || '',
        custom: req.headers['x-custom'] || '',
      })
    )
  })

  // 首页：含一个跳转到 /echo-headers 的链接（用于测试页面内导航时 UA 是否保持）
  server.get('/', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Headers Test Page</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <h1>Welcome</h1>
        <a id="ua-link" href="/echo-headers">Echo Headers</a>
      </body>
      </html>
    `)
  })

  // 可被 blockResources 拦截的样式表；记录请求数以便断言拦截是否生效
  server.get('/style.css', (req, reply) => {
    styleRequestCount++
    reply.type('text/css').send('body { color: red; }')
  })

  return server
}

describe('PlaywrightFetchEngine Headers Override', () => {
  let server: FastifyInstance & { getStyleRequestCount: () => number }
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

  async function createEngine(
    options?: Record<string, any>
  ): Promise<FetchEngine> {
    const id = `test-pw-hdrs-${Date.now()}-${Math.random()}`
    const context: FetchEngineContext = {
      id,
      engine: 'playwright' as any,
      retries: 0,
    } as any
    const engine = await FetchEngine.create(context, {
      engine: 'playwright',
      antibot: false,
      timeoutMs: 5000,
      ...options,
    })
    if (!engine) throw new Error(`Failed to create Playwright engine (id=${id})`)
    return engine as FetchEngine
  }

  async function echoHeaders(engine: FetchEngine): Promise<{ ua: string; custom: string }> {
    const res = await engine.getContent()
    return JSON.parse(res.text || '{}')
  }

  // ─── headers() API 重载（不触发浏览器导航）──────────────────────

  describe('headers() API', () => {
    it('should get all headers as a lower-cased record', async () => {
      const engine = await createEngine({
        headers: { 'X-Custom': 'v1', 'User-Agent': 'ua-initial' },
      })
      try {
        expect(await engine.headers()).toEqual({
          'x-custom': 'v1',
          'user-agent': 'ua-initial',
        })
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should get a single header value', async () => {
      const engine = await createEngine({
        headers: { 'User-Agent': 'ua-initial' },
      })
      try {
        expect(await engine.headers('user-agent')).toBe('ua-initial')
        expect(await engine.headers('missing-header')).toBe('')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should set a single header and merge (not replace) existing ones', async () => {
      const engine = await createEngine({
        headers: { 'x-keep': 'kept' },
      })
      try {
        expect(await engine.headers('x-new', 'v2')).toBe(true)
        expect(await engine.headers()).toEqual({ 'x-keep': 'kept', 'x-new': 'v2' })
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should set multiple headers at once', async () => {
      const engine = await createEngine()
      try {
        expect(await engine.headers({ 'x-a': '1', 'x-b': '2' })).toBe(true)
        expect(await engine.headers('x-a')).toBe('1')
        expect(await engine.headers('x-b')).toBe('2')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should replace all headers when replaced=true', async () => {
      const engine = await createEngine({
        headers: { 'x-old': 'gone' },
      })
      try {
        expect(await engine.headers({ 'x-new': 'only' }, true)).toBe(true)
        expect(await engine.headers()).toEqual({ 'x-new': 'only' })
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should remove a header with null value', async () => {
      const engine = await createEngine({
        headers: { 'user-agent': 'ua-initial' },
      })
      try {
        expect(await engine.headers('user-agent', null)).toBe(true)
        expect(await engine.headers('user-agent')).toBe('')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })

  // ─── user-agent 网络层覆盖（核心回归点）──────────────────────────

  describe('user-agent override', () => {
    it('should send a custom user-agent set via headers() after creation', async () => {
      const engine = await createEngine()
      try {
        await engine.headers('user-agent', CUSTOM_UA)
        await engine.goto(`${baseUrl}/echo-headers`)
        const data = await echoHeaders(engine)
        expect(data.ua).toBe(CUSTOM_UA)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should send a custom user-agent provided at engine creation', async () => {
      const engine = await createEngine({ headers: { 'User-Agent': CUSTOM_UA } })
      try {
        await engine.goto(`${baseUrl}/echo-headers`)
        const data = await echoHeaders(engine)
        expect(data.ua).toBe(CUSTOM_UA)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should fall back to the default browser ua after the custom one is removed', async () => {
      const engine = await createEngine()
      try {
        await engine.headers('user-agent', CUSTOM_UA)
        await engine.goto(`${baseUrl}/echo-headers`)
        expect((await echoHeaders(engine)).ua).toBe(CUSTOM_UA)

        // 动态移除后，后续导航不应再携带自定义 UA
        await engine.headers('user-agent', null)
        await engine.goto(`${baseUrl}/echo-headers`)
        const ua = (await echoHeaders(engine)).ua
        expect(ua).not.toContain('web-fetcher')
        expect(ua).toMatch(/Mozilla|Chrome/)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should apply non-user-agent custom headers', async () => {
      const engine = await createEngine()
      try {
        await engine.headers('x-custom', 'hello')
        await engine.goto(`${baseUrl}/echo-headers`)
        const data = await echoHeaders(engine)
        expect(data.custom).toBe('hello')
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should keep the custom user-agent on in-page navigations', async () => {
      const engine = await createEngine()
      try {
        await engine.headers('user-agent', CUSTOM_UA)
        await engine.goto(baseUrl)
        // 页面内导航（dispatchAction('navigate') 路径）同样应应用自定义 UA
        await engine.click('#ua-link')
        await engine.waitFor({ selector: 'body' })
        const data = await echoHeaders(engine)
        expect(data.ua).toBe(CUSTOM_UA)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)

    it('should coexist with blocked resources (merged route)', async () => {
      const engine = await createEngine()
      try {
        await engine.headers('user-agent', CUSTOM_UA)
        await engine.blockResources(['stylesheet'])

        // 前置测试可能已经请求过 /style.css，这里只断言本次导航不产生新请求
        const styleCountBefore = server.getStyleRequestCount()

        await engine.goto(baseUrl)
        // 给样式表请求一点时间到达服务器（若未被拦截）
        await engine.waitFor({ ms: 300 })

        // 拦截生效：样式表未被请求
        expect(server.getStyleRequestCount()).toBe(styleCountBefore)

        // 同时自定义 UA 仍然作用于页面内导航
        await engine.click('#ua-link')
        await engine.waitFor({ selector: 'body' })
        const data = await echoHeaders(engine)
        expect(data.ua).toBe(CUSTOM_UA)
      } finally {
        await engine.dispose()
      }
    }, TEST_TIMEOUT)
  })
})
