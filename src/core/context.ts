import { EventEmitter } from 'events-ex'
import { FetchEngine } from '../engine/base'
import {
  FetchActionOptions,
  FetchActionProperties,
  FetchActionResult,
} from '../action/fetch-action'
import { FetchReturnType } from './fetch-return-type'
import { BaseFetcherProperties, FetchResponse } from './types'

/**
 * Represents the state of an action being executed within a context.
 *
 * @remarks
 * Extends the basic action properties with runtime metadata like execution index,
 * nesting depth, and any errors encountered during execution.
 */
export interface FetchActionInContext extends FetchActionProperties {
  /**
   * The 0-based index of the action in the execution sequence.
   */
  index?: number
  /**
   * Error encountered during action execution, if any.
   */
  error?: Error
  /**
   * The nesting depth of the action. Top-level actions (executed directly by the session) have a depth of 0.
   */
  depth?: number
}

/**
 * Base internal state used by fetch engines to maintain their runtime environment.
 *
 * @internal
 */
interface BaseFetchContextInteralState {
  /**
   * The active engine instance (e.g., CheerioFetchEngine or PlaywrightFetchEngine)
   * associated with this context.
   */
  engine?: FetchEngine
  /**
   * Additional implementation-specific internal state.
   */
  [key: string]: any
}

/**
 * Extended internal state for the fetch context, including action lifecycle management.
 *
 * @internal
 */
interface FetchContextInteralState extends BaseFetchContextInteralState {
  /**
   * Stack of actions currently being executed, used to manage nested action calls.
   */
  actionStack?: FetchActionInContext[]
  /**
   * Global counter for actions executed within the session, used to assign auto-incrementing indices.
   */
  actionIndex?: number
}

/**
 * Context provided to the Fetch Engine during navigation and request handling.
 *
 * @remarks
 * This interface contains the minimum set of properties required by an engine
 * to perform a fetch operation and build a response.
 */
export interface FetchEngineContext extends BaseFetcherProperties {
  /**
   * Unique identifier for the session or request batch.
   */
  id: string
  /**
   * The target URL for the next navigation, if specified.
   */
  url?: string
  /**
   * The final URL after all redirects have been followed.
   */
  finalUrl?: string

  /**
   * The standardized response object from the most recent navigation.
   */
  lastResponse?: FetchResponse
  /**
   * The result object from the most recent action execution.
   */
  lastResult?: FetchActionResult

  /**
   * Engine-specific internal state.
   */
  internal: BaseFetchContextInteralState
}

/**
 * The full execution context for a Web Fetcher session or action batch.
 *
 * @remarks
 * This object is the central state container for the fetch operation. It provides
 * access to configuration, the event bus, shared outputs, and the execution engine.
 * It is passed to every action during execution.
 */
export interface FetchContext extends FetchEngineContext {
  /**
   * Metadata about the action currently being executed.
   */
  currentAction?: FetchActionInContext

  /**
   * A shared key-value store for storing data extracted from pages or
   * metadata generated during action execution.
   */
  outputs: Record<string, any>

  /**
   * Executes a FetchAction within the current context.
   *
   * @param actionOptions - Configuration for the action to be executed.
   * @returns A promise that resolves to the action's result.
   */
  execute<R extends FetchReturnType = 'any'>(
    actionOptions: FetchActionOptions
  ): Promise<FetchActionResult<R>>

  /**
   * Convenience method to execute an action by its registered name or ID.
   *
   * @param name - The registered name or ID of the action.
   * @param params - Parameters specific to the action type.
   * @param options - Additional execution options (e.g., storeAs, failOnError).
   * @returns A promise that resolves to the action's result.
   */
  action<R extends FetchReturnType = 'any'>(
    name: string,
    params?: any,
    options?: Partial<FetchActionOptions>
  ): Promise<FetchActionResult<R>>

  /**
   * Internal state for engine and lifecycle management.
   */
  internal: FetchContextInteralState

  /**
   * The central event bus for publishing and subscribing to session and action events.
   */
  eventBus: EventEmitter
}
