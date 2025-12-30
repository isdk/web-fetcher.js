import { defaultsDeep, merge } from 'lodash-es';
import { EventEmitter } from 'events-ex';
import { CommonError } from '@isdk/common-error';
import {
  Configuration,
  RequestQueue,
} from 'crawlee';
import type { BasicCrawler, BasicCrawlerOptions, CrawlingContext } from 'crawlee';

import { FetchEngineContext } from '../core/context';
import { ExtractSchema, ExtractArraySchema, ExtractObjectSchema, ExtractValueSchema } from '../core/extract';
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
  failOnTimeout?: boolean;
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
  | { type: 'extract'; schema: ExtractSchema }
  | { type: 'pause'; message?: string }
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

type AnyFetchEngine = FetchEngine<any, any, any>;
type AnyFetchEngineCtor = new (...args: any[]) => AnyFetchEngine;

export abstract class FetchEngine<
  TContext extends CrawlingContext = any,
  TCrawler extends BasicCrawler<TContext> = any,
  TOptions extends BasicCrawlerOptions<TContext>  = any
> {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, AnyFetchEngineCtor>();

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
    const id = (engineClass as any).id;
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
  static get(id: string): AnyFetchEngineCtor | undefined {
    return this.registry.get(id);
  }

  /**
   * Retrieves a fetch engine implementation by execution mode.
   *
   * @param mode - Execution mode (`'http'` or `'browser'`)
   * @returns Engine class if found, otherwise `undefined`
   */
  static getByMode(mode: FetchEngineType): AnyFetchEngineCtor | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if ((engineClass as any).mode === mode) return engineClass;
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
    const finalOptions = defaultsDeep(options, ctx, DefaultFetcherProperties) as BaseFetcherProperties;
    const engineName = (finalOptions.engine ?? ctx.engine) as FetchEngineType;
    const Engine = engineName ? (this.get(engineName!) ?? this.getByMode(engineName)) : null;
    if (Engine) {
      const result = new Engine();
      await result.initialize(ctx, finalOptions);
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
  declare protected crawler?: TCrawler;
  declare protected isCrawlerReady?: boolean;
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

  protected abstract _querySelectorAll(context: any, selector: string): Promise<any[]>;
  protected abstract _extractValue(schema: ExtractValueSchema, context: any): Promise<any>;

  protected async _extract(schema: ExtractSchema, context: any): Promise<any> {
    const schemaType = (schema as any).type;

    if (!context) {
      return schemaType === 'array' ? [] : null;
    }

    if (schemaType === 'object') {
      const { selector, properties } = schema as ExtractObjectSchema;
      let newContext = context;
      if (selector) {
        const elements = await this._querySelectorAll(context, selector);
        newContext = elements.length > 0 ? elements[0] : null;
      }
      if (!newContext) return null;

      const result: Record<string, any> = {};
      for (const key in properties) {
        result[key] = await this._extract(properties[key], newContext);
      }
      return result;
    }

    if (schemaType === 'array') {
      const { selector, items } = schema as ExtractArraySchema;
      const elements = selector ? await this._querySelectorAll(context, selector) : [context];
      const results: any[] = [];
      for (const element of elements) {
        results.push(await this._extract(items!, element));
      }
      return results;
    }

    const { selector } = schema as ExtractValueSchema;
    let elementToExtract = context;
    if (selector) {
      const elements = await this._querySelectorAll(context, selector);
      elementToExtract = elements.length > 0 ? elements[0] : null;
    }

    if (!elementToExtract) return null;

    return this._extractValue(schema as ExtractValueSchema, elementToExtract);
  }

  /**
   * Creates the crawler instance for the specific engine implementation.
   * @param options - The final crawler options.
   * @internal
   */
  protected abstract _createCrawler(options: TOptions): TCrawler;

  /**
   * Gets the crawler-specific options from the subclass.
   * @param ctx - The fetch engine context.
   * @internal
   */
  protected abstract _getSpecificCrawlerOptions(ctx: FetchEngineContext): Promise<Partial<TOptions>> | Partial<TOptions>;
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
  protected abstract _buildResponse(context: TContext): Promise<FetchResponse>;
  protected async buildResponse(context: TContext): Promise<FetchResponse> {
    const result = await this._buildResponse(context);
    const contentTypeHeader = result.headers['content-type'] || '';
    result.contentType = contentTypeHeader.split(';')[0].trim();
    return result;
  };

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
  protected abstract executeAction(context: TContext, action: FetchEngineAction): Promise<any>;

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
  waitFor(params?: WaitForActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'waitFor', options: params });
  }

  /**
   * Clicks on element matching selector.
   *
   * @param selector - CSS selector of element to click
   * @returns Promise resolving when click is processed
   * @throws {Error} When no active page context exists
   */
  click(selector: string): Promise<void> {
    return this.dispatchAction({ type: 'click', selector });
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
    return this.dispatchAction({ type: 'fill', selector, value });
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
    return this.dispatchAction({ type: 'submit', selector, options });
  }

  /**
   * Pauses execution, allowing for manual intervention or inspection.
   *
   * @param message - Optional message to display during pause
   * @returns Promise resolving when execution is resumed
   * @throws {Error} When no active page context exists
   */
  pause(message?: string): Promise<void> {
    return this.dispatchAction({ type: 'pause', message });
  }

  /**
   * Extracts structured data from the current page content.
   *
   * @param schema - An object defining the data to extract.
   * @returns A promise that resolves to an object with the extracted data.
   */
  extract<T>(schema: ExtractSchema): Promise<T> {
    const normalizedSchema = this._normalizeSchema(schema);
    return this.dispatchAction({ type: 'extract', schema: normalizedSchema });
  }

  protected _normalizeSchema(schema: ExtractSchema): ExtractSchema {
    const newSchema = JSON.parse(JSON.stringify(schema)) as any;

    if (newSchema.properties) {
      for (const key in newSchema.properties) {
        newSchema.properties[key] = this._normalizeSchema(newSchema.properties[key]);
      }
    }
    if (newSchema.items) {
      newSchema.items = this._normalizeSchema(newSchema.items);
    }

    if (newSchema.type === 'array') {
      if (newSchema.attribute && !newSchema.items) {
        newSchema.items = { attribute: newSchema.attribute };
        delete newSchema.attribute;
      }
      if (!newSchema.items) {
        newSchema.items = { type: 'string' };
      }
    }

    if (newSchema.selector && (newSchema.has || newSchema.exclude)) {
      const { selector, has, exclude } = newSchema;
      const finalSelector = selector
        .split(',')
        .map((s: string) => {
          let part = s.trim();
          if (has) part = `${part}:has(${has})`;
          if (exclude) part = `${part}:not(${exclude})`;
          return part;
        })
        .join(', ');
      newSchema.selector = finalSelector;
      delete newSchema.has;
      delete newSchema.exclude;
    }

    return newSchema;
  }

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
    if (this.ctx) {
      return;
    }
    // Deep merge the final resolved options back into the context,
    // so the context object always holds the most up-to-date data.
    merge(context, options);

    this.ctx = context;
    this.opts = context; // Use the merged context
    this.hdrs = normalizeHeaders(context.headers);
    this.jar = [...(context.cookies ?? [])];
    if (!context.internal) {
      context.internal = {};
    }
    context.internal.engine = this;
    context.engine = this.mode;
    this.actionEmitter.setMaxListeners(100); // Set a higher limit to prevent memory leak warnings
    this.requestQueue = await RequestQueue.open();

    const specificCrawlerOptions = await this._getSpecificCrawlerOptions(context);

    const finalCrawlerOptions = {
      ...defaultsDeep(specificCrawlerOptions, {
        requestQueue: this.requestQueue,
        maxConcurrency: 1,
        minConcurrency: 1,
        useSessionPool: true,
        persistCookiesPerSession: true,
        sessionPoolOptions: {
          maxPoolSize: 1,
          persistenceOptions: { enable: false },
          sessionOptions: { maxUsageCount: 1000, maxErrorScore: 3 },
        },
      }),
      // Force these handlers, they are critical for the engine's operation
      requestHandler: this._requestHandler.bind(this),
      errorHandler: this._failedRequestHandler.bind(this),
      failedRequestHandler: this._failedRequestHandler.bind(this),
    };

    this.crawler = this._createCrawler(finalCrawlerOptions as TOptions);

    this.crawler.run().then(()=>{this.isCrawlerReady = true}).catch((error) => {
      this.isCrawlerReady = false;
      console.error('Crawler background error:', error);
    });
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
  protected async _executePendingActions(context: TContext) {
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

  protected async _sharedRequestHandler(context: TContext): Promise<void> {
    try {
      const { request } = context;
      this.isPageActive = true;

      const gotoPromise = this.pendingRequests.get(request.userData.requestId);
      if (gotoPromise) {
        const fetchResponse = await this._buildResponse(context);

        // If throwHttpErrors is enabled, check for failure conditions and reject if necessary.
        const isError = !fetchResponse.statusCode || fetchResponse.statusCode >= 400;
        if (this.ctx?.throwHttpErrors && isError) {
          const error = new CommonError(`Request for ${fetchResponse.finalUrl} failed with status ${fetchResponse.statusCode || 'N/A'}`, 'request', fetchResponse.statusCode);
          gotoPromise.reject(error);
        } else {
          this.lastResponse = fetchResponse;
          gotoPromise.resolve(fetchResponse);
        }
        this.pendingRequests.delete(request.userData.requestId);
      }

      await this._executePendingActions(context);
    } finally {
      this.isPageActive = false;
      this.navigationLock.release();
    }
  }

  protected async _sharedFailedRequestHandler(context: TContext, error?: Error): Promise<void> {
    const { request } = context;
    const gotoPromise = this.pendingRequests.get(request.userData.requestId);
    if (gotoPromise && error && this.ctx?.throwHttpErrors) {
      this.pendingRequests.delete(request.userData.requestId);
      const response = (error as any).response;
      const statusCode = response?.statusCode || 500;
      const url = response?.url ? response.url : request.url;
      const finalError = new CommonError(`Request${url ? ' for '+url: ''} failed: ${error.message}`, 'request', statusCode);
      gotoPromise.reject(finalError);
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

  private async _requestHandler(context: TContext): Promise<void> {
    await this._sharedRequestHandler(context);
  }

  private async _failedRequestHandler(context: TContext, error: Error): Promise<void> {
    await this._sharedFailedRequestHandler(context, error);
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
      try {await this.crawler.teardown?.();} catch (error) {
        console.error('ccrawler teardown error:', error)
      }
      this.crawler = undefined;
    }
    this.isCrawlerReady = undefined;

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