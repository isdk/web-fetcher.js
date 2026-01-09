import type { FetchContext } from './context'
import { FetchAction, FetchActionOptions, FetchActionResult } from '../action/fetch-action'
import { Cookie, DefaultFetcherProperties, FetcherOptions } from './types'
import { FetchReturnType } from './fetch-return-type'
import { createEvent } from '../event/create-event'
import { defaultsDeep } from 'lodash-es'
import { generateId } from './utils'
import { maybeCreateEngine } from './select-engine'

/**
 * Represents a stateful web fetching session.
 *
 * @remarks
 * A `FetchSession` manages the lifecycle of a single crawling operation, including engine initialization,
 * cookie persistence, and sequential action execution. It maintains a `FetchContext` that stores
 * session-level configurations and outputs.
 *
 * Sessions are isolated; each has its own unique ID and (by default) its own storage and cookies.
 */
export class FetchSession {
  /**
   * Unique identifier for the session.
   */
  public readonly id: string
  /**
   * The execution context for this session, containing configurations, event bus, and shared state.
   */
  public readonly context: FetchContext

  // private options!: FetchSessionOptions
  protected closed = false

  /**
   * Creates a new FetchSession.
   *
   * @param options - Configuration options for the fetcher.
   */
  constructor(protected options: FetcherOptions = {}) {
    this.id = generateId()
    this.context = this.createContext(options)
  }


  /**
   * Executes a single action within the session.
   *
   * @param actionOptions - Configuration for the action to be executed.
   * @param context - Optional context override for this specific execution. Defaults to the session context.
   * @returns A promise that resolves to the result of the action.
   * @template R - The expected return type of the action.
   *
   * @example
   * ```ts
   * await session.execute({ name: 'goto', params: { url: 'https://example.com' } });
   * ```
   */
  async execute<R extends FetchReturnType = 'response'>(
    actionOptions: FetchActionOptions,
    context: FetchContext = this.context
  ): Promise<FetchActionResult<R>> {
    const index = actionOptions.index ?? (context.internal.actionIndex || 0);
    context.internal.actionIndex = index + 1;

    await this.ensureEngine(actionOptions, context)

    const action = FetchAction.create(actionOptions)
    if (!action) {
      throw new Error(`Unknown action: ${actionOptions.id || actionOptions.name}`)
    }
    // const actionId = actionOptions.id || actionOptions.name || 'unknown'
    // const eventBus = this.context.eventBus;

    // Use a copy of actionOptions to avoid mutating the original, and inject the index
    const effectiveActionOptions = { ...actionOptions, index };

    // 更新当前动作状态
    context.currentAction = {
      ...effectiveActionOptions,
      startedAt: Date.now()
    }

    let result: FetchActionResult<R>|undefined;
    let error: Error|undefined;

    try {
      result = await action.execute<R>(context, effectiveActionOptions)

      return result
    } catch (e: any) {
      error = e;
      throw error;
    } finally {
      // 清除当前动作状态
      context.currentAction = undefined
    }
  }

  /**
   * Executes a sequence of actions.
   *
   * @param actions - An array of action options to be executed in order.
   * @param options - Optional temporary configuration overrides (e.g., timeoutMs, headers) for this batch of actions.
   *                  These overrides do not affect the main session context.
   * @returns A promise that resolves to an object containing the result of the last action and all accumulated outputs.
   *
   * @example
   * ```ts
   * const { result, outputs } = await session.executeAll([
   *   { name: 'goto', params: { url: 'https://example.com' } },
   *   { name: 'extract', params: { schema: { title: 'h1' } }, storeAs: 'data' }
   * ], { timeoutMs: 30000 });
   * ```
   */
  async executeAll(actions: FetchActionOptions[], options?: Partial<FetcherOptions> & { index?: number }) {
    const runContext: FetchContext = options
      ? {
        ...this.context,
        ...options,
        // Preserve critical session state
        id: this.context.id,
        eventBus: this.context.eventBus,
        outputs: this.context.outputs,
        execute: this.context.execute,
        action: this.context.action,
      }
      : this.context;

    let i = options?.index ?? 0;
    try {
      while (i < actions.length) {
        const actionOptions = actions[i]
        await this.execute({ ...actionOptions, index: i }, runContext)
        i++
      }

      const response = await this.execute({
        id: 'getContent',
        index: i
      }, runContext)
      return {
        result: response?.result,
        outputs: this.getOutputs(),
      }
    } catch (error: any) {
      error.actionIndex = i
      throw error
    }
  }

  /**
   * Retrieves all outputs accumulated during the session.
   *
   * @returns A record of stored output data.
   */
  getOutputs(): Record<string, any> {
    return this.context.outputs
  }

  /**
   * Gets the current state of the session, including cookies and engine-specific state.
   *
   * @returns A promise resolving to the session state, or undefined if no engine is initialized.
   */
  async getState(): Promise<{ cookies: Cookie[], sessionState?: any } | undefined> {
    return this.context.internal.engine?.getState()
  }

  /**
   * Disposes of the session and its associated engine.
   *
   * @remarks
   * This method should be called when the session is no longer needed to free up resources
   * (e.g., closing browser instances, purging temporary storage).
   */
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

  private async ensureEngine(actionOptions: FetchActionOptions | undefined, context: FetchContext) {
    if (this.closed) {
      throw new Error('Session is closed')
    }
    if (!context.internal.engine) {
      const url = actionOptions?.params?.url ?? context.url;
      const engine = await maybeCreateEngine(context, { url })
      if (!engine) {throw new Error('No engine found')}
      context.internal.engine = engine
    }

  }

  protected createContext(options = this.options): FetchContext {
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
