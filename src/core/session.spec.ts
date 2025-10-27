import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import fastify, { FastifyInstance } from 'fastify';
import formbody from '@fastify/formbody';
import { AddressInfo } from 'net';

import '../engine';
// The things to test
import { FetchSession } from './session';

// Dependencies for testing
import '../action/definitions'; // to register all actions
import { FetcherOptions } from './types';
import { FetchActionResultStatus } from '../action/fetch-action';
import { CommonError } from '@isdk/common-error';

const TEST_TIMEOUT = 5000; // 5s

// 1. 本地测试服务器 (copied from action.spec.ts)
const createTestServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: false });
  server.register(formbody as any);

  // 首页
  server.get('/', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Welcome</h1>
        <a href="/page2">Go to Page 2</a>
        <form action="/submit" method="post">
          <input type="text" name="test_input" value="initial" />
          <input type="submit" value="Submit" />
        </form>
      </body>
      </html>
    `);
  });

  // 第二页
  server.get('/page2', (req, reply) => {
    reply.type('text/html').send('<h2>Page 2</h2>');
  });

  // 表单提交 (JSON)
  server.post('/submit', (req, reply) => {
    const body = req.body as { test_input: string };
    reply.send(`Submitted: ${body.test_input}`);
  });

  return server;
};


describe.sequential('FetchSession', () => {
  let server: FastifyInstance;
  let baseUrl: string;

  beforeAll(async () => {
    server = await createTestServer();
    await server.listen({ port: 0 });
    const address = server.server.address() as AddressInfo;
    baseUrl = `http://localhost:${address.port}`;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    await server.close();
  });

  let session: FetchSession;
  const createSession = (options: FetcherOptions = {}) => {
    session = new FetchSession({
      engine: 'cheerio', // default to cheerio for speed
      ...options,
    });
  };

  afterEach(async () => {
    if (session) {
      await session.dispose();
    }
  });

  it('should create a session with a context', () => {
    createSession();
    expect(session).toBeInstanceOf(FetchSession);
    expect(session.id).toBeTypeOf('string');
    expect(session.context).toBeDefined();
    expect(session.context.id).toBe(session.id);
  });

  it('should execute a single "goto" action and initialize engine', async () => {
    createSession();
    const result = await session.execute({ name: 'goto', params: { url: baseUrl } });

    expect(result.status).toBe(FetchActionResultStatus.Success);
    expect(result.returnType).toBe('response');
    expect(result.result!.statusCode).toBe(200);

    // Check if engine is initialized and has content
    const content = await session.context.internal.engine!.getContent();
    expect(content.html).toContain('<h1>Welcome</h1>');
  });

  it('should throw when executing on a closed session', async () => {
    createSession();
    await session.dispose();
    await expect(session.execute({ name: 'goto', params: { url: baseUrl } })).rejects.toThrow('Session is closed');
  });

  it('should throw for an unknown action', async () => {
    createSession();
    await expect(session.execute({ name: 'nonexistent-action' })).rejects.toThrow('Unknown action: nonexistent-action');
  });

  it('should execute a sequence of actions with executeAll', async () => {
    createSession();
    const response = await session.executeAll([
      { name: 'goto', params: { url: baseUrl } },
      { name: 'fill', params: { selector: 'input[name="test_input"]', value: 'session_test' } },
      { name: 'submit', params: { selector: 'form' } },
    ]);

    expect(response).toBeDefined();
    expect(response!.text).toContain('Submitted: session_test');

    const content = await session.context.internal.engine!.getContent();
    expect(content.text).toContain('Submitted: session_test');
  });

  it('should emit action:start and action:end events', async () => {
    createSession();
    const startListener = vi.fn();
    const endListener = vi.fn();
    session.context.eventBus.on('action:start', startListener);
    session.context.eventBus.on('action:end', endListener);

    await session.execute({ name: 'goto', params: { url: baseUrl } });

    expect(startListener).toHaveBeenCalledOnce();
    expect(startListener).toHaveBeenCalledWith(expect.objectContaining({
      context: expect.objectContaining({id: session.id}),
      action: expect.objectContaining({id: 'goto'}),
    }));

    expect(endListener).toHaveBeenCalledOnce();
    expect(endListener).toHaveBeenCalledWith(expect.objectContaining({
      context: expect.objectContaining({id: session.id}),
      action: expect.objectContaining({id: 'goto'}),
      result: expect.any(Object),
    }));
    const [event] = endListener.mock.calls[0];
    expect(event).not.toHaveProperty('error');
  });

  it('should emit session:closing and session:closed events on dispose', async () => {
    createSession();
    const closingListener = vi.fn();
    const closedListener = vi.fn();
    session.context.eventBus.on('session:closing', closingListener);
    session.context.eventBus.on('session:closed', closedListener);

    await session.dispose();

    expect(closingListener).toHaveBeenCalledOnce();
    expect(closingListener).toHaveBeenCalledWith({ sessionId: session.id });

    expect(closedListener).toHaveBeenCalledOnce();
    expect(closedListener).toHaveBeenCalledWith({ sessionId: session.id });
  });

  it('should handle action execution error', async () => {
    createSession();
    const endListener = vi.fn();
    session.context.eventBus.on('action:end', endListener);

    const action = { name: 'goto', params: { url: 'http://localhost:9999/invalid' }, failOnError: true };
    await expect(session.execute(action)).rejects.toThrow();

    expect(endListener).toHaveBeenCalledOnce();
    expect(endListener).toHaveBeenCalledWith(expect.objectContaining({
      context: expect.objectContaining({id: session.id}),
      action: expect.objectContaining({id: 'goto'}),
      result: expect.objectContaining({error: expect.any(Error)}),
      error: expect.any(Error),
    }));
  });

  it('should store and retrieve outputs', async () => {
    createSession();
    await session.executeAll([
      { name: 'goto', params: { url: baseUrl } },
      {
        name: 'getContent',
        storeAs: 'content1' // Correct: Use 'storeAs' to save the result to outputs
      }
    ]);

    const outputs = session.getOutputs();
    expect(outputs).toHaveProperty('content1');
    expect(outputs.content1.html).toContain('<h1>Welcome</h1>');
  });

});
