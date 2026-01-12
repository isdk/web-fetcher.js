import { defaultsDeep, merge } from 'lodash-es'
import { EventEmitter } from 'events-ex'
import { CommonError } from '@isdk/common-error'
import {
  Configuration,
  KeyValueStore,
  PERSIST_STATE_KEY,
  RequestQueue,
  Session,
  ProxyConfiguration,
} from 'crawlee'
import type {
  BasicCrawler,
  BasicCrawlerOptions,
  CrawlingContext,
  FinalStatistics,
  PlaywrightCrawlingContext,
  PlaywrightGotoOptions,
} from 'crawlee'

import { FetchEngineContext } from '../core/context'
import {
  ExtractSchema,
  ExtractArraySchema,
  ExtractObjectSchema,
  ExtractValueSchema,
  ExtractArrayMode,
  ExtractArrayModeName,
  ColumnarOptions,
  SegmentedOptions,
} from '../core/extract'
import {
  BaseFetcherProperties,
  FetchEngineType,
  Cookie,
  FetchResponse,
  ResourceType,
  DefaultFetcherProperties,
} from '../core/types'
import { normalizeHeaders } from '../utils/headers'
import { PromiseLock, createResolvedPromiseLock } from './promise-lock'

Configuration.getGlobalConfig().set('persistStorage', false)

/**
 * Options for the {@link FetchEngine.goto}, allowing configuration of HTTP method, payload, headers, and navigation behavior.
 *
 * @remarks
 * Used when navigating to a URL to specify additional parameters beyond the basic URL.
 *
 * @example
 * ```ts
 * await engine.goto('https://example.com', {
 *   method: 'POST',
 *   payload: { username: 'user', password: 'pass' },
 *   headers: { 'Content-Type': 'application/json' },
 *   waitUntil: 'networkidle'
 * });
 * ```
 */
export interface GotoActionOptions {
  method?:
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'OPTIONS'
    | 'CONNECT'
    | 'PATCH'
  payload?: any // POST
  headers?: Record<string, string>
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
  timeoutMs?: number
}

/**
 * Options for the {@link FetchEngine.waitFor} action, specifying conditions to wait for before continuing.
 *
 * @remarks
 * Controls timing behavior for interactions, allowing waiting for elements, time intervals, or network conditions.
 */
export interface WaitForActionOptions {
  ms?: number
  selector?: string
  networkIdle?: boolean
  failOnTimeout?: boolean
}

/**
 * Options for the {@link FetchEngine.submit} action, configuring form submission behavior.
 *
 * @remarks
 * Specifies encoding type for form submissions, particularly relevant for JSON-based APIs.
 */
export interface SubmitActionOptions {
  enctype?:
    | 'application/x-www-form-urlencoded'
    | 'application/json'
    | 'multipart/form-data'
}

/**
 * Predefined cleanup groups for the {@link FetchEngine.trim} action.
 */
export type TrimPreset =
  | 'scripts'
  | 'styles'
  | 'svgs'
  | 'images'
  | 'comments'
  | 'hidden'
  | 'all'

/**
 * Options for the {@link FetchEngine.trim} action, specifying which elements to remove from the DOM.
 */
export interface TrimActionOptions {
  selectors?: string | string[]
  presets?: TrimPreset | TrimPreset[]
}

export const TRIM_PRESETS: Record<string, string[]> = {
  scripts: ['script'],
  styles: ['style', 'link[rel="stylesheet"]'],
  svgs: ['svg'],
  images: ['img', 'picture', 'canvas'],
  hidden: ['[hidden]', '[style*="display:none"]', '[style*="display: none"]'],
}

/**
 * Union type representing all possible engine actions that can be dispatched.
 *
 * @remarks
 * Defines the command structure processed during page interactions. Each action type corresponds to
 * a specific user interaction or navigation command within the action loop architecture.
 */
export type FetchEngineAction =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'waitFor'; options?: WaitForActionOptions }
  | { type: 'submit'; selector?: any; options?: SubmitActionOptions }
  | { type: 'getContent' }
  | { type: 'navigate'; url: string; opts?: GotoActionOptions }
  | { type: 'extract'; schema: ExtractSchema }
  | { type: 'pause'; message?: string }
  | { type: 'trim'; options: TrimActionOptions }
  | { type: 'dispose' }

/**
 * Represents an action that has been dispatched and is awaiting execution in the active page context.
 *
 * @remarks
 * Connects the action request with its resolution mechanism. Used internally by the action dispatch system
 * to handle promises while maintaining the page context validity window.
 */
export interface DispatchedEngineAction {
  action: FetchEngineAction
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}

/**
 * Represents a pending navigation request awaiting resolution.
 *
 * @remarks
 * Tracks navigation requests that have been queued but not yet processed by the request handler.
 */
export interface PendingEngineRequest {
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

/**
 * Abstract base class for all fetch engines, providing a unified interface for web content fetching and interaction.
 *
 * @remarks
 * The `FetchEngine` class serves as the foundation for concrete engine implementations (e.g., `CheerioFetchEngine`,
 * `PlaywrightFetchEngine`). It abstracts underlying crawling technology and provides a consistent API for navigation,
 * content retrieval, and user interaction.
 *
 * The engine architecture uses an event-driven action loop to bridge Crawlee's stateless request handling with
 * the need for a stateful, sequential API for page interactions. This solves the critical challenge of maintaining
 * page context validity across asynchronous operations.
 *
 * @example
 * ```ts
 * import "./playwright"; // 引入注册 Playwright browser 引擎
 * const engine = await FetchEngine.create(context, { engine: 'browser' });
 * await engine.goto('https://example.com');
 * await engine.fill('#username', 'user');
 * await engine.click('#submit');
 * const response = await engine.getContent();
 * ```
 */

type AnyFetchEngine = FetchEngine<any, any, any>
type AnyFetchEngineCtor = new (...args: any[]) => AnyFetchEngine

export abstract class FetchEngine<
  TContext extends CrawlingContext = any,
  TCrawler extends BasicCrawler<TContext> = any,
  TOptions extends BasicCrawlerOptions<TContext> = any,
> {
  // ===== 静态成员：注册管理 =====
  private static registry = new Map<string, AnyFetchEngineCtor>()

  /**
   * Registers a fetch engine implementation with the global registry.
   *
   * @param engineClass - The engine class to register
   * @throws {Error} When engine class lacks static `id` or ID is already registered
   *
   * @example
   * ```ts
   * FetchEngine.register(CheerioFetchEngine);
   * ```
   */
  static register(engineClass: AnyFetchEngineCtor): void {
    const id = (engineClass as any).id
    if (!id) throw new Error('Engine must define static id')
    if (this.registry.has(id)) throw new Error(`Engine id duplicated: ${id}`)
    this.registry.set(id, engineClass)
  }

  /**
   * Retrieves a fetch engine implementation by its unique ID.
   *
   * @param id - The ID of the engine to retrieve
   * @returns Engine class if found, otherwise `undefined`
   */
  static get(id: string): AnyFetchEngineCtor | undefined {
    return this.registry.get(id)
  }

  /**
   * Retrieves a fetch engine implementation by execution mode.
   *
   * @param mode - Execution mode (`'http'` or `'browser'`)
   * @returns Engine class if found, otherwise `undefined`
   */
  static getByMode(mode: FetchEngineType): AnyFetchEngineCtor | undefined {
    for (const [_id, engineClass] of this.registry.entries()) {
      if ((engineClass as any).mode === mode) return engineClass
    }
  }

  /**
   * Factory method to create and initialize a fetch engine instance.
   *
   * @param ctx - Fetch engine context
   * @param options - Configuration options
   * @returns Initialized fetch engine instance
   * @throws {Error} When no suitable engine implementation is found
   *
   * @remarks
   * Primary entry point for engine creation. Selects appropriate implementation based on `engine` name of the option or context.
   */
  static async create(
    ctx: FetchEngineContext,
    options?: BaseFetcherProperties
  ) {
    const finalOptions = defaultsDeep(
      options,
      ctx,
      DefaultFetcherProperties
    ) as BaseFetcherProperties
    const engineName = (finalOptions.engine ?? ctx.engine) as FetchEngineType
    const Engine = engineName
      ? (this.get(engineName!) ?? this.getByMode(engineName))
      : null
    if (Engine) {
      const result = new Engine()
      await result.initialize(ctx, finalOptions)
      return result
    }
  }

  /**
   * Unique identifier for the engine implementation.
   *
   * @remarks
   * Must be defined by concrete implementations. Used for registration and lookup in engine registry.
   */
  static readonly id: string

  /**
   * Execution mode of the engine (`'http'` or `'browser'`).
   *
   * @remarks
   * Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.
   */
  static readonly mode: FetchEngineType

  declare protected ctx?: FetchEngineContext
  declare protected opts?: BaseFetcherProperties
  declare protected crawler?: TCrawler
  declare protected isCrawlerReady?: boolean
  protected crawlerRunPromise?: Promise<FinalStatistics>
  protected config?: Configuration
  declare protected requestQueue?: RequestQueue
  protected kvStore?: KeyValueStore
  protected proxyConfiguration?: ProxyConfiguration

  protected hdrs: Record<string, string> = {}
  protected _initialCookies?: Cookie[]
  protected _initializedSessions = new Set<string>()
  protected currentSession?: Session
  protected pendingRequests = new Map<string, PendingEngineRequest>()
  protected requestCounter = 0
  protected actionEmitter = new EventEmitter()
  protected isPageActive = false
  protected isEngineDisposed = false
  protected navigationLock: PromiseLock = createResolvedPromiseLock()
  protected lastResponse?: FetchResponse
  protected blockedTypes = new Set<string>()

  protected _logDebug(...args: any[]) {
    if (this.opts?.debug) {
      console.log(`[FetchEngine:${this.id}]`, ...args)
    }
  }

  protected _cleanup?(): Promise<void>

  protected _getTrimInfo(options: TrimActionOptions) {
    let { selectors = [], presets = [] } = options
    if (typeof selectors === 'string') selectors = [selectors]
    if (typeof presets === 'string') presets = [presets]

    const isAll = presets.includes('all')
    const allSelectors = [...selectors]

    for (const [preset, sels] of Object.entries(TRIM_PRESETS)) {
      if (isAll || presets.includes(preset as any)) {
        allSelectors.push(...sels)
      }
    }

    return {
      selectors: allSelectors,
      removeComments: isAll || presets.includes('comments'),
      removeHidden: isAll || presets.includes('hidden'),
    }
  }

  /**
   * Finds all elements matching the selector within the given context.
   * @param context - The context to search in (Engine-specific element/node or array of nodes).
   * @param selector - CSS selector.
   * @internal
   */
  protected abstract _querySelectorAll(
    context: any,
    selector: string
  ): Promise<any[]>

  /**
   * Extracts a primitive value from the element based on schema.
   * @param schema - Value extraction schema.
   * @param context - The element context.
   * @internal
   */
  protected abstract _extractValue(
    schema: ExtractValueSchema,
    context: any
  ): Promise<any>

  /**
   * Gets the parent element of the given element.
   * @param element - The element.
   * @internal
   */
  protected abstract _parentElement(element: any): Promise<any | null>

  /**
   * Checks if two elements are the same.
   * @param element1 - First element.
   * @param element2 - Second element.
   * @internal
   */
  protected abstract _isSameElement(
    element1: any,
    element2: any
  ): Promise<boolean>

  /**
   * Gets all subsequent siblings of an element until a sibling matches the selector.
   * Used in 'segmented' extraction mode.
   * @param element - The anchor element.
   * @param untilSelector - Optional selector that marks the end of the segment.
   * @internal
   */
  protected abstract _nextSiblingsUntil(
    element: any,
    untilSelector?: string
  ): Promise<any[]>

  /**
   * Determines if a schema is an "Implicit Object Schema".
   *
   * An implicit object is a shorthand where you define properties directly
   * without specifying `type: 'object'` or `properties: { ... }`.
   *
   * @example
   * { title: 'h1', author: '.name' } => implicit object
   * { type: 'object', properties: { ... } } => explicit object
   *
   * @param schema - The schema to check.
   * @returns True if it's an implicit object.
   */
  protected _isImplicitObject(schema: any): boolean {
    if (!schema || typeof schema !== 'object') return false

    // If 'type' is explicitly set, it's NOT an implicit shorthand.
    if ('type' in schema) return false

    const reservedKeys = new Set([
      'selector',
      'attribute',
      'has',
      'exclude',
      'properties',
      'items',
      'mode',
      'required',
    ])

    const keys = Object.keys(schema)
    if (keys.length === 0) return false

    // If it contains any key that is NOT a reserved configuration keyword,
    // we treat it as an implicit object where keys are property names.
    for (const key of keys) {
      if (!reservedKeys.has(key)) return true
    }

    // Special Case: Handling reserved keywords as property names.
    // If a schema has 'items' but NO 'type: array', it's likely an implicit object
    // intending to extract a field named 'items'.
    if (keys.includes('items')) return true

    return false
  }

  protected async _extract(schema: ExtractSchema, context: any): Promise<any> {
    const schemaType = (schema as any).type
    const schemaSelector = (schema as any).selector

    if (!context) {
      this._logDebug(
        `_extract: No context for selector "${schemaSelector || ''}", type "${schemaType || 'value'}"`
      )
      return schemaType === 'array' ? [] : null
    }

    if (schemaType === 'object') {
      const { selector, properties, strict } = schema as ExtractObjectSchema
      let newContext = context
      if (selector) {
        const elements = await this._querySelectorAll(context, selector)
        newContext = elements.length > 0 ? elements[0] : null
        this._logDebug(
          `_extract: object selector "${selector}" found ${elements.length} elements`
        )
      }
      if (!newContext) {
        this._logDebug(
          `_extract: object context not found for selector "${selector}"`
        )
        if (strict && (schema as any).required) {
          throw new CommonError(
            `Required object "${selector || ''}" is missing.`,
            'extract'
          )
        }
        return null
      }

      const result: Record<string, any> = {}
      for (const key in properties) {
        this._logDebug(`_extract: extracting property "${key}"`)
        const value = await this._extract(properties[key], newContext)
        if (value === null && (properties[key] as any).required) {
          this._logDebug(`_extract: required property "${key}" is null`)
          if (strict) {
            throw new CommonError(
              `Required property "${key}" is missing.`,
              'extract'
            )
          }
          return null
        }
        result[key] = value
      }
      return result
    }

    if (!schemaType && this._isImplicitObject(schema)) {
      this._logDebug('_extract: implicit object')
      const result: Record<string, any> = {}
      const properties = (schema as any).properties || schema
      const reservedKeys = new Set([
        'selector',
        'attribute',
        'has',
        'exclude',
        'properties',
        'items',
        'mode',
        'required',
      ])

      for (const key in properties) {
        if (reservedKeys.has(key)) continue
        this._logDebug(`_extract: extracting implicit property "${key}"`)
        const value = await this._extract(properties[key], context)
        if (value === null && (properties[key] as any).required) {
          this._logDebug(
            `_extract: required implicit property "${key}" is null, skipping object`
          )
          return null
        }
        result[key] = value
      }
      return result
    }

    if (schemaType === 'array') {
      const { selector, items, mode, strict } = schema as ExtractArraySchema
      const elements = selector
        ? await this._querySelectorAll(context, selector)
        : [context]

      this._logDebug(
        `_extract: array selector "${selector || ''}" found ${elements.length} elements`
      )

      const normalizedMode = this._normalizeArrayMode(mode)
      if (strict !== undefined && normalizedMode.strict === undefined) {
        normalizedMode.strict = strict
      }
      const isAuto = !mode

      if (
        (isAuto || normalizedMode.type === 'columnar') &&
        elements.length === 1 &&
        items
      ) {
        this._logDebug('_extract: trying columnar extraction')
        const results = await this._extractColumnar(
          items,
          elements[0],
          normalizedMode
        )
        if (results) {
          this._logDebug(
            `_extract: columnar extraction successful, found ${results.length} items`
          )
          return results
        }
      }

      if (
        normalizedMode.type === 'segmented' &&
        elements.length === 1 &&
        items
      ) {
        this._logDebug('_extract: trying segmented extraction')
        const results = await this._extractSegmented(
          items,
          elements[0],
          normalizedMode
        )
        if (results) {
          this._logDebug(
            `_extract: segmented extraction successful, found ${results.length} items`
          )
          return results
        }
      }

      // Default fallback or explicit nested
      this._logDebug(
        `_extract: using nested extraction for ${elements.length} elements`
      )
      return this._extractNested(items!, elements, {
        strict: normalizedMode.strict,
      })
    }

    const { selector } = schema as ExtractValueSchema
    let elementToExtract = context
    if (selector) {
      const elements = await this._querySelectorAll(context, selector)
      elementToExtract = elements.length > 0 ? elements[0] : null
      this._logDebug(
        `_extract: value selector "${selector}" found ${elements.length} elements`
      )
    } else if (Array.isArray(context)) {
      elementToExtract = context.length > 0 ? context[0] : null
    }

    if (!elementToExtract) {
      this._logDebug(
        `_extract: value element not found for selector "${selector || ''}"`
      )
      return null
    }

    const result = await this._extractValue(
      schema as ExtractValueSchema,
      elementToExtract
    )
    this._logDebug(
      `_extract: value extracted for selector "${selector || ''}":`,
      result
    )
    return result
  }

  /**
   * Normalizes the array extraction mode into an options object.
   * @param mode - The mode string or options object.
   * @internal
   */
  protected _normalizeArrayMode(
    mode?: ExtractArrayMode
  ): { type: ExtractArrayModeName } & any {
    if (!mode) return { type: 'nested' }
    if (typeof mode === 'string') return { type: mode }
    return mode
  }

  /**
   * Performs standard nested array extraction.
   * @param items - The schema for each item.
   * @param elements - The list of item elements.
   * @internal
   */
  protected async _extractNested(
    items: ExtractSchema,
    elements: any[],
    opts?: { strict?: boolean }
  ): Promise<any[]> {
    const results: any[] = []
    const isRequired = (items as any).required
    const strict = opts?.strict === true
    const isComplex =
      (items as any).type === 'object' ||
      (items as any).type === 'array' ||
      this._isImplicitObject(items)

    for (const element of elements) {
      const result = await this._extract(items, element)
      if (result !== null) {
        results.push(result)
      } else if (isRequired && strict) {
        throw new CommonError('Required item is missing in array.', 'extract')
      } else if (!isRequired && !isComplex) {
        results.push(null)
      }
    }
    return results
  }

  /**
   * Performs columnar extraction (Column Alignment Mode).
   *
   * @param schema - The schema for a single item (must be an object or implicit object).
   * @param container - The container element to search within.
   * @param opts - Columnar extraction options (strict, inference).
   * @returns An array of extracted items, or null if requirements aren't met.
   * @internal
   */
  protected async _extractColumnar(
    schema: ExtractSchema,
    container: any,
    opts?: ColumnarOptions
  ): Promise<any[] | null> {
    const isObject =
      schema.type === 'object' ||
      (!schema.type && this._isImplicitObject(schema))
    const strict = opts?.strict === true // Default to false
    const inference = opts?.inference === true

    if (isObject) {
      const properties =
        schema.type === 'object'
          ? (schema as ExtractObjectSchema).properties
          : (schema as any)

      const keys = Object.keys(properties)
      if (keys.length === 0) return null

      const collectedValues: Record<string, any[]> = {}
      let commonCount: number | null = null
      let maxCount = 0
      let maxCountMatches: any[] = []

      for (const key of keys) {
        const propSchema = properties[key] as ExtractSchema
        // Nested complex structures are not supported for simple Columnar alignment
        if (
          propSchema.type === 'array' ||
          propSchema.type === 'object' ||
          (!propSchema.type && this._isImplicitObject(propSchema))
        ) {
          this._logDebug(
            `_extractColumnar: field "${key}" has nested structure, columnar not supported`
          )
          return null
        }

        const valueSchema = propSchema as ExtractValueSchema
        let matches: any[] = []

        if (valueSchema.selector) {
          matches = await this._querySelectorAll(
            container,
            valueSchema.selector
          )
        } else {
          // If no selector, it's a "global" value (e.g. constant/attribute of container)
          matches = [container]
        }

        const count = matches.length
        this._logDebug(
          `_extractColumnar: field "${key}" with selector "${valueSchema.selector || ''}" found ${count} matches`
        )

        if (count > maxCount) {
          maxCount = count
          maxCountMatches = matches
        }

        if (valueSchema.selector) {
          if (commonCount === null) {
            commonCount = count
            this._logDebug(
              `_extractColumnar: set commonCount to ${commonCount}`
            )
          } else if (commonCount !== count) {
            this._logDebug(
              `_extractColumnar: count mismatch for field "${key}": ${count} vs ${commonCount}`
            )
            if (inference && maxCount > 1) {
              commonCount = -1 // Mark as mismatched
              this._logDebug('_extractColumnar: mismatch marked for inference')
            } else if (strict) {
              if (propSchema.required && count < commonCount!) {
                throw new CommonError(
                  `Required field "${key}" is missing at index ${count}.`,
                  'extract'
                )
              }
              throw new CommonError(
                `Columnar extraction mismatch: field "${key}" has ${count} matches, but expected ${commonCount}.`,
                'extract'
              )
            }
          }
        }

        const values = await Promise.all(
          matches.map((m) => this._extractValue(valueSchema, m))
        )
        collectedValues[key] = values
      }

      // Try inference if enabled and mismatch occurred
      if (
        inference &&
        commonCount === -1 &&
        maxCount > 1 &&
        maxCountMatches.length > 0
      ) {
        const itemWrappers: any[] = []
        for (const match of maxCountMatches) {
          let current = match
          let parent = await this._parentElement(current)
          let childOfContainer = current

          while (parent) {
            if (await this._isSameElement(parent, container)) {
              itemWrappers.push(childOfContainer)
              break
            }
            childOfContainer = parent
            current = parent
            parent = await this._parentElement(current)
          }
        }

        const uniqueWrappers: any[] = []
        for (const w of itemWrappers) {
          let isDuplicate = false
          for (const u of uniqueWrappers) {
            if (await this._isSameElement(w, u)) {
              isDuplicate = true
              break
            }
          }
          if (!isDuplicate) uniqueWrappers.push(w)
        }

        if (uniqueWrappers.length > 1) {
          return this._extractNested(schema, uniqueWrappers)
        }
      }

      if (maxCount <= 1) return null
      if (commonCount === -1 && strict) return null

      const resultCount = strict && commonCount !== -1 ? commonCount! : maxCount

      const results: any[] = []
      for (let i = 0; i < resultCount; i++) {
        const obj: Record<string, any> = {}
        let skipRow = false
        for (const key of keys) {
          const vals = collectedValues[key]
          const propSchema = properties[key] as any
          let val = vals[i]
          if (vals.length === 1 && resultCount > 1 && !propSchema.selector) {
            val = vals[0]
          } else if (val === undefined) {
            val = null
          }

          if (val === null && propSchema.required) {
            if (strict) {
              throw new CommonError(
                `Required field "${key}" is missing at index ${i}.`,
                'extract'
              )
            }
            skipRow = true
            break
          }
          obj[key] = val
        }
        if (!skipRow) {
          results.push(obj)
        }
      }
      return results
    } else {
      const valueSchema = schema as ExtractValueSchema
      if (!valueSchema.selector) return null

      const matches = await this._querySelectorAll(
        container,
        valueSchema.selector
      )
      if (matches.length <= 1) return null

      const results = await Promise.all(
        matches.map((m) => this._extractValue(valueSchema, m))
      )
      return valueSchema.required ? results.filter((r) => r !== null) : results
    }
  }

  /**
   * Performs segmented extraction (Anchor-based Scanning).
   *
   * @param schema - The schema for a single item (must be an object).
   * @param container - The container element to scan.
   * @param opts - Segmented extraction options (anchor).
   * @returns An array of extracted items.
   * @internal
   */
  protected async _extractSegmented(
    schema: ExtractSchema,
    container: any,
    opts?: SegmentedOptions
  ): Promise<any[] | null> {
    const isObject =
      schema.type === 'object' ||
      (!schema.type && this._isImplicitObject(schema))
    if (!isObject) return null

    const properties =
      schema.type === 'object'
        ? (schema as ExtractObjectSchema).properties
        : (schema as any)

    const keys = Object.keys(properties)
    if (keys.length === 0) return null

    const anchorKey = opts?.anchor || keys[0]
    const anchorSchema = properties[anchorKey] as ExtractValueSchema
    if (!anchorSchema.selector) return null

    const anchorElements = await this._querySelectorAll(
      container,
      anchorSchema.selector
    )
    this._logDebug(
      `_extractSegmented: anchor selector "${anchorSchema.selector}" found ${anchorElements.length} elements`
    )
    if (anchorElements.length === 0) return []

    const results: any[] = []
    for (let i = 0; i < anchorElements.length; i++) {
      const anchor = anchorElements[i]
      const segment = await this._nextSiblingsUntil(
        anchor,
        anchorSchema.selector
      )
      // The segment context includes the anchor itself + following siblings until next anchor
      const segmentContext = [anchor, ...segment]
      this._logDebug(
        `_extractSegmented: segment ${i} has ${segmentContext.length} elements (including anchor)`
      )
      const result = await this._extract(schema, segmentContext)
      const isRequired = (schema as any).required
      const isComplex =
        (schema as any).type === 'object' ||
        (schema as any).type === 'array' ||
        this._isImplicitObject(schema)

      if (result !== null) {
        results.push(result)
      } else if (!isRequired && !isComplex) {
        results.push(null)
      }
    }

    return results
  }

  /**
   * Creates the crawler instance for the specific engine implementation.
   * @param options - The final crawler options.
   * @internal
   */
  protected abstract _createCrawler(
    options: TOptions,
    config?: Configuration
  ): TCrawler

  /**
   * Gets the crawler-specific options from the subclass.
   * @param ctx - The fetch engine context.
   * @internal
   */
  protected abstract _getSpecificCrawlerOptions(
    ctx: FetchEngineContext
  ): Promise<Partial<TOptions>> | Partial<TOptions>
  /**
   * Abstract method for building standard [FetchResponse] from Crawlee context.
   *
   * @param context - Crawlee crawling context
   * @returns Promise resolving to [FetchResponse] object
   *
   * @remarks
   * Converts implementation-specific context (Playwright `page` or Cheerio `$`) to standardized response.
   * @internal
   */
  protected abstract _buildResponse(context: TContext): Promise<FetchResponse>
  protected async buildResponse(context: TContext): Promise<FetchResponse> {
    const result = await this._buildResponse(context)
    const contentTypeHeader = result.headers['content-type'] || ''
    result.contentType = contentTypeHeader.split(';')[0].trim()
    if (this.opts?.output?.cookies !== false) {
      if (!result.cookies && context.session) {
        result.cookies = context.session.getCookies(context.request.url)
      }
    } else {
      delete result.cookies
    }

    if (this.opts?.output?.sessionState !== false) {
      if (this.crawler?.sessionPool) {
        result.sessionState = await this.crawler.sessionPool.getState()
      }
    } else {
      delete result.sessionState
    }

    if (this.opts?.debug) {
      result.metadata = {
        ...result.metadata,
        mode: this.mode,
        engine: this.id as any,
        proxy:
          (context as any).proxyInfo?.url ||
          (typeof this.opts.proxy === 'string'
            ? this.opts.proxy
            : Array.isArray(this.opts.proxy)
              ? this.opts.proxy[0]
              : undefined),
      }
    }

    return result
  }

  /**
   * Abstract method for executing action within current page context.
   *
   * @param context - Crawlee crawling context
   * @param action - Action to execute
   * @returns Promise resolving to action result
   *
   * @remarks
   * Handles specific user interactions using underlying technology (Playwright/Cheerio).
   * @internal
   */
  protected abstract executeAction(
    context: TContext,
    action: FetchEngineAction
  ): Promise<any>

  /**
   * Navigates to the specified URL.
   *
   * @param url - Target URL
   * @param params - Navigation options
   * @returns Promise resolving when navigation completes
   *
   * @example
   * ```ts
   * await engine.goto('https://example.com');
   * ```
   */
  abstract goto(
    url: string,
    params?: GotoActionOptions
  ): Promise<void | FetchResponse>

  /**
   * Waits for specified condition before continuing.
   *
   * @param params - Wait conditions
   * @returns Promise resolving when wait condition is met
   *
   * @example
   * ```ts
   * await engine.waitFor({ ms: 1000 }); // Wait 1 second
   * await engine.waitFor({ selector: '#content' }); // Wait for element
   * ```
   */
  waitFor(params?: WaitForActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'waitFor', options: params })
  }

  /**
   * Clicks on element matching selector.
   *
   * @param selector - CSS selector of element to click
   * @returns Promise resolving when click is processed
   * @throws {Error} When no active page context exists
   */
  click(selector: string): Promise<void> {
    return this.dispatchAction({ type: 'click', selector })
  }

  /**
   * Fills input element with specified value.
   *
   * @param selector - CSS selector of input element
   * @param value - Value to fill
   * @returns Promise resolving when fill operation completes
   * @throws {Error} When no active page context exists
   */
  fill(selector: string, value: string): Promise<void> {
    return this.dispatchAction({ type: 'fill', selector, value })
  }

  /**
   * Submits a form.
   *
   * @param selector - Optional form/submit button selector
   * @param options - Submission options
   * @returns Promise resolving when form is submitted
   * @throws {Error} When no active page context exists
   */
  submit(selector?: any, options?: SubmitActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options })
  }

  /**
   * Removes elements from the DOM based on selectors and presets.
   *
   * @param options - Trim options specifying selectors and presets
   * @returns Promise resolving when trim operation completes
   * @throws {Error} When no active page context exists
   */
  trim(options: TrimActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'trim', options })
  }

  /**
   * Pauses execution, allowing for manual intervention or inspection.
   *
   * @param message - Optional message to display during pause
   * @returns Promise resolving when execution is resumed
   * @throws {Error} When no active page context exists
   */
  pause(message?: string): Promise<void> {
    return this.dispatchAction({ type: 'pause', message })
  }

  /**
   * Extracts structured data from the current page content.
   *
   * @param schema - An object defining the data to extract.
   * @returns A promise that resolves to an object with the extracted data.
   */
  extract<T>(schema: ExtractSchema): Promise<T> {
    if (schema && typeof schema === 'object' && (schema as any).schema) {
      schema = (schema as any).schema
    }
    const normalizedSchema = this._normalizeSchema(schema)
    return this.dispatchAction({ type: 'extract', schema: normalizedSchema })
  }

  /**
   * Normalizes the extraction schema into a standard internal format.
   *
   * Handles shorthands:
   * 1. String: 'h1' => { selector: 'h1' }
   * 2. Implicit Object: { title: 'h1' } => { type: 'object', properties: { title: { selector: 'h1' } } }
   * 3. Array shorthands: { type: 'array', selector: 'li', attribute: 'href' } => { type: 'array', selector: 'li', items: { attribute: 'href' } }
   * 4. Filter shorthands: { selector: 'a', has: 'img' } => { selector: 'a:has(img)' }
   *
   * @param schema - The user-provided schema.
   * @returns A normalized ExtractSchema.
   */
  protected _normalizeSchema(schema: ExtractSchema): ExtractSchema {
    // 1. Handle String shorthand: 'h1' -> { selector: 'h1' }
    if (typeof schema === 'string') {
      return { selector: schema } as any
    }

    const newSchema = { ...(schema as any) }

    // 2. Handle Implicit Object shorthand:
    // If it's an object but doesn't have a 'type', and contains properties,
    // we convert it to an explicit 'object' type.
    if (this._isImplicitObject(newSchema)) {
      const properties: any = {}
      const contextKeys = new Set(['selector', 'has', 'exclude'])

      // We separate context-defining keys from data-defining keys.
      for (const key of Object.keys(newSchema)) {
        if (!contextKeys.has(key)) {
          // All other keys are treated as properties to be extracted.
          properties[key] = this._normalizeSchema(newSchema[key])
          delete newSchema[key]
        }
      }
      newSchema.type = 'object'
      newSchema.properties = properties
    } else {
      // 3. Recursively normalize explicit objects and arrays.
      if (newSchema.properties) {
        newSchema.properties = { ...newSchema.properties }
        for (const key in newSchema.properties) {
          newSchema.properties[key] = this._normalizeSchema(
            newSchema.properties[key]
          )
        }
      }
      if (newSchema.items) {
        newSchema.items = this._normalizeSchema(newSchema.items)
      }
    }

    // 4. Normalize Array shorthands:
    if (newSchema.type === 'array') {
      // If 'attribute' is provided on an array without 'items', it's a shorthand for extracting that attribute from each element.
      if (newSchema.attribute && !newSchema.items) {
        newSchema.items = { attribute: newSchema.attribute }
        delete newSchema.attribute
      }
      // Default array item extraction is 'string' (textContent).
      if (!newSchema.items) {
        newSchema.items = { type: 'string' }
      }
    }

    // 5. Normalize Filter shorthands (has/exclude):
    // Combines selector with :has() and :not() pseudo-classes for CSS engines that support them (or our internal emulation).
    if (newSchema.selector && (newSchema.has || newSchema.exclude)) {
      const { selector, has, exclude } = newSchema
      const finalSelector = selector
        .split(',')
        .map((s: string) => {
          let part = s.trim()
          if (has) part = `${part}:has(${has})`
          if (exclude) part = `${part}:not(${exclude})`
          return part
        })
        .join(', ')
      newSchema.selector = finalSelector
      delete newSchema.has
      delete newSchema.exclude
    }

    return newSchema
  }

  /**
   * Gets the unique identifier of this engine implementation.
   */
  get id() {
    return (this.constructor as typeof FetchEngine).id
  }

  /**
   * Returns the current state of the engine (cookies)
   * that can be used to restore the session later.
   */
  async getState(): Promise<{ cookies: Cookie[]; sessionState?: any }> {
    return {
      cookies: await this.cookies(),
      sessionState: await this.crawler?.sessionPool?.getState(),
    }
  }

  /**
   * Gets the execution mode of this engine (`'http'` or `'browser'`).
   */
  get mode() {
    return (this.constructor as typeof FetchEngine).mode
  }

  /**
   * Gets the fetch engine context associated with this instance.
   */
  get context() {
    return this.ctx
  }

  /**
   * Initializes the fetch engine with provided context and options.
   *
   * @param context - Fetch engine context
   * @param options - Configuration options
   * @returns Promise resolving when initialization completes
   *
   * @remarks
   * Sets up internal state and calls implementation-specific [_initialize](file:///home/riceball/Documents/mywork/public/@isdk/ai-tools/packages/web-fetcher/src/engine/cheerio.ts#L169-L204) method.
   * Automatically called when creating engine via `FetchEngine.create()`.
   */
  async initialize(
    context: FetchEngineContext,
    options?: BaseFetcherProperties
  ): Promise<void> {
    if (this.ctx) {
      return
    }
    // Deep merge the final resolved options back into the context,
    // so the context object always holds the most up-to-date data.
    merge(context, options)

    this.ctx = context
    this.opts = context // Use the merged context
    this.hdrs = normalizeHeaders(context.headers)
    this._initialCookies = [...(context.cookies ?? [])]
    if (!context.internal) {
      context.internal = {}
    }
    context.internal.engine = this
    context.engine = this.mode
    this.actionEmitter.setMaxListeners(100) // Set a higher limit to prevent memory leak warnings

    const storage = context.storage || {}
    const persistStorage = storage.persist ?? false
    const config = (this.config = new Configuration({
      persistStorage,
      storageClientOptions: {
        persistStorage,
        ...storage.config,
      },
      ...storage.config,
    }))
    const storeId = storage.id || context.id
    this.requestQueue = await RequestQueue.open(storeId, { config })

    const proxyUrls = this.opts?.proxy
      ? typeof this.opts.proxy === 'string'
        ? [this.opts.proxy]
        : this.opts.proxy
      : undefined
    if (proxyUrls?.length) {
      this.proxyConfiguration = new ProxyConfiguration({ proxyUrls })
    }

    const specificCrawlerOptions =
      await this._getSpecificCrawlerOptions(context)
    const sessionPoolOptions: any = defaultsDeep(
      {
        persistenceOptions: { enable: true, storeId: storeId },
        persistStateKeyValueStoreId: storeId,
      },
      context.sessionPoolOptions,
      {
        maxPoolSize: 1,
        sessionOptions: { maxUsageCount: 1000, maxErrorScore: 3 },
      }
    )
    if (context.sessionState) {
      if (context.cookies && context.cookies.length > 0) {
        console.warn(
          '[FetchEngine] Warning: Both "sessionState" and "cookies" are provided. Explicit "cookies" will override any conflicting cookies restored from "sessionState".'
        )
      }
    }

    const finalCrawlerOptions = {
      ...defaultsDeep(specificCrawlerOptions, {
        requestQueue: this.requestQueue,
        maxConcurrency: 1,
        minConcurrency: 1,
        useSessionPool: true,
        persistCookiesPerSession: true,
        sessionPoolOptions,
      }),
      // Force these handlers, they are critical for the engine's operation
      requestHandler: this._requestHandler.bind(this),
      errorHandler: this._failedRequestHandler.bind(this),
      failedRequestHandler: this._failedRequestHandler.bind(this),
    }

    if (!finalCrawlerOptions.preNavigationHooks) {
      finalCrawlerOptions.preNavigationHooks = []
    }
    finalCrawlerOptions.preNavigationHooks.unshift(
      (
        { crawler, session, request }: PlaywrightCrawlingContext,
        opts: PlaywrightGotoOptions
      ) => {
        this.currentSession = session
        if (session && !this._initializedSessions.has(session.id)) {
          if (this._initialCookies && this._initialCookies.length > 0) {
            const normalizedCookies = this._initialCookies.map((c) => {
              const cookie = { ...c }
              if ((cookie as any).sameSite === 'no_restriction') {
                cookie.sameSite = 'None'
              }
              return cookie
            })
            session.setCookies(normalizedCookies, request.url)
          }
          this._initializedSessions.add(session.id)
        }
      }
    )

    const crawler = (this.crawler = this._createCrawler(
      finalCrawlerOptions as TOptions,
      config
    ))
    const kvStore = (this.kvStore = await KeyValueStore.open(storeId, {
      config,
    }))
    const persistState = await kvStore.getValue(PERSIST_STATE_KEY)
    if (
      context.sessionState &&
      (!persistState || context.overrideSessionState)
    ) {
      await kvStore.setValue(PERSIST_STATE_KEY, context.sessionState)
    }

    this.isCrawlerReady = true
    this.crawlerRunPromise = crawler.run()
    this.crawlerRunPromise
      .finally(() => {
        this.isCrawlerReady = false
      })
      .catch((error) => {
        console.error('Crawler background error:', error)
      })
  }

  async cleanup(): Promise<void> {
    await this._cleanup?.()
    await this._commonCleanup()
    const context = this.ctx
    if (context) {
      if (context.internal?.engine === this) {
        context.internal.engine = undefined
      }
    }
    this.ctx = undefined
    this.opts = undefined
  }

  /**
   * Executes all pending fetch engine actions within the current Crawlee request handler context.
   *
   * **Critical Execution Constraint**: This method **MUST** be awaited within the synchronous execution path
   * of Crawlee's [requestHandler](https://crawlee.dev/js/api/basic-crawler) (before any `await` that yields control back to the event loop).
   *
   * ### Why This Constraint Exists
   * - Crawlee's page context ([PlaywrightCrawler](https://crawlee.dev/js/api/playwright-crawler)'s `page` or [CheerioCrawler](https://crawlee.dev/js/api/cheerio-crawler)'s `$`)
   *   is **only valid during the synchronous execution phase** of the request handler
   * - After any `await` (e.g., `await page.goto()`), the page context may be destroyed
   *   due to Crawlee's internal resource management
   *
   * ### How It Works
   * 1. Processes all actions queued via {@link dispatchAction} (click, fill, submit, etc.)
   * 2. Maintains the page context validity window via {@link isPageActive} lifecycle flag
   * 3. Automatically cleans up event listeners upon completion
   *
   * Usage see {@link _sharedRequestHandler}
   * @see {@link _sharedRequestHandler}
   * @param context The active Crawlee crawling context containing the page/$ object
   * @throws {Error} If called outside valid page context window (`!this.isPageActive`)
   * @internal Engine infrastructure method - not for direct consumer use
   */
  protected async _executePendingActions(context: TContext) {
    if (this.isEngineDisposed) return
    await new Promise<void>((resolveLoop) => {
      const listener = async ({
        action,
        resolve,
        reject,
      }: DispatchedEngineAction) => {
        try {
          if (action.type === 'dispose') {
            this.actionEmitter.emit('dispose')
            resolve()
            return
          }
          const result = await this.executeAction(context, action)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      const onDispose = () => {
        this.actionEmitter.removeListener('dispatch', listener)
        resolveLoop()
      }

      this.actionEmitter.on('dispatch', listener)
      this.actionEmitter.once('dispose', onDispose)

      if (this.isEngineDisposed) {
        onDispose()
        this.actionEmitter.removeListener('dispose', onDispose)
      }
    })
  }

  protected async _sharedRequestHandler(context: TContext): Promise<void> {
    const { request } = context
    this._logDebug(`Processing request: ${request.url}`)
    try {
      this.currentSession = context.session
      this.isPageActive = true

      const gotoPromise = this.pendingRequests.get(request.userData.requestId)
      if (gotoPromise) {
        const fetchResponse = await this.buildResponse(context)

        // If throwHttpErrors is enabled, check for failure conditions and reject if necessary.
        const isError =
          !fetchResponse.statusCode || fetchResponse.statusCode >= 400
        if (this.ctx?.throwHttpErrors && isError) {
          const error = new CommonError(
            `Request for ${fetchResponse.finalUrl} failed with status ${fetchResponse.statusCode || 'N/A'}`,
            'request',
            fetchResponse.statusCode
          )
          gotoPromise.reject(error)
        } else {
          this.lastResponse = fetchResponse
          gotoPromise.resolve(fetchResponse)
        }
        this.pendingRequests.delete(request.userData.requestId)
      }

      await this._executePendingActions(context)
    } finally {
      if (this.currentSession) {
        const cookies = this.currentSession.getCookies(request.url)
        if (cookies) {
          this._initialCookies = cookies
        }
      }
      this.isPageActive = false
      this.navigationLock.release()
    }
  }

  protected async _sharedFailedRequestHandler(
    context: TContext,
    error?: Error
  ): Promise<void> {
    const { request } = context
    const gotoPromise = this.pendingRequests.get(request.userData.requestId)
    if (gotoPromise && error && this.ctx?.throwHttpErrors) {
      this.pendingRequests.delete(request.userData.requestId)
      const response = (error as any).response
      const statusCode = response?.statusCode || 500
      const url = response?.url ? response.url : request.url
      const finalError = new CommonError(
        `Request${url ? ' for ' + url : ''} failed: ${error.message}`,
        'request',
        statusCode
      )
      gotoPromise.reject(finalError)
    }
    // By calling the original handler, we ensure cleanup (e.g. lock release) happens.
    // The original handler will not find the promise and that's OK.
    return this._sharedRequestHandler(context)
  }

  protected async dispatchAction<T>(action: FetchEngineAction): Promise<T> {
    if (!this.isPageActive) {
      throw new Error('No active page. Call goto() before performing actions.')
    }
    return new Promise<T>((resolve, reject) => {
      this.actionEmitter.emit('dispatch', { action, resolve, reject })
    })
  }

  private async _requestHandler(context: TContext): Promise<void> {
    await this._sharedRequestHandler(context)
  }

  private async _failedRequestHandler(
    context: TContext,
    error: Error
  ): Promise<void> {
    await this._sharedFailedRequestHandler(context, error)
  }

  protected async _commonCleanup() {
    this.isEngineDisposed = true
    this._initializedSessions.clear()
    this.actionEmitter.emit('dispose')
    this.navigationLock?.release()

    if (this.pendingRequests.size > 0) {
      for (const [, pendingRequest] of this.pendingRequests) {
        pendingRequest.reject(new Error('Cleanup:Request cancelled'))
      }
      this.pendingRequests.clear()
    }

    if (this.crawler) {
      try {
        await this.crawler.teardown?.()
      } catch (error) {
        console.error('crawler teardown error:', error)
      }
      this.crawler = undefined
    }
    this.crawlerRunPromise = undefined
    this.isCrawlerReady = undefined

    const storage = this.opts?.storage || {}
    const shouldPurge = storage.purge ?? true

    if (this.requestQueue) {
      if (shouldPurge) {
        await this.requestQueue
          .drop()
          .catch((err) => console.error('Error dropping requestQueue:', err))
      }
      this.requestQueue = undefined
    }

    if (this.kvStore) {
      if (shouldPurge) {
        await this.kvStore
          .drop()
          .catch((err) => console.error('Error dropping kvStore:', err))
      }
      this.kvStore = undefined
    }

    this.actionEmitter.removeAllListeners()
    this.pendingRequests.clear()
    this.config = undefined
  }

  /**
   * Blocks specified resource types from loading.
   *
   * @param types - Resource types to block
   * @param overwrite - Whether to replace existing blocked types
   * @returns Number of blocked resource types
   *
   * @example
   * ```ts
   * await engine.blockResources(['image', 'stylesheet']);
   * await engine.blockResources(['script'], true); // Replace existing
   * ```
   */
  async blockResources(types: ResourceType[], overwrite?: boolean) {
    if (overwrite) {
      this.blockedTypes.clear()
    }
    types.forEach((t) => this.blockedTypes.add(t))
    return types.length
  }

  /**
   * Gets content of current page.
   *
   * @returns Promise resolving to fetch response
   * @throws {Error} When no content has been fetched yet
   */
  getContent(): Promise<FetchResponse> {
    if (!this.lastResponse) {
      return Promise.reject(
        new Error('No content fetched yet. Call goto() first.')
      )
    }
    return Promise.resolve(this.lastResponse)
  }

  /**
   * Manages HTTP headers for requests with multiple overloads.
   *
   * @overload
   * Gets all headers.
   * @returns All headers as record
   *
   * @overload
   * Gets specific header value.
   * @param name - Header name
   * @returns Header value
   *
   * @overload
   * Sets multiple headers.
   * @param headers - Headers to set
   * @param replaced - Whether to replace all existing headers
   * @returns `true` if successful
   *
   * @overload
   * Sets single header.
   * @param name - Header name
   * @param value - Header value or `null` to remove
   * @returns `true` if successful
   *
   * @example
   * ```ts
   * const allHeaders = await engine.headers();
   * const userAgent = await engine.headers('user-agent');
   * await engine.headers({ 'x-custom': 'value' });
   * await engine.headers('auth', 'token');
   * ```
   */
  async headers(): Promise<Record<string, string>>
  async headers(name: string): Promise<string>
  async headers(
    headers: Record<string, string>,
    replaced?: boolean
  ): Promise<boolean>
  async headers(name: string, value: string | null): Promise<boolean>
  async headers(
    nameOrHeaders?: string | Record<string, string>,
    value?: string | boolean | null
  ): Promise<Record<string, string> | string | boolean> {
    if (nameOrHeaders === undefined) {
      return { ...this.hdrs }
    }

    if (typeof nameOrHeaders === 'string' && value === undefined) {
      return this.hdrs[nameOrHeaders.toLowerCase()] || ''
    }

    if (nameOrHeaders !== null && typeof nameOrHeaders === 'object') {
      const normalized: Record<string, string> = {}
      for (const [k, v] of Object.entries(nameOrHeaders)) {
        normalized[k.toLowerCase()] = String(v)
      }
      if (value === true) {
        this.hdrs = normalized
      } else {
        this.hdrs = { ...this.hdrs, ...normalized }
      }
      return true
    }

    if (typeof nameOrHeaders === 'string') {
      if (typeof value === 'string') {
        this.hdrs[nameOrHeaders.toLowerCase()] = value
      } else if (value === null) {
        delete this.hdrs[nameOrHeaders.toLowerCase()]
      }
      return true
    }
    return false
  }

  /**
   * Manages cookies for current session with multiple overloads.
   *
   * @overload
   * Gets all cookies.
   * @returns Array of cookies
   *
   * @overload
   * Sets cookies for session.
   * @param cookies - Cookies to set
   * @returns `true` if successful
   *
   * @example
   * ```ts
   * const cookies = await engine.cookies();
   * await engine.cookies([{ name: 'session', value: '123' }]);
   * ```
   */
  async cookies(): Promise<Cookie[]>
  async cookies(cookies: Cookie[]): Promise<boolean>
  async cookies(a?: any): Promise<any> {
    const url = this.lastResponse?.url || ''
    if (Array.isArray(a)) {
      if (this.currentSession) {
        this.currentSession.setCookies(a, url)
      } else {
        this._initialCookies = [...a]
      }
      return true
    } else if (a === null) {
      if (this.currentSession) {
        // Not straightforward to clear cookies in Session,
        // usually overwriting with empty array or expired cookies works
        // But Crawlee Session doesn't have explicit clearCookies() public API easily accessible for all?
        // Actually, setCookies([]) doesn't clear.
        // We might need to iterate and delete?
        // For now, let's just reset our initial cookies buffer or warn.
        // Implementing 'clear' fully via Session might require accessing internal jar.
      }
      this._initialCookies = []
      return true
    }
    if (this.currentSession) {
      const cookies = this.currentSession.getCookies(url)
      return cookies
    }
    return [...(this._initialCookies || [])]
  }

  /**
   * Disposes of engine, cleaning up all resources.
   *
   * @returns Promise resolving when disposal completes
   */
  async dispose(): Promise<void> {
    await this.cleanup()
  }

  // 能力协商（动作层可打标：native/simulate/noop）
  // abstract capabilityOf(actionName: string): FetchActionCapabilityMode;
}
