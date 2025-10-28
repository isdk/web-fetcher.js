import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import fastify, { FastifyInstance } from 'fastify';
import formbody from '@fastify/formbody';
import { AddressInfo } from 'net';
import {EventEmitter} from 'events-ex';

// The things to test
import { FetchAction, FetchActionResultStatus } from './fetch-action';
import './definitions'; // to register all actions
import { GotoAction } from './definitions/goto';
import { FillAction } from './definitions/fill';
import { SubmitAction } from './definitions/submit';
import { GetContentAction } from './definitions/get-content';
import { ClickAction } from './definitions/click';
import { WaitForAction } from './definitions/wait-for';
import { ExtractAction } from './definitions/extract';


// Dependencies for testing
import { FetchEngine } from '../engine/base';
import { CheerioFetchEngine } from '../engine/cheerio';
import { PlaywrightFetchEngine } from '../engine/playwright';
import { FetchContext, FetchEngineContext } from '../core/context';
import { FetchResponse } from '../core/types';

const TEST_TIMEOUT = 5000; // 5s

// 1. 本地测试服务器 (copied from engine.spec.ts)
const createTestServer = async (): Promise<FastifyInstance> => {
  const server = fastify({ logger: false });
  server.register(formbody as any);

  // State for rate limiting
  const requests = new Map<string, number>();
  server.decorate('clearRateLimit', () => requests.clear());

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
        <a href="/protected">Protected Page</a>
        <a href="/slow">Slow Page</a>
        <form action="/submit" method="post">
          <input type="text" name="test_input" value="initial" />
          <input type="submit" value="Submit" />
        </form>
      </body>
      </html>
    `);
  });

  // Extract test page
  server.get('/extract-test', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Extract Test Page</title>
      </head>
      <body>
        <h1 class="title">Article Title</h1>
        <div class="author" data-id="123">
          <span class="name">John Doe</span>
          <a class="profile-link" href="/profiles/johndoe">View Profile</a>
        </div>
        <ul class="tags">
          <li class="tag">tech</li>
          <li class="tag">news</li>
          <li class="tag">web</li>
        </ul>
      </body>
      </html>
    `);
  });

  // 第二页
  server.get('/page2', (req, reply) => {
    reply.type('text/html').send('<h2>Page 2</h2>');
  });

   // 慢速页
  server.get('/slow', async (req, reply) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    reply.type('text/html').send('Finally loaded');
  });

  // 表单提交 (JSON)
  server.post('/submit', (req, reply) => {
    const body = req.body as { test_input: string };
    reply.send(`Submitted: ${body.test_input}`);
  });

  return server;
};


// 2. 可复用的测试套件
const actionTestSuite = (engineName: string, EngineClass: typeof CheerioFetchEngine | typeof PlaywrightFetchEngine) => {
  describe.sequential(`FetchAction Suite: ${engineName}`, () => {
    let server: FastifyInstance & { clearRateLimit: () => void };
    let baseUrl: string;
    let context: FetchContext;
    let engine: FetchEngine;

    beforeAll(async () => {
      server = await createTestServer() as any;
      await server.listen({ port: 0 });
      const address = server.server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
    }, TEST_TIMEOUT);

    afterAll(async () => {
      await server.close();
    });

    // 每个测试前创建新引擎实例和上下文
    beforeEach(async () => {
      server.clearRateLimit();
      const engineCtx: FetchEngineContext = { id: `test-action-${engineName}-${Date.now()}`, engine: engineName as any, retries: 1, internal: {} };
      engine = (await FetchEngine.create(engineCtx, {
          engine: engineName as any,
          headers: { 'User-Agent': 'web-fetcher/1.0' },
      })) as FetchEngine;
      expect(engine).toBeInstanceOf(EngineClass);

      context = {
        id: engineCtx.id,
        engine: engineName as any,
        url: baseUrl,
        eventBus: new EventEmitter(),
        outputs: {},
        internal: { engine },
        execute: undefined as unknown as any,
        action: undefined as unknown as any,
      } as FetchContext;
    });

    // 每个测试后清理
    afterEach(async () => {
      await engine.dispose();
    });

    it('should execute goto action', async () => {
      const gotoAction = FetchAction.create('goto');
      expect(gotoAction).toBeInstanceOf(GotoAction);

      const result = await gotoAction!.execute(context, { params: { url: baseUrl } });

      expect(result.status).toBe(FetchActionResultStatus.Success);
      expect(result.returnType).toBe('response');

      const response = result.result as FetchResponse;
      expect(response.statusCode).toBe(200);

      const content = await context.internal.engine!.getContent();
      expect(content.html).toContain('<h1>Welcome</h1>');
    }, TEST_TIMEOUT);

    it('should execute getContent action', async () => {
      await engine.goto(baseUrl); // Initial navigation

      const getContentAction = FetchAction.create('getContent');
      expect(getContentAction).toBeInstanceOf(GetContentAction);

      const result = await getContentAction!.execute(context);

      expect(result.status).toBe(FetchActionResultStatus.Success);
      expect(result.returnType).toBe('response');
      const response = result.result as FetchResponse;
      expect(response.html).toContain('<h1>Welcome</h1>');
    }, TEST_TIMEOUT);

    it('should execute click action to navigate', async () => {
      await engine.goto(baseUrl);

      const clickAction = FetchAction.create('click');
      expect(clickAction).toBeInstanceOf(ClickAction);

      await clickAction!.execute(context, { params: { selector: 'a[href="/page2"]' } });

      const content = await engine.getContent();

      expect(content.finalUrl).toBe(`${baseUrl}/page2`);
      expect(content.html).toContain('<h2>Page 2</h2>');
    }, TEST_TIMEOUT);

    it('should execute fill and submit actions', async () => {
      await engine.goto(baseUrl);

      const fillAction = FetchAction.create('fill');
      expect(fillAction).toBeInstanceOf(FillAction);
      await fillAction!.execute(context, {
          params: {
              selector: 'input[name="test_input"]',
              value: 'action_test_value'
          }
      });

      const submitAction = FetchAction.create('submit');
      expect(submitAction).toBeInstanceOf(SubmitAction);
      await submitAction!.execute(context, {
          params: {
              selector: 'form[action="/submit"]',
              enctype: 'application/json'
          }
      });

      const content = await engine.getContent();
      expect(content.text).toContain('Submitted: action_test_value');
    }, TEST_TIMEOUT);

    it('should execute waitFor action', async () => {
      const waitForAction = FetchAction.create('waitFor');
      expect(waitForAction).toBeInstanceOf(WaitForAction);

      const start = Date.now();
      await engine.goto(baseUrl);
      const result = await waitForAction!.execute(context, { params: { ms: 500 } });
      const duration = Date.now() - start;

      expect(result.status).toBe(FetchActionResultStatus.Success);
      expect(duration).toBeGreaterThanOrEqual(480); // allow some tolerance
    }, TEST_TIMEOUT);

    it('should execute extract action', async () => {
      await engine.goto(`${baseUrl}/extract-test`);

      const extractAction = FetchAction.create('extract');
      expect(extractAction).toBeInstanceOf(ExtractAction);

      const testSchema = {
        type: 'object',
        properties: {
          title: {
            selector: '.title',
            type: 'string',
          },
          author: {
            type: 'object',
            selector: '.author',
            properties: {
              name: { selector: '.name' },
              profile: { selector: 'a', attribute: 'href' },
            },
          },
          tags: {
            type: 'array',
            selector: '.tag',
            items: { type: 'string' },
          },
        },
      } as const;

      const result = await extractAction!.execute(context, { params: testSchema });

      expect(result.status).toBe(FetchActionResultStatus.Success);
      expect(result.returnType).toBe('any');
      expect(result.result).toEqual({
        title: 'Article Title',
        author: {
          name: 'John Doe',
          profile: '/profiles/johndoe',
        },
        tags: ['tech', 'news', 'web'],
      });
    }, TEST_TIMEOUT);

  });
};

// 3. 运行测试
actionTestSuite('cheerio', CheerioFetchEngine);
actionTestSuite('playwright', PlaywrightFetchEngine);
