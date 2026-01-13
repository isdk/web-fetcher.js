import { describe, it, expect } from 'vitest'
import { normalizeExtractSchema } from './schema-normalization'

describe('FetchEngine Schema Normalization', () => {
  it('should normalize string shorthand', () => {
    const schema = 'h1'
    expect(normalizeExtractSchema(schema)).toEqual({
      type: 'string',
      selector: 'h1',
      mode: 'text',
    })
  })

  it('should normalize implicit object shorthand', () => {
    const schema = {
      title: 'h1',
      link: { selector: 'a', attribute: 'href' },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        title: { type: 'string', selector: 'h1', mode: 'text' },
        link: {
          type: 'string',
          selector: 'a',
          attribute: 'href',
          mode: 'text',
        },
      },
    })
  })

  it('should handle reserved keys in implicit object', () => {
    const schema = {
      selector: '.container',
      title: 'h1',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      selector: '.container',
      properties: {
        title: { type: 'string', selector: 'h1', mode: 'text' },
      },
    })
  })

  it('should normalize nested implicit objects', () => {
    const schema = {
      author: {
        name: '.name',
        meta: {
          id: { attribute: 'data-id' },
        },
      },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        author: {
          type: 'object',
          properties: {
            name: { type: 'string', selector: '.name', mode: 'text' },
            meta: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  attribute: 'data-id',
                  mode: 'text',
                },
              },
            },
          },
        },
      },
    })
  })

  it('should normalize implicit objects inside explicit arrays', () => {
    const schema = {
      type: 'array',
      selector: 'li',
      items: {
        name: '.name',
        age: '.age',
      },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'li',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', selector: '.name', mode: 'text' },
          age: { type: 'string', selector: '.age', mode: 'text' },
        },
      },
    })
  })

  it('should normalize implicit objects inside explicit object properties', () => {
    const schema = {
      type: 'object',
      properties: {
        user: {
          name: '.name',
        },
      },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string', selector: '.name', mode: 'text' },
          },
        },
      },
    })
  })

  it('should handle array attribute shorthand', () => {
    const schema = {
      type: 'array',
      selector: 'a',
      attribute: 'href',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'a',
      items: {
        type: 'string',
        attribute: 'href',
        mode: 'text',
      },
    })
  })

  it('should default array items to string type if missing', () => {
    const schema = {
      type: 'array',
      selector: 'li',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'li',
      items: { type: 'string', mode: 'text' },
    })
  })

  it('should normalize filter shorthands (has/exclude)', () => {
    const schema = {
      selector: 'div',
      has: '.active',
      exclude: '.disabled',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'string',
      selector: 'div:has(.active):not(.disabled)',
      mode: 'text',
    })
  })

  it('should handle deeply nested mixed structures', () => {
    const schema = {
      users: {
        type: 'array',
        selector: '.user',
        items: {
          profile: {
            name: 'h3',
            stats: {
              type: 'object', // explicit inside implicit
              properties: {
                posts: '.posts-count',
              },
            },
          },
        },
      },
    }

    const normalized = normalizeExtractSchema(schema as any)

    expect(normalized).toMatchObject({
      type: 'object',
      properties: {
        users: {
          type: 'array',
          selector: '.user',
          items: {
            type: 'object',
            properties: {
              profile: {
                type: 'object',
                properties: {
                  name: { type: 'string', selector: 'h3', mode: 'text' },
                  stats: {
                    type: 'object',
                    properties: {
                      posts: {
                        type: 'string',
                        selector: '.posts-count',
                        mode: 'text',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  })

  it('should normalize array mode string to object', () => {
    const schema = {
      type: 'array',
      selector: 'div',
      mode: 'columnar',
      items: { foo: '.foo' },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toMatchObject({
      type: 'array',
      mode: { type: 'columnar' },
    })
  })

  it('should handle Implicit Object with "items" key when type is missing', () => {
    // This is the specific edge case user requested
    const schema = {
      selector: '.root',
      items: '.list-item',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      selector: '.root',
      properties: {
        items: {
          type: 'string',
          selector: '.list-item',
          mode: 'text',
        },
      },
    })
  })

  it('should handle Implicit Object with "properties" key when type is missing', () => {
    const schema = {
      properties: '.prop-val',
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        properties: {
          type: 'string',
          selector: '.prop-val',
          mode: 'text',
        },
      },
    })
  })

  it('should preserve has/exclude when selector is missing', () => {
    const schema = {
      type: 'object',
      has: '.indicator',
      properties: {
        title: 'h1',
      },
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      has: '.indicator',
      properties: {
        title: {
          type: 'string',
          selector: 'h1',
          mode: 'text',
        },
      },
    })
  })
})
