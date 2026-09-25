import { describe, it, expect } from 'vitest'
import { PlaywrightFetchEngine } from './playwright'
import { CheerioFetchEngine } from './cheerio'
import { normalizeGotoMethodPayload } from './base'
import { FetchEngineContext } from '../core/context'
import { DefaultFetcherProperties } from '../core/types'

class TestPlaywrightEngine extends PlaywrightFetchEngine {
  public async testGetCrawlerOptions(ctx: FetchEngineContext) {
    this.opts = ctx
    return this._getSpecificCrawlerOptions(ctx)
  }
}

class TestCheerioEngine extends CheerioFetchEngine {
  public testGetCrawlerOptions(ctx: FetchEngineContext) {
    this.opts = ctx
    return this._getSpecificCrawlerOptions(ctx)
  }
}

const baseCtx = {
  id: 'test-wiring',
  internal: {} as any,
} as FetchEngineContext

describe('normalizeGotoMethodPayload', () => {
  it('should serialize object payload to JSON', () => {
    const { method, payload } = normalizeGotoMethodPayload({
      method: 'POST',
      payload: { a: 1 },
    })
    expect(method).toBe('POST')
    expect(payload).toBe('{"a":1}')
  })

  it('should keep string payload as-is', () => {
    const { payload } = normalizeGotoMethodPayload({
      method: 'POST',
      payload: 'raw-body',
    })
    expect(payload).toBe('raw-body')
  })

  it('should drop payload for GET/HEAD requests', () => {
    expect(normalizeGotoMethodPayload({ method: 'GET', payload: 'x' })).toEqual({
      method: 'GET',
      payload: undefined,
    })
    expect(normalizeGotoMethodPayload({ method: 'HEAD', payload: 'x' })).toEqual({
      method: 'HEAD',
      payload: undefined,
    })
    // 未指定 method 时默认视为 GET，同样剔除 payload
    expect(normalizeGotoMethodPayload({ payload: 'x' })).toEqual({
      method: undefined,
      payload: undefined,
    })
  })

  it('should pass through non-GET method without payload', () => {
    expect(normalizeGotoMethodPayload({ method: 'PUT' })).toEqual({
      method: 'PUT',
      payload: undefined,
    })
  })
})

describe('CheerioFetchEngine crawler options wiring', () => {
  it('should forward maxConcurrency / maxRequestsPerMinute / ignoreSslErrors', async () => {
    const ctx = {
      ...baseCtx,
      maxConcurrency: 5,
      maxRequestsPerMinute: 120,
      ignoreSslErrors: false,
    } as FetchEngineContext

    const options = new TestCheerioEngine().testGetCrawlerOptions(ctx)

    expect(options.maxConcurrency).toBe(5)
    expect(options.maxRequestsPerMinute).toBe(120)
    expect(options.ignoreSslErrors).toBe(false)
  })

  it('should yield undefined (use base defaults) when options are not set', async () => {
    const options = new TestCheerioEngine().testGetCrawlerOptions({ ...baseCtx })

    expect(options.maxConcurrency).toBeUndefined()
    expect(options.maxRequestsPerMinute).toBeUndefined()
    expect(options.ignoreSslErrors).toBeUndefined()
  })

  it('defaults resolve wired values from DefaultFetcherProperties', () => {
    // defaultsDeep(specific, base) 顺序下，specific 值覆盖 base 硬编码的 maxConcurrency: 1
    expect(DefaultFetcherProperties.maxConcurrency).toBe(1)
    expect(DefaultFetcherProperties.maxRequestsPerMinute).toBe(1000)
    expect(DefaultFetcherProperties.ignoreSslErrors).toBe(true)
  })
})

describe('PlaywrightFetchEngine crawler options wiring', () => {
  it('should forward maxConcurrency / maxRequestsPerMinute', async () => {
    const ctx = {
      ...baseCtx,
      maxConcurrency: 3,
      maxRequestsPerMinute: 60,
    } as FetchEngineContext

    const options = await new TestPlaywrightEngine().testGetCrawlerOptions(ctx)

    expect(options.maxConcurrency).toBe(3)
    expect(options.maxRequestsPerMinute).toBe(60)
  })

  it('should inject ignoreHTTPSErrors into launchContext.launchOptions (normal mode)', async () => {
    const ctx = {
      ...baseCtx,
      ignoreSslErrors: false,
      browser: { engine: 'playwright', launchOptions: { slowMo: 10 } },
    } as unknown as FetchEngineContext

    const options = await new TestPlaywrightEngine().testGetCrawlerOptions(ctx)

    expect(options.launchContext?.launchOptions).toMatchObject({
      ignoreHTTPSErrors: false,
      slowMo: 10,
    })
  })

  it('should set ignoreHTTPSErrors even without user launchOptions', async () => {
    const ctx = {
      ...baseCtx,
      ignoreSslErrors: false,
    } as FetchEngineContext

    const options = await new TestPlaywrightEngine().testGetCrawlerOptions(ctx)

    expect(options.launchContext?.launchOptions).toEqual({ ignoreHTTPSErrors: false })
  })

  it('should not set launchContext when ignoreSslErrors is not configured', async () => {
    const options = await new TestPlaywrightEngine().testGetCrawlerOptions({
      ...baseCtx,
    })
    expect(options.launchContext).toBeUndefined()
  })

  it('user launchOptions should win over derived ignoreHTTPSErrors', async () => {
    const ctx = {
      ...baseCtx,
      ignoreSslErrors: true,
      browser: {
        engine: 'playwright',
        launchOptions: { ignoreHTTPSErrors: false },
      },
    } as unknown as FetchEngineContext

    const options = await new TestPlaywrightEngine().testGetCrawlerOptions(ctx)

    expect(options.launchContext?.launchOptions).toMatchObject({
      ignoreHTTPSErrors: false,
    })
  })

  it('should reject unsupported browser.engine explicitly', async () => {
    const ctx = {
      ...baseCtx,
      browser: { engine: 'puppeteer' },
    } as unknown as FetchEngineContext

    await expect(
      new TestPlaywrightEngine().testGetCrawlerOptions(ctx)
    ).rejects.toThrow(/not supported yet/)
  })

  it('should resolve waitUntil: action opts > browser.waitUntil > domcontentloaded', async () => {
    const engine = new TestPlaywrightEngine()

    // 1. 全局配置生效
    engine.testGetCrawlerOptions({
      ...baseCtx,
      browser: { engine: 'playwright', waitUntil: 'networkidle' },
    } as FetchEngineContext)
    // 通过保护方法间接验证：直接用带参数的 goto 需要完整初始化，这里测 _resolveWaitUntil
    expect((engine as any)._resolveWaitUntil({ waitUntil: 'load' })).toBe('load')
    expect((engine as any)._resolveWaitUntil(undefined)).toBe('networkidle')

    // 2. 无配置时回退默认
    const engine2 = new TestPlaywrightEngine()
    engine2.testGetCrawlerOptions({ ...baseCtx })
    expect((engine2 as any)._resolveWaitUntil(undefined)).toBe('domcontentloaded')
  })
})
