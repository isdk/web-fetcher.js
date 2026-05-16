import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import { rmSync } from 'node:fs'
import fastify, { FastifyInstance } from 'fastify'
import { AddressInfo } from 'node:net'
import { fetchWeb } from '../index'
import './cheerio'
import './playwright'

const TEST_TIMEOUT = 30000
describe('FetchEngine Upgrade & Cache Healing Integration', () => {
  let server: FastifyInstance
  let baseUrl: string
  const requestLogs: string[] = []
  const tmpDir = path.join(os.tmpdir(), 'web-fetcher-upgrade-cache-test')
  let serverState = {
    isEvil: false,
    maxAge: 3600,
  }

  beforeAll(async () => {
    server = fastify({ logger: false })

    // Simulate a WAF protected endpoint
    server.get('/waf-protected', async (req, reply) => {
      const cookie = req.headers.cookie || ''
      requestLogs.push(`Request to /waf-protected: Cookie=${cookie}`)

      if (serverState.isEvil) {
        // Simulation of Proxy's STALE_RESCUE logic:
        // Even if the engine tries to refresh, if we still return a challenge,
        // the proxy (mocked here) returns the rescue data.
        if (req.headers['x-isdk-proxy-refresh'] === 'true') {
          return reply
            .header('x-proxy-cache', 'STALE_RESCUE_WAF_CHALLENGE')
            .send('Old Secret Content')
        }
      }

      if (cookie.includes('verified=true')) {
        return reply
          .header('Cache-Control', `public, max-age=${serverState.maxAge}`)
          .send('Secret Content ' + Date.now())
      } else {
        // Return WAF challenge
        return reply
          .code(403)
          // We mock the proxy's header in the test server for simplicity
          // to trigger the Fetcher's upgrade logic
          .header('x-proxy-cache', 'MISS_EXCLUDED_WAF_CHALLENGE')
          .send('<html><title>Just a moment...</title><body>WAF Challenge Page</body></html>')
      }
    })

    // A starting page to test upgrades during actions
    server.get('/start-page', async (req, reply) => {
      return reply.type('text/html').send(`
        <html><body>
          <a href="${baseUrl}/waf-protected" id="login">Login</a>
        </body></html>
      `)
    })

    // Unique URL for STALE_RESCUE test
    server.get('/waf-protected-rescue', async (req, reply) => {
      if (serverState.isEvil) {
        return reply
          .code(403)
          .send('<html><title>Just a moment...</title><body>WAF Challenge Page</body></html>')
      }
      return reply
        .header('Cache-Control', `public, max-age=${serverState.maxAge}`)
        .send('Initial Content')
    })

    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  })

  afterAll(async () => {
    await server.close()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('should upgrade from http to browser on WAF and heal cache after manual verification', async () => {
    const storageId = `test-heal-${Date.now()}`
    const storagePath = path.join(tmpDir, storageId)
    requestLogs.length = 0
    serverState.isEvil = false

    // 1. Attempt: Use fetchWeb with 'auto' engine
    const { result, outputs: finalOutputs } = await fetchWeb({
      url: `${baseUrl}/waf-protected`,
      engine: 'auto',
      enableSmart: true,
      storage: { id: storageId },
      cache: {
        enabled: true,
        storagePath,
      },
      actions: [
        // This action will only be reached by the Browser engine after upgrade
        {
          id: 'evaluate',
          params: {
            fn: () => { document.cookie = "verified=true; path=/"; }
          }
        },
        // Navigate again to trigger the verified response
        { id: 'goto', params: { url: `${baseUrl}/waf-protected` } },
        { id: 'extract', params: { selector: 'body' }, storeAs: 'data' }
      ]
    })

    expect(result!.metadata!.mode).toBe('browser')
    expect(finalOutputs.data).toContain('Secret Content')

    // 2. Second attempt: Use http engine again. It should now HIT the cache!
    const res2: any = await fetchWeb({
      url: `${baseUrl}/waf-protected`,
      engine: 'http',
      cache: {
        enabled: true,
        storagePath,
      }
    })

    expect(res2.result.metadata.cache).toBe('HIT')
    expect(res2.result.text).toContain('Secret Content')
  }, TEST_TIMEOUT)

  it('should upgrade engine when WAF is encountered during a click navigation', async () => {
    const storageId = `test-action-upgrade-${Date.now()}`
    serverState.isEvil = false

    const { result, outputs: finalOutputs } = await fetchWeb({
      url: `${baseUrl}/start-page`,
      engine: 'auto',
      enableSmart: true,
      storage: { id: storageId },
      actions: [
        { id: 'click', params: { selector: '#login' } },
        // Click leads to /waf-protected, which triggers EngineUpgradeError
        // After upgrade, we should be in browser mode and continue actions
        {
          id: 'evaluate',
          params: { fn: () => { document.cookie = "verified=true; path=/"; } }
        },
        { id: 'goto', params: { url: `${baseUrl}/waf-protected` } },
        { id: 'extract', params: { selector: 'body' }, storeAs: 'data' }
      ]
    })

    expect(result!.metadata!.mode).toBe('browser')
    expect(finalOutputs.data).toContain('Secret Content')
  }, TEST_TIMEOUT)

  it('should return STALE_RESCUE data if browser healing still encounters WAF', async () => {
    const storageId = `test-stale-rescue-${Date.now()}`
    const storagePath = path.join(tmpDir, storageId)
    serverState.isEvil = false
    serverState.maxAge = 1 // 1s TTL
    // Use a unique URL to avoid interference
    const rescueUrl = `${baseUrl}/waf-protected-rescue`

    // 1. Success first to populate cache with 1s TTL
    await fetchWeb({
      url: rescueUrl,
      cache: { enabled: true, storagePath }
    })

    // 2. Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 1100))

    // 3. Now server becomes "Evil" (always returns challenge)
    serverState.isEvil = true

    const { result } = await fetchWeb({
      url: rescueUrl,
      engine: 'auto',
      enableSmart: true,
      // Disable background update to wait for the rescue result synchronously
      cache: { enabled: true, storagePath, backgroundUpdate: false },
    }) as any

    // Should return the stale rescue data from the proxy mock
    expect(result.metadata.cache).toBe('STALE_RESCUE_WAF_CHALLENGE')
    expect(result.text).toBe('Initial Content')
  }, TEST_TIMEOUT)
})
