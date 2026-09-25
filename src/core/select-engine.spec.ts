import { describe, it, expect, vi } from 'vitest'
import {
  smartShouldUseBrowser,
  maybeCreateEngine,
  pickSiteMatched,
} from './select-engine'
import { FetchResponse, FetchSite } from './types'
import { getRetryAfter } from '../utils/headers'
import { FetchEngine } from '../engine/base'

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
      expect(smartShouldUseBrowser(res as any, {upgradeThresholdMs: 5000} as any)).toBe(true)
    })

    it('should NOT suggest upgrade for 429 with short delay', () => {
      const res: Partial<FetchResponse> = {
        statusCode: 429,
        headers: { 'retry-after': '2' }
      }
      expect(smartShouldUseBrowser(res as any, {upgradeThresholdMs: 5000} as any)).toBe(false)
    })

    it('should suggest upgrade for JS detection', () => {
      const res: Partial<FetchResponse> = {
        statusCode: 200,
        contentType: 'text/html',
        html: '<div>window.__NEXT_DATA__ = {}</div>'
      }
      expect(smartShouldUseBrowser(res as any, {upgradeOnJsContent: true} as any)).toBe(true)
    })
  })

  describe('maybeCreateEngine (puppeteer guard)', () => {
    it('should throw explicit not-supported error for puppeteer', async () => {
      await expect(
        maybeCreateEngine({ engine: 'puppeteer' } as any)
      ).rejects.toThrow(/not supported yet/)
    })

    it('should not hit the engine registry for puppeteer', async () => {
      const createSpy = vi.spyOn(FetchEngine, 'create')
      await expect(
        maybeCreateEngine({ engine: 'puppeteer' } as any)
      ).rejects.toThrow()
      expect(createSpy).not.toHaveBeenCalled()
      createSpy.mockRestore()
    })
  })

  describe('pickSiteMatched / useSiteRegistry', () => {
    const sites: FetchSite[] = [
      { domain: 'example.com', engine: 'browser' },
      { domain: 'sub.example.org', pathScope: ['/docs'] },
    ]

    it('should match exact domain', () => {
      expect(pickSiteMatched('https://example.com/a', sites)).toEqual(sites[0])
    })

    it('should match domain suffix', () => {
      expect(pickSiteMatched('https://www.example.com/', sites)).toEqual(sites[0])
    })

    it('should respect pathScope', () => {
      expect(
        pickSiteMatched('https://sub.example.org/docs/intro', sites)
      ).toEqual(sites[1])
      expect(pickSiteMatched('https://sub.example.org/blog', sites)).toBeNull()
    })

    it('should return null for unmatched host or empty input', () => {
      expect(pickSiteMatched('https://other.net/', sites)).toBeNull()
      expect(pickSiteMatched(undefined, sites)).toBeNull()
      expect(pickSiteMatched('https://example.com/', [])).toBeNull()
    })
  })
})
