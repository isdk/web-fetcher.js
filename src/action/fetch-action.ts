import type { RequireAtLeastOne } from 'type-fest'
import { FetchActionInContext, FetchContext } from '../core/context'
import { FetchReturnType, FetchReturnTypeFor } from '../core/fetch-return-type'
import type { FetchEngineType, FetchResponse } from '../core/types'
import type { FetchEngine } from '../engine/'

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

export type FetchActionCapabilityMode = 'native' | 'simulate' | 'noop'

// 承载与诊断相关的信息（引擎、降级路径、时延、重试、HTTP 信息等）
interface FetchActionMeta {
  id: string
  index?: number
  engineType?: FetchEngineType
  capability?: FetchActionCapabilityMode
  response?: FetchResponse
  timings?: { start: number; total: number }
  retries?: number // 实际重试次数
}

export interface FetchActionResult<
  R extends FetchReturnType = FetchReturnType,
> {
  status: FetchActionResultStatus // 默认 'success'（未抛错且未标记跳过）
  returnType?: R
  result?: FetchReturnTypeFor<R>
  error?: Error
  meta?: FetchActionMeta // 便于审计与调试的元信息
}

export interface BaseFetchActionProperties {
  id?: string
  name?: string // action id 的别名
  action?: string | FetchAction // action id 的别名
  index?: number
  params?: any
  args?: any // params 的别名
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
export type BaseFetchActionOptions = RequireAtLeastOne<
  BaseFetchActionProperties,
  'id' | 'name' | 'action'
>

export interface BaseFetchCollectorActionProperties
  extends BaseFetchActionProperties {
  // 启动事件，支持正则表达式，任意事件发生就启动`onStart`
  activateOn?: string | RegExp | Array<string | RegExp>
  // 结束事件，任意事件发生就结束`onEnd`
  deactivateOn?: string | RegExp | Array<string | RegExp>
  // 当指定事件发生时，执行收集`onExecute`
  collectOn?: string | RegExp | Array<string | RegExp> // self, session, action, action:name
  // 是否在后台运行（不等待 onExec 完成），defaults to true
  background?: boolean
}

export type BaseFetchCollectorOptions = RequireAtLeastOne<
  BaseFetchCollectorActionProperties,
  'id' | 'name' | 'action'
>

export interface FetchActionProperties extends BaseFetchActionProperties {
  collectors?: BaseFetchCollectorOptions[]
}

export type FetchActionOptions = RequireAtLeastOne<
  FetchActionProperties,
  'id' | 'name' | 'action'
>

export type FetchActionCapabilities = {
  [mode in FetchEngineType]?: FetchActionCapabilityMode
}

export abstract class FetchAction {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, typeof FetchAction>()

  static register(actionClass: typeof FetchAction): void {
    const id = (actionClass as any).id
    if (!id) throw new Error('FetchAction.register: actionClass.id is required')
    this.registry.set(id, actionClass)
  }

  static get(id: string): typeof FetchAction | undefined {
    return this.registry.get(id)
  }

  static create(id: FetchActionOptions): FetchAction | undefined
  static create(id: string): FetchAction | undefined
  static create(
    idOrOptions: string | FetchActionOptions
  ): FetchAction | undefined {
    const id =
      typeof idOrOptions === 'string'
        ? idOrOptions
        : idOrOptions.id || idOrOptions.name || idOrOptions.action
    if (!id) throw new Error('Action must have id, name or action')
    const ActionClass =
      id instanceof FetchAction
        ? id.constructor
        : (this.registry.get(id) as any)
    return ActionClass ? new ActionClass() : undefined
  }

  static has(name: string): boolean {
    return this.registry.has(name)
  }

  static list(): string[] {
    return Array.from(this.registry.keys())
  }
  // ===== 注册管理 END =====

  static id: string
  static returnType: FetchReturnType = 'any'
  static capabilities: FetchActionCapabilities = {
    http: 'noop',
    browser: 'noop',
  }

  static getCapability(mode?: FetchEngineType): FetchActionCapabilityMode {
    return this.capabilities[mode!] ?? 'noop'
  }

  getCapability(mode?: FetchEngineType): FetchActionCapabilityMode {
    const ctor = this.constructor as typeof FetchAction
    return ctor.getCapability(mode)
  }

  get id(): string {
    return (this.constructor as typeof FetchAction).id
  }

  get returnType(): FetchReturnType {
    return (this.constructor as typeof FetchAction).returnType
  }

  get capabilities(): FetchActionCapabilities {
    return (this.constructor as typeof FetchAction).capabilities
  }

  // 生命周期钩子（可选）
  protected onBeforeExec?(
    context: FetchContext,
    options?: FetchActionProperties
  ): Promise<void> | void
  protected onAfterExec?(
    context: FetchContext,
    options?: FetchActionProperties
  ): Promise<void> | void

  // 核心执行逻辑（必需）
  abstract onExecute(
    context: FetchContext,
    options?: FetchActionProperties,
    eventPayload?: any
  ): Promise<any> | any

  protected async delegateToEngine(
    context: FetchContext,
    method: keyof FetchEngine,
    ...args: any[]
  ): Promise<any> {
    const engine = context.internal.engine
    if (!engine) {
      throw new Error('No engine available')
    }

    if (typeof engine[method] !== 'function') {
      throw new Error(`Engine does not have a method named '${String(method)}'`)
    }

    return await (engine[method] as any)(...args)
  }

  protected installCollectors(
    context: FetchContext,
    options?: FetchActionProperties
  ) {
    const configs = (options as any)?.collectors as
      | BaseFetchCollectorOptions[]
      | undefined
    if (!configs?.length) return

    const unsubs: Array<() => void> = []
    const allPendings: Set<Promise<any>> = new Set() // 汇总需等待的 onExec Promise

    for (const raw of configs) {
      const activateOn = arrify(raw.activateOn)
      const collectOn = arrify(raw.collectOn)
      const deactivateOn = arrify(raw.deactivateOn)
      const background: boolean = raw.background ?? true // 默认后台 => 不等待
      const awaitExec = !background

      const collector = FetchAction.create(raw)
      if (!collector) continue

      let started = false
      let ended = false
      let execCount = 0

      const doBefore = async (payload?: any) => {
        if (started || ended) return
        started = true
        try {
          await collector.onBeforeExec?.(context, raw as any)
        } catch (e) {
          context.eventBus.emit('collector:error', {
            action: this.id,
            collector: collector.id,
            phase: 'before',
            error: e,
          })
        }
      }

      const doEach = async (eventName: string | RegExp, payload?: any) => {
        if (ended) return
        if (!started) await doBefore(payload)
        try {
          const p = Promise.resolve(
            collector.onExecute?.(context, raw as any, payload)
          )
            .then((res) => {
              if ((raw as any).storeAs) {
                const arr = (context.outputs[(raw as any).storeAs!] ||= [])
                arr.push(res)
              }
              context.eventBus.emit('collector:result', {
                action: this.id,
                collector: raw.id || raw.name,
                event: eventName,
                result: res,
              })
              return res
            })
            .catch((error) => {
              context.eventBus.emit('collector:error', {
                action: this.id,
                collector: raw.id || raw.name,
                event: eventName,
                phase: 'exec',
                error,
              })
            })
            .finally(() => {
              execCount++
            })

          if (awaitExec) {
            allPendings.add(p)
            p.finally(() => allPendings.delete(p))
          }
        } catch (error) {
          context.eventBus.emit('collector:error', {
            action: this.id,
            collector: collector.id,
            event: eventName,
            phase: 'exec',
            error,
          })
        }
      }

      const doAfter = async () => {
        if (ended) return
        if (execCount === 0) {
          doEach('collector:after')
        }
        ended = true
        try {
          await collector.onAfterExec?.(context, raw as any)
        } catch (e) {
          context.eventBus.emit('collector:error', {
            action: this.id,
            collector: raw.id || raw.name,
            phase: 'after',
            error: e,
          })
        } finally {
          context.eventBus.emit('collector:end', {
            action: this.id,
            collector: raw.id || raw.name,
          })
          unsubsExec.forEach((fn) => fn()) // 解除采集监听
        }
      }

      const unsubsBefore = subscribeOnce(context, activateOn, doBefore)
      const unsubsExec = subscribeEach(context, collectOn, doEach)
      const unsubsAfter = subscribeOnce(context, deactivateOn, doAfter)

      unsubs.push(...unsubsBefore, ...unsubsExec, ...unsubsAfter)

      // 若未配置任何触发条件：在主动作结束时，进行采集，然后自动停用
      if (!activateOn.length && !collectOn.length && !deactivateOn.length) {
        const endHandler = () => {
          doAfter()
        }
        context.eventBus.once(`action:${this.id}.end`, endHandler)
        unsubs.push(() =>
          context.eventBus.off('fetcher:action:end', endHandler)
        )
      }
    }
    if (unsubs.length || allPendings.size > 0) {
      return {
        cleanup: () => unsubs.forEach((fn) => fn()),
        awaitExecPendings: async () => {
          if (allPendings.size > 0)
            await Promise.allSettled(Array.from(allPendings))
        },
      } as CollectorsRuntime
    }
  }

  // ============ 生命周期方法（基类实现，子类可覆盖）============
  /**
   * Action 开始生命周期
   * 负责：初始化 stack、设置 currentAction、触发事件、调用钩子
   */
  async beforeExec(context: FetchContext, options?: FetchActionProperties) {
    // 1. 初始化调用栈
    if (!context.internal.actionStack) {
      context.internal.actionStack = []
    }

    const stack = context.internal.actionStack
    const depth = stack.length
    const parent = stack.length > 0 ? stack[stack.length - 1].id : undefined

    // 2. 创建 Action 上下文信息
    const actionInfo: FetchActionInContext = {
      ...options,
      id: this.id,
      depth,
      parent,
    }

    // 3. 压入调用栈
    stack.push(actionInfo)
    context.currentAction = actionInfo

    // 4. 触发开始事件
    const data: FetchActionInContext = {
      action: this,
      context,
      options,
      index: options?.index,
      depth,
      stack: [...stack],
    }
    context.eventBus.emit(`action:${this.id}.start`, data)
    context.eventBus.emit('action:start', data)

    // 5. 调用子类钩子
    await this.onBeforeExec?.(context, options)
    const collectors = this.installCollectors(context, options)
    return { entry: data, collectors }
  }

  /**
   * Action 结束生命周期
   * 负责：调用钩子、赋值lastResult, 触发事件、清理 stack、恢复 currentAction
   */
  async afterExec(
    context: FetchContext,
    options?: BaseFetchCollectorActionProperties,
    result?: FetchActionResult,
    scope?: { entry: FetchActionInContext; collectors?: CollectorsRuntime }
  ): Promise<void> {
    const stack = context.internal.actionStack!
    const depth = stack.length - 1
    const collectors = scope?.collectors
    try {
      await collectors?.awaitExecPendings()

      context.lastResult = result
      if (result?.returnType === 'response' && !result.error) {
        context.lastResponse = result.result
      }

      if (options?.storeAs) {
        context.outputs[options.storeAs] = result?.result
      }
      if (result?.error) {
        context.currentAction!.error = result.error
      }

      // 1. 调用子类钩子
      await this.onAfterExec?.(context, options)

      // 2. 触发结束事件
      const data: any = {
        action: this,
        context,
        options,
        result,
        depth,
        stack: [...stack],
      }
      if (result?.error) {
        data.error = result.error
      }
      try {
        context.eventBus.emit(`action:${this.id}.end`, data)
      } catch (e) {}
      try {
        context.eventBus.emit('action:end', data)
      } catch (e) {}
    } finally {
      try {
        collectors?.cleanup()
      } finally {
        stack.pop()
        const len = stack.length
        context.currentAction = len > 0 ? stack[len - 1] : undefined
      }
    }
  }

  // the main action entry point
  async execute<R extends FetchReturnType = 'any'>(
    context: FetchContext,
    options?: FetchActionProperties
  ): Promise<FetchActionResult<R>> {
    if (options?.args && !options.params) options.params = options.args
    const scope = await this.beforeExec(context, options)
    const failOnError = options?.failOnError ?? true
    let result: FetchActionResult<R> | undefined
    try {
      context.throwHttpErrors = failOnError
      result = await this.onExecute(context, options)
      if (!result || !result.returnType) {
        result = {
          status: FetchActionResultStatus.Success,
          returnType: this.returnType ?? 'any',
          result,
        } as FetchActionResult<R>
      }
      return result
    } catch (error: any) {
      result = {
        status: FetchActionResultStatus.Failed,
        error,
        meta: {
          id: this.id,
          engineType: context.engine as any,
          capability: this.getCapability(context.engine as any),
        },
      }
      if (!failOnError) {
        return result
      } else throw error
    } finally {
      await this.afterExec(context, options, result, scope)
    }
  }
}

type CollectorsRuntime = {
  cleanup: () => void
  awaitExecPendings: () => Promise<void>
}

function arrify<T>(v?: T | T[]): T[] {
  if (!v) return []
  return Array.isArray(v) ? v : [v]
}

function subscribeOnce(
  ctx: FetchContext,
  patterns: Array<string | RegExp>,
  fn: (ev?: any) => void
) {
  const unsubs: Array<() => void> = []
  for (const p of patterns) {
    if (typeof p === 'string' || p instanceof RegExp) {
      const h = (...args: any[]) => {
        fn(args[0])
      }
      ctx.eventBus.once(p, h)
      unsubs.push(() => ctx.eventBus.off(p, h))
    }
  }
  return unsubs
}

function subscribeEach(
  ctx: FetchContext,
  patterns: Array<string | RegExp>,
  fn: (evName: string | RegExp, payload: any) => void
) {
  const unsubs: Array<() => void> = []
  for (const p of patterns) {
    if (typeof p === 'string' || p instanceof RegExp) {
      const h = (payload: any) => fn(p, payload)
      ctx.eventBus.on(p, h)
      unsubs.push(() => ctx.eventBus.off(p, h))
    }
  }
  return unsubs
}
