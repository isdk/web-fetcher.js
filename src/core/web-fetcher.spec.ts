import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { AddressInfo } from 'net'
import fastify, { FastifyInstance } from 'fastify'

import '../engine'
import '../action/definitions'
import { fetchWeb } from '../fetch-web'
import type { FetchActionOptions } from './types'

/**
 * Regression test: `WebFetcher.fetch` used to `unshift` the auto-inserted
 * `goto` action into the caller's `actions` array in place. Callers that
 * reuse one array across fetches (e.g. a module-level schema) leaked a
 * stale `goto` into every subsequent fetch, making a later session
 * re-navigate to the previous URL and return its content.
 */
describe('WebFetcher.fetch', () => {
  let serverA: FastifyInstance
  let serverB: FastifyInstance
  let urlA: string
  let urlB: string

  beforeAll(async () => {
    serverA = fastify({ logger: false })
    serverB = fastify({ logger: false })
    serverA.get('/page', async (_req, reply) => {
      reply.type('text/html').send('<!DOCTYPE html><html><body><h1>PAGE-A</h1></body></html>')
    })
    serverB.get('/page', async (_req, reply) => {
      reply.type('text/html').send('<!DOCTYPE html><html><body><h1>PAGE-B</h1></body></html>')
    })
    await serverA.listen()
    await serverB.listen()
    urlA = `http://127.0.0.1:${(serverA.server.address() as AddressInfo).port}/page`
    urlB = `http://127.0.0.1:${(serverB.server.address() as AddressInfo).port}/page`
  })

  afterAll(async () => {
    await serverA.close()
    await serverB.close()
  })

  it('does not mutate a shared actions array across fetches', async () => {
    // Reused by both calls on purpose (mirrors a module-level schema).
    const sharedActions: FetchActionOptions[] = []

    const r1 = await fetchWeb(urlA, {
      engine: 'http',
      enableSmart: false,
      throwHttpErrors: false,
      actions: sharedActions,
    } as any)
    expect(r1.result?.text).toContain('PAGE-A')

    const r2 = await fetchWeb(urlB, {
      engine: 'http',
      enableSmart: false,
      throwHttpErrors: false,
      actions: sharedActions,
    } as any)
    // Before the fix this resolved to PAGE-A (re-navigated to urlA).
    expect(r2.result?.text).toContain('PAGE-B')
    // The caller's array must be untouched.
    expect(sharedActions).toEqual([])
  })
})
