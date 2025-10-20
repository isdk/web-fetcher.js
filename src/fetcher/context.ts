import { EventEmitter } from 'events-ex'
import { FetchEngine } from "../engine/base";
import { FetchActionOptions, FetchActionProperties, FetchActionResult } from "../action/fetch-action";
import { FetchReturnType } from "./fetch-return";
import { BaseFetcherProperties, FetchResponse } from "./types";

export interface FetchActionInContext extends FetchActionProperties {
  index?: number;
  error?: Error;
  depth?: number; // 嵌套深度，顶层为 0
  // parent?: string;  // 父action路径，如 "customAction/goto" no used just for debug
}

export interface FetchContext extends BaseFetcherProperties {
  id: string;
  url?: string;
  finalUrl?: string;

  lastResponse?: FetchResponse;
  lastResult?: FetchActionResult;

  currentAction?: FetchActionInContext;

  outputs: Record<string, any>;

 // ===== 统一的动作执行接口 =====
  execute<R extends FetchReturnType = 'any'>(actionOptions: FetchActionOptions): Promise<FetchActionResult<R>>
  // 便捷方法：快速调用动作
  action<R extends FetchReturnType = 'any'>(name: string, params?: any, options?: Partial<FetchActionOptions>): Promise<FetchActionResult<R>>

  // ===== 内部状态（引擎专用）=====
  internal: {
    // 引擎实例
    engine?: FetchEngine
    actionStack?: FetchActionInContext[]; // 动作调用栈
    actionIndex?: number;
    [key: string]: any
  }

  eventBus: EventEmitter;
}
