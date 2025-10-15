import { BaseFetchEngine } from "../engines/BaseEngine";
import { FetchActionOptions, FetchActionProperties, FetchActionResult } from "./base-fetch-action";
import { FetchReturnType } from "./fetch-return";
import { BaseFetcherProperties, BaseFetchMode, FetchResponse } from "./types";

interface FetchActionInContext extends FetchActionProperties {
  index?: number;
  startedAt: number;
  finishedAt?: number;
  error?: Error;
}

export interface FetchContext extends BaseFetcherProperties {
  readonly id: string;
  url?: string;
  finalUrl?: string;

  lastResponse?: FetchResponse;
  lastResult?: FetchActionResult;

  currentAction?: FetchActionInContext;

  outputs: Map<string, any>;

 // ===== 统一的动作执行接口 =====
  execute<R extends FetchReturnType = 'any'>(actionOptions: FetchActionOptions): Promise<FetchActionResult<R>>
  // 便捷方法：快速调用动作
  action<R extends FetchReturnType = 'any'>(name: string, params?: any, options?: Partial<FetchActionOptions>): Promise<FetchActionResult<R>>

  // ===== 内部状态（引擎专用）=====
  internal: {
    // 引擎实例
    engine?: BaseFetchEngine
    [key: string]: any
  }

  eventBus: EventBus;
}

// 上下文工厂函数
export function createContext(
  url: string,
  mode: BaseFetchMode,
  options: BaseFetcherProperties,
  engine: BaseEngine
): FetchContext {
  const events = new EventEmitter()

  const context: FetchContext = {
    // 标识
    id: randomUUID(),
    url,
    finalUrl: url,
    mode,

    // 继承选项
    ...options,

    // Cookies
    cookies: [...(options.cookies || [])],

    // 输出
    outputs: new Map(),

    // 内部状态
    internal: {
      engine,
    },

    // 事件
    events,

    // ===== 统一的动作执行接口 =====
    async execute<R extends FetchReturnType = 'any'>(actionOptions: FetchActionOptions): Promise<FetchActionResult<R>> {
      // 这个方法由 FetchSession 注入实现
      throw new Error('Context.execute not implemented. This should be injected by FetchSession.')
    },

    // 便捷方法
    async action<R extends FetchReturnType = 'any'>(name: string, params?: any, options?: Partial<FetchActionOptions>): Promise<FetchActionResult<R>> {
      return this.execute({
        name,
        params,
        ...options,
      } as FetchActionOptions)
    },
  }

  return context
}
