import type { BaseFetchMode, BrowserEngine, FetchContext, FetchResponse } from "./types"

export enum FetchActionStatus {
  /**
   * 动作执行失败但未抛出（通常因 failOnError=false）；错误信息在 error 字段
   */
  Failed = 0,
  /**
   * 动作按预期完成（即便产生 warnings）
   */
  Success,
  /**
   * 动作被判定为不执行/降级为 noop（比如引擎不支持且 degradeTo='noop'）
   * 能力不支持且 degradeTo='noop' 时：status='skipped'，warnings 增加 { code:'capability-not-supported' }
   */
  Skipped,
}

type FetchActionCapabilityMode = 'native' | 'simulate' | 'noop';

// 承载与诊断相关的信息（引擎、降级路径、时延、重试、HTTP 信息等）
interface FetchActionMeta {
  name: string
  index?: number
  mode: BaseFetchMode;
  engine?: BrowserEngine;
  capability?: FetchActionCapabilityMode;
  response?: FetchResponse;
  timings?: { start: number; total: number };
  retries?: number;         // 实际重试次数
}

export interface FetchActionResult<TResult = any> {
  status: FetchActionStatus;     // 默认 'success'（未抛错且未标记跳过）
  result?: TResult;
  error?: Error;
  meta?: FetchActionMeta;        // 便于审计与调试的元信息
}

export interface BaseFetchActionOptions {
  name: string
  params?: any
  storeAs?: string
  failOnError?: boolean
  failOnTimeout?: boolean
  timeoutMs?: number
  maxRetries?: number
  [key: string]: any
}

export interface BaseFetchCollectorOptions extends BaseFetchActionOptions {
  startOn?: string|RegExp
  stopOn?: string|RegExp
  block?: boolean // 是否等待结果完成
  bindTo?: string // self, session, action, action:name
}

export interface FetchActionOptions extends BaseFetchActionOptions {
  collectors?: BaseFetchCollectorOptions[]
}

export abstract class BaseFetchAction {
  abstract name: string
  abstract supports: BaseFetchMode[]

  // 生命周期钩子（可选）
  onStart?(context: FetchContext): Promise<void>|void
  onEnd?(context: FetchContext): Promise<void>|void

  // 核心执行逻辑（必需）
  abstract onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<FetchActionResult|void>|FetchActionResult|void

  async execute(context: FetchContext, params?: FetchActionOptions): Promise<FetchActionResult|void> {
    await this.onStart?.(context);
    try {
      const result = await this.onExecute(context, params);
      return result;
    } catch (error: any) {
      if (!params?.failOnError) {
        return {
          status: FetchActionStatus.Failed,
          error,
        };
      } else throw error;
    } finally {
      await this.onEnd?.(context);
    }
  }
}
