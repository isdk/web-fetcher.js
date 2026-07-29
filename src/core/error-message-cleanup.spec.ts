import { describe, it, expect } from 'vitest'
import { getCleanErrorMessage } from '../engine/error-helpers'

describe('getCleanErrorMessage', () => {
  it('should return clean message unchanged when no newline', () => {
    const result = getCleanErrorMessage('net::ERR_CONNECTION_CLOSED')
    expect(result.clean).toBe('net::ERR_CONNECTION_CLOSED')
    expect(result.full).toBeUndefined()
  })

  it('should return clean message unchanged for empty string', () => {
    const result = getCleanErrorMessage('')
    expect(result.clean).toBe('')
    expect(result.full).toBeUndefined()
  })

  it('should strip Call log debug info after newline', () => {
    const msg = `page.goto: net::ERR_CONNECTION_CLOSED at https://example.com/
         Call log:
           - navigating to "https://example.com/", waiting until "load"`
    const result = getCleanErrorMessage(msg)
    expect(result.clean).toBe('page.goto: net::ERR_CONNECTION_CLOSED at https://example.com/')
    expect(result.full).toBe(msg.trim())
  })

  it('should strip any multi-line debug info (not just Call log)', () => {
    const msg = `Error: something went wrong
    at Object.<anonymous> (/path/to/file.ts:10:5)
    at Generator.next (<anonymous>)`
    const result = getCleanErrorMessage(msg)
    expect(result.clean).toBe('Error: something went wrong')
    expect(result.full).toBe(msg.trim())
  })

  it('should handle single-line message with trailing whitespace', () => {
    const result = getCleanErrorMessage('  some error  ')
    expect(result.clean).toBe('  some error  ')
    expect(result.full).toBeUndefined()
  })

  it('should handle nullish input gracefully', () => {
    const result = getCleanErrorMessage(null as any)
    expect(result.clean).toBe('')
    expect(result.full).toBeUndefined()
  })

  it('should handle undefined input gracefully', () => {
    const result = getCleanErrorMessage(undefined)
    expect(result.clean).toBe('')
    expect(result.full).toBeUndefined()
  })
})
