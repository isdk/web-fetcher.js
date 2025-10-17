import { FetchContext } from "../fetcher/context";
import { BaseFetcherProperties, FetchEngineType, Cookie, FetchResponse, ResourceType } from "../fetcher/types";

/**
 * Engine 的唯一职责：对 Crawler 做统一抽象
 */
export abstract class FetchEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchEngine>()

  static register(engineClass: typeof FetchEngine): void {
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

  static readonly id: string;
  static readonly mode: FetchEngineType

  declare ctx?: FetchContext
  declare opts?: BaseFetcherProperties

  hdrs: Record<string, string> = {};
  jar: Cookie[] = [];

  _initialize?(ctx?: FetchContext, options?: BaseFetcherProperties): Promise<void>
  _cleanup?(): Promise<void>

  async initialize(context: FetchContext, options?: BaseFetcherProperties): Promise<void> {
    this.ctx = context;
    this.opts = options;
    this.hdrs = { ...(options?.headers ?? {}) };
    this.jar = [...(options?.cookies ?? [])];
    if (!context.internal) {context.internal = {}}
    context.internal.engine = this
    await this._initialize?.(context, options);
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
  abstract goto(url: string, opts?: { waitUntil?: 'load'|'domcontentloaded'|'networkidle'|'commit'; timeoutMs?: number}): Promise<void|FetchResponse>;
  abstract getContent(): Promise<FetchResponse>;
  // 条件等待（browser 原生；http 可 simulate(ms) 或直接 skipped）
  abstract waitFor(options?: { ms?: number; selector?: string; networkIdle?: boolean }): Promise<void>;
  // 交互（browser 原生；http 最小模拟 or skipped）
  abstract click(selectorOrHref: string): Promise<void>; // http: 仅当能解析为 a[href] 才模拟
  abstract fill(selector: string, value: string): Promise<void>; // http: fill form 模拟
  abstract submit(selector?: string): Promise<void>; // http: post form 模拟
  // 资源拦截（统一实现，不依赖引擎差异）
  abstract blockResources(types: ResourceType[]): Promise<boolean>;

  // headers 重载
  async headers(): Promise<Record<string, string>>;
  async headers(name: string): Promise<string>;
  async headers(headers: Record<string, string>): Promise<boolean>;
  async headers(name: string, value: string): Promise<boolean>;
  async headers(a?: any, b?: any): Promise<any> {
    if (a == null && b == null) {
      return { ...this.hdrs };
    }
    if (typeof a === 'string' && b == null) {
      const key = a.toLowerCase();
      return this.hdrs[key] ?? '';
    }
    if (a && typeof a === 'object' && b == null) {
      const normalized: Record<string,string> = {};
      for (const [k, v] of Object.entries(a)) normalized[k.toLowerCase()] = String(v);
      this.hdrs = normalized;
      return true;
    }
    if (typeof a === 'string' && typeof b === 'string') {
      this.hdrs[a.toLowerCase()] = b;
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
    }
    return [...this.jar];
  }
  async dispose(): Promise<void> {} // for cleanup

  // 能力协商（动作层可打标：native/simulate/noop）
  // abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
