import { defaultsDeep } from 'lodash-es';
import { EventEmitter } from 'events-ex';
import type {
  RequestQueue,
  CheerioCrawler,
  PlaywrightCrawler,
  CrawlingContext,
} from 'crawlee';
import { FetchEngineContext } from '../core/context';
import { BaseFetcherProperties, FetchEngineType, Cookie, FetchResponse, ResourceType, DefaultFetcherProperties } from '../core/types';
import { normalizeHeaders } from '../utils/headers';

export interface GotoActionOptions {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'OPTIONS' | 'CONNECT' | 'PATCH';
  payload?: any; // POST
  headers?: Record<string, string>;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeoutMs?: number;
}

export interface WaitForActionOptions {
  ms?: number;
  selector?: string;
  networkIdle?: boolean;
}

export interface SubmitActionOptions {
  enctype?: 'application/x-www-form-urlencoded' | 'application/json' | 'multipart/form-data';
}

export type FetchEngineAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'waitFor'; options?: WaitForActionOptions }
  | { type: 'submit'; selector?: any; options?: SubmitActionOptions }
  | { type: 'getContent' }
  | { type: 'navigate'; url: string; opts?: GotoActionOptions }
  | { type: 'dispose' };

export interface DispatchedAction {
  action: FetchEngineAction;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

/**
 * Engine 职责：对 Crawler 做统一抽象
 */
export abstract class FetchEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchEngine>();

  static register<T extends typeof FetchEngine>(engineClass: T): void {
    const id = engineClass.id;
    if (!id) throw new Error('Engine must define static id');
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`);
    this.registry.set(id, engineClass);
  }

  static get(id: string): typeof FetchEngine | undefined {
    return this.registry.get(id);
  }

  static getByMode(mode: FetchEngineType): typeof FetchEngine | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if (engineClass.mode === mode) return engineClass;
    }
  }

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

  static readonly id: string;
  static readonly mode: FetchEngineType;

  declare protected ctx?: FetchEngineContext;
  declare protected opts?: BaseFetcherProperties;
  declare protected crawler?: CheerioCrawler | PlaywrightCrawler;
  declare protected requestQueue?: RequestQueue;

  protected hdrs: Record<string, string> = {};
  protected jar: Cookie[] = [];
  protected pendingRequests = new Map<string, PendingRequest>();
  protected requestCounter = 0;
  protected actionEmitter = new EventEmitter();
  protected isPageActive = false;
  protected lastResponse?: FetchResponse;
  protected blockedTypes = new Set<string>();

  protected _cleanup?(): Promise<void>;
  protected abstract _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void>;
  protected abstract buildResponse(context: CrawlingContext): Promise<FetchResponse>;
  protected abstract executeAction(context: CrawlingContext, action: FetchEngineAction): Promise<any>;

  get id() {
    return (this.constructor as typeof FetchEngine).id;
  }

  get mode() {
    return (this.constructor as typeof FetchEngine).mode;
  }

  get context() {
    return this.ctx;
  }

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
      const listener = async ({ action, resolve, reject }: DispatchedAction) => {
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

    this.isPageActive = false;
  }

  protected async _sharedFailedRequestHandler(context: CrawlingContext): Promise<void> {
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

  // 通用方法
  abstract goto(url: string, opts?: GotoActionOptions): Promise<void | FetchResponse>;
  // 条件等待（browser 原生；http 可 simulate(ms) 或直接 skipped）
  abstract waitFor(options?: WaitForActionOptions): Promise<void>;
  // 交互（browser 原生；http 最小模拟 or skipped）
  abstract click(selector: string): Promise<void>; // http: 仅当能解析为 a[href] 才模拟
  abstract fill(selector: string, value: string): Promise<void>; // http: fill form 模拟
  abstract submit(selector?: any, options?: SubmitActionOptions): Promise<void>; // http: post form 模拟

  // 资源拦截（统一实现，不依赖引擎差异）
  async blockResources(types: ResourceType[], overwrite?: boolean) {
    if (overwrite) {
      this.blockedTypes.clear();
    }
    types.forEach((t) => this.blockedTypes.add(t));
    return types.length;
  }

  getContent(): Promise<FetchResponse> {
    if (!this.lastResponse) {
      return Promise.reject(new Error('No content fetched yet. Call goto() first.'));
    }
    return Promise.resolve(this.lastResponse);
  }

  // headers 重载
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

  // cookies 重载
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

  async dispose(): Promise<void> {
    await this.cleanup()
  }

  // 能力协商（动作层可打标：native/simulate/noop）
  // abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
