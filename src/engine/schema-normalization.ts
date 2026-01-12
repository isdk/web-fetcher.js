import { ExtractSchema } from '../core/extract'

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
export function isImplicitObject(schema: any): boolean {
  if (!schema || typeof schema !== 'object') return false

  // If 'type' is one of the valid schema types, it's NOT an implicit shorthand.
  if (
    'type' in schema &&
    typeof schema.type === 'string' &&
    ['object', 'array', 'string', 'number', 'boolean', 'html'].includes(
      schema.type
    )
  ) {
    return false
  }

  const reservedKeys = new Set([
    'selector',
    'attribute',
    'has',
    'exclude',
    'properties',
    'items',
    'mode',
    'required',
    'strict',
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
export function normalizeExtractSchema(schema: ExtractSchema): ExtractSchema {
  // 1. Handle String shorthand: 'h1' -> { selector: 'h1' }
  if (typeof schema === 'string') {
    return { selector: schema } as any
  }

  const newSchema = { ...(schema as any) }

  // 2. Handle Implicit Object shorthand:
  // If it's an object but doesn't have a 'type', and contains properties,
  // we convert it to an explicit 'object' type.
  if (isImplicitObject(newSchema)) {
    const properties: any = {}
    const contextKeys = new Set([
      'selector',
      'has',
      'exclude',
      'required',
      'strict',
    ])

    // We separate context-defining keys from data-defining keys.
    for (const key of Object.keys(newSchema)) {
      if (!contextKeys.has(key)) {
        // All other keys are treated as properties to be extracted.
        properties[key] = normalizeExtractSchema(newSchema[key])
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
        newSchema.properties[key] = normalizeExtractSchema(
          newSchema.properties[key]
        )
      }
    }
    if (newSchema.items) {
      newSchema.items = normalizeExtractSchema(newSchema.items)
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

  return newSchema as ExtractSchema
}
