import { defaultsDeep } from 'lodash-es';
import { EventEmitter } from 'events-ex';
import { CommonError } from '@isdk/common-error';
import {
  Configuration,
  RequestQueue,
  type CheerioCrawler,
  type CrawlingContext,
  type PlaywrightCrawler,
} from 'crawlee';
import { FetchEngineContext } from '../core/context';
import {
  BaseFetcherProperties,
  FetchEngineType,
  Cookie,
  FetchResponse,
  ResourceType,
  DefaultFetcherProperties,
} from '../core/types';
import { normalizeHeaders } from '../utils/headers';
import { PromiseLock, createResolvedPromiseLock } from './promise-lock';

Configuration.getGlobalConfig().set('persistStorage', false);

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
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'OPTIONS' | 'CONNECT' | 'PATCH';
  payload?: any; // POST
  headers?: Record<string, string>;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeoutMs?: number;
}

/**
 * Options for the {@link FetchEngine.waitFor} action, specifying conditions to wait for before continuing.
 *
 * @remarks
 * Controls timing behavior for interactions, allowing waiting for elements, time intervals, or network conditions.
 */
export interface WaitForActionOptions {
  ms?: number;
  selector?: string;
  networkIdle?: boolean;
}

/**
 * Options for the {@link FetchEngine.submit} action, configuring form submission behavior.
 *
 * @remarks
 * Specifies encoding type for form submissions, particularly relevant for JSON-based APIs.
 */
export interface SubmitActionOptions {
  enctype?: 'application/x-www-form-urlencoded' | 'application/json' | 'multipart/form-data';
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
  | { type: 'dispose' };

/**
 * Represents an action that has been dispatched and is awaiting execution in the active page context.
 *
 * @remarks
 * Connects the action request with its resolution mechanism. Used internally by the action dispatch system
 * to handle promises while maintaining the page context validity window.
 */
export interface DispatchedEngineAction {
  action: FetchEngineAction;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

/**
 * Represents a pending navigation request awaiting resolution.
 *
 * @remarks
 * Tracks navigation requests that have been queued but not yet processed by the request handler.
 */
export interface PendingEngineRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
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
export abstract class FetchEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchEngine>();

  /**
   * Registers a fetch engine implementation with the global registry.
   *
   * @param engineClass - The engine class to register
   * @throws {Error} When engine class lacks static [id](file:///home/riceball/Documents/mywork/public/@isdk/ai-tools/packages/web-fetcher/src/engine/cheerio.ts#L20-L20) or ID is already registered
   *
   * @example
   * ```ts
   * FetchEngine.register(CheerioFetchEngine);
   * ```
   */
  static register<T extends typeof FetchEngine>(engineClass: T): void {
    const id = engineClass.id;
    if (!id) throw new Error('Engine must define static id');
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`);
    this.registry.set(id, engineClass);
  }

  /**
   * Retrieves a fetch engine implementation by its unique ID.
   *
   * @param id - The ID of the engine to retrieve
   * @returns Engine class if found, otherwise `undefined`
   */
  static get(id: string): typeof FetchEngine | undefined {
    return this.registry.get(id);
  }

  /**
   * Retrieves a fetch engine implementation by execution mode.
   *
   * @param mode - Execution mode (`'http'` or `'browser'`)
   * @returns Engine class if found, otherwise `undefined`
   */
  static getByMode(mode: FetchEngineType): typeof FetchEngine | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if (engineClass.mode === mode) return engineClass;
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
  static async create(ctx: FetchEngineContext, options?: BaseFetcherProperties) {
    options = defaultsDeep(options, DefaultFetcherProperties) as BaseFetcherProperties;
    const engineName = (options.engine ?? ctx.engine) as FetchEngineType;
    const Engine = engineName ? (this.get(engineName!) ?? this.getByMode(engineName)) : this !== FetchEngine ? this : null;
    if (Engine) {
      const result = new (Engine as any)() as FetchEngine;
      await result.initialize(ctx, options);
      return result;
    }
  }

  /**
   * Unique identifier for the engine implementation.
   *
   * @remarks
   * Must be defined by concrete implementations. Used for registration and lookup in engine registry.
   */
  static readonly id: string;

  /**
   * Execution mode of the engine (`'http'` or `'browser'`).
   *
   * @remarks
   * Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.
   */
  static readonly mode: FetchEngineType;

  declare protected ctx?: FetchEngineContext;
  declare protected opts?: BaseFetcherProperties;
  declare protected crawler?: CheerioCrawler | PlaywrightCrawler;
  declare protected requestQueue?: RequestQueue;

  protected hdrs: Record<string, string> = {};
  protected jar: Cookie[] = [];
  protected pendingRequests = new Map<string, PendingEngineRequest>();
  protected requestCounter = 0;
  protected actionEmitter = new EventEmitter();
  protected isPageActive = false;
  protected navigationLock: PromiseLock = createResolvedPromiseLock();
  protected lastResponse?: FetchResponse;
  protected blockedTypes = new Set<string>();

  protected _cleanup?(): Promise<void>;
  /**
   * Abstract method for initializing engine's underlying crawler.
   *
   * @param ctx - Fetch engine context
   * @param options - Configuration options
   * @returns Promise resolving when initialization completes
   *
   * @remarks
   * Concrete implementations must provide this to set up their specific crawler instance.
   * @internal
   */
  protected abstract _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void>;
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
  protected abstract buildResponse(context: CrawlingContext): Promise<FetchResponse>;
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
  protected abstract executeAction(context: CrawlingContext, action: FetchEngineAction): Promise<any>;

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
  abstract goto(url: string, params?: GotoActionOptions): Promise<void | FetchResponse>;

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
  abstract waitFor(params?: WaitForActionOptions): Promise<void>;

  /**
   * Clicks on element matching selector.
   *
   * @param selector - CSS selector of element to click
   * @returns Promise resolving when click is processed
   * @throws {Error} When no active page context exists
   */
  abstract click(selector: string): Promise<void>;

  /**
   * Fills input element with specified value.
   *
   * @param selector - CSS selector of input element
   * @param value - Value to fill
   * @returns Promise resolving when fill operation completes
   * @throws {Error} When no active page context exists
   */
  abstract fill(selector: string, value: string): Promise<void>;

  /**
   * Submits a form.
   *
   * @param selector - Optional form/submit button selector
   * @param options - Submission options
   * @returns Promise resolving when form is submitted
   * @throws {Error} When no active page context exists
   */
  abstract submit(selector?: any, options?: SubmitActionOptions): Promise<void>; // http: post form 模拟

  /**
   * Gets the unique identifier of this engine implementation.
   */
  get id() {
    return (this.constructor as typeof FetchEngine).id;
  }

  /**
   * Gets the execution mode of this engine (`'http'` or `'browser'`).
   */
  get mode() {
    return (this.constructor as typeof FetchEngine).mode;
  }

  /**
   * Gets the fetch engine context associated with this instance.
   */
  get context() {
    return this.ctx;
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
  async initialize(context: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    if (!this.ctx) {
      this.ctx = context;
      this.opts = options;
      this.hdrs = normalizeHeaders(options?.headers);

      this.jar = [...(options?.cookies ?? [])];
      if (!context.internal) {
        context.internal = {};
      }
      context.internal.engine = this;
      context.engine = this.mode;
      // this.requestQueue = await RequestQueue.open(`cheerio-queue-${ctx.id}`); // 带id会创建持久化请求队列。
      this.requestQueue = await RequestQueue.open();
      await this._initialize(context, options);
    }
  }

  async cleanup(): Promise<void> {
    await this._cleanup?.();
    await this._commonCleanup();
    const context = this.ctx;
    if (context) {
      if (context.internal?.engine === this) {
        context.internal.engine = undefined;
      }
    }
    this.ctx = undefined;
    this.opts = undefined;
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
  protected async _executePendingActions(context: CrawlingContext) {
    await new Promise<void>((resolveLoop) => {
      const listener = async ({ action, resolve, reject }: DispatchedEngineAction) => {
        try {
          if (action.type === 'dispose') {
            this.actionEmitter.emit('dispose');
            resolve();
            return;
          }
          const result = await this.executeAction(context, action);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      this.actionEmitter.on('dispatch', listener);
      this.actionEmitter.once('dispose', () => {
        this.actionEmitter.removeListener('dispatch', listener);
        resolveLoop();
      });
    });
  }

  protected async _sharedRequestHandler(context: CrawlingContext): Promise<void> {
    try {
      const { request } = context;
      this.isPageActive = true;

      const gotoPromise = this.pendingRequests.get(request.userData.requestId);
      if (gotoPromise) {
        const fetchResponse = await this.buildResponse(context);
        this.lastResponse = fetchResponse; // set last response
        gotoPromise.resolve(fetchResponse);
        this.pendingRequests.delete(request.userData.requestId);
      }

      await this._executePendingActions(context);
    } finally {
      this.isPageActive = false;
      this.navigationLock.release();
    }
  }

  protected async _sharedFailedRequestHandler(context: CrawlingContext, error?: Error): Promise<void> {
    const { request } = context;
    const gotoPromise = this.pendingRequests.get(request.userData.requestId);
    if (gotoPromise && error && this.ctx?.throwHttpErrors) {
      const response = (error as any).response;
      const statusCode = response?.statusCode || 500;
      const url = response?.url ? response.url : request.url;
      const finalError = new CommonError(`Request${url ? ' for '+url: ''} failed: ${error.message}`, 'request', statusCode);
      gotoPromise.reject(finalError);
      this.pendingRequests.delete(request.userData.requestId);
    }
    // By calling the original handler, we ensure cleanup (e.g. lock release) happens.
    // The original handler will not find the promise and that's OK.
    return this._sharedRequestHandler(context);
  }

  protected async dispatchAction<T>(action: FetchEngineAction): Promise<T> {
    if (!this.isPageActive) {
      throw new Error('No active page. Call goto() before performing actions.');
    }
    return new Promise<T>((resolve, reject) => {
      this.actionEmitter.emit('dispatch', { action, resolve, reject });
    });
  }

  protected async _commonCleanup() {
    if (this.isPageActive) {
      await this.dispatchAction({ type: 'dispose' }).catch(() => {
        /* ignore */
      });
    }

    if (this.pendingRequests.size > 0) {
      for (const [, pendingRequest] of this.pendingRequests) {
        pendingRequest.reject(new Error('Cleanup:Request cancelled'));
      }
    }

    this.actionEmitter.removeAllListeners();

    if (this.crawler) {
      await this.crawler.teardown?.();
      this.crawler = undefined;
    }

    if (this.requestQueue) {
      await this.requestQueue.drop();
      this.requestQueue = undefined;
    }

    this.pendingRequests.clear();
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
      this.blockedTypes.clear();
    }
    types.forEach((t) => this.blockedTypes.add(t));
    return types.length;
  }

  /**
   * Gets content of current page.
   *
   * @returns Promise resolving to fetch response
   * @throws {Error} When no content has been fetched yet
   */
  getContent(): Promise<FetchResponse> {
    if (!this.lastResponse) {
      return Promise.reject(new Error('No content fetched yet. Call goto() first.'));
    }
    return Promise.resolve(this.lastResponse);
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
  async headers(): Promise<Record<string, string>>;
  async headers(name: string): Promise<string>;
  async headers(headers: Record<string, string>, replaced?: boolean): Promise<boolean>;
  async headers(name: string, value: string | null): Promise<boolean>;
  async headers(
    nameOrHeaders?: string | Record<string, string>,
    value?: string | boolean | null,
  ): Promise<Record<string, string> | string | boolean> {
    if (nameOrHeaders === undefined) {
      return { ...this.hdrs };
    }

    if (typeof nameOrHeaders === 'string' && value === undefined) {
      return this.hdrs[nameOrHeaders.toLowerCase()] || '';
    }

    if (nameOrHeaders !== null && typeof nameOrHeaders === 'object') {
      const normalized: Record<string, string> = {};
      for (const [k, v] of Object.entries(nameOrHeaders)) {
        normalized[k.toLowerCase()] = String(v);
      }
      if (value === true) {
        this.hdrs = normalized;
      } else {
        this.hdrs = { ...this.hdrs, ...normalized };
      }
      return true;
    }

    if (typeof nameOrHeaders === 'string') {
      if (typeof value === 'string') {
        this.hdrs[nameOrHeaders.toLowerCase()] = value;
      } else if (value === null) {
        delete this.hdrs[nameOrHeaders.toLowerCase()];
      }
      return true;
    }
    return false;
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
  async cookies(): Promise<Cookie[]>;
  async cookies(cookies: Cookie[]): Promise<boolean>;
  async cookies(a?: any): Promise<any> {
    if (Array.isArray(a)) {
      this.jar = [...a];
      return true;
    } else if (a === null) {
      this.jar = [];
      return true;
    }
    return [...this.jar];
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