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
  /**
   * Maximum time (ms) to wait for the crawler's autoscaled pool to start before
   * tearing it down during disposal.
   *
   * `AutoscaledPool.abort()` is a no-op unless the pool's own `run()` has
   * started, so the engine waits for it first; otherwise the crawler would turn
   * into a zombie that never settles and keeps the process alive. Defaults to
   * 10s. Raise it for slow-starting browser crawlers.
   */
  poolStartTimeoutMs?: number
  /**
   * Maximum time (ms) to wait for in-flight crawler tasks to settle before the
   * request queue and key-value store are dropped during disposal.
   *
   * `abort()` does not wait for running tasks, yet those tasks still touch the
   * storages after the request handler returns. Defaults to 120s. When the
   * timeout elapses the storages are kept instead of crashing the settling
   * tasks ("Request queue ... does not exist").
   */
  taskSettleTimeoutMs?: number

  /**
   * 快速失败选项：引擎被 `abortFastFail()`（race 输家引擎）中止时，清理不再等待
   * in-flight crawler 任务收敛，立即丢弃 request queue / key-value store。
   * 默认 false（保持等待，保证收尾任务不会碰到已丢弃的 storage）。
   *
   * @remarks
   * 背景：race 调度（如 `@isdk/web-searcher`）在赢家返回后 abort 输家引擎时，
   * `dispose()` 会同步等待输家的 in-flight 任务收敛（慢站点可达 `taskSettleTimeoutMs`
   * = 120s）。任务不持锁主进程事件循环，但 await `dispose()` 的调用方会一直挂起，
   * 表现为「主进程已看到结果，却还要等一段时间才退出」。
   *
   * 启用后 `abortFastFail()` 跳过该等待，显著缩短退出延迟。代价：仍在收尾的任务
   * 可能触碰已丢弃的 storage，在日志中留下 "Request queue ... does not exist"
   * 类记录（Crawlee 会重试后放弃，无功能性影响）；存储本身按会话隔离，不会被
   * 其他会话使用。
   */
  fastFailOnAbort?: boolean
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
   * Whether to enable SWR background asynchronous update. Default is true.
   */
  backgroundUpdate?: boolean
  /**
   * Force refresh: ignore existing cache and re-validate/heal it.
   */
  refresh?: boolean
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
  upgradeOnJsContent?: boolean // 如果html包含js内容就触发升级，默认 false
  upgradeThresholdMs?: number // 触发升级的等待时间阈值（毫秒），默认 5000ms。超过此时间或无信息则升级。
  useSiteRegistry?: boolean // 使用站点配置
  antibot?: boolean

  /**
   * 外部中断信号（AbortSignal）。
   *
   * @remarks
   * 传入后可通过 `signal.abort(reason)` 中断当前会话：
   * - 尚未开始的动作会立即以 `AbortError` 失败；
   * - 进行中的导航/请求会被取消（`dispose()` 内部会先中止会话再清理资源）；
   * - 会话中止后不可恢复，再次使用会抛 `AbortError`。
   *
   * 也可不传 signal，直接调用 `session.abort(reason)` 手动中止。
   */
  signal?: AbortSignal

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

  /**
   * 请求超时（毫秒）。默认 30000（30 秒）。
   *
   * @remarks
   * - `http`（cheerio）引擎：作为 got 的 `timeout.request`（整个请求的硬性上限）与 goto 导航超时。
   * - `browser`（playwright）引擎：作为导航与页面默认超时。
   * - 公共 API / 搜索引擎类站点的响应通常在数秒内返回；慢站点可按需调大。
   * - 与 {@link firstByteMs} 配合可区分「卡在建连」与「已开始下载数据」的慢请求：
   *   `firstByteMs` 先到点说明对端迟迟不响应，`timeoutMs` 到点则是整体超时。
   */
  timeoutMs?: number

  /**
   * 首字节超时（time-to-first-byte，毫秒）。默认 10000（10 秒）。
   *
   * @remarks
   * 这是在传输层区分「连接卡死」（对端接受连接后迟迟不发数据，或根本连不上）
   * 与「慢但在正常工作」（已开始接收响应体）的拆分点：
   *
   * - `http`（cheerio）引擎：作为 got 的 `timeout.response` —— 自请求发出起，
   *   若在 `firstByteMs` 内未收到首字节数据，got 立即以 `TimeoutError` 失败该请求，
   *   不会一直等到 `timeoutMs`（或 Crawlee 的 `requestHandlerTimeoutSecs`，默认 300 秒）。
   *   响应体开始流式传输后，剩余时间只受 `timeoutMs` 约束。
   * - `browser`（playwright）引擎：包装导航实现同语义 —— 导航开始后，若在
 *   `firstByteMs` 内页面未收到主 frame 导航链（含重定向）的任何响应头，
   *   立即以 {@link FirstByteTimeoutError} 取消导航（Crawlee 会 `window.stop()`
   *   停掉卡死的加载）。收到首字节后，剩余加载（响应体、子资源、waitUntil）
   *   只受 `timeoutMs` 约束。判定信号是「主 frame 导航请求的响应头到达」，
   *   旧页面残留的 XHR/fetch 不算；`data:` / `blob:` / `file:` 等非 http(s)
   *   导航不适用该检查。
   *
   * 上游（如 `@isdk/web-searcher` 的 race 策略）可读取引擎的 `lastActivityAt` /
   * `fetch:progress` 事件来判断「是否已在接收数据」，从而对卡死引擎提前放手。
   *
   * `0` 或 `Infinity` 表示禁用首字节检查（回退为整请求只有 `timeoutMs` 一档超时）。
   */
  firstByteMs?: number

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

  /**
   * `got-scraping`（http 引擎）的浏览器头生成器配置。
   *
   * @remarks
   * got-scraping 默认会随机生成一整套浏览器指纹头（含 `sec-ch-ua` client hints、
   * `sec-fetch-*` 等）注入请求。当调用方显式指定 `User-Agent` 时，生成的头可能与
   * 自定义 UA 不匹配（如生成 Chromium 的 client hints 但 UA 是 Firefox），这种
   * 自相矛盾的指纹会被部分 WAF/反bot（如 4get.nadeko.net）直接拒绝（401）。
   * 通过 `headerGeneratorOptions` 把生成器固定为与 UA 一致的浏览器即可避免。
   *
   * - 设为 `false`（`useHeaderGenerator`）可完全禁用自动头生成，只用 `headers`。
   * - 设为 `{ browsers: [{ name: 'firefox' }] }` 可强制生成 Firefox 一致的头。
   */
  headerGeneratorOptions?:
    | {
        browsers?: { name: 'chrome' | 'firefox' | 'safari' | 'edge'; minVersion?: number; maxVersion?: number }[]
        operatingSystems?: ('windows' | 'macos' | 'android' | 'ios' | 'linux')[]
        devices?: ('desktop' | 'mobile')[]
        locales?: string[]
        httpVersion?: 1 | 2
        http1Headers?: Record<string, string>
        http2Headers?: Record<string, string>
      }
    | false

  /** 完全禁用 got-scraping 的自动浏览器头生成（仅发送 `headers` 中显式声明的头）。 */
  useHeaderGenerator?: boolean

  /**
   * 额外的 MIME 类型，允许引擎下载并返回非 HTML 响应体，例如 `['application/pdf', 'text/csv']`。
   *
   * @remarks
   * - `http`（cheerio）引擎：透传给 Crawlee 的 `CheerioCrawler.additionalMimeTypes`。Crawlee 默认只允许
   *   HTML/XML/JSON 类型的响应体，白名单之外的类型会被直接跳过（请求报错）；配置后对应的响应体会
   *   以原始 Buffer 保存在 `FetchResponse.body` 中。
   * - `browser`（playwright）引擎：通过 Playwright 的 `download` 事件捕获触发下载的响应（如 `Content-Disposition: attachment`），
   *   读取原始二进制内容返回 `FetchResponse.body`；同样受该白名单约束（文本类 MIME 始终允许）。
   * - 值会统一规范化为小写并去重，且始终与引擎自身允许的类型（如 `text/plain`）合并。
   * - 支持通配符（`*` 斜杠 `*` 表示允许所有类型）。
   * - 默认不启用任何额外类型；需要下载非 HTML 内容时请显式配置。
   */
  additionalMimeTypes?: string[]

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
    poolStartTimeoutMs: 10_000,
    taskSettleTimeoutMs: 120_000,
    fastFailOnAbort: false,
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
  timeoutMs: 30000,
  firstByteMs: 10000,
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
  // 无默认值但仍属合法选项，需显式保留，否则外部按 FetcherOptionKeys 过滤选项时会丢失该配置。
  'additionalMimeTypes',
])
