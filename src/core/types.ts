import type { Cookie, SessionPoolOptions } from 'crawlee'
import type { RequireAtLeastOne } from 'type-fest'
import { FetchReturnType, FetchReturnTypeFor } from './fetch-return-type'

export type { Cookie } from 'crawlee'

export enum FetchActionResultStatus {
  /**
   * 动作执行失败但未抛出（通常因 failOnError=false）；错误信息在 error 字段
   */
  Failed,
  /**
   * 动作按预期完成（即便产生 warnings）
   */
  Success,
  /**
   * 动作被判定为不执行/降级为 noop（比如引擎不支持且 degradeTo='noop'）
   * 能力不支持且 degradeTo='noop' 时：status='skipped'，warnings 增加 { code:'capability-not-supported' }
   */
  Skipped,
}

export type FetchActionCapabilityMode = 'native' | 'simulate' | 'noop'

// 承载与诊断相关的信息（引擎、降级路径、时延、重试、HTTP 信息等）
export interface FetchActionMeta {
  id: string
  index?: number
  engineType?: FetchEngineType
  capability?: FetchActionCapabilityMode
  response?: FetchResponse
  timings?: { start: number; total: number }
  retries?: number // 实际重试次数
}

export interface FetchActionResult<
  R extends FetchReturnType = FetchReturnType,
> {
  status: FetchActionResultStatus // 默认 'success'（未抛错且未标记跳过）
  returnType?: R
  result?: FetchReturnTypeFor<R>
  error?: Error
  meta?: FetchActionMeta // 便于审计与调试的元信息
}

export interface BaseFetchActionProperties {
  id?: string
  name?: string // action id 的别名
  action?: string | any // action id 的别名
  index?: number
  params?: any
  args?: any // params 的别名
  // 如果设置则将结果存储到上下文的outputs[storeAs]
  storeAs?: string
  // defaults to true if in main action
  // defaults to false if in collector action
  failOnError?: boolean
  // defaults to false
  failOnTimeout?: boolean
  timeoutMs?: number
  maxRetries?: number
  [key: string]: any
}
export type BaseFetchActionOptions = RequireAtLeastOne<
  BaseFetchActionProperties,
  'id' | 'name' | 'action'
>

export interface BaseFetchCollectorActionProperties
  extends BaseFetchActionProperties {
  // 启动事件，支持正则表达式，任意事件发生就启动`onStart`
  activateOn?: string | RegExp | Array<string | RegExp>
  // 结束事件，任意事件发生就结束`onEnd`
  deactivateOn?: string | RegExp | Array<string | RegExp>
  // 当指定事件发生时，执行收集`onExecute`
  collectOn?: string | RegExp | Array<string | RegExp> // self, session, action, action:name
  // 是否在后台运行（不等待 onExec 完成），defaults to true
  background?: boolean
}

export type BaseFetchCollectorOptions = RequireAtLeastOne<
  BaseFetchCollectorActionProperties,
  'id' | 'name' | 'action'
>

export interface FetchActionProperties extends BaseFetchActionProperties {
  collectors?: BaseFetchCollectorOptions[]
}

export type FetchActionOptions = RequireAtLeastOne<
  FetchActionProperties,
  'id' | 'name' | 'action'
>

export class EngineUpgradeError extends Error {
  public code = 'ENGINE_UPGRADE_REQUIRED'
  constructor(public res: FetchResponse) {
    super(`Engine upgrade requested for status ${res.statusCode}`)
    this.name = 'EngineUpgradeError'
  }
}

export type FetchEngineType = 'http' | 'browser'
export type BrowserEngine = 'playwright' | 'puppeteer'

type FetchEngineMode = FetchEngineType | 'auto' | string
export type ResourceType =
  | 'image'
  | 'stylesheet'
  | 'font'
  | 'script'
  | 'media'
  | string

/**
 * Storage configuration options for the fetch engine.
 *
 * @remarks
 * Controls how Crawlee's internal storage (RequestQueue, KeyValueStore, SessionPool) is managed.
 */
export interface StorageOptions {
  /**
   * Custom identifier for the storage.
   * If provided, multiple sessions can share the same storage by using the same ID.
   * If not provided, a unique session ID is used (strong isolation).
   */
  id?: string
  /**
   * Whether to persist storage to disk.
   * If true, uses Crawlee's disk persistence. If false, data might be stored in memory or temporary directory.
   * Corresponds to Crawlee's `persistStorage` configuration.
   */
  persist?: boolean
  /**
   * Whether to delete the storage (RequestQueue and KeyValueStore) when the session is closed.
   * Defaults to true. Set to false if you want to keep data for future reuse with the same `id`.
   */
  purge?: boolean
  /**
   * Additional Crawlee configuration options.
   * Allows fine-grained control over the underlying Crawlee instance.
   */
  config?: Record<string, any>
}

export interface FetchCacheOptions {
  /**
   * Whether to enable caching.
   */
  enabled?: boolean
  /**
   * Explicit offline mode. If true, network requests are prohibited and MISS results will throw OfflineCacheMissError.
   */
  offline?: boolean
  /**
   * Custom storage path for the cache.
   */
  storagePath?: string
  /**
   * Allowed HTTP methods for caching. Default is ['GET', 'HEAD'].
   */
  methods?: string[]
  /**
   * Fine-grained cache interception rules.
   */
  cacheRules?: any[]
  /**
   * URL query parameter filtering.
   */
  query?: any
  /**
   * Request header filtering.
   */
  headers?: any
  /**
   * Cookie field filtering.
   */
  cookies?: any
  /**
   * JSON request body field filtering.
   */
  body?: any
  /**
   * Whether to force return stale cache if network request fails.
   */
  staleIfError?: boolean
  /**
   * Whether to ignore server directives and force caching.
   */
  forceCache?: boolean
  /**
   * Max memory size for a single file content in bytes.
   */
  maxMemorySize?: number
  /**
   * Max total memory size for the LRU cache in bytes.
   */
  maxTotalMemorySize?: number
}

export interface BaseFetcherProperties {
  /**
   * 抓取模式
   *
   * - `http`: 使用 HTTP 进行抓取
   * - `browser`: 使用浏览器进行抓取
   * - `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.
   */
  engine?: FetchEngineMode
  enableSmart?: boolean // 启用智能探测
  syncStateOnUpgrade?: boolean // 升级引擎时是否同步状态（Cookies/Session），默认 false
  upgradeThresholdMs?: number // 触发升级的等待时间阈值（毫秒），默认 5000ms。超过此时间或无信息则升级。
  useSiteRegistry?: boolean // 使用站点配置
  antibot?: boolean
  debug?: boolean | string | string[]

  headers?: Record<string, string>
  cookies?: Cookie[]
  sessionState?: any
  sessionPoolOptions?: SessionPoolOptions
  overrideSessionState?: boolean
  throwHttpErrors?: boolean

  output?: {
    cookies?: boolean // 默认 true
    sessionState?: boolean // 默认 true
  }

  proxy?: string | string[]
  // 阻止加载特定类型的资源
  blockResources?: ResourceType[]

  /**
   * Storage configuration for session isolation and persistence.
   */
  storage?: StorageOptions

  /**
   * Cache configuration for persistent HTTP caching.
   */
  cache?: FetchCacheOptions

  // browser 模式下，没有对应的配置，需要根据浏览器类型去设置浏览器内部配置，也可能无法配置。
  ignoreSslErrors?: boolean

  browser?: {
    /**
     * 浏览器引擎，默认为 playwright
     *
     * - `playwright`: 使用 Playwright 引擎
     * - `puppeteer`: 使用 Puppeteer 引擎
     */
    engine?: BrowserEngine
    headless?: boolean
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
    launchOptions?: Record<string, any>
  }

  http?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
  }

  timeoutMs?: number
  requestHandlerTimeoutSecs?: number
  maxConcurrency?: number
  maxRequestsPerMinute?: number
  delayBetweenRequestsMs?: number
  retries?: number

  sites?: FetchSite[]
  url?: string
}

export interface FetchSite extends BaseFetcherProperties {
  domain: string
  pathScope?: string[]

  meta?: {
    updatedAt?: number
    ttlMs?: number
    source?: 'manual' | 'smart'
  }
}

export type OnFetchPauseCallback = (options: {
  message?: string
}) => Promise<void>

export interface FetcherOptions extends BaseFetcherProperties {
  actions?: FetchActionOptions[]
  onPause?: OnFetchPauseCallback
}

export interface FetchMetadata {
  mode: FetchEngineType
  engine?: BrowserEngine
  timings?: {
    start: number
    total: number
    ttfb?: number
    dns?: number
    tcp?: number
    firstByte?: number
    download?: number
  }
  proxy?: string
  [key: string]: any
}

// 标准抓取响应
export interface FetchResponse {
  url: string
  finalUrl: string
  statusCode?: number
  statusText?: string
  headers: Record<string, string>
  contentType?: string
  body?: string | Buffer<ArrayBufferLike>
  html?: string
  text?: string
  json?: any
  cookies?: Cookie[]
  sessionState?: any
  metadata?: FetchMetadata
}

export const DefaultFetcherProperties: BaseFetcherProperties = {
  engine: 'auto',
  enableSmart: true,
  syncStateOnUpgrade: false,
  upgradeThresholdMs: 5000,
  useSiteRegistry: true,
  antibot: false,
  debug: false,
  headers: {},
  cookies: [],
  throwHttpErrors: undefined,
  output: {
    cookies: true,
    sessionState: true,
  },
  proxy: [],
  blockResources: [],
  storage: {
    purge: true,
  },
  ignoreSslErrors: true,
  browser: {
    engine: 'playwright',
    headless: true,
    waitUntil: 'domcontentloaded',
  },
  http: {
    method: 'GET',
  },
  timeoutMs: 60000,
  requestHandlerTimeoutSecs: undefined,
  maxConcurrency: 1,
  maxRequestsPerMinute: 1000,
  delayBetweenRequestsMs: 0,
  retries: 0,
  sites: [],
}

export const FetcherOptionKeys = Object.keys(DefaultFetcherProperties).concat([
  'actions',
  'onPause',
  'cache',
])
