import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'node:path'
import { rmSync } from 'node:fs'
import fastify, { FastifyInstance } from 'fastify'
import { AddressInfo } from 'node:net'
import { FetchEngine } from './base'
import './cheerio' // Register cheerio engine
import { OfflineCacheMissErrorCode } from '@isdk/proxy'

const TEST_TIMEOUT = 10000

describe('FetchEngine Cache Suite', () => {
  let server: FastifyInstance
  let baseUrl: string
  const requestCounts: Record<string, number> = {}
  const tmpDir = path.resolve(__dirname, '..', '..', 'tmp', 'cache-test')

  beforeAll(async () => {
    server = fastify({ logger: false })
    server.get('/cacheable', (req, reply) => {
      requestCounts['/cacheable'] = (requestCounts['/cacheable'] || 0) + 1
      reply.header('Cache-Control', 'public, max-age=3600')
      reply.send('Cacheable Content ' + Date.now())
    })
    server.get('/short-ttl', (req, reply) => {
      requestCounts['/short-ttl'] = (requestCounts['/short-ttl'] || 0) + 1
      reply.header('Cache-Control', 'public, max-age=1')
      reply.send('Short TTL Content ' + Date.now())
    })
    server.get('/no-cache', (req, reply) => {
      requestCounts['/no-cache'] = (requestCounts['/no-cache'] || 0) + 1
      reply.header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
      reply.send('No Cache Content ' + Date.now())
    })
    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  })

  afterAll(async () => {
    await server.close()
    rmSync(tmpDir, { recursive: true, force: true })
  })

  it('should cache requests and return HIT on second fetch', async () => {
    const storageId = `test-cache-${Date.now()}`
    const context: any = {
      id: storageId,
      engine: 'http',
      storage: {
        persist: true,
      },
      cache: {
        enabled: true,
        storagePath: path.join(tmpDir, storageId),
        forceCache: true,
      }
    }

    const engine = (await FetchEngine.create(context)) as FetchEngine

    // First fetch: MISS
    const res1 = await engine.goto(`${baseUrl}/cacheable`)
    expect(res1!.metadata?.cache).toBe('MISS')
    const content1 = res1!.text

    // Second fetch: HIT
    const res2 = await engine.goto(`${baseUrl}/cacheable`)
    expect(res2!.metadata?.cache).toBe('HIT')
    expect(res2!.text).toBe(content1)

    await engine.dispose()
  }, TEST_TIMEOUT)

  it('should handle offline mode and throw error when not in cache', async () => {
    const storageId = `test-offline-throw-${Date.now()}`
    const context: any = {
      id: storageId,
      engine: 'http',
      debug: true,
      throwHttpErrors: true,
      // storage: {
      //   persist: true,
      // },
      cache: {
        enabled: true,
        offline: true,
        storagePath: path.join(tmpDir, storageId),
      }
    }

    const engine = (await FetchEngine.create(context)) as FetchEngine

    // Fetch in offline mode without cache should fail
    try {
      await engine.goto(`${baseUrl}/cacheable`)
      throw new Error('Should have thrown an error')
    } catch (e: any) {
      expect(e.code).toBe(OfflineCacheMissErrorCode)
      expect(e.message).toMatch(/Offline mode: No cached/)
    }

    await engine.dispose()
  }, TEST_TIMEOUT)

  it('should return HIT even when HTTP cache expires if forceCache is true', async () => {
    requestCounts['/cacheable'] = 0

    const storageId = `test-expiry-${Date.now()}`
    const context: any = {
      id: storageId,
      engine: 'http',
      storage: {
        persist: true,
      },
      cache: {
        enabled: true,
        storagePath: path.join(tmpDir, storageId),
        forceCache: true,
      }
    }

    const engine = (await FetchEngine.create(context)) as FetchEngine

    // First fetch: MISS
    const res1 = await engine.goto(`${baseUrl}/cacheable`)
    expect(res1!.metadata?.cache).toBe('MISS')
    const content1 = res1!.text

    // Wait for 1.5s to ensure HTTP TTL expires
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Second fetch: should still be HIT because of forceCache
    const res2 = await engine.goto(`${baseUrl}/cacheable`)
    expect(res2!.metadata?.cache).toBe('HIT')
    expect(res2!.text).toBe(content1)
    expect(requestCounts['/cacheable']).toBe(1)

    await engine.dispose()
  }, TEST_TIMEOUT)

  it('should return HIT even with no-cache/max-age=0 if forceCache is true', async () => {
    requestCounts['/no-cache'] = 0

    const storageId = `test-nocache-${Date.now()}`
    const context: any = {
      id: storageId,
      engine: 'http',
      storage: {
        persist: true,
      },
      cache: {
        enabled: true,
        storagePath: path.join(tmpDir, storageId),
        forceCache: true,
      }
    }

    const engine = (await FetchEngine.create(context)) as FetchEngine

    // First fetch: MISS
    const res1 = await engine.goto(`${baseUrl}/no-cache`)
    expect(res1!.metadata?.cache).toBe('MISS')
    const content1 = res1!.text

    // Second fetch: should be HIT because of forceCache, ignoring max-age=0
    const res2 = await engine.goto(`${baseUrl}/no-cache`)
    expect(res2!.metadata?.cache).toBe('HIT')
    expect(res2!.text).toBe(content1)
    expect(requestCounts['/no-cache']).toBe(1)

    await engine.dispose()
  }, TEST_TIMEOUT)
})
