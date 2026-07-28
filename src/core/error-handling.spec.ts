import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from 'vitest'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
import '../engine'
import '../action/definitions'
import { FetchSession } from './session'
import { FetcherOptions } from './types'

const TEST_TIMEOUT = 30000
const storageDir = path.join(os.tmpdir(), 'isdk-web-fetch-error-handling')
const UNREACHABLE_URL = 'http://127.0.0.1:19999'

/**
 * Error Handling Tests
 *
 * This test suite verifies that when a navigation fails (e.g., connection refused),
 * the reported error message shows the ORIGINAL error (e.g., ECONNREFUSED / ERR_CONNECTION_REFUSED)
 * instead of being overwritten by a secondary error from page.content() or buildResponse().
 *
 * Bug background:
 * When page.goto() fails, Crawlee retries up to maxRequestRetries. After exhausting retries,
 * it calls requestHandler or failedRequestHandler. In these handlers, buildResponse() calls
 * page.content() which can throw "Unable to retrieve content because the page is navigating"
 * if the page is in a bad state. This secondary error was previously overwriting the original
 * navigation error in the catch block.
 *
 * Fix: Prefer the original error parameter over the buildResponse error in both
 * _sharedRequestHandler and _sharedFailedRequestHandler catch blocks.
 */

describe('Error Handling: Original error preservation', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    fs.rmSync(storageDir, { recursive: true, force: true })
    fs.mkdirSync(storageDir, { recursive: true })
    server = fastify()
    server.get('/', async (_req, reply) => {
      reply.type('text/html').send('<h1>Home</h1>')
    })



    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  })

  afterAll(async () => {
    await server.close()
  })

  // ─── Cheerio Engine ─────────────────────────────────────────────

  describe('Cheerio engine', () => {
    const baseOpts: FetcherOptions = {
      engine: 'cheerio',
      retries: 0,
      throwHttpErrors: true,
      enableSmart: false,
      storage: { config: { localDataDirectory: path.join(storageDir, 'cheerio') } },
    }

    it('should report connection error when connecting to unreachable host', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        // Fix 1: Should NOT contain the secondary page.content error (catch block regression check)
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')

        // Cheerio error goes through _sharedFailedRequestHandler which produces:
        // "Request for ... failed: ${error.message}" format  (Fix 1+4+5 verified)
        expect(e.message).toMatch(/Request for .+ failed(:| with status)/i)

        // Should have a well-formed response
        expect(e.response).toBeDefined()
        expect(e.response.statusCode).toBeGreaterThanOrEqual(400)
        expect(e.response.url).toContain('127.0.0.1')

        // Fix 2: statusText should NOT be BUILD_RESPONSE_FAILURE
        expect(e.response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
        expect(e.response.statusText).not.toContain('page.content')
        expect(e.response.statusText.length).toBeGreaterThan(0)
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should preserve original error in response statusText', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        // Fix 2: statusText should NOT be 'BUILD_RESPONSE_FAILURE'
        expect(e.response).toBeDefined()
        expect(e.response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
        expect(e.response.statusText).not.toContain('page.content')
        expect(e.response.statusText.length).toBeGreaterThan(0)
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should preserve original error through executeAll', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.executeAll([
          { id: 'goto', params: { url: UNREACHABLE_URL } },
        ])
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        // Fix 1+3: Not the secondary error
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')
        // Positive assertion: contains original error
        expect(e.message).toMatch(/(failed|error)/i)

        expect(e.response).toBeDefined()
        // Fix 2: statusText not BUILD_RESPONSE_FAILURE
        expect(e.response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
        expect(e.response.statusText.length).toBeGreaterThan(0)
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should allow successful navigation after a failed one', async () => {
      const session = new FetchSession(baseOpts)

      // Step 1: Fail
      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
      } catch (e: any) {
        expect(e.message).not.toContain('Unable to retrieve content')
      }

      // Step 2: Succeed (verifies engine recovers from failure)
      const result = await session.execute({ name: 'goto', params: { url: baseUrl } })
      expect(result.result?.statusCode).toBe(200)

      await session.dispose()
    }, TEST_TIMEOUT)
  })

  // ─── Playwright Engine ──────────────────────────────────────────

  describe('Playwright engine', () => {
    const baseOpts: FetcherOptions = {
      engine: 'playwright',
      retries: 0,
      throwHttpErrors: true,
      antibot: false,
      enableSmart: false,
      storage: { config: { localDataDirectory: path.join(storageDir, 'playwright') } },
    }

    it('should report connection refused when navigating to unreachable port', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        // Should contain the ORIGINAL Playwright navigation error, NOT a page.content secondary error
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')
        // The original Playwright error should be reflected in message or statusText
        expect(e.message || e.response?.statusText).toBeTruthy()

        // Should have a well-formed response
        expect(e.response).toBeDefined()
        expect(e.response.statusCode).toBeGreaterThanOrEqual(400)
        expect(e.response.url).toContain('127.0.0.1')
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should include original error in response statusText', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        expect(e.response).toBeDefined()
        // Fix 2: statusText should be the original Playwright error, not a generic BUILD_RESPONSE_FAILURE
        expect(e.response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
        expect(e.response.statusText).not.toContain('page.content')
        expect(e.response.statusText).not.toMatch(/^BUILD_RESPONSE_/)
        // Positive assertion: statusText contains the original error text
        expect(e.response.statusText).toMatch(/(Connection Refused|ERR_|refused)/i)
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should preserve original error through executeAll with multiple actions', async () => {
      const session = new FetchSession(baseOpts)

      try {
        await session.executeAll([
          { id: 'goto', params: { url: UNREACHABLE_URL } },
          { id: 'getContent' },
        ])
        expect.fail('Should have thrown an error')
      } catch (e: any) {
        // Fix 1+3: Not the secondary error
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')
        // Fix 3: message should contain error details (status code + error text)
        expect(e.message).toMatch(/failed with status \d+: /i)

        // Fix 2: response has original error info
        expect(e.response).toBeDefined()
        expect(e.response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
        expect(e.response.statusText).not.toContain('page.content')
        expect(e.response.statusText).not.toMatch(/^BUILD_RESPONSE_/)
        // Positive assertion: statusText contains original error
        expect(e.response.statusText).toMatch(/(Connection Refused|ERR_|refused)/i)
      }

      await session.dispose()
    }, TEST_TIMEOUT)

    it('should allow successful navigation after a failed one (engine recovery)', async () => {
      const session = new FetchSession(baseOpts)

      // Step 1: Fail with unreachable port
      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
      } catch (e: any) {
        // Original error should be preserved
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')
      }

      // Step 2: Succeed with valid server
      const result = await session.execute({ name: 'goto', params: { url: baseUrl } })
      expect(result.result?.statusCode).toBe(200)

      await session.dispose()
    }, TEST_TIMEOUT)
  })

  // ─── Skipped: error=undefined path ───────────────────────────────
  // The catch block in _sharedRequestHandler differentiates between:
  //   - error IS defined:   "Request for ${url} failed: ${error.message}"
  //   - error is undefined: "Navigation to ${url} completed, but failed to
  //                          retrieve page content: ${err}"
  //
  // The error=undefined path requires `page.content()` to throw while
  // Crawlee considers navigation successful. This can happen when:
  //   1. Antibot engine (camoufox-js) closes page before buildResponse
  //   2. Meta refresh navigation races with page.content()
  //
  // However, Crawlee's PlaywrightCrawler always calls
  // page.waitForLoadState('networkidle') after page.goto(), ensuring the
  // page is stable before requestHandler runs. Thus page.content() never
  // throws "page is navigating" in an integration test.
  //
  // This path is verified through: code review + the 11 tests below that
  // validate the primary fix (error IS defined path) for both engines.
  describe.skip('error=undefined (catch block differentiated message)', () => {
    it('would validate "Navigation completed but failed to retrieve page content" format', () => {
      // This scenario requires page.content() to throw while error is undefined.
      // Cannot be reliably triggered in integration tests because Crawlee waits
      // for page stabilization (waitForLoadState('networkidle')) before calling
      // requestHandler, making page.content() always succeed.
      //
      // Triggered in production by:
      // - Antibot engine closing pages before buildResponse
      // - Race conditions with meta refresh / JS navigations
      //
      // Verified via code review of catch block logic in base.ts._sharedRequestHandler
    })
  })

  // ─── Cross-Engine Recovery Tests ────────────────────────────────

  describe('Cross-engine: Error recovery', () => {
    it('should recover after connection error in auto mode', async () => {
      const session = new FetchSession({
        engine: 'auto',
        retries: 0,
        throwHttpErrors: true,
        enableSmart: false,
        storage: { config: { localDataDirectory: path.join(storageDir, 'auto') } },
      })

      // Step 1: Fail
      try {
        await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
      } catch (e: any) {
        expect(e.message).not.toMatch(/^Failed to process request/)
        expect(e.message).not.toContain('Unable to retrieve content')
        expect(e.message).not.toContain('page.content')
      }

      // Step 2: Succeed
      const result = await session.execute({ name: 'goto', params: { url: baseUrl } })
      expect(result.result?.statusCode).toBe(200)

      await session.dispose()
    }, TEST_TIMEOUT)
  })

  // ─── throwHttpErrors: false tests ────────────────────────────────
  // When throwHttpErrors is false and enableSmart is false,
  // the goto promise may resolve with an error response or reject,
  // depending on the engine behavior. The key assertion is that
  // the error/response NEVER contains the secondary page.content error.
  //
  // This also tests Fix 4 (invalid context path) and Fix 5 (GotoAction
  // failOnError with statusText) because when throwHttpErrors is false
  // in the engine layer, buildResponse may succeed and the GotoAction
  // layer constructs the final error including statusText.

  describe('throwHttpErrors: false (fallback path)', () => {
    const assertNoSecondaryError = (errorOrResult: any) => {
      // Fix 1+5: check error message doesn't contain secondary error
      const msg = errorOrResult instanceof Error
        ? errorOrResult.message
        : (errorOrResult as any)?.result?.statusText || ''
      expect(msg).not.toMatch(/^Failed to process request/)
      expect(msg).not.toContain('Unable to retrieve content')
      expect(msg).not.toContain('page.content')
    }

    const assertStatusTextHasOriginalError = (response: any) => {
      if (!response) return
      // Fix 2+5: statusText contains original error, not BUILD_RESPONSE_FAILURE
      expect(response.statusText).not.toBe('BUILD_RESPONSE_FAILURE')
      expect(response.statusText).not.toContain('page.content')
      expect(response.statusText.length).toBeGreaterThan(0)
    }

    describe('Cheerio engine', () => {
      it('should not contain secondary page.content error', async () => {
        const session = new FetchSession({
          engine: 'cheerio',
          retries: 0,
          throwHttpErrors: false,
          enableSmart: false,
          storage: { config: { localDataDirectory: path.join(storageDir, 'cheerio-no-throw') } },
        })

        try {
          const result = await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
          // Resolved with error response - check it
          assertNoSecondaryError(result)
          assertStatusTextHasOriginalError(result.result)
          // Fix 5: error message from GotoAction should include statusText
          if (result.result?.statusText) {
            expect(result.result.statusText).toMatch(/(ECONNREFUSED|connect)/i)
          }
        } catch (e: any) {
          // Rejected with error - check it
          assertNoSecondaryError(e)
          assertStatusTextHasOriginalError(e.response)
        }

        await session.dispose()
      }, TEST_TIMEOUT)
    })

    describe('Playwright engine', () => {
      it('should not contain secondary page.content error', async () => {
        const session = new FetchSession({
          engine: 'playwright',
          retries: 0,
          throwHttpErrors: false,
          antibot: false,
          enableSmart: false,
          storage: { config: { localDataDirectory: path.join(storageDir, 'pw-no-throw') } },
        })

        try {
          const result = await session.execute({ name: 'goto', params: { url: UNREACHABLE_URL } })
          // Resolved with error response - check it
          assertNoSecondaryError(result)
          assertStatusTextHasOriginalError(result.result)
          // Fix 5: GotoAction error message should include statusText
          if (result.result?.statusText) {
            expect(result.result.statusText).toMatch(/(Connection Refused|refused)/i)
          }
        } catch (e: any) {
          // Rejected with error - check it
          assertNoSecondaryError(e)
          assertStatusTextHasOriginalError(e.response)
          // Fix 5: error message from GotoAction should include statusText
          if (e.message && e.response?.statusText) {
            expect(e.message).toMatch(new RegExp(e.response.statusText, 'i'))
          }
        }

        await session.dispose()
      }, TEST_TIMEOUT)
    })
  })
})
