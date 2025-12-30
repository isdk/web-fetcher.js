import type { FetchContext } from './context'
import { FetchAction, FetchActionOptions, FetchActionResult } from '../action/fetch-action'
import { Cookie, DefaultFetcherProperties, FetcherOptions } from './types'
import { FetchReturnType } from './fetch-return-type'
import { createEvent } from '../event/create-event'
import { defaultsDeep } from 'lodash-es'
import { generateId } from './utils'
import { maybeCreateEngine } from './select-engine'

// ===== 会话类 =====
export class FetchSession {
  public readonly id: string
  public readonly context: FetchContext

  // private options!: FetchSessionOptions
  private closed = false

  constructor(private options: FetcherOptions = {}) {
    this.id = generateId()
    this.context = this.createContext(options)
  }


  /**
   * 执行单个动作
   */
  async execute<R extends FetchReturnType = 'response'>(actionOptions: FetchActionOptions): Promise<FetchActionResult<R>> {
    await this.ensureEngine(actionOptions)

    const action = FetchAction.create(actionOptions)
    if (!action) {
      throw new Error(`Unknown action: ${actionOptions.id || actionOptions.name}`)
    }
    // const actionId = actionOptions.id || actionOptions.name || 'unknown'
    // const eventBus = this.context.eventBus;

    this.context.internal.actionIndex = (this.context.internal.actionIndex || 0) + 1;
    // 更新当前动作状态
    this.context.currentAction = {
      ...actionOptions,
      index: this.context.internal.actionIndex,
      startedAt: Date.now()
    }

    let result: FetchActionResult<R>|undefined;
    let error: Error|undefined;

    try {
      result = await action.execute<R>(this.context, actionOptions)

      return result
    } catch (e: any) {
      error = e;
      throw error;
    } finally {
      // 清除当前动作状态
      this.context.currentAction = undefined
    }
  }

  async executeAll(actions: FetchActionOptions[]) {
    try {
      for (let i = 0; i < actions.length; i++) {
        const actionOptions = actions[i]
        await this.execute(actionOptions)
      }
      const response = await this.execute({
        id: 'getContent'
      })
      return {
        result: response?.result,
        outputs: this.getOutputs(),
      }
    } catch (error) {
      throw error
    }
  }

  getOutputs(): Record<string, any> {
    return this.context.outputs
  }

  async getState(): Promise<{ cookies: Cookie[] } | undefined> {
    return this.context.internal.engine?.getState()
  }

  async dispose(): Promise<void> {
    if (this.closed) return
    const eventBus = this.context.eventBus

    eventBus.emit('session:closing', { sessionId: this.id })
    try {
      await this.context.internal.engine?.dispose()
    } finally {
      this.closed = true
    }

    eventBus.emit('session:closed', { sessionId: this.id })
  }

  private async ensureEngine(actionOptions?: FetchActionOptions) {
    if (this.closed) {
      throw new Error('Session is closed')
    }
    if (!this.context.internal.engine) {
      const url = actionOptions?.params?.url ?? this.context.url;
      const engine = await maybeCreateEngine(this.context, { url })
      if (!engine) {throw new Error('No engine found')}
    }

  }

  private createContext(options = this.options): FetchContext {
    const eventBus = createEvent();
    const result: FetchContext = defaultsDeep({
      ...options,
      id: this.id,
      eventBus,
      outputs: {},
      internal: {},
      execute: async <R extends FetchReturnType = 'any'>(
        actionOptions: FetchActionOptions
      ) => this.execute<R>(actionOptions),
      action: async function<R extends FetchReturnType = 'any'>(
        this: FetchContext,
        name: string,
        params?: any,
        options?: FetchActionOptions
      ) {
        return this.execute<R>({
          name,
          params,
          ...options,
        } as FetchActionOptions)
      },
    }, DefaultFetcherProperties)
    return result
  }
}
