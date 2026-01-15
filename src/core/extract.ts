import { CommonError } from '@isdk/common-error'
import { normalizeExtractSchema } from './normalize-extract-schema'

/**
 * Represents the engine-specific execution scope (e.g., a Cheerio node or a Playwright Locator).
 * It acts as the target for extraction and interaction actions.
 */
export type FetchElementScope = any

/**
 * Interface representing the minimal engine capabilities required for extraction.
 */
export interface IExtractEngine {
  _querySelectorAll(
    scope: FetchElementScope,
    selector: string
  ): Promise<FetchElementScope[]>
  _extractValue(
    schema: ExtractValueSchema,
    scope: FetchElementScope
  ): Promise<any>
  _parentElement(scope: FetchElementScope): Promise<FetchElementScope | null>
  _isSameElement(
    scope1: FetchElementScope,
    scope2: FetchElementScope
  ): Promise<boolean>
  _nextSiblingsUntil(
    scope: FetchElementScope,
    untilSelector?: string
  ): Promise<FetchElementScope[]>
  _logDebug(...args: any[]): void
}

/**
 * Public entry point for extraction.
 * Normalizes the schema and then calls the internal _extract logic.
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
 * The core extraction logic, engine-agnostic.
 * @param this - The engine instance providing low-level DOM access.
 * @param schema - The extraction schema.
 * @param scope - The current DOM scope (element or array of elements).
 * @param parentStrict - Whether strict mode is inherited from parent.
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

  if (schemaType === 'object') {
    const {
      selector,
      properties,
      strict: objectStrict,
      relativeTo,
      order,
    } = schema as ExtractObjectSchema
    const finalStrict = objectStrict ?? strict
    let newScope = scope
    if (selector) {
      const elements = await this._querySelectorAll(scope, selector)
      newScope = elements.length > 0 ? elements[0] : null
      this._logDebug(
        `_extract: object selector "${selector}" found ${elements.length} elements`
      )
    }
    if (!newScope) {
      this._logDebug(
        `_extract: object scope not found for selector "${selector}"`
      )
      if (finalStrict && (schema as any).required) {
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
    // fieldElements stores the DOM element(s) associated with each extracted field
    const fieldElements = new Map<string, FetchElementScope>()

    const isSequential = relativeTo === 'previous' && Array.isArray(newScope)

    for (const key of keys) {
      const propSchema = properties[key]
      if (!propSchema) continue

      this._logDebug(`_extract: extracting property "${key}"`)

      // --- Anchor Logic ---
      let scopeForField = currentWorkingScope
      if (propSchema.anchor) {
        let anchorElement: FetchElementScope = null
        // 1. Try to resolve as a reference to a previous field
        if (fieldElements.has(propSchema.anchor)) {
          anchorElement = fieldElements.get(propSchema.anchor)
          this._logDebug(
            `_extract: anchor resolved from field "${propSchema.anchor}"`
          )
        } else {
          // 2. Try to resolve as a CSS selector within the object's root scope
          // Note: we use 'newScope' (the object container) as the base for the selector
          const anchors = await this._querySelectorAll(
            newScope,
            propSchema.anchor
          )
          if (anchors.length > 0) {
            anchorElement = anchors[0]
            this._logDebug(
              `_extract: anchor resolved from selector "${propSchema.anchor}"`
            )
          }
        }

        if (anchorElement) {
          // Bubble up to find the "effective anchor" within the current context
          // If we are operating on a list of siblings (isSequential or caused by previous anchor),
          // we need to find which sibling contains our anchor.
          // If we are in a single element scope, we find which direct child contains the anchor.
          const effectiveAnchor = await _bubbleUpToScope.call(
            this,
            anchorElement,
            newScope
          )

          if (effectiveAnchor) {
            // Set scope to siblings AFTER the anchor
            scopeForField = await this._nextSiblingsUntil(effectiveAnchor)
            this._logDebug(
              `_extract: scope adjusted to ${scopeForField.length} siblings after anchor`
            )
            // If this is a sequential flow, we might want to update currentWorkingScope too,
            // but strict 'anchor' usually implies a specific jump for THIS field.
            // However, if relativeTo='previous' is ON, should this jump affect subsequent fields?
            // "Anchor" effectively resets the cursor. So yes, it makes sense to update currentWorkingScope
            // if we are in sequential mode.
            if (isSequential) {
              currentWorkingScope = scopeForField
            }
          } else {
            this._logDebug(
              `_extract: anchor element found but not within current scope chain`
            )
            if (finalStrict) {
              throw new CommonError(
                `Anchor "${propSchema.anchor}" is not within the expected scope.`,
                'extract'
              )
            }
          }
        } else {
          this._logDebug(`_extract: anchor "${propSchema.anchor}" not found`)
          if (finalStrict) {
            throw new CommonError(
              `Anchor "${propSchema.anchor}" not found.`,
              'extract'
            )
          }
        }
      }

      let value: any
      let extractedElement: FetchElementScope = null

      // Determine if we should pre-select the element to track it
      // We do this if it has a selector OR if we are in a sequential/array scope where we need to pick one.
      const propSelector = (propSchema as any).selector

      if (propSelector && (Array.isArray(scopeForField) || propSchema.anchor)) {
        // Hoisted selection logic for accurate element tracking
        const matches = await this._querySelectorAll(
          scopeForField,
          propSelector
        )
        if (matches.length > 0) {
          extractedElement = matches[0]
          // Use a temporary schema without selector to avoid redundant lookup
          const tempSchema = { ...propSchema, selector: undefined } as any
          value = await _extract.call(
            this,
            tempSchema,
            extractedElement,
            finalStrict
          )

          // If sequential, update the cursor (slice scope)
          if (isSequential && !propSchema.anchor) {
            // Logic to find matchedElement index in currentWorkingScope and slice
            // (Reusing existing logic, but now robust with _bubbleUp)
            const effectiveMatch = await _bubbleUpToScope.call(
              this,
              extractedElement,
              currentWorkingScope
            )
            if (effectiveMatch) {
              // Find index
              const idx = (currentWorkingScope as any[]).findIndex(
                // We need to compare handles. _bubbleUp returns the exact object ref if from array?
                // No, _bubbleUp returns an element. We need async comparison.
                () => false // Placeholder, we do manual loop below
              )
              // Actually _bubbleUpToScope already returns the item from the array if matched.
              // But we can't easily find index of an object reference if they are different wrappers.
              // Let's rely on _isSameElement loop.
              let containerIndex = -1
              for (let i = 0; i < currentWorkingScope.length; i++) {
                if (
                  await this._isSameElement(
                    currentWorkingScope[i],
                    effectiveMatch
                  )
                ) {
                  containerIndex = i
                  break
                }
              }
              if (containerIndex !== -1) {
                currentWorkingScope = currentWorkingScope.slice(
                  containerIndex + 1
                )
              }
            }
          }
        } else {
          value = null
        }
      } else {
        // Standard extraction (recurses and handles selection internally)
        value = await _extract.call(
          this,
          propSchema,
          scopeForField,
          finalStrict
        )
        // If successful and it was a simple extraction from the current scope...
        // We can't easily get the element back if we delegated everything.
        // But for anchoring to work, we mostly care about fields WITH selectors.
        // If a field has no selector (inherits scope), its element IS the scope.
        if (value !== null && !propSelector) {
          extractedElement = Array.isArray(scopeForField)
            ? scopeForField[0]
            : scopeForField
        }
      }

      if (extractedElement) {
        fieldElements.set(key, extractedElement)
      }

      if (value === null && (propSchema as any).required) {
        this._logDebug(`_extract: required property "${key}" is null`)
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

  if (schemaType === 'array') {
    const {
      selector,
      items,
      mode,
      strict: arrayStrict,
    } = schema as ExtractArraySchema
    const finalStrict = arrayStrict ?? strict
    const elements = selector
      ? await this._querySelectorAll(scope, selector)
      : [scope]

    this._logDebug(
      `_extract: array selector "${selector || ''}" found ${elements.length} elements`
    )

    const normalizedMode = _normalizeArrayMode.call(this, mode)
    if (finalStrict !== undefined && normalizedMode.strict === undefined) {
      normalizedMode.strict = finalStrict
    }
    const isAuto = !mode

    if (
      (isAuto || normalizedMode.type === 'columnar') &&
      elements.length === 1 &&
      items
    ) {
      this._logDebug('_extract: trying columnar extraction')
      const results = await _extractColumnar.call(
        this,
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

    if (normalizedMode.type === 'segmented' && items) {
      this._logDebug(
        `_extract: trying segmented extraction for ${elements.length} containers`
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

      if (success) {
        this._logDebug(
          `_extract: segmented extraction successful, found ${allResults.length} items`
        )
        return allResults
      }
    }

    // Default fallback or explicit nested
    this._logDebug(
      `_extract: using nested extraction for ${elements.length} elements`
    )
    return _extractNested.call(this, items!, elements, {
      strict: normalizedMode.strict,
    })
  }

  const { selector } = schema as ExtractValueSchema
  let elementToExtract = scope
  if (selector) {
    const elements = await this._querySelectorAll(scope, selector)
    elementToExtract = elements.length > 0 ? elements[0] : null
    this._logDebug(
      `_extract: value selector "${selector}" found ${elements.length} elements`
    )
  } else if (Array.isArray(scope)) {
    elementToExtract = scope.length > 0 ? scope[0] : null
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
      this._logDebug(`_extractColumnar: field "${key}" values:`, values)
      collectedValues[key] = values
    }

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
        return _extractNested.call(this, schema, uniqueWrappers, { strict })
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
    anchorSelector = properties[keys[0]]?.selector
  }

  if (!anchorSelector) return null

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
    // Find the highest ancestor of the current anchor that does NOT contain
    // the previous or next anchors. This allows identifying the "Card" container
    // even if the anchor is deep inside.
    let currentScope = anchor
    let bestScope = anchor
    while (true) {
      const parent = await this._parentElement(currentScope)
      if (!parent || (await this._isSameElement(parent, container))) break

      // Check if parent contains neighbors
      let conflict = false
      if (prevAnchor && (await _isAncestor.call(this, parent, prevAnchor))) {
        conflict = true
      }
      if (
        !conflict &&
        nextAnchor &&
        (await _isAncestor.call(this, parent, nextAnchor))
      ) {
        conflict = true
      }

      if (conflict) break
      currentScope = parent
      bestScope = currentScope
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
 * Finds the element within `scope` that contains or is the `element`.
 *
 * - If `scope` is an array of siblings, returns the sibling that contains `element`.
 * - If `scope` is a single element, returns the direct child of `scope` that contains `element`.
 */
async function _bubbleUpToScope(
  this: IExtractEngine,
  element: FetchElementScope,
  scope: FetchElementScope | FetchElementScope[]
): Promise<FetchElementScope | null> {
  const isScopeArray = Array.isArray(scope)
  const scopeItems = isScopeArray ? scope : [scope]

  let current = element
  let parent = await this._parentElement(current)

  // First, check if the element itself is in the scope (or is a child of the single scope)
  // Optimization: direct check
  // But we need to loop up.

  while (current) {
    // 1. Check if current matches any item in scope (for Array scope)
    if (isScopeArray) {
      for (const item of scopeItems) {
        if (await this._isSameElement(current, item)) {
          return item
        }
      }
    } else {
      // 2. Check if parent matches the single scope (for Element scope)
      // If parent is the scope, then 'current' is the direct child we want.
      if (parent && (await this._isSameElement(parent, scope as any))) {
        return current
      }
    }

    if (!parent) break
    current = parent
    parent = await this._parentElement(current)
  }

  return null
}

/**
 * Checks if one element is an ancestor of another.
 */
async function _isAncestor(
  this: IExtractEngine,
  ancestor: FetchElementScope,
  descendant: FetchElementScope
): Promise<boolean> {
  let current = await this._parentElement(descendant)
  while (current) {
    if (await this._isSameElement(ancestor, current)) return true
    current = await this._parentElement(current)
  }
  return false
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
   * - CSS Selector: Re-queries the selector within the current object scope to find the anchor.
   *
   * Once anchored, the search scope for this field becomes the siblings following the anchor.
   */
  anchor?: string
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
