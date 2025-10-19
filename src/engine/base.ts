import { defaultsDeep } from "lodash-es";
import { FetchContext } from "../fetcher/context";
import { BaseFetcherProperties, FetchEngineType, Cookie, FetchResponse, ResourceType } from "../fetcher/types";
import { normalizeHeaders } from "../utils/headers";

export interface GotoOptions {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'OPTIONS' | 'CONNECT' | 'PATCH';
  payload?: any; // POST
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeoutMs?: number;
}

export interface WaitForOptions {
  ms?: number;
  selector?: string;
  networkIdle?: boolean;
}

const DefaultFetcherProperties: BaseFetcherProperties = {
  engine: 'http',
  enableSmart: true,
  useSiteRegistry: true,
  antibot: true,
  headers: {},
  cookies: [],
  reuseCookies: true,
  proxy: [],
  blockResources: [],
  ignoreSslErrors: true,
  browser: {
    engine: 'playwright',
    headless: false,
    waitUntil: 'domcontentloaded',
  },
  http: {
    method: 'GET',
  },
  timeoutMs: 60000,
  maxConcurrency: 1,
  maxRequestsPerMinute: 1000,
  delayBetweenRequestsMs: 0,
  retries: 0,
  sites: [],
}

/**
 * Engine 职责：对 Crawler 做统一抽象
 */
export abstract class FetchEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchEngine>()

  static register<T extends typeof FetchEngine>(engineClass: T): void {
    const id = engineClass.id;
    if (!id) throw new Error('Engine must define static id');
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`);
    this.registry.set(id, engineClass)
  }

  static get(id: string): typeof FetchEngine | undefined {
    return this.registry.get(id)
  }

  static getByMode(mode: FetchEngineType): typeof FetchEngine | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if (engineClass.mode === mode) return engineClass
    }
  }

  static async create(ctx: FetchContext, options?: BaseFetcherProperties) {
    options = defaultsDeep(options, DefaultFetcherProperties) as BaseFetcherProperties;
    const Engine = this.get(options.engine!) ?? this.getByMode(options.engine as FetchEngineType);
    if (Engine) {
      const result = new (Engine as any)() as FetchEngine;
      await result.initialize(ctx, options);
      return result;
    }
  }

  static readonly id: string;
  static readonly mode: FetchEngineType

  declare protected ctx?: FetchContext
  declare protected opts?: BaseFetcherProperties

  protected hdrs: Record<string, string> = {};
  protected jar: Cookie[] = [];

  protected _initialize?(ctx: FetchContext, options?: BaseFetcherProperties): Promise<void>
  protected _cleanup?(): Promise<void>

  get context() {
    return this.ctx;
  }

  async initialize(context: FetchContext, options?: BaseFetcherProperties): Promise<void> {
    if (!this.ctx) {
      this.ctx = context;
      this.opts = options;
      this.hdrs = normalizeHeaders(options?.headers);

      this.jar = [...(options?.cookies ?? [])];
      if (!context.internal) {context.internal = {}}
      context.internal.engine = this
      await this._initialize?.(context, options);
    }
  }

  async cleanup(): Promise<void> {
    await this._cleanup?.();
    const context = this.ctx;
    if (context) {
      if (context.internal?.engine === this) {
        context.internal.engine = undefined;
      }
      this.ctx = undefined;
    }
  }

  // 通用方法
  abstract goto(url: string, opts?: GotoOptions): Promise<void|FetchResponse>;
  abstract getContent(): Promise<FetchResponse>;
  // 条件等待（browser 原生；http 可 simulate(ms) 或直接 skipped）
  abstract waitFor(options?: WaitForOptions): Promise<void>;
  // 交互（browser 原生；http 最小模拟 or skipped）
  abstract click(selector: string): Promise<void>; // http: 仅当能解析为 a[href] 才模拟
  abstract fill(selector: string, value: string): Promise<void>; // http: fill form 模拟
  abstract submit(selector?: string): Promise<void>; // http: post form 模拟
  // 资源拦截（统一实现，不依赖引擎差异）
  abstract blockResources(types: ResourceType[]): Promise<boolean>;

  // headers 重载
  async headers(): Promise<Record<string, string>>;
  async headers(name: string): Promise<string>;
  async headers(headers: Record<string, string>, replaced?: boolean): Promise<boolean>;
  async headers(name: string, value: string|null): Promise<boolean>;
  async headers(
    nameOrHeaders?: string | Record<string, string>,
    value?: string|boolean|null
  ): Promise<Record<string, string> | string | boolean> {
    if (nameOrHeaders === undefined) {
      return { ...this.hdrs };
    }

    if (typeof nameOrHeaders === 'string' && value === undefined) {
      return this.hdrs[nameOrHeaders.toLowerCase()] || '';
    }

    if (nameOrHeaders !== null && typeof nameOrHeaders === 'object') {
      const normalized: Record<string,string> = {};
      for (const [k, v] of Object.entries(nameOrHeaders)) {normalized[k.toLowerCase()] = String(v);}
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
  async dispose(): Promise<void> {return this._cleanup?.()} // for cleanup

  // 能力协商（动作层可打标：native/simulate/noop）
  // abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
