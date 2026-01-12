import { describe, it, expect } from 'vitest'
import { normalizeExtractSchema } from './schema-normalization'

describe('FetchEngine Schema Normalization', () => {
  it('should normalize string shorthand', () => {
    const schema = 'h1'
    expect(normalizeExtractSchema(schema)).toEqual({ selector: 'h1' })
  })

  it('should normalize implicit object shorthand', () => {
    const schema = {
      title: 'h1',
      link: { selector: 'a', attribute: 'href' }
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        title: { selector: 'h1' },
        link: { selector: 'a', attribute: 'href' }
      }
    })
  })

  it('should handle reserved keys in implicit object', () => {
    const schema = {
      selector: '.container',
      title: 'h1'
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      selector: '.container',
      properties: {
        title: { selector: 'h1' }
      }
    })
  })

  it('should normalize nested implicit objects', () => {
    const schema = {
      author: {
        name: '.name',
        meta: {
          id: { attribute: 'data-id' }
        }
      }
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        author: {
          type: 'object',
          properties: {
            name: { selector: '.name' },
            meta: {
              type: 'object',
              properties: {
                id: { attribute: 'data-id' }
              }
            }
          }
        }
      }
    })
  })

  it('should normalize implicit objects inside explicit arrays', () => {
    const schema = {
      type: 'array',
      selector: 'li',
      items: {
        name: '.name',
        age: '.age'
      }
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'li',
      items: {
        type: 'object',
        properties: {
          name: { selector: '.name' },
          age: { selector: '.age' }
        }
      }
    })
  })

  it('should normalize implicit objects inside explicit object properties', () => {
    const schema = {
      type: 'object',
      properties: {
        user: {
          name: '.name'
        }
      }
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { selector: '.name' }
          }
        }
      }
    })
  })

  it('should handle array attribute shorthand', () => {
    const schema = {
      type: 'array',
      selector: 'a',
      attribute: 'href'
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'a',
      items: {
        attribute: 'href'
      }
    })
  })

  it('should default array items to string type if missing', () => {
    const schema = {
      type: 'array',
      selector: 'li'
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      type: 'array',
      selector: 'li',
      items: { type: 'string' }
    })
  })

  it('should normalize filter shorthands (has/exclude)', () => {
    const schema = {
      selector: 'div',
      has: '.active',
      exclude: '.disabled'
    }
    const normalized = normalizeExtractSchema(schema as any)
    expect(normalized).toEqual({
      selector: 'div:has(.active):not(.disabled)'
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
                posts: '.posts-count'
              }
            }
          }
        }
      }
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
                  name: { selector: 'h3' },
                  stats: {
                    type: 'object',
                    properties: {
                      posts: { selector: '.posts-count' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  })
})