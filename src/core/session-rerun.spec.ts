import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'
import { WebFetcher } from './web-fetcher'
import '../engine'
import '../action/definitions'
import { FetchAction } from '../action/fetch-action'
import { FetchContext } from './context'
import { BaseFetchActionProperties } from './types'

const TEST_TIMEOUT = 30000
const storageDir = path.join(os.tmpdir(), 'web-fetcher-session-rerun-split')

describe('Issue 1: Target page closed after failure', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    fs.rmSync(storageDir, { recursive: true, force: true })
    fs.mkdirSync(storageDir, { recursive: true })
    server = fastify()
    server.get('/', async (req, reply) => {
      reply.type('text/html').send('<h1>Home</h1>')
    })
    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`
  })

  afterAll(async () => {
    await server.close()
  })

  it('should allow subsequent executeAll after a failed navigation', async () => {
    const fetcher = new WebFetcher()
    const session = await fetcher.createSession({
      debug: true,
      engine: 'playwright', // Focus on playwright specifically for this issue
      retries: 0,
      storage: {
        config: { localDataDirectory: path.join(storageDir, 'issue1') },
      },
    })

    console.log('--- Phase 1: Fail with invalid URL ---')
    try {
      await session.executeAll([
        { id: 'goto', params: { url: 'http://localhost:1' } }
      ])
      expect.fail('Should have failed')
    } catch (e: any) {
      console.log('Phase 1 failed as expected:', e.message)
    }

    console.log('--- Phase 2: Success with valid URL ---')
    const res = await session.executeAll([
      { id: 'goto', params: { url: baseUrl } },
      { id: 'extract', params: { schema: { title: 'h1' } }, storeAs: 'data' }
    ])

    expect(res.outputs.data.title).toBe('Home')
    await session.dispose()
  }, TEST_TIMEOUT)
})

describe('Issue 2: Persistent engine upgrade in auto mode', () => {
  let server: FastifyInstance
  let baseUrl: string

  beforeAll(async () => {
    server = fastify()
    server.get('/normal', async (req, reply) => {
      reply.type('text/html').send('<h1>Normal</h1>')
    })
    server.get('/trigger-upgrade', async (req, reply) => {
      reply.status(403).send('Forbidden - Trigger Upgrade')
    })
    await server.listen({ port: 0 })
    const address = server.server.address() as AddressInfo
    baseUrl = `http://localhost:${address.port}`

    FetchAction.register(GetEngineAction)

  })

  afterAll(async () => {
    FetchAction.unregister(GetEngineAction.id)
    await server.close()
  })

  it('should reset to http for new goto in auto mode after an upgrade', async () => {
    const fetcher = new WebFetcher()
    const session = await fetcher.createSession({
      // debug: true,
      engine: 'auto',
      enableSmart: true,
      retries: 0,
      storage: {
        config: { localDataDirectory: path.join(storageDir, 'issue2') },
      },
    })

    console.log('--- Phase 1: Trigger Upgrade ---')
    const usedParams: any = {}
    try {
      await session.executeAll([
        { id: 'GetEngine', params: usedParams },
        { id: 'goto', params: { url: `${baseUrl}/trigger-upgrade` } }
      ])
    } catch (e) {
      // Expected to fail if throwHttpErrors is true, or just upgrade
    }
    // 当executeAll执行完毕，引擎就恢复了，session.context.internal.engine?.mode 测不到！只能这样测
    expect(usedParams.engine?.mode).toBe('browser')

    console.log('--- Phase 2: New navigation should start with http ---')
    await session.executeAll([
      { id: 'goto', params: { url: `${baseUrl}/normal` } }
    ])

    // We expect it to reset to http for the new goto
    expect(session.context.internal.engine?.mode).toBe('http')

    await session.dispose()
  }, TEST_TIMEOUT)
})

export class GetEngineAction extends FetchAction {
  static override id = 'GetEngine'
  static override returnType = 'none' as const
  static override capabilities = {
    http: 'simulate' as const,
    browser: 'native' as const,
  }

  async onExecute(
    context: FetchContext,
    options?: BaseFetchActionProperties
  ): Promise<void> {
    const params = options?.params || {}
    params.engine = context.internal.engine;
  }
}
