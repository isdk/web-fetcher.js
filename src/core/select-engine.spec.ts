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

    // Site entries decide the engine (and, with antibot/proxy fields, the whole
    // request posture), so a rule must never be reachable from a host that only
    // *looks* like the configured domain.
    describe('host must match on a label boundary', () => {
      const bing: FetchSite[] = [{ domain: 'bing.com', engine: 'browser' }]

      it('should not match a look-alike host that merely ends with the domain text', () => {
        expect(pickSiteMatched('https://evilbing.com/search', bing)).toBeNull()
        expect(pickSiteMatched('https://not-bing.com/', bing)).toBeNull()
        expect(pickSiteMatched('https://bing.com.my-vps.net/', bing)).toBeNull()
      })

      it('should match the apex host and any real subdomain', () => {
        expect(pickSiteMatched('https://bing.com/', bing)).toEqual(bing[0])
        expect(pickSiteMatched('https://www.bing.com/', bing)).toEqual(bing[0])
        expect(pickSiteMatched('https://cn.bing.com/search?q=x', bing)).toEqual(bing[0])
      })

      it('should tolerate a leading dot and mixed case in a configured domain', () => {
        const dotted: FetchSite[] = [{ domain: '.Bing.com', engine: 'browser' }]
        expect(pickSiteMatched('https://WWW.BING.COM/', dotted)).toEqual(dotted[0])
        expect(pickSiteMatched('https://evilbing.com/', dotted)).toBeNull()
      })
    })

    it('should return null for an unparseable URL instead of throwing', () => {
      expect(() => pickSiteMatched('not-a-url', sites)).not.toThrow()
      expect(pickSiteMatched('not-a-url', sites)).toBeNull()
      expect(pickSiteMatched('', sites)).toBeNull()
    })

    it('should prefer the most specific entry (longest host match, then longest pathScope)', () => {
      const specific: FetchSite[] = [
        { domain: 'example.com', engine: 'http' },
        { domain: 'example.com', pathScope: ['/docs/advanced'], engine: 'browser' },
        { domain: 'docs.example.com', engine: 'browser' },
      ]
      // Subdomain rule wins over the apex rule.
      expect(pickSiteMatched('https://docs.example.com/x', specific)?.engine).toBe('browser')
      // Longer pathScope wins over the shorter/apex one.
      expect(
        pickSiteMatched('https://example.com/docs/advanced/intro', specific)?.pathScope
      ).toEqual(['/docs/advanced'])
      expect(pickSiteMatched('https://example.com/other', specific)?.engine).toBe('http')
    })

    it('should scope pathScope on a path-segment boundary', () => {
      const scoped: FetchSite[] = [
        { domain: 'example.org', pathScope: ['/docs'], engine: 'browser' },
      ]
      expect(pickSiteMatched('https://example.org/docs', scoped)).toEqual(scoped[0])
      expect(pickSiteMatched('https://example.org/docs/intro', scoped)).toEqual(scoped[0])
      // `/documents` is a different page, not something under `/docs`.
      expect(pickSiteMatched('https://example.org/documents', scoped)).toBeNull()
    })
  })
})
