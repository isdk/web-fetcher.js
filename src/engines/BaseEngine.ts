import { FetchActionCapabilityMode } from "../fetcher/base-fetch-action";
import { FetchContext } from "../fetcher/context";
import { BaseFetcherProperties, BaseFetchMode, Cookie, FetchResponse } from "../fetcher/types";

/**
 * Engine 的唯一职责：对 Crawler 做统一抽象
 */
export abstract class BaseFetchEngine {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof BaseFetchEngine>()

  static register(engineClass: typeof BaseFetchEngine): void {
    const id = (engineClass as any).id;
    if (!id) throw new Error('Engine must define static id');
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`);
    this.registry.set(id, engineClass)
  }

  static get(id: string): typeof BaseFetchEngine | undefined {
    return this.registry.get(id)
  }

  static getByMode(mode: BaseFetchMode): typeof BaseFetchEngine | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if (engineClass.mode === mode) return engineClass
    }
  }

  static readonly mode: BaseFetchMode

  /**
   * 初始化 Crawler 并将其挂载到 context
   */
  abstract initialize(context: FetchContext, options: BaseFetcherProperties): Promise<void>

  /**
   * 清理资源
   */
  abstract cleanup(context: FetchContext): Promise<void>

  // 通用方法
  abstract goto(url: string, opts?: { waitUntil?: 'load'|'domcontentloaded'|'networkidle'|'commit'; timeoutMs?: number}): Promise<void|FetchResponse>;
  abstract getContent(): Promise<FetchResponse>;
  // 条件等待（browser 原生；http 可 simulate(ms) 或直接 skipped）
  abstract waitFor(options?: { ms?: number; selector?: string; networkIdle?: boolean }): Promise<void>;
  // 交互（browser 原生；http 最小模拟 or skipped）
  abstract click(selectorOrHref: string): Promise<void>; // http: 仅当能解析为 a[href] 才模拟
  abstract fill(selector: string, value: string): Promise<void>; // http: fill form 模拟
  abstract submit(selector?: string): Promise<void>; // http: post form 模拟

  // 获取 headers
  abstract headers(): Promise<Record<string, string>>;
  abstract headers(name: string): Promise<string>;
  // 设置 headers
  abstract headers(headers: Record<string, string>): Promise<boolean>;
  abstract headers(name: string, value: string): Promise<boolean>;
  // 获取 cookie
  abstract cookies(): Promise<Cookie[]>;
  // 设置 cookie
  abstract cookies(cookies: Cookie[]): Promise<boolean>;
  // 资源拦截（统一实现，不依赖引擎差异）
  abstract blockResources(types: Array<'images'|'stylesheets'|'fonts'|'scripts'|'media'|string>): Promise<boolean>;

  // 能力协商（动作层可打标：native/simulate/noop）
  abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
