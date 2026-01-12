import { describe, it, expect } from 'vitest'
import { FetchEngine, FetchEngineAction } from './base'
import { ExtractSchema } from '../core/extract'
import { FetchEngineContext } from '../core/context'

// Test subclass to expose protected method
class TestFetchEngine extends FetchEngine {
  // Required abstract implementations
  static id = 'test'
  static mode = 'http' as const
  
  protected _querySelectorAll(context: any, selector: string): Promise<any[]> {
    throw new Error('Method not implemented.')
  }
  protected _extractValue(schema: any, context: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  protected _parentElement(element: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  protected _isSameElement(element1: any, element2: any): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  protected _nextSiblingsUntil(element: any, untilSelector?: string | undefined): Promise<any[]> {
    throw new Error('Method not implemented.')
  }
  protected _createCrawler(options: any, config?: any): any {
    return {} as any
  }
  protected _getSpecificCrawlerOptions(ctx: FetchEngineContext): any {
    return {}
  }
  protected _buildResponse(context: any): Promise<any> {
    throw new Error('Method not implemented.')
  }
  protected executeAction(context: any, action: FetchEngineAction): Promise<any> {
    throw new Error('Method not implemented.')
  }
  public goto(url: string, params?: any): Promise<void | any> {
    throw new Error('Method not implemented.')
  }

  // Helper to access protected method
  public normalize(schema: ExtractSchema): ExtractSchema {
    return this._normalizeSchema(schema)
  }
}

describe('FetchEngine Schema Normalization', () => {
  const engine = new TestFetchEngine()

  it('should normalize string shorthand', () => {
    const schema = 'h1'
    expect(engine.normalize(schema)).toEqual({ selector: 'h1' })
  })

  it('should normalize implicit object shorthand', () => {
    const schema = {
      title: 'h1',
      link: { selector: 'a', attribute: 'href' }
    }
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    const normalized = engine.normalize(schema as any)
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
    
    const normalized = engine.normalize(schema as any)
    
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
