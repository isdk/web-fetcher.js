import { CommonError } from '@isdk/common-error'

/**
 * Interface representing the minimal engine capabilities required for extraction.
 */
export interface IExtractEngine {
  _querySelectorAll(context: any, selector: string): Promise<any[]>
  _extractValue(schema: ExtractValueSchema, context: any): Promise<any>
  _parentElement(element: any): Promise<any | null>
  _isSameElement(element1: any, element2: any): Promise<boolean>
  _nextSiblingsUntil(element: any, untilSelector?: string): Promise<any[]>
  _logDebug(...args: any[]): void
}

/**
 * The core extraction logic, engine-agnostic.
 * @param this - The engine instance providing low-level DOM access.
 * @param schema - The extraction schema.
 * @param context - The current DOM context (element or array of elements).
 * @param parentStrict - Whether strict mode is inherited from parent.
 */
export async function _extract(
  this: IExtractEngine,
  schema: ExtractSchema,
  context: any,
  parentStrict?: boolean
): Promise<any> {
  const schemaType = (schema as any).type
  const schemaSelector = (schema as any).selector
  const strict = (schema as any).strict ?? parentStrict

  if (!context) {
    this._logDebug(
      `_extract: No context for selector "${schemaSelector || ''}", type "${schemaType || 'value'}"`
    )
    return schemaType === 'array' ? [] : null
  }

  if (schemaType === 'object') {
    const {
      selector,
      properties,
      strict: objectStrict,
    } = schema as ExtractObjectSchema
    const finalStrict = objectStrict ?? strict
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
    for (const key in properties) {
      this._logDebug(`_extract: extracting property "${key}"`)
      const value = await _extract.call(
        this,
        properties[key],
        newContext,
        finalStrict
      )
      if (value === null && (properties[key] as any).required) {
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
      ? await this._querySelectorAll(context, selector)
      : [context]

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

    if (
      normalizedMode.type === 'segmented' &&
      elements.length === 1 &&
      items
    ) {
      this._logDebug('_extract: trying segmented extraction')
      const results = await _extractSegmented.call(
        this,
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
    return _extractNested.call(this, items!, elements, {
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

    const matches = await this._querySelectorAll(container, valueSchema.selector)
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
    const segment = await this._nextSiblingsUntil(anchor, anchorSelector)
    const segmentContext = [anchor, ...segment]
    this._logDebug(
      `_extractSegmented: segment ${i} created with ${segmentContext.length} elements using anchorSelector "${anchorSelector}"`
    )
    const result = await _extract.call(this, schema, segmentContext, opts?.strict)
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
   * Definition of the object's properties and their corresponding extraction schemas.
   */
  properties: {
    [key: string]: ExtractSchema
  }
}
