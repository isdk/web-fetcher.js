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
   * The name of the field in `items` to use as a segment anchor.
   * Defaults to the first property key defined in `items`.
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