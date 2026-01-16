import { CommonError } from '@isdk/common-error'
import { normalizeExtractSchema } from './normalize-extract-schema'

/**
 * Represents the engine-specific execution scope (e.g., a Cheerio node or a Playwright Locator).
 * It acts as the target for extraction and interaction actions.
 */
export type FetchElementScope = any

/**
 * Interface representing the minimal engine capabilities required for extraction.
 *
 * @remarks
 * This interface abstracts the underlying DOM manipulation library (Cheerio or Playwright).
 * Implementing classes must ensure consistent behavior across different engines, especially
 * regarding scope handling (Element vs Array of Elements) and DOM traversal.
 */
export interface IExtractEngine {
  /**
   * Finds all elements matching the selector within the given scope.
   *
   * @param scope - The context to search in. Can be a single element or an array of elements (e.g., in segmented mode).
   * @param selector - The CSS selector to match.
   * @returns A promise resolving to an array of found element scopes.
   *
   * @remarks
   * **Behavior Contract:**
   * 1. **Descendants**: It MUST search for descendants matching the selector within the scope.
   * 2. **Self-Matching**: It MUST check if the scope element(s) *themselves* match the selector.
   * 3. **Array Scope**: If `scope` is an array:
   *    - It MUST process elements in the order they appear in the array (which should match document order).
   *    - It MUST perform the check (Self + Descendants) for *each* element in the array.
   *    - It MUST flatten the results into a single array.
   *    - It SHOULD dedup the results if the engine's query mechanism naturally produces duplicates (e.g. nested scopes),
   *      but generally, preserving document order is the priority.
   */
  _querySelectorAll(
    scope: FetchElementScope,
    selector: string
  ): Promise<FetchElementScope[]>

  /**
   * Extracts a primitive value from the element based on the schema configuration.
   *
   * @param schema - The value extraction schema defining `type`, `mode`, and `attribute`.
   * @param scope - The specific element to extract data from.
   * @returns A promise resolving to the extracted value (string, number, boolean, or null).
   *
   * @remarks
   * **Behavior Contract:**
   * - **Attribute**: If `schema.attribute` is set, returns the attribute value. If missing, returns `null` or empty string based on engine.
   * - **HTML**: If `schema.mode` is 'html', returns `innerHTML`.
   * - **OuterHTML**: If `schema.mode` is 'outerHTML', returns `outerHTML`.
   * - **Text**: If `schema.mode` is 'text', returns `textContent` (trimmed by default in most implementations).
   * - **InnerText**: If `schema.mode` is 'innerText', returns rendered text (visual approximation in Cheerio).
   */
  _extractValue(
    schema: ExtractValueSchema,
    scope: FetchElementScope
  ): Promise<any>

  /**
   * Gets the parent element of the given scope.
   *
   * @param scope - The element to find the parent of.
   * @returns A promise resolving to the parent element scope, or `null` if the element is root or detached.
   */
  _parentElement(scope: FetchElementScope): Promise<FetchElementScope | null>

  /**
   * Checks if two element scopes refer to the exact same DOM node.
   *
   * @param scope1 - The first element scope.
   * @param scope2 - The second element scope.
   * @returns A promise resolving to `true` if they are the same node, `false` otherwise.
   *
   * @remarks
   * This comparison MUST be identity-based, not just content-based.
   */
  _isSameElement(
    scope1: FetchElementScope,
    scope2: FetchElementScope
  ): Promise<boolean>

  /**
   * Retrieves all subsequent sibling elements of the `scope` element, stopping *before* the first sibling that matches `untilSelector`.
   *
   * @param scope - The anchor element (starting point). The returned list starts *after* this element.
   * @param untilSelector - Optional. A CSS selector. If provided, the scanning stops when a sibling matches this selector (exclusive).
   *                        If omitted or null, returns all following siblings.
   * @returns A promise resolving to an array of sibling element scopes.
   *
   * @remarks
   * **Behavior Contract:**
   * - **Starting Point**: The `scope` element itself IS NOT included in the result.
   * - **Ending Point**: The element matching `untilSelector` IS NOT included in the result.
   * - **Direction**: Only scans *following* siblings (next siblings).
   * - **Flattening**: The result is a flat list of siblings, not a nested structure.
   */
  _nextSiblingsUntil(
    scope: FetchElementScope,
    untilSelector?: string
  ): Promise<FetchElementScope[]>

  /**
   * Finds the closest ancestor of the `scope` element (including the element itself) that is present in the `candidates` array.
   *
   * @param scope - The starting element from which to ascend the DOM tree.
   * @param candidates - An array of potential ancestor elements to check against.
   * @returns A promise resolving to the matching candidate element from the array, or `null` if no match is found.
   *
   * @remarks
   * **Performance Critical**: This method is a key optimization for "bubbling up" logic (e.g., in Segmented extraction).
   * It effectively answers: "Which of these container candidates does my current element belong to?"
   *
   * **Implementation Guidelines**:
   * - **Cheerio**: Should use a `Set` for O(1) candidate lookup during tree traversal (Total O(Depth)).
   * - **Playwright**: Should perform the entire traversal within a single `page.evaluate` call to avoid O(Depth) IPC round-trips.
   */
  _findClosestAncestor(
    scope: FetchElementScope,
    candidates: FetchElementScope[]
  ): Promise<FetchElementScope | null>

  /**
   * Checks if the `container` element contains the `element` (descendant).
   *
   * @param container - The potential ancestor element.
   * @param element - The potential descendant element.
   * @returns A promise resolving to `true` if `container` contains `element`, `false` otherwise.
   *
   * @remarks
   * **Standard Compliance**: This mirrors the DOM [Node.contains()](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains) behavior.
   *
   * @performance-critical Used extensively in boundary checks for Segmented extraction.
   * - **Playwright**: MUST use `elementHandle.evaluate` to use native `Node.contains` in the browser context, reducing IPC overhead.
   * - **Cheerio**: Should use efficient lookups like `$.contains` or `.find()`.
   */
  _contains(
    container: FetchElementScope,
    element: FetchElementScope
  ): Promise<boolean>

  /**
   * Finds the Lowest Common Ancestor (LCA) of two element scopes.
   *
   * @param scope1 - The first element.
   * @param scope2 - The second element.
   * @returns A promise resolving to the LCA element, or null if they are in different documents/trees.
   *
   * @remarks
   * This is a fundamental tree operation used to find the point where two element paths diverge.
   * **Performance Critical**: For Playwright, this MUST be implemented in a single `evaluate` call.
   */
  _findCommonAncestor(
    scope1: FetchElementScope,
    scope2: FetchElementScope
  ): Promise<FetchElementScope | null>

  /**
   * Finds the direct child of the `container` that contains the `element` (or is the `element` itself).
   *
   * @param element - The descendant element.
   * @param container - The ancestor container.
   * @returns A promise resolving to the child element, or null if `element` is not a descendant of `container`.
   *
   * @remarks
   * This method traverses up from `element` until it finds the node whose parent is `container`.
   * **Performance Critical**: This replaces the manual bubble-up loop in Node.js.
   */
  _findContainerChild(
    element: FetchElementScope,
    container: FetchElementScope
  ): Promise<FetchElementScope | null>

  /**
   * Logs debug information if debug mode is enabled.
   * @param args - Arguments to log.
   */
  _logDebug(...args: any[]): void
}
const MAX_DOM_DEPTH = 1000
/**
 * Public entry point for structured data extraction.
 *
 * This function normalizes the input schema and initiates the recursive extraction process.
 *
 * @param this - The engine instance (Cheerio or Playwright).
 * @param schema - The raw extraction schema or a shortcut.
 * @param scope - The initial DOM scope (usually the document root).
 * @param parentStrict - Internal use: inherited strict mode from parent.
 * @returns A promise resolving to the extracted structured data.
 */
export async function extract(
  this: IExtractEngine,
  schema: any,
  scope: FetchElementScope,
  parentStrict?: boolean
): Promise<any> {
  const normalizedSchema = normalizeExtractSchema(schema)
  return _extract.call(this, normalizedSchema, scope, parentStrict)
}

/**
 * The core recursive extraction logic.
 *
 * Handles three main types of extraction:
 * 1. **Object**: Extracts multiple properties, supporting anchors and sequential scanning.
 * 2. **Array**: Extracts lists of items using nested, columnar, or segmented modes.
 * 3. **Value**: Extracts primitive data (text, HTML, attributes) from elements.
 *
 * @param this - The engine instance.
 * @param schema - The normalized extraction schema.
 * @param scope - The current execution context (single element or array of elements).
 * @param parentStrict - Whether to throw errors on missing required fields.
 * @returns A promise resolving to the extracted value, object, or array.
 *
 * @internal
 */
export async function _extract(
  this: IExtractEngine,
  schema: ExtractSchema,
  scope: FetchElementScope,
  parentStrict?: boolean
): Promise<any> {
  const schemaType = (schema as any).type
  const schemaSelector = (schema as any).selector
  const strict = (schema as any).strict ?? parentStrict

  if (!scope) {
    this._logDebug(
      `_extract: No scope for selector "${schemaSelector || ''}", type "${schemaType || 'value'}"`
    )
    return schemaType === 'array' ? [] : null
  }

  switch (schemaType) {
    case 'object':
      return _extractObject.call(
        this,
        schema as ExtractObjectSchema,
        scope,
        strict
      )
    case 'array':
      return _extractArray.call(
        this,
        schema as ExtractArraySchema,
        scope,
        strict
      )
    default:
      return _extractValue.call(
        this,
        schema as ExtractValueSchema,
        scope,
        strict
      )
  }
}

/**
 * Extracts an object with multiple properties.
 *
 * This function handles:
 * 1. **Scope Resolution**: Finding the root element of the object if a selector is provided.
 * 2. **Property Iteration**: Extracting each property defined in the schema.
 * 3. **Anchor Handling**: Adjusting the search scope for fields that specify an `anchor`.
 * 4. **Sequential Scanning**: Advancing the cursor for `relativeTo: 'previous'` mode.
 * 5. **Field Tracking**: Storing elements of extracted fields for subsequent anchor references.
 *
 * @param schema - The object extraction schema.
 * @param scope - The parent DOM scope.
 * @param strict - Whether to inherit strict mode.
 * @returns A promise resolving to the extracted object, or null if not found/empty.
 * @internal
 */
async function _extractObject(
  this: IExtractEngine,
  schema: ExtractObjectSchema,
  scope: FetchElementScope,
  strict?: boolean
): Promise<any> {
  const {
    selector,
    properties,
    strict: objectStrict,
    relativeTo,
    order,
  } = schema
  const finalStrict = objectStrict ?? strict
  const skipSelector = (schema as any)._skipSelector
  let newScope = scope

  if (selector && !skipSelector) {
    const elements = await this._querySelectorAll(scope, selector)
    newScope = elements.length > 0 ? elements[0] : null
    if (newScope && schema.depth !== undefined) {
      newScope = await _bubbleUpToScope.call(
        this,
        newScope,
        scope,
        schema.depth
      )
    }
    this._logDebug(
      `_extractObject: selector "${selector}" found ${elements.length} elements`
    )
  }

  if (!newScope) {
    this._logDebug(
      `_extractObject: scope not found for selector "${selector || ''}"`
    )
    if (finalStrict && schema.required) {
      throw new CommonError(
        `Required object "${selector || ''}" is missing.`,
        'extract'
      )
    }
    return null
  }

  const result: Record<string, any> = {}
  let hasValue = false
  const keys = order || Object.keys(properties)
  let currentWorkingScope = newScope
  const fieldElements = new Map<string, FetchElementScope>()
  const isSequential = relativeTo === 'previous'

  for (const key of keys) {
    const propSchema = properties[key]
    if (!propSchema) continue

    this._logDebug(`_extractObject: extracting property "${key}"`)

    let scopeForField = currentWorkingScope
    if (propSchema.anchor) {
      const anchorResult = await _resolveAnchorScope.call(
        this,
        propSchema.anchor,
        properties,
        fieldElements,
        newScope,
        isSequential,
        propSchema.depth
      )
      if (anchorResult) {
        scopeForField = anchorResult.scopeForField
        if (isSequential) {
          currentWorkingScope = scopeForField
        }
      } else if (finalStrict) {
        throw new CommonError(
          `Anchor "${propSchema.anchor}" not found or out of scope.`,
          'extract'
        )
      }
    }

    let value: any
    let extractedElement: FetchElementScope = null
    const propSelector = (propSchema as any).selector
    const isArrayField = propSchema.type === 'array'

    if (propSelector) {
      let matches = await this._querySelectorAll(scopeForField, propSelector)
      if (matches.length > 0) {
        if (propSchema.depth !== undefined) {
          matches = await Promise.all(
            matches.map((m) =>
              _bubbleUpToScope.call(this, m, scopeForField, propSchema.depth)
            )
          )
        }
        extractedElement = matches[0]
        const tempSchema = { ...propSchema, _skipSelector: true } as any
        value = await _extract.call(
          this,
          tempSchema,
          isArrayField ? matches : extractedElement,
          finalStrict
        )

        if (isSequential && !propSchema.anchor) {
          const matchToSliceAfter =
            isArrayField && Array.isArray(value)
              ? matches[matches.length - 1]
              : extractedElement
          currentWorkingScope = await _sliceSequentialScope.call(
            this,
            matchToSliceAfter,
            currentWorkingScope
          )
        }

        if (isArrayField) {
          extractedElement = matches[matches.length - 1]
        }
      } else {
        value = null
      }
    } else {
      value = await _extract.call(this, propSchema, scopeForField, finalStrict)
      if (value !== null) {
        extractedElement = Array.isArray(scopeForField)
          ? scopeForField[0]
          : scopeForField
      }
    }

    if (extractedElement) {
      fieldElements.set(key, extractedElement)
    }

    if (value === null && (propSchema as any).required) {
      if (finalStrict) {
        throw new CommonError(
          `Required property "${key}" is missing.`,
          'extract'
        )
      }
      return null
    }
    if (value !== null) {
      hasValue = true
    }
    result[key] = value
  }

  if (!selector && !hasValue && Object.keys(properties).length > 0) {
    return null
  }
  return result
}

/**
 * Extracts an array of items.
 *
 * This function dispatches the extraction to different modes:
 * 1. **Columnar**: Aligns multiple value matches by index into objects.
 * 2. **Segmented**: Splits the container into segments using an anchor element.
 * 3. **Nested (Default)**: Recursively extracts items from each matched element.
 *
 * It correctly handles `skipSelector` to avoid redundant queries when elements
 * have been pre-selected by a parent object.
 *
 * @param schema - The array extraction schema.
 * @param scope - The parent DOM scope.
 * @param strict - Whether to inherit strict mode.
 * @returns A promise resolving to the array of extracted items.
 * @internal
 */
async function _extractArray(
  this: IExtractEngine,
  schema: ExtractArraySchema,
  scope: FetchElementScope,
  strict?: boolean
): Promise<any[]> {
  const { selector, items, mode, strict: arrayStrict } = schema
  const finalStrict = arrayStrict ?? strict
  const skipSelector = (schema as any)._skipSelector
  let elements =
    selector && !skipSelector
      ? await this._querySelectorAll(scope, selector)
      : Array.isArray(scope)
        ? scope
        : [scope]

  if (selector && !skipSelector && schema.depth !== undefined) {
    elements = await Promise.all(
      elements.map((e) => _bubbleUpToScope.call(this, e, scope, schema.depth))
    )
  }

  this._logDebug(
    `_extractArray: selector "${selector || ''}" found ${elements.length} elements`
  )

  const normalizedMode = _normalizeArrayMode.call(this, mode)
  if (finalStrict !== undefined && normalizedMode.strict === undefined) {
    normalizedMode.strict = finalStrict
  }

  if (
    (!mode || normalizedMode.type === 'columnar') &&
    elements.length === 1 &&
    items
  ) {
    this._logDebug('_extractArray: trying columnar extraction')
    const results = await _extractColumnar.call(
      this,
      items,
      elements[0],
      normalizedMode
    )
    if (results) return results
  }

  if (normalizedMode.type === 'segmented' && items) {
    this._logDebug(
      `_extractArray: trying segmented extraction for ${elements.length} containers`
    )
    const allResults: any[] = []
    let success = false

    for (const element of elements) {
      const results = await _extractSegmented.call(
        this,
        items,
        element,
        normalizedMode
      )
      if (results) {
        success = true
        allResults.push(...results)
      }
    }
    if (success) return allResults
  }

  this._logDebug(
    `_extractArray: using nested extraction for ${elements.length} elements`
  )
  return _extractNested.call(this, items!, elements, {
    strict: normalizedMode.strict,
  })
}

/**
 * Extracts a single primitive value (string, number, boolean, or HTML).
 *
 * This function locates the target element and delegates the actual data
 * retrieval to the engine's `_extractValue` implementation.
 *
 * @param schema - The value extraction schema.
 * @param scope - The parent DOM scope.
 * @param strict - Whether to inherit strict mode.
 * @returns A promise resolving to the extracted primitive value, or null if not found.
 * @internal
 */
async function _extractValue(
  this: IExtractEngine,
  schema: ExtractValueSchema,
  scope: FetchElementScope,
  strict?: boolean
): Promise<any> {
  const { selector } = schema
  const skipSelector = (schema as any)._skipSelector
  const finalStrict = schema.strict ?? strict
  let elementToExtract = scope

  if (selector && !skipSelector) {
    const elements = await this._querySelectorAll(scope, selector)
    elementToExtract = elements.length > 0 ? elements[0] : null
    if (elementToExtract && schema.depth !== undefined) {
      elementToExtract = await _bubbleUpToScope.call(
        this,
        elementToExtract,
        scope,
        schema.depth
      )
    }
    this._logDebug(
      `_extractValue: selector "${selector}" found ${elements.length} elements`
    )
  } else if (Array.isArray(scope)) {
    elementToExtract = scope.length > 0 ? scope[0] : null
  }

  if (!elementToExtract) {
    this._logDebug(
      `_extractValue: element not found for selector "${selector || ''}"`
    )
    if (finalStrict && schema.required) {
      throw new CommonError(
        `Required value "${selector || ''}" is missing.`,
        'extract'
      )
    }
    return null
  }

  const result = await this._extractValue(schema, elementToExtract)
  this._logDebug(
    `_extractValue: extracted for selector "${selector || ''}":`,
    result
  )
  return result
}

/**
 * Normalizes the array extraction mode into an options object.
 */
export function _normalizeArrayMode(
  this: IExtractEngine,
  mode?: ExtractArrayMode
): { type: ExtractArrayModeName } & any {
  if (!mode) return { type: 'nested' }
  if (typeof mode === 'string') return { type: mode }
  return mode
}

/**
 * Performs standard nested array extraction.
 */
export async function _extractNested(
  this: IExtractEngine,
  items: ExtractSchema,
  elements: any[],
  opts?: { strict?: boolean }
): Promise<any[]> {
  const results: any[] = []
  const isRequired = (items as any).required
  const strict = opts?.strict === true
  const isComplex =
    (items as any).type === 'object' || (items as any).type === 'array'

  for (const element of elements) {
    const result = await _extract.call(this, items, element, strict)
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
 * This mode is optimized for speed by aligning multiple independent value matches into objects.
 * It features:
 * 1. **Index Alignment**: Matches from different fields are paired by their document order index.
 * 2. **Broadcasting**: Fields with a single match that equals the container are "broadcast" to all rows.
 * 3. **Heuristic Inference**: When counts mismatch, it attempts to identify common item wrappers
 *    using an optimized ancestor search to recover the list structure.
 * 4. **Performance Optimized**: Broadcast checks and alignment calculations are pre-computed to minimize RPC calls.
 */
export async function _extractColumnar(
  this: IExtractEngine,
  schema: ExtractSchema,
  container: any,
  opts?: ColumnarOptions
): Promise<any[] | null> {
  const isObject = schema.type === 'object'
  const strict = opts?.strict === true
  const inference = opts?.inference === true

  if (isObject) {
    const properties = (schema as ExtractObjectSchema).properties

    const keys = Object.keys(properties)
    if (keys.length === 0) return null

    const collectedValues: Record<string, any[]> = {}
    const collectedMatches: Record<string, any[]> = {}
    let commonCount: number | null = null
    let maxCount = 0
    let maxCountMatches: any[] = []

    for (const key of keys) {
      const propSchema = properties[key] as ExtractSchema
      if (propSchema.type === 'array' || propSchema.type === 'object') {
        this._logDebug(
          `_extractColumnar: field "${key}" has nested structure, columnar not supported`
        )
        return null
      }

      const valueSchema = propSchema as ExtractValueSchema
      let matches: any[] = []

      if (valueSchema.selector) {
        matches = await this._querySelectorAll(container, valueSchema.selector)
      } else {
        matches = [container]
      }
      collectedMatches[key] = matches

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
          this._logDebug(`_extractColumnar: set commonCount to ${commonCount}`)
        } else if (commonCount !== count) {
          this._logDebug(
            `_extractColumnar: count mismatch for field "${key}": ${count} vs ${commonCount}`
          )
          if (inference && maxCount > 1) {
            commonCount = -1
            this._logDebug('_extractColumnar: mismatch marked for inference')
          } else if (strict) {
            // Check if it's a broadcastable field (only 1 match and it's the container)
            const isBroadcastable =
              count === 1 && (await this._isSameElement(matches[0], container))
            if (!isBroadcastable) {
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
      }

      const values = await Promise.all(
        matches.map((m) => this._extractValue(valueSchema, m))
      )
      this._logDebug(`_extractColumnar: field "${key}" values:`, values)
      collectedValues[key] = values
    }

    if (
      inference &&
      commonCount === -1 &&
      maxCount > 1 &&
      maxCountMatches.length > 0
    ) {
      // Use the engine's optimized ancestor search to find item wrappers
      const itemWrappers: any[] = []
      for (const match of maxCountMatches) {
        const wrapper = await this._findContainerChild(match, container)
        if (wrapper) {
          itemWrappers.push(wrapper)
        }
      }

      const uniqueWrappers: any[] = []
      for (const w of itemWrappers) {
        const existing = await this._findClosestAncestor(w, uniqueWrappers)
        if (!existing) {
          uniqueWrappers.push(w)
        }
      }

      if (uniqueWrappers.length > 1) {
        return _extractNested.call(this, schema, uniqueWrappers, { strict })
      }
    }

    if (maxCount <= 1) return null
    if (commonCount === -1 && strict) return null

    const resultCount = strict && commonCount !== -1 ? commonCount! : maxCount

    // Pre-calculate broadcastable flags to avoid RPC calls in the loop
    const broadcastFlags: Record<string, boolean> = {}
    if (resultCount > 1) {
      for (const key of keys) {
        const vals = collectedValues[key]
        if (vals.length === 1) {
          const propSchema = properties[key] as any
          const isBroadcastable =
            !propSchema.selector ||
            (await this._isSameElement(collectedMatches[key][0], container))
          if (isBroadcastable) {
            broadcastFlags[key] = true
          }
        }
      }
    }

    const results: any[] = []
    for (let i = 0; i < resultCount; i++) {
      const obj: Record<string, any> = {}
      let skipRow = false
      for (const key of keys) {
        const vals = collectedValues[key]
        const propSchema = properties[key] as any
        let val = vals[i]
        if (broadcastFlags[key]) {
          val = vals[0]
        }

        if (val === undefined) {
          val = null
        }

        if (val === null && propSchema.required) {
          this._logDebug(
            `_extractColumnar: skipping row ${i} because required field "${key}" is null`
          )
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
 */
export async function _extractSegmented(
  this: IExtractEngine,
  schema: ExtractSchema,
  container: any,
  opts?: SegmentedOptions
): Promise<any[] | null> {
  const isObject = schema.type === 'object'
  if (!isObject) return null

  const properties = (schema as ExtractObjectSchema).properties

  const keys = Object.keys(properties)
  if (keys.length === 0) return null

  let anchorSelector: string | undefined
  if (opts?.anchor) {
    anchorSelector = properties[opts.anchor]?.selector || opts.anchor
  } else {
    // Find the first property that has a selector
    for (const key of keys) {
      if ((properties[key] as any).selector) {
        anchorSelector = (properties[key] as any).selector
        break
      }
    }
  }

  if (!anchorSelector) {
    this._logDebug(
      '_extractSegmented: no anchor selector found, falling back to nested'
    )
    return null
  }

  const anchorElements = await this._querySelectorAll(container, anchorSelector)
  this._logDebug(
    `_extractSegmented: anchor selector "${anchorSelector}" found ${anchorElements.length} elements`
  )
  if (anchorElements.length === 0) {
    if (opts?.strict) {
      throw new CommonError(
        `Segmented extraction failed: no elements found for anchor selector "${anchorSelector}".`,
        'extract'
      )
    }
    return []
  }

  const results: any[] = []
  for (let i = 0; i < anchorElements.length; i++) {
    const anchor = anchorElements[i]
    const prevAnchor = i > 0 ? anchorElements[i - 1] : null
    const nextAnchor =
      i < anchorElements.length - 1 ? anchorElements[i + 1] : null

    // "Bubble Up" strategy:
    // Identify the highest ancestor that does not conflict with neighbors.
    let bestScope = anchor
    let conflictLCA: FetchElementScope | null = null

    if (prevAnchor) {
      conflictLCA = await this._findCommonAncestor(anchor, prevAnchor)
    }
    if (!conflictLCA && nextAnchor) {
      conflictLCA = await this._findCommonAncestor(anchor, nextAnchor)
    } else if (conflictLCA && nextAnchor) {
      // If we already have a conflict with prev, check if next is even closer
      const nextLCA = await this._findCommonAncestor(anchor, nextAnchor)
      if (nextLCA && (await this._contains(conflictLCA, nextLCA))) {
        // nextLCA is a descendant of conflictLCA, so it's a tighter constraint
        conflictLCA = nextLCA
      }
    }

    if (conflictLCA) {
      // The container is the child of conflictLCA that leads to anchor
      const bubbled = await _bubbleUpToScope.call(
        this,
        anchor,
        conflictLCA,
        opts?.depth
      )
      if (bubbled && !(await this._isSameElement(bubbled, anchor))) {
        bestScope = bubbled
      }
    } else {
      // No neighbor conflict (e.g. single item), try to bubble up to container
      const bubbled = await _bubbleUpToScope.call(
        this,
        anchor,
        container,
        opts?.depth
      )
      if (bubbled) {
        bestScope = bubbled
      }
    }

    let segmentContext: any
    if (await this._isSameElement(bestScope, anchor)) {
      // Flat structure (or conflict immediately): use siblings scanning
      const segment = await this._nextSiblingsUntil(anchor, anchorSelector)
      segmentContext = [anchor, ...segment]
      this._logDebug(
        `_extractSegmented: segment ${i} (flat) created with ${segmentContext.length} elements`
      )
    } else {
      // Nested structure: use the bubbled-up container
      segmentContext = bestScope
      this._logDebug(
        `_extractSegmented: segment ${i} (nested) identified as container element`
      )
    }

    // Inject relativeTo from options if not set in schema
    const itemSchema = { ...schema } as ExtractObjectSchema
    if (opts?.relativeTo && !itemSchema.relativeTo) {
      itemSchema.relativeTo = opts.relativeTo
    }
    const result = await _extract.call(
      this,
      itemSchema,
      segmentContext,
      opts?.strict
    )
    const isRequired = (schema as any).required
    const isComplex =
      (schema as any).type === 'object' || (schema as any).type === 'array'

    if (result !== null) {
      results.push(result)
    } else if (isRequired && opts?.strict) {
      throw new CommonError('Required item is missing in array.', 'extract')
    } else if (!isRequired && !isComplex) {
      results.push(null)
    }
  }

  return results
}

/**
 * Finds the logical container of an element within a given scope.
 *
 * - If `scope` is an array (e.g., list of siblings), it returns the sibling that contains `element`.
 * - If `scope` is a single element, it returns the direct child of `scope` that contains `element`.
 *
 * This is crucial for "Segmented" and "Sequential" modes to identify which "slot" or "segment"
 * an element belongs to.
 *
 * @param element - The deep element to bubble up from.
 * @param scope - The boundary scope to stop at.
 * @param maxDepth - Optional. Maximum number of levels to bubble up.
 * @returns The direct child/item of scope that contains the element, or null if not found.
 */
async function _bubbleUpToScope(
  this: IExtractEngine,
  element: FetchElementScope,
  scope: FetchElementScope | FetchElementScope[],
  maxDepth?: number
): Promise<FetchElementScope | null> {
  const isScopeArray = Array.isArray(scope)
  const scopeItems = isScopeArray ? scope : [scope]

  // Performance Optimization: Use the engine's optimized ancestor search
  const target = isScopeArray
    ? await this._findClosestAncestor(element, scopeItems)
    : await this._findContainerChild(element, scope)

  if (maxDepth === undefined || !target) return target

  // Cap the bubbling by maxDepth
  let current = element
  for (let i = 0; i < maxDepth; i++) {
    if (await this._isSameElement(current, target)) break

    const parent = await this._parentElement(current)
    if (!parent || !(await this._contains(target, parent))) break
    current = parent
  }
  return current
}

/**
 * Resolves the search scope for a field based on its `anchor` configuration.
 *
 * It supports:
 * 1. **Field Reference**: Using the DOM element of a previously extracted field as the anchor.
 * 2. **Selector**: Querying a new anchor element within the current object's root scope.
 *
 * Once the anchor is found, it finds the effective sibling/child and returns all following siblings.
 *
 * @param anchor - The field name or CSS selector for the anchor.
 * @param properties - The schema definitions of the current object.
 * @param fieldElements - Map of elements already extracted in the current object.
 * @param rootScope - The root element of the current object.
 * @param isSequential - Whether we are in 'previous' mode (used for logging context).
 * @param maxDepth - Optional. Maximum number of levels to bubble up from the anchor.
 * @returns An object containing the new scope (following siblings), or null if resolution fails.
 */
async function _resolveAnchorScope(
  this: IExtractEngine,
  anchor: string,
  properties: Record<string, ExtractSchema>,
  fieldElements: Map<string, FetchElementScope>,
  rootScope: FetchElementScope,
  isSequential: boolean,
  maxDepth?: number
): Promise<{ scopeForField: FetchElementScope[] } | null> {
  let anchorElement: FetchElementScope = null
  const isFieldRef = properties.hasOwnProperty(anchor)

  if (isFieldRef) {
    anchorElement = fieldElements.get(anchor) || null
  } else {
    const anchors = await this._querySelectorAll(rootScope, anchor)
    if (anchors.length > 0) {
      anchorElement = anchors[0]
    }
  }

  if (anchorElement) {
    const scopes: FetchElementScope[] = []
    let current = anchorElement
    let d = 0
    const maxD = maxDepth !== undefined ? maxDepth : MAX_DOM_DEPTH

    // Collect subsequent siblings from the anchor up to the rootScope
    while (current && d <= maxD) {
      // Get siblings following the current element
      const siblings = await this._nextSiblingsUntil(current)
      scopes.push(...siblings)

      // Move up to parent
      const parent = await this._parentElement(current)
      if (!parent) break

      // Stop if we hit the root scope (or one of the root scope items)
      const isRoot = Array.isArray(rootScope)
        ? (await this._findClosestAncestor(parent, rootScope)) !== null
        : await this._isSameElement(parent, rootScope)

      if (isRoot) break
      current = parent
      d++
    }

    if (scopes.length > 0 || maxDepth !== undefined) {
      return { scopeForField: scopes }
    }
  }

  return null
}

/**
 * Advances the search cursor in sequential mode (`relativeTo: 'previous'`).
 *
 * Given the last matched element (which could be deep), it finds which item in the current
 * array-based scope it belongs to and returns the remaining (following) items.
 *
 * @param lastMatchedElement - The element that was just extracted.
 * @param currentWorkingScope - The current list of items we are scanning through.
 * @returns The remaining items to search in for subsequent fields.
 */
async function _sliceSequentialScope(
  this: IExtractEngine,
  lastMatchedElement: FetchElementScope,
  currentWorkingScope: FetchElementScope | FetchElementScope[]
): Promise<FetchElementScope[]> {
  const effectiveMatch = await _bubbleUpToScope.call(
    this,
    lastMatchedElement,
    currentWorkingScope
  )

  if (effectiveMatch) {
    if (Array.isArray(currentWorkingScope)) {
      // First try direct reference equality (fast, no RPC)
      let containerIndex = currentWorkingScope.indexOf(effectiveMatch)

      if (containerIndex === -1) {
        // Fallback to identity-based comparison
        for (let i = 0; i < currentWorkingScope.length; i++) {
          if (
            await this._isSameElement(currentWorkingScope[i], effectiveMatch)
          ) {
            containerIndex = i
            break
          }
        }
      }

      if (containerIndex !== -1) {
        return currentWorkingScope.slice(containerIndex + 1)
      }
    } else {
      // Single element scope: the "sequence" continues with following siblings
      return this._nextSiblingsUntil(effectiveMatch)
    }
  }
  return Array.isArray(currentWorkingScope)
    ? currentWorkingScope
    : [currentWorkingScope]
}

/**
 * Base configuration for all extraction schemas.
 */
export interface BaseExtractSchema {
  /**
   * Whether this field is required. If true and the value is null,
   * the containing object or array item will be skipped (or throw error in strict mode).
   */
  required?: boolean
  /**
   * Whether to enable strict mode for this extraction.
   * If true, missing required fields will throw an error instead of being skipped.
   */
  strict?: boolean
  /**
   * Specifies the starting anchor for extraction of this field.
   * - Field Name: Uses the DOM element of a previously extracted field as the anchor.
   * - CSS Selector: Re-queries the selector within the current context to find the anchor.
   *
   * Once anchored, the search scope for this field becomes the siblings following the anchor.
   */
  anchor?: string
  /**
   * The maximum number of levels to bubble up from the anchor or matched element.
   * - In 'anchor' mode: Defines how many parent levels to traverse to collect following siblings.
   * - In 'segmented' mode: Defines the maximum levels to ascend from the anchor to find a container.
   */
  depth?: number
}

/**
 * Extraction schema types.
 */
export type ExtractSchema =
  | ExtractObjectSchema
  | ExtractArraySchema
  | ExtractValueSchema

/**
 * Configuration for extracting a single value.
 */
export interface ExtractValueSchema extends BaseExtractSchema {
  /**
   * The data type to cast the extracted value to.
   * @default 'string'
   */
  type?: 'string' | 'number' | 'boolean' | 'html'
  /**
   * Extraction behavior mode.
   * - 'text': (Default) Uses textContent.
   * - 'innerText': Uses rendered text (respects CSS line breaks).
   * - 'html': Returns innerHTML.
   * - 'outerHTML': Returns HTML including the element's tag.
   */
  mode?: 'text' | 'innerText' | 'html' | 'outerHTML'
  /**
   * CSS selector to locate the element within the current context.
   */
  selector?: string
  /**
   * Attribute name to extract (e.g., 'href', 'src').
   * If omitted, the text content or HTML is extracted based on `type`.
   */
  attribute?: string
  /**
   * Filter elements that contain a descendant matching this CSS selector.
   */
  has?: string
  /**
   * Exclude elements matching this CSS selector.
   */
  exclude?: string
}

/**
 * Names of the supported array extraction modes.
 */
export type ExtractArrayModeName = 'nested' | 'columnar' | 'segmented'

/**
 * Base options for array extraction modes.
 */
export interface BaseModeOptions {
  type: ExtractArrayModeName
  /**
   * Whether to enable strict mode for this specific array mode.
   * @default false
   */
  strict?: boolean
}

/**
 * Options for columnar (column-alignment) extraction.
 */
export interface ColumnarOptions extends BaseModeOptions {
  type: 'columnar'
  /**
   * Whether to enable heuristic inference.
   * If true, tries to find a common parent to infer item wrappers when counts mismatch.
   * @default false
   */
  inference?: boolean
}

/**
 * Options for segmented (anchor-based) extraction.
 */
export interface SegmentedOptions extends BaseModeOptions {
  type: 'segmented'
  /**
   * The name of the field in `items` to use as a segment anchor, or a direct CSS selector.
   * Defaults to the first property key's selector defined in `items`.
   */
  anchor?: string
  /**
   * Where to start searching for fields within each segment.
   * - 'anchor': (Default) All fields are searched within the entire segment.
   * - 'previous': Each field is searched starting from after the previous field's match.
   */
  relativeTo?: 'anchor' | 'previous'
  /**
   * The maximum number of levels to bubble up from the anchor to find a segment container.
   * If omitted, it bubbles up as high as possible without conflicting with neighboring segments.
   */
  depth?: number
}

/**
 * Union type for array extraction modes and their options.
 */
export type ExtractArrayMode =
  | ExtractArrayModeName
  | ColumnarOptions
  | SegmentedOptions

/**
 * Configuration for extracting an array of items.
 */
export interface ExtractArraySchema extends BaseExtractSchema {
  type: 'array'
  /**
   * CSS selector for items (in 'nested' mode) or the container (in 'columnar'/'segmented' modes).
   */
  selector: string
  /**
   * Filter items/containers that contain a descendant matching this CSS selector.
   */
  has?: string
  /**
   * Exclude items/containers matching this CSS selector.
   */
  exclude?: string
  /**
   * Schema applied recursively to each extracted item.
   * If omitted, defaults to extracting text.
   */
  items?: ExtractSchema
  /**
   * Shortcut for `items` to extract a specific attribute directly.
   */
  attribute?: string
  /**
   * Array extraction mode.
   * - 'nested': (Default) Items are elements matched by `selector`.
   * - 'columnar': `selector` is a container, fields in `items` are parallel columns aligned by index.
   * - 'segmented': `selector` is a container, items are segmented by an anchor field.
   */
  mode?: ExtractArrayMode
}

/**
 * Configuration for extracting an object with multiple properties.
 */
export interface ExtractObjectSchema extends BaseExtractSchema {
  type: 'object'
  /**
   * Root selector for the object. If provided, sub-properties are searched within this element.
   */
  selector?: string
  /**
   * Filter the object element based on descendants.
   */
  has?: string
  /**
   * Exclude the object element if it matches this selector.
   */
  exclude?: string
  /**
   * Where to start searching for fields within this object.
   * Only applicable when the object is being extracted from an array of elements (e.g. in 'segmented' mode).
   * - 'anchor': (Default) All fields are searched within the entire scope.
   * - 'previous': Each field is searched starting from after the previous field's match.
   */
  relativeTo?: 'anchor' | 'previous'
  /**
   * Explicit order of property extraction.
   * Useful when using `relativeTo: 'previous'`.
   */
  order?: string[]
  /**
   * Definition of the object's properties and their corresponding extraction schemas.
   */
  properties: {
    [key: string]: ExtractSchema
  }
}
