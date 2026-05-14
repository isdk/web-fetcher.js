import { describe, it, expect } from 'vitest'
import { smartShouldUseBrowser } from './select-engine'
import { FetchResponse } from './types'
import { getRetryAfter } from '../utils/headers'

describe('select-engine unit tests', () => {
  describe('getRetryAfter', () => {
    it('should parse seconds', () => {
      expect(getRetryAfter({ 'retry-after': '30' })).toBe(30000)
    })

    it('should parse date string', () => {
      const futureDate = new Date(Date.now() + 60000).toUTCString()
      const delay = getRetryAfter({ 'Retry-After': futureDate })
      expect(delay).toBeGreaterThan(50000)
      expect(delay).toBeLessThanOrEqual(60000)
    })

    it('should return null if no header', () => {
      expect(getRetryAfter({})).toBeNull()
    })
  })

  describe('smartShouldUseBrowser', () => {
    it('should suggest upgrade for 403', () => {
      const res: Partial<FetchResponse> = { statusCode: 403 }
      expect(smartShouldUseBrowser(res as any)).toBe(true)
    })

    it('should suggest upgrade for 429 with long delay', () => {
      const res: Partial<FetchResponse> = {
        statusCode: 429,
        headers: { 'retry-after': '10' }
      }
      expect(smartShouldUseBrowser(res as any, 5000)).toBe(true)
    })

    it('should NOT suggest upgrade for 429 with short delay', () => {
      const res: Partial<FetchResponse> = {
        statusCode: 429,
        headers: { 'retry-after': '2' }
      }
      expect(smartShouldUseBrowser(res as any, 5000)).toBe(false)
    })

    it('should suggest upgrade for JS detection', () => {
      const res: Partial<FetchResponse> = {
        statusCode: 200,
        contentType: 'text/html',
        html: '<div>window.__NEXT_DATA__ = {}</div>'
      }
      expect(smartShouldUseBrowser(res as any)).toBe(true)
    })
  })
})
