import { defaultsDeep, merge } from 'lodash-es'
import { EventEmitter } from 'events-ex'
import { CommonError } from '@isdk/common-error'
import {
  Configuration,
  KeyValueStore,
  PERSIST_STATE_KEY,
  RequestQueue,
  Session,
  ProxyConfiguration,
} from 'crawlee'
import type {
  BasicCrawler,
  BasicCrawlerOptions,
  CrawlingContext,
  FinalStatistics,
  PlaywrightCrawlingContext,
  PlaywrightGotoOptions,
} from 'crawlee'

import { FetchEngineContext } from '../core/context'
import {
  ExtractSchema,
  ExtractValueSchema,
  ExtractArrayMode,
  ExtractArrayModeName,
  ColumnarOptions,
  SegmentedOptions,
  IExtractEngine,
  _extract,
  _extractNested,
  _extractColumnar,
  _extractSegmented,
  _normalizeArrayMode,
} from '../core/extract'
import {
  BaseFetcherProperties,
  FetchEngineType,
  Cookie,
  FetchResponse,
  ResourceType,
  DefaultFetcherProperties,
} from '../core/types'
import { normalizeHeaders } from '../utils/headers'
import { PromiseLock, createResolvedPromiseLock } from './promise-lock'
import { normalizeExtractSchema } from '../core/normalize-extract-schema'

Configuration.getGlobalConfig().set('persistStorage', false)

/**
 * Options for the {@link FetchEngine.goto}, allowing configuration of HTTP method, payload, headers, and navigation behavior.
 *
 * @remarks
 * Used when navigating to a URL to specify additional parameters beyond the basic URL.
 *
 * @example
 * ```ts
 * await engine.goto('https://example.com', {
 *   method: 'POST',
 *   payload: { username: 'user', password: 'pass' },
 *   headers: { 'Content-Type': 'application/json' },
 *   waitUntil: 'networkidle'
 * });
 * ```
 */
export interface GotoActionOptions {
  method?:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'OPTIONS'
    | 'CONNECT'
    | 'PATCH'
  payload?: any // POST
  headers?: Record<string, string>
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
  timeoutMs?: number
}

/**
 * Options for the {@link FetchEngine.waitFor} action, specifying conditions to wait for before continuing.
 *
 * @remarks
 * Controls timing behavior for interactions, allowing waiting for elements, time intervals, or network conditions.
 */
export interface WaitForActionOptions {
  ms?: number
  selector?: string
  networkIdle?: boolean
  failOnTimeout?: boolean
}

/**
 * Options for the {@link FetchEngine.submit} action, configuring form submission behavior.
 *
 * @remarks
 * Specifies encoding type for form submissions, particularly relevant for JSON-based APIs.
 */
export interface SubmitActionOptions {
  enctype?:
    | 'application/x-www-form-urlencoded'
    | 'application/json'
    | 'multipart/form-data'
}

/**
 * Predefined cleanup groups for the {@link FetchEngine.trim} action.
 */
export type TrimPreset =
  | 'scripts'
  | 'styles'
  | 'svgs'
  | 'images'
  | 'comments'
  | 'hidden'
  | 'all'

/**
 * Options for the {@link FetchEngine.trim} action, specifying which elements to remove from the DOM.
 */
export interface TrimActionOptions {
  selectors?: string | string[]
  presets?: TrimPreset | TrimPreset[]
}

export const TRIM_PRESETS: Record<string, string[]> = {
  scripts: ['script'],
  styles: ['style', 'link[rel="stylesheet"]'],
  svgs: ['svg'],
  images: ['img', 'picture', 'canvas'],
  hidden: ['[hidden]', '[style*="display:none"]', '[style*="display: none"]'],
}

/**
 * Union type representing all possible engine actions that can be dispatched.
 *
 * @remarks
 * Defines the command structure processed during page interactions. Each action type corresponds to
 * a specific user interaction or navigation command within the action loop architecture.
 */
export type FetchEngineAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'waitFor'; options?: WaitForActionOptions }
  | { type: 'submit'; selector?: any; options?: SubmitActionOptions }
  | { type: 'getContent' }
  | { type: 'navigate'; url: string; opts?: GotoActionOptions }
  | { type: 'extract'; schema: ExtractSchema }
  | { type: 'pause'; message?: string }
  | { type: 'trim'; options: TrimActionOptions }
  | { type: 'dispose' }

/**
 * Represents an action that has been dispatched and is awaiting execution in the active page context.
 *
 * @remarks
 * Connects the action request with its resolution mechanism. Used internally by the action dispatch system
 * to handle promises while maintaining the page context validity window.
 */
export interface DispatchedEngineAction {
  action: FetchEngineAction
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}

/**
 * Represents a pending navigation request awaiting resolution.
 *
 * @remarks
 * Tracks navigation requests that have been queued but not yet processed by the request handler.
 */
export interface PendingEngineRequest {
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

/**
 * Abstract base class for all fetch engines, providing a unified interface for web content fetching and interaction.
 *
 * @remarks
 * The `FetchEngine` class serves as the foundation for concrete engine implementations (e.g., `CheerioFetchEngine`,
 * `PlaywrightFetchEngine`). It abstracts underlying crawling technology and provides a consistent API for navigation,
 * content retrieval, and user interaction.
 *
 * The engine architecture uses an event-driven action loop to bridge Crawlee's stateless request handling with
 * the need for a stateful, sequential API for page interactions. This solves the critical challenge of maintaining
 * page context validity across asynchronous operations.
 *
 * @example
 * ```ts
 * import "./playwright"; // 引入注册 Playwright browser 引擎
 * const engine = await FetchEngine.create(context, { engine: 'browser' });
 * await engine.goto('https://example.com');
 * await engine.fill('#username', 'user');
 * await engine.click('#submit');
 * const response = await engine.getContent();
 * ```
 */

type AnyFetchEngine = FetchEngine<any, any, any>
type AnyFetchEngineCtor = new (...args: any[]) => AnyFetchEngine

export abstract class FetchEngine<
  TContext extends CrawlingContext = any,
  TCrawler extends BasicCrawler<TContext> = any,
  TOptions extends BasicCrawlerOptions<TContext> = any,
> implements IExtractEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, AnyFetchEngineCtor>()

  /**
   * Registers a fetch engine implementation with the global registry.
   *
   * @param engineClass - The engine class to register
   * @throws {Error} When engine class lacks static `id` or ID is already registered
   *
   * @example
   * ```ts
   * FetchEngine.register(CheerioFetchEngine);
   * ```
   */
  static register(engineClass: AnyFetchEngineCtor): void {
    const id = (engineClass as any).id
    if (!id) throw new Error('Engine must define static id')
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`)
    this.registry.set(id, engineClass)
  }

  /**
   * Retrieves a fetch engine implementation by its unique ID.
   *
   * @param id - The ID of the engine to retrieve
   * @returns Engine class if found, otherwise `undefined`
   */
  static get(id: string): AnyFetchEngineCtor | undefined {
    return this.registry.get(id)
  }

  /**
   * Retrieves a fetch engine implementation by execution mode.
   *
   * @param mode - Execution mode (`'http'` or `'browser'`)
   * @returns Engine class if found, otherwise `undefined`
   */
  static getByMode(mode: FetchEngineType): AnyFetchEngineCtor | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if ((engineClass as any).mode === mode) return engineClass
    }
  }

  /**
   * Factory method to create and initialize a fetch engine instance.
   *
   * @param ctx - Fetch engine context
   * @param options - Configuration options
   * @returns Initialized fetch engine instance
   * @throws {Error} When no suitable engine implementation is found
   *
   * @remarks
   * Primary entry point for engine creation. Selects appropriate implementation based on `engine` name of the option or context.
   */
  static async create(
    ctx: FetchEngineContext,
    options?: BaseFetcherProperties
  ) {
    const finalOptions = defaultsDeep(
      options,
      ctx,
      DefaultFetcherProperties
    ) as BaseFetcherProperties
    const engineName = (finalOptions.engine ?? ctx.engine) as FetchEngineType
    const Engine = engineName
      ? (this.get(engineName!) ?? this.getByMode(engineName))
      : null
    if (Engine) {
      const result = new Engine()
      await result.initialize(ctx, finalOptions)
      return result
    }
  }

  /**
   * Unique identifier for the engine implementation.
   *
   * @remarks
   * Must be defined by concrete implementations. Used for registration and lookup in engine registry.
   */
  static readonly id: string

  /**
   * Execution mode of the engine (`'http'` or `'browser'`).
   *
   * @remarks
   * Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.
   */
  static readonly mode: FetchEngineType

  declare protected ctx?: FetchEngineContext
  declare protected opts?: BaseFetcherProperties
  declare protected crawler?: TCrawler
  declare protected isCrawlerReady?: boolean
  protected crawlerRunPromise?: Promise<FinalStatistics>
  protected config?: Configuration
  declare protected requestQueue?: RequestQueue
  protected kvStore?: KeyValueStore
  protected proxyConfiguration?: ProxyConfiguration

  protected hdrs: Record<string, string> = {}
  protected _initialCookies?: Cookie[]
  protected _initializedSessions = new Set<string>()
  protected currentSession?: Session
  protected pendingRequests = new Map<string, PendingEngineRequest>()
  protected requestCounter = 0
  protected actionEmitter = new EventEmitter()
  protected isPageActive = false
  protected isEngineDisposed = false
  protected navigationLock: PromiseLock = createResolvedPromiseLock()
  protected lastResponse?: FetchResponse
  protected blockedTypes = new Set<string>()

  public _logDebug(...args: any[]) {
    if (this.opts?.debug) {
      console.log(`[FetchEngine:${this.id}]`, ...args)
    }
  }

  protected _cleanup?(): Promise<void>

  protected _getTrimInfo(options: TrimActionOptions) {
    let { selectors = [], presets = [] } = options
    if (typeof selectors === 'string') selectors = [selectors]
    if (typeof presets === 'string') presets = [presets]

    const isAll = presets.includes('all')
    const allSelectors = [...selectors]

    for (const [preset, sels] of Object.entries(TRIM_PRESETS)) {
      if (isAll || presets.includes(preset as any)) {
        allSelectors.push(...sels)
      }
    }

    return {
      selectors: allSelectors,
      removeComments: isAll || presets.includes('comments'),
      removeHidden: isAll || presets.includes('hidden'),
    }
  }

  /**
   * Finds all elements matching the selector within the given context.
   * @param context - The context to search in (Engine-specific element/node or array of nodes).
   * @param selector - CSS selector.
   * @internal
   */
  public abstract _querySelectorAll(
    context: any,
    selector: string
  ): Promise<any[]>

  /**
   * Extracts a primitive value from the element based on schema.
   * @param schema - Value extraction schema.
   * @param context - The element context.
   * @internal
   */
  public abstract _extractValue(
    schema: ExtractValueSchema,
    context: any
  ): Promise<any>

  /**
   * Gets the parent element of the given element.
   * @param element - The element.
   * @internal
   */
  public abstract _parentElement(element: any): Promise<any | null>

  /**
   * Checks if two elements are the same.
   * @param element1 - First element.
   * @param element2 - Second element.
   * @internal
   */
  public abstract _isSameElement(
    element1: any,
    element2: any
  ): Promise<boolean>

  /**
   * Gets all subsequent siblings of an element until a sibling matches the selector.
   * Used in 'segmented' extraction mode.
   * @param element - The anchor element.
   * @param untilSelector - Optional selector that marks the end of the segment.
   * @internal
   */
  public abstract _nextSiblingsUntil(
    element: any,
    untilSelector?: string
  ): Promise<any[]>

  protected async _extract(
    schema: ExtractSchema,
    context: any,
    parentStrict?: boolean
  ): Promise<any> {
    return _extract.call(this, schema, context, parentStrict)
  }

  /**
   * Normalizes the array extraction mode into an options object.
   * @param mode - The mode string or options object.
   * @internal
   */
  protected _normalizeArrayMode(
    mode?: ExtractArrayMode
  ): { type: ExtractArrayModeName } & any {
    return _normalizeArrayMode.call(this, mode)
  }

  /**
   * Performs standard nested array extraction.
   * @param items - The schema for each item.
   * @param elements - The list of item elements.
   * @internal
   */
  protected async _extractNested(
    items: ExtractSchema,
    elements: any[],
    opts?: { strict?: boolean }
  ): Promise<any[]> {
    return _extractNested.call(this, items, elements, opts)
  }

  /**
   * Performs columnar extraction (Column Alignment Mode).
   *
   * @param schema - The schema for a single item (must be an object or implicit object).
   * @param container - The container element to search within.
   * @param opts - Columnar extraction options (strict, inference).
   * @returns An array of extracted items, or null if requirements aren't met.
   * @internal
   */
  protected async _extractColumnar(
    schema: ExtractSchema,
    container: any,
    opts?: ColumnarOptions
  ): Promise<any[] | null> {
    return _extractColumnar.call(this, schema, container, opts)
  }

  /**
   * Performs segmented extraction (Anchor-based Scanning).
   *
   * @param schema - The schema for a single item (must be an object).
   * @param container - The container element to scan.
   * @param opts - Segmented extraction options (anchor).
   * @returns An array of extracted items.
   * @internal
   */
  protected async _extractSegmented(
    schema: ExtractSchema,
    container: any,
    opts?: SegmentedOptions
  ): Promise<any[] | null> {
    return _extractSegmented.call(this, schema, container, opts)
  }

  /**
   * Creates the crawler instance for the specific engine implementation.
   * @param options - The final crawler options.
   * @internal
   */
  protected abstract _createCrawler(
    options: TOptions,
    config?: Configuration
  ): TCrawler

  /**
   * Gets the crawler-specific options from the subclass.
   * @param ctx - The fetch engine context.
   * @internal
   */
  protected abstract _getSpecificCrawlerOptions(
    ctx: FetchEngineContext
  ): Promise<Partial<TOptions>> | Partial<TOptions>
  /**
   * Abstract method for building standard [FetchResponse] from Crawlee context.
   *
   * @param context - Crawlee crawling context
   * @returns Promise resolving to [FetchResponse] object
   *
   * @remarks
   * Converts implementation-specific context (Playwright `page` or Cheerio `$`) to standardized response.
   * @internal
   */
  protected abstract _buildResponse(context: TContext): Promise<FetchResponse>
  protected async buildResponse(context: TContext): Promise<FetchResponse> {
    const result = await this._buildResponse(context)
    const contentTypeHeader = result.headers['content-type'] || ''
    result.contentType = contentTypeHeader.split(';')[0].trim()
    if (this.opts?.output?.cookies !== false) {
      if (!result.cookies && context.session) {
        result.cookies = context.session.getCookies(context.request.url)
      }
    } else {
      delete result.cookies
    }

    if (this.opts?.output?.sessionState !== false) {
      if (this.crawler?.sessionPool) {
        result.sessionState = await this.crawler.sessionPool.getState()
      }
    } else {
      delete result.sessionState
    }

    if (this.opts?.debug) {
      result.metadata = {
        ...result.metadata,
        mode: this.mode,
        engine: this.id as any,
        proxy:
          (context as any).proxyInfo?.url ||
          (typeof this.opts.proxy === 'string'
            ? this.opts.proxy
            : Array.isArray(this.opts.proxy)
              ? this.opts.proxy[0]
              : undefined),
      }
    }

    return result
  }

  /**
   * Abstract method for executing action within current page context.
   *
   * @param context - Crawlee crawling context
   * @param action - Action to execute
   * @returns Promise resolving to action result
   *
   * @remarks
   * Handles specific user interactions using underlying technology (Playwright/Cheerio).
   * @internal
   */
  protected abstract executeAction(
    context: TContext,
    action: FetchEngineAction
  ): Promise<any>

  /**
   * Navigates to the specified URL.
   *
   * @param url - Target URL
   * @param params - Navigation options
   * @returns Promise resolving when navigation completes
   *
   * @example
   * ```ts
   * await engine.goto('https://example.com');
   * ```
   */
  abstract goto(
    url: string,
    params?: GotoActionOptions
  ): Promise<void | FetchResponse>

  /**
   * Waits for specified condition before continuing.
   *
   * @param params - Wait conditions
   * @returns Promise resolving when wait condition is met
   *
   * @example
   * ```ts
   * await engine.waitFor({ ms: 1000 }); // Wait 1 second
   * await engine.waitFor({ selector: '#content' }); // Wait for element
   * ```
   */
  waitFor(params?: WaitForActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'waitFor', options: params })
  }

  /**
   * Clicks on element matching selector.
   *
   * @param selector - CSS selector of element to click
   * @returns Promise resolving when click is processed
   * @throws {Error} When no active page context exists
   */
  click(selector: string): Promise<void> {
    return this.dispatchAction({ type: 'click', selector })
  }

  /**
   * Fills input element with specified value.
   *
   * @param selector - CSS selector of input element
   * @param value - Value to fill
   * @returns Promise resolving when fill operation completes
   * @throws {Error} When no active page context exists
   */
  fill(selector: string, value: string): Promise<void> {
    return this.dispatchAction({ type: 'fill', selector, value })
  }

  /**
   * Submits a form.
   *
   * @param selector - Optional form/submit button selector
   * @param options - Submission options
   * @returns Promise resolving when form is submitted
   * @throws {Error} When no active page context exists
   */
  submit(selector?: any, options?: SubmitActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options })
  }

  /**
   * Removes elements from the DOM based on selectors and presets.
   *
   * @param options - Trim options specifying selectors and presets
   * @returns Promise resolving when trim operation completes
   * @throws {Error} When no active page context exists
   */
  trim(options: TrimActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'trim', options })
  }

  /**
   * Pauses execution, allowing for manual intervention or inspection.
   *
   * @param message - Optional message to display during pause
   * @returns Promise resolving when execution is resumed
   * @throws {Error} When no active page context exists
   */
  pause(message?: string): Promise<void> {
    return this.dispatchAction({ type: 'pause', message })
  }

  /**
   * Extracts structured data from the current page content.
   *
   * @param schema - An object defining the data to extract.
   * @returns A promise that resolves to an object with the extracted data.
   */
  extract<T>(schema: ExtractSchema): Promise<T> {
    if (schema && typeof schema === 'object' && (schema as any).schema) {
      schema = (schema as any).schema
    }
    const normalizedSchema = normalizeExtractSchema(schema)
    return this.dispatchAction({ type: 'extract', schema: normalizedSchema })
  }

  /**
   * Gets the unique identifier of this engine implementation.
   */
  get id() {
    return (this.constructor as typeof FetchEngine).id
  }

  /**
   * Returns the current state of the engine (cookies)
   * that can be used to restore the session later.
   */
  async getState(): Promise<{ cookies: Cookie[]; sessionState?: any }> {
    return {
      cookies: await this.cookies(),
      sessionState: await this.crawler?.sessionPool?.getState(),
    }
  }

  /**
   * Gets the execution mode of this engine (`'http'` or `'browser'`).
   */
  get mode() {
    return (this.constructor as typeof FetchEngine).mode
  }

  /**
   * Gets the fetch engine context associated with this instance.
   */
  get context() {
    return this.ctx
  }

  /**
   * Initializes the fetch engine with provided context and options.
   *
   * @param context - Fetch engine context
   * @param options - Configuration options
   * @returns Promise resolving when initialization completes
   *
   * @remarks
   * Sets up internal state and calls implementation-specific [_initialize](file:///home/riceball/Documents/mywork/public/@isdk/ai-tools/packages/web-fetcher/src/engine/cheerio.ts#L169-L204) method.
   * Automatically called when creating engine via `FetchEngine.create()`.
   */
  async initialize(
    context: FetchEngineContext,
    options?: BaseFetcherProperties
  ): Promise<void> {
    if (this.ctx) {
      return
    }
    // Deep merge the final resolved options back into the context,
    // so the context object always holds the most up-to-date data.
    merge(context, options)

    this.ctx = context
    this.opts = context // Use the merged context
    this.hdrs = normalizeHeaders(context.headers)
    this._initialCookies = [...(context.cookies ?? [])]
    if (!context.internal) {
      context.internal = {}
    }
    context.internal.engine = this
    context.engine = this.mode
    this.actionEmitter.setMaxListeners(100) // Set a higher limit to prevent memory leak warnings

    const storage = context.storage || {}
    const persistStorage = storage.persist ?? false
    const config = (this.config = new Configuration({
      persistStorage,
      storageClientOptions: {
        persistStorage,
        ...storage.config,
      },
      ...storage.config,
    }))
    const storeId = storage.id || context.id
    this.requestQueue = await RequestQueue.open(storeId, { config })

    const proxyUrls = this.opts?.proxy
      ? typeof this.opts.proxy === 'string'
        ? [this.opts.proxy]
        : this.opts.proxy
      : undefined
    if (proxyUrls?.length) {
      this.proxyConfiguration = new ProxyConfiguration({ proxyUrls })
    }

    const specificCrawlerOptions =
      await this._getSpecificCrawlerOptions(context)
    const sessionPoolOptions: any = defaultsDeep(
      {
        persistenceOptions: { enable: true, storeId: storeId },
        persistStateKeyValueStoreId: storeId,
      },
      context.sessionPoolOptions,
      {
        maxPoolSize: 1,
        sessionOptions: { maxUsageCount: 1000, maxErrorScore: 3 },
      }
    )
    if (context.sessionState) {
      if (context.cookies && context.cookies.length > 0) {
        console.warn(
          '[FetchEngine] Warning: Both "sessionState" and "cookies" are provided. Explicit "cookies" will override any conflicting cookies restored from "sessionState".'
        )
      }
    }

    const finalCrawlerOptions = {
      ...defaultsDeep(specificCrawlerOptions, {
        requestQueue: this.requestQueue,
        maxConcurrency: 1,
        minConcurrency: 1,
        useSessionPool: true,
        persistCookiesPerSession: true,
        sessionPoolOptions,
      }),
      // Force these handlers, they are critical for the engine's operation
      requestHandler: this._requestHandler.bind(this),
      errorHandler: this._failedRequestHandler.bind(this),
      failedRequestHandler: this._failedRequestHandler.bind(this),
    }

    if (!finalCrawlerOptions.preNavigationHooks) {
      finalCrawlerOptions.preNavigationHooks = []
    }
    finalCrawlerOptions.preNavigationHooks.unshift(
      (
        { crawler, session, request }: PlaywrightCrawlingContext,
        opts: PlaywrightGotoOptions
      ) => {
        this.currentSession = session
        if (session && !this._initializedSessions.has(session.id)) {
          if (this._initialCookies && this._initialCookies.length > 0) {
            const normalizedCookies = this._initialCookies.map((c) => {
              const cookie = { ...c }
              if ((cookie as any).sameSite === 'no_restriction') {
                cookie.sameSite = 'None'
              }
              return cookie
            })
            session.setCookies(normalizedCookies, request.url)
          }
          this._initializedSessions.add(session.id)
        }
      }
    )

    const crawler = (this.crawler = this._createCrawler(
      finalCrawlerOptions as TOptions,
      config
    ))
    const kvStore = (this.kvStore = await KeyValueStore.open(storeId, {
      config,
    }))
    const persistState = await kvStore.getValue(PERSIST_STATE_KEY)
    if (
      context.sessionState &&
      (!persistState || context.overrideSessionState)
    ) {
      await kvStore.setValue(PERSIST_STATE_KEY, context.sessionState)
    }

    this.isCrawlerReady = true
    this.crawlerRunPromise = crawler.run()
    this.crawlerRunPromise
      .finally(() => {
        this.isCrawlerReady = false
      })
      .catch((error) => {
        console.error('Crawler background error:', error)
      })
  }

  async cleanup(): Promise<void> {
    await this._cleanup?.()
    await this._commonCleanup()
    const context = this.ctx
    if (context) {
      if (context.internal?.engine === this) {
        context.internal.engine = undefined
      }
    }
    this.ctx = undefined
    this.opts = undefined
  }

  /**
   * Executes all pending fetch engine actions within the current Crawlee request handler context.
   *
   * **Critical Execution Constraint**: This method **MUST** be awaited within the synchronous execution path
   * of Crawlee's [requestHandler](https://crawlee.dev/js/api/basic-crawler) (before any `await` that yields control back to the event loop).
   *
   * ### Why This Constraint Exists
   * - Crawlee's page context ([PlaywrightCrawler](https://crawlee.dev/js/api/playwright-crawler)'s `page` or [CheerioCrawler](https://crawlee.dev/js/api/cheerio-crawler)'s `$`)
   *   is **only valid during the synchronous execution phase** of the request handler
   * - After any `await` (e.g., `await page.goto()`), the page context may be destroyed
   *   due to Crawlee's internal resource management
   *
   * ### How It Works
   * 1. Processes all actions queued via {@link dispatchAction} (click, fill, submit, etc.)
   * 2. Maintains the page context validity window via {@link isPageActive} lifecycle flag
   * 3. Automatically cleans up event listeners upon completion
   *
   * Usage see {@link _sharedRequestHandler}
   * @see {@link _sharedRequestHandler}
   * @param context The active Crawlee crawling context containing the page/$ object
   * @throws {Error} If called outside valid page context window (`!this.isPageActive`)
   * @internal Engine infrastructure method - not for direct consumer use
   */
  protected async _executePendingActions(context: TContext) {
    if (this.isEngineDisposed) return
    await new Promise<void>((resolveLoop) => {
      const listener = async ({
        action,
        resolve,
        reject,
      }: DispatchedEngineAction) => {
        try {
          if (action.type === 'dispose') {
            this.actionEmitter.emit('dispose')
            resolve()
            return
          }
          const result = await this.executeAction(context, action)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      const onDispose = () => {
        this.actionEmitter.removeListener('dispatch', listener)
        resolveLoop()
      }

      this.actionEmitter.on('dispatch', listener)
      this.actionEmitter.once('dispose', onDispose)

      if (this.isEngineDisposed) {
        onDispose()
        this.actionEmitter.removeListener('dispose', onDispose)
      }
    })
  }

  protected async _sharedRequestHandler(context: TContext): Promise<void> {
    const { request } = context
    this._logDebug(`Processing request: ${request.url}`)
    try {
      this.currentSession = context.session
      this.isPageActive = true

      const gotoPromise = this.pendingRequests.get(request.userData.requestId)
      if (gotoPromise) {
        const fetchResponse = await this.buildResponse(context)

        // If throwHttpErrors is enabled, check for failure conditions and reject if necessary.
        const isError =
          !fetchResponse.statusCode || fetchResponse.statusCode >= 400
        if (this.ctx?.throwHttpErrors && isError) {
          const error = new CommonError(
            `Request for ${fetchResponse.finalUrl} failed with status ${fetchResponse.statusCode || 'N/A'}`,
            'request',
            fetchResponse.statusCode
          )
          gotoPromise.reject(error)
        } else {
          this.lastResponse = fetchResponse
          gotoPromise.resolve(fetchResponse)
        }
        this.pendingRequests.delete(request.userData.requestId)
      }

      await this._executePendingActions(context)
    } finally {
      if (this.currentSession) {
        const cookies = this.currentSession.getCookies(request.url)
        if (cookies) {
          this._initialCookies = cookies
        }
      }
      this.isPageActive = false
      this.navigationLock.release()
    }
  }

  protected async _sharedFailedRequestHandler(
    context: TContext,
    error?: Error
  ): Promise<void> {
    const { request } = context
    const gotoPromise = this.pendingRequests.get(request.userData.requestId)
    if (gotoPromise && error && this.ctx?.throwHttpErrors) {
      this.pendingRequests.delete(request.userData.requestId)
      const response = (error as any).response
      const statusCode = response?.statusCode || 500
      const url = response?.url ? response.url : request.url
      const finalError = new CommonError(
        `Request${url ? ' for ' + url : ''} failed: ${error.message}`,
        'request',
        statusCode
      )
      gotoPromise.reject(finalError)
    }
    // By calling the original handler, we ensure cleanup (e.g. lock release) happens.
    // The original handler will not find the promise and that's OK.
    return this._sharedRequestHandler(context)
  }

  protected async dispatchAction<T>(action: FetchEngineAction): Promise<T> {
    if (!this.isPageActive) {
      throw new Error('No active page. Call goto() before performing actions.')
    }
    return new Promise<T>((resolve, reject) => {
      this.actionEmitter.emit('dispatch', { action, resolve, reject })
    })
  }

  private async _requestHandler(context: TContext): Promise<void> {
    await this._sharedRequestHandler(context)
  }

  private async _failedRequestHandler(
    context: TContext,
    error: Error
  ): Promise<void> {
    await this._sharedFailedRequestHandler(context, error)
  }

  protected async _commonCleanup() {
    this.isEngineDisposed = true
    this._initializedSessions.clear()
    this.actionEmitter.emit('dispose')
    this.navigationLock?.release()

    if (this.pendingRequests.size > 0) {
      for (const [, pendingRequest] of this.pendingRequests) {
        pendingRequest.reject(new Error('Cleanup:Request cancelled'))
      }
      this.pendingRequests.clear()
    }

    if (this.crawler) {
      try {
        await this.crawler.teardown?.()
      } catch (error) {
        console.error('crawler teardown error:', error)
      }
      this.crawler = undefined
    }
    this.crawlerRunPromise = undefined
    this.isCrawlerReady = undefined

    const storage = this.opts?.storage || {}
    const shouldPurge = storage.purge ?? true

    if (this.requestQueue) {
      if (shouldPurge) {
        await this.requestQueue
          .drop()
          .catch((err) => console.error('Error dropping requestQueue:', err))
      }
      this.requestQueue = undefined
    }

    if (this.kvStore) {
      if (shouldPurge) {
        await this.kvStore
          .drop()
          .catch((err) => console.error('Error dropping kvStore:', err))
      }
      this.kvStore = undefined
    }

    this.actionEmitter.removeAllListeners()
    this.pendingRequests.clear()
    this.config = undefined
  }

  /**
   * Blocks specified resource types from loading.
   *
   * @param types - Resource types to block
   * @param overwrite - Whether to replace existing blocked types
   * @returns Number of blocked resource types
   *
   * @example
   * ```ts
   * await engine.blockResources(['image', 'stylesheet']);
   * await engine.blockResources(['script'], true); // Replace existing
   * ```
   */
  async blockResources(types: ResourceType[], overwrite?: boolean) {
    if (overwrite) {
      this.blockedTypes.clear()
    }
    types.forEach((t) => this.blockedTypes.add(t))
    return types.length
  }

  /**
   * Gets content of current page.
   *
   * @returns Promise resolving to fetch response
   * @throws {Error} When no content has been fetched yet
   */
  getContent(): Promise<FetchResponse> {
    if (!this.lastResponse) {
      return Promise.reject(
        new Error('No content fetched yet. Call goto() first.')
      )
    }
    return Promise.resolve(this.lastResponse)
  }

  /**
   * Manages HTTP headers for requests with multiple overloads.
   *
   * @overload
   * Gets all headers.
   * @returns All headers as record
   *
   * @overload
   * Gets specific header value.
   * @param name - Header name
   * @returns Header value
   *
   * @overload
   * Sets multiple headers.
   * @param headers - Headers to set
   * @param replaced - Whether to replace all existing headers
   * @returns `true` if successful
   *
   * @overload
   * Sets single header.
   * @param name - Header name
   * @param value - Header value or `null` to remove
   * @returns `true` if successful
   *
   * @example
   * ```ts
   * const allHeaders = await engine.headers();
   * const userAgent = await engine.headers('user-agent');
   * await engine.headers({ 'x-custom': 'value' });
   * await engine.headers('auth', 'token');
   * ```
   */
  async headers(): Promise<Record<string, string>>
  async headers(name: string): Promise<string>
  async headers(
    headers: Record<string, string>,
    replaced?: boolean
  ): Promise<boolean>
  async headers(name: string, value: string | null): Promise<boolean>
  async headers(
    nameOrHeaders?: string | Record<string, string>,
    value?: string | boolean | null
  ): Promise<Record<string, string> | string | boolean> {
    if (nameOrHeaders === undefined) {
      return { ...this.hdrs }
    }

    if (typeof nameOrHeaders === 'string' && value === undefined) {
      return this.hdrs[nameOrHeaders.toLowerCase()] || ''
    }

    if (nameOrHeaders !== null && typeof nameOrHeaders === 'object') {
      const normalized: Record<string, string> = {}
      for (const [k, v] of Object.entries(nameOrHeaders)) {
        normalized[k.toLowerCase()] = String(v)
      }
      if (value === true) {
        this.hdrs = normalized
      } else {
        this.hdrs = { ...this.hdrs, ...normalized }
      }
      return true
    }

    if (typeof nameOrHeaders === 'string') {
      if (typeof value === 'string') {
        this.hdrs[nameOrHeaders.toLowerCase()] = value
      } else if (value === null) {
        delete this.hdrs[nameOrHeaders.toLowerCase()]
      }
      return true
    }
    return false
  }

  /**
   * Manages cookies for current session with multiple overloads.
   *
   * @overload
   * Gets all cookies.
   * @returns Array of cookies
   *
   * @overload
   * Sets cookies for session.
   * @param cookies - Cookies to set
   * @returns `true` if successful
   *
   * @example
   * ```ts
   * const cookies = await engine.cookies();
   * await engine.cookies([{ name: 'session', value: '123' }]);
   * ```
   */
  async cookies(): Promise<Cookie[]>
  async cookies(cookies: Cookie[]): Promise<boolean>
  async cookies(a?: any): Promise<any> {
    const url = this.lastResponse?.url || ''
    if (Array.isArray(a)) {
      if (this.currentSession) {
        this.currentSession.setCookies(a, url)
      } else {
        this._initialCookies = [...a]
      }
      return true
    } else if (a === null) {
      if (this.currentSession) {
        // Not straightforward to clear cookies in Session,
        // usually overwriting with empty array or expired cookies works
        // But Crawlee Session doesn't have explicit clearCookies() public API easily accessible for all?
        // Actually, setCookies([]) doesn't clear.
        // We might need to iterate and delete?
        // For now, let's just reset our initial cookies buffer or warn.
        // Implementing 'clear' fully via Session might require accessing internal jar.
      }
      this._initialCookies = []
      return true
    }
    if (this.currentSession) {
      const cookies = this.currentSession.getCookies(url)
      return cookies
    }
    return [...(this._initialCookies || [])]
  }

  /**
   * Disposes of engine, cleaning up all resources.
   *
   * @returns Promise resolving when disposal completes
   */
  async dispose(): Promise<void> {
    await this.cleanup()
  }

  // 能力协商（动作层可打标：native/simulate/noop）
  // abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
