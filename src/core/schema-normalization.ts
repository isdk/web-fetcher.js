import {
  ExtractSchema,
  ExtractObjectSchema,
  ExtractArraySchema,
  ExtractValueSchema,
} from './extract'

// Valid schema type keywords.
const VALID_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'html',
  'object',
  'array',
])

// Context keys that apply to the object/node itself (filters, root selector), not the children.
const CONTEXT_KEYS = new Set([
  'selector',
  'has',
  'exclude',
  'required',
  'strict',
  // 'mode', // mode is not valid for Object schema, only Value/Array.
])

/**
 * Determines if a schema is an "Implicit Object Schema".
 *
 * Rule:
 * 1. If `type` is present AND is a valid Schema Type keyword, it is Explicit.
 * 2. If `type` is present but NOT a valid keyword (e.g. an object, or arbitrary string),
 *    it is treated as a property named "type", so it is an Implicit Object.
 * 3. If no `type`, checks if there are any keys that are NOT reserved configuration keywords.
 *    If yes, it's an Implicit Object (keys are field names).
 *    If no (all keys are reserved), it's likely a Value Schema (e.g. { selector: '...' }).
 */
export function isImplicitObject(schema: any): boolean {
  if (!schema || typeof schema !== 'object') return false
  if (Array.isArray(schema)) return false

  // 1. Explicit type check
  if ('type' in schema) {
    if (typeof schema.type === 'string' && VALID_TYPES.has(schema.type)) {
      return false // It is an explicit schema
    }
    // If 'type' exists but is not a valid keyword, it is a property.
    // Existence of a property implies Implicit Object.
    return true
  }

  // 2. Check for non-reserved keys
  const keys = Object.keys(schema)
  if (keys.length === 0) return false

  for (const key of keys) {
    // Note: We deliberately treat 'items' and 'properties' as non-reserved here
    // based on the requirement: "Only when type: 'array' is items a keyword".
    // So if type is missing, 'items' is a property name.
    // We only check against the fundamental directive keys.
    if (
      ![
        'selector',
        'attribute',
        'has',
        'exclude',
        'mode',
        'required',
        'strict',
      ].includes(key)
    ) {
      return true
    }
  }

  return false
}

/**
 * Normalizes the extraction schema into a strict, fully explicit format.
 *
 * Transformations:
 * 1. String Shorthand: 'selector' -> { type: 'string', selector: 'selector', mode: 'text' }
 * 2. Implicit Object: { title: 'h1' } -> { type: 'object', properties: { title: ... } }
 * 3. Array Shorthand:
 *    - MUST have type: 'array'.
 *    - attribute shorthand: { type: 'array', attribute: 'href' } -> items: { type: 'string', attribute: 'href' }
 * 4. Filter Shorthand: selector + has/exclude -> selector: ':has(...)'
 * 5. Defaults:
 *    - Value type defaults to 'string'.
 *    - Value mode defaults to 'text' (if string).
 *    - Array mode defaults to { type: 'nested' }.
 */
export function normalizeExtractSchema(schema: ExtractSchema): ExtractSchema {
  // 1. Handle String Shorthand
  if (typeof schema === 'string') {
    return {
      type: 'string',
      selector: schema,
      mode: 'text',
    } as ExtractValueSchema
  }

  // 2. Handle Null/Undefined (Defensive)
  if (!schema || typeof schema !== 'object') {
    return { type: 'string', mode: 'text' } as ExtractValueSchema
  }

  let newSchema = { ...schema } as any

  // 3. Handle Implicit Object
  if (isImplicitObject(newSchema)) {
    const properties: Record<string, ExtractSchema> = {}

    // Extract properties vs context
    for (const key of Object.keys(newSchema)) {
      if (CONTEXT_KEYS.has(key)) {
        continue // Keep context keys on the root
      }
      // Move everything else to properties
      properties[key] = normalizeExtractSchema(newSchema[key])
      delete newSchema[key]
    }

    newSchema.type = 'object'
    newSchema.properties = properties
  }

  // 4. Normalize based on Type (now strict)
  if (!newSchema.type) {
    newSchema.type = 'string' // Default to string value
  }

  // 4a. Object Normalization
  if (newSchema.type === 'object') {
    const objSchema = newSchema as ExtractObjectSchema
    if (!objSchema.properties) {
      objSchema.properties = {}
    }
    // Deep normalization
    for (const key in objSchema.properties) {
      objSchema.properties[key] = normalizeExtractSchema(
        objSchema.properties[key]
      )
    }
    // Clean up invalid keys for object
    delete (objSchema as any).mode
    delete (objSchema as any).items
    delete (objSchema as any).attribute
  }
  // 4b. Array Normalization
  else if (newSchema.type === 'array') {
    const arrSchema = newSchema as ExtractArraySchema

    // Handle 'attribute' shorthand on array root -> applies to items
    if ((arrSchema as any).attribute && !arrSchema.items) {
      arrSchema.items = {
        type: 'string',
        attribute: (arrSchema as any).attribute,
        mode: 'text',
      }
      delete (arrSchema as any).attribute
    }

    // Default items
    if (!arrSchema.items) {
      arrSchema.items = { type: 'string', mode: 'text' }
    }

    // Recursively normalize items
    arrSchema.items = normalizeExtractSchema(arrSchema.items)

    // Normalize Mode
    // CRITICAL: Do NOT default to 'nested'. If mode is undefined, it implies 'auto'.
    if (typeof arrSchema.mode === 'string') {
      arrSchema.mode = { type: arrSchema.mode as any }
    }
  }
  // 4c. Value Normalization (string, number, boolean, html)
  else {
    const valSchema = newSchema as ExtractValueSchema
    // Default mode
    if (!valSchema.mode) {
      if (valSchema.type === 'html') valSchema.mode = 'html'
      else valSchema.mode = 'text'
    }
  }

  // 5. Universal Filter Normalization (selector + has/exclude)
  // This happens AFTER all other normalizations and applies to ALL types.
  // We only consume has/exclude if we can merge them into a selector.
  if (
    (newSchema as any).selector &&
    ((newSchema as any).has || (newSchema as any).exclude)
  ) {
    const { selector, has, exclude } = newSchema as any
    const parts = selector.split(',').map((s: string) => s.trim())
    const fixedParts = parts.map((p: string) => {
      let res = p
      if (has) res += `:has(${has})`
      if (exclude) res += `:not(${exclude})`
      return res
    })
    newSchema.selector = fixedParts.join(', ')
    // Consumed!
    delete newSchema.has
    delete newSchema.exclude
  }

  return newSchema as ExtractSchema
}
