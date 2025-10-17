import { EventEmitter } from 'events-ex'
import { FetchEngine } from "../engine/base";
import { FetchActionOptions, FetchActionProperties, FetchActionResult } from "./base-fetch-action";
import { FetchReturnType } from "./fetch-return";
import { BaseFetcherProperties, FetchResponse } from "./types";

interface FetchActionInContext extends FetchActionProperties {
  index?: number;
  startedAt: number;
  finishedAt?: number;
  error?: Error;
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
    [key: string]: any
  }

  eventBus: EventEmitter;
}
