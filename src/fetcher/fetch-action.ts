import type { RequireAtLeastOne } from 'type-fest';
import { FetchContext } from "./context";
import { FetchReturnType, FetchReturnTypeFor } from "./fetch-return";
import type { FetchEngineType, FetchResponse } from "./types"

export enum FetchActionResultStatus {
  /**
   * 动作执行失败但未抛出（通常因 failOnError=false）；错误信息在 error 字段
   */
  Failed,
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

export type FetchActionCapabilityMode = 'native' | 'simulate' | 'noop';

// 承载与诊断相关的信息（引擎、降级路径、时延、重试、HTTP 信息等）
interface FetchActionMeta {
  id: string
  index?: number
  engineType?: FetchEngineType;
  capability?: FetchActionCapabilityMode;
  response?: FetchResponse;
  timings?: { start: number; total: number };
  retries?: number; // 实际重试次数
}

export interface FetchActionResult<R extends FetchReturnType = FetchReturnType> {
  status: FetchActionResultStatus; // 默认 'success'（未抛错且未标记跳过）
  returnType?: R;
  result?: FetchReturnTypeFor<R>;
  error?: Error;
  meta?: FetchActionMeta; // 便于审计与调试的元信息
}

export interface BaseFetchActionProperties {
  id?: string
  name?: string // action id 的别名
  params?: any
  // 如果设置则将结果存储到上下文的outputs[storeAs]
  storeAs?: string
  // defaults to true if in main action
  // defaults to false if in collector action
  failOnError?: boolean
  // defaults to false
  failOnTimeout?: boolean
  timeoutMs?: number
  maxRetries?: number
  [key: string]: any
}
export type BaseFetchActionOptions = RequireAtLeastOne<BaseFetchActionProperties, 'id' | 'name'>

export interface BaseFetchCollectorActionProperties extends BaseFetchActionProperties {
  // 启动事件，支持正则表达式，任意事件发生就启动`onStart`
  startOn?: string|RegExp|Array<string|RegExp>
  // 结束事件，任意事件发生就结束`onEnd`
  stopOn?: string|RegExp|Array<string|RegExp>
  block?: boolean // 是否等待结果完成
  // 当指定事件发生时，执行收集`onExecute`
  bindTo?: string // self, session, action, action:name
}

export type BaseFetchCollectorOptions = RequireAtLeastOne<BaseFetchCollectorActionProperties, 'id' | 'name'>

export interface FetchActionProperties extends BaseFetchActionProperties {
  collectors?: BaseFetchCollectorOptions[]
}

export type FetchActionOptions = RequireAtLeastOne<FetchActionProperties, 'id' | 'name'>

export type FetchActionCapabilities = {
  [mode in FetchEngineType]?: FetchActionCapabilityMode
}

export abstract class FetchAction {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchAction>()

  static register(actionClass: typeof FetchAction): void {
    const id = (actionClass as any).id;
    if (!id) throw new Error('Action must define static id');
    if (this.registry.has(id)) throw new Error(`Action id duplicated: ${id}`);
    this.registry.set(id, actionClass)
  }

  static get(id: string): typeof FetchAction | undefined {
    return this.registry.get(id)
  }

  static create(id: FetchActionOptions): FetchAction | undefined
  static create(id: string): FetchAction | undefined
  static create(idOrOptions: string|FetchActionOptions): FetchAction | undefined {
    const id = typeof idOrOptions === 'string' ? idOrOptions : idOrOptions.id || idOrOptions.name;
    if (!id) throw new Error('Action must have id or name');
    const ActionClass = this.registry.get(id) as any
    return ActionClass ? new ActionClass() : undefined
  }

  static has(name: string): boolean {
    return this.registry.has(name)
  }

  static list(): string[] {
    return Array.from(this.registry.keys())
  }
  // ===== 注册管理 END =====

  static returnType: FetchReturnType;
  static id: string
  static capabilities: FetchActionCapabilities

  static getCapability(mode?: FetchEngineType): FetchActionCapabilityMode {
    return this.capabilities[mode!] ?? 'noop'
  }

  getCapability(mode?: FetchEngineType): FetchActionCapabilityMode {
    const ctor = this.constructor as typeof FetchAction
    return ctor.getCapability(mode)
  }

  get id(): string {
    return (this.constructor as any).id
  }

  get returnType(): FetchReturnType {
    return (this.constructor as any).returnType ?? 'any'
  }

  // 生命周期钩子（可选）
  onStart?(context: FetchContext, options?: FetchActionOptions): Promise<void>|void
  onEnd?(context: FetchContext, options?: FetchActionOptions): Promise<void>|void

  // 核心执行逻辑（必需）
  abstract onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<any>|any

  // the main action entry point
  async execute(context: FetchContext, options?: FetchActionOptions): Promise<FetchActionResult> {
    await this.onStart?.(context, options);
    try {
      let result = await this.onExecute(context, options);
      if (!result?.returnType) {
        result = {
          status: FetchActionResultStatus.Success,
          returnType: this.returnType,
          result,
        };
      }
      return result;
    } catch (error: any) {
      if (!options?.failOnError) {
        return {
          status: FetchActionResultStatus.Failed,
          error,
          meta: {
            id: this.id,
            engineType: context.engine as any,
            capability: this.getCapability(context.engine as any),
          },
        };
      } else throw error;
    } finally {
      await this.onEnd?.(context);
    }
  }
}
