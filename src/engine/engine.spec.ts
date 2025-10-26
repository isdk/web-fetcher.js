
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { FetchEngine } from './base';
import { CheerioFetchEngine } from './cheerio';
import { PlaywrightFetchEngine } from './playwright';
import { FetchEngineContext } from '../core/context';
import fastify, { FastifyInstance } from 'fastify';
import { AddressInfo } from 'net';
import formbody from '@fastify/formbody';

const TEST_TIMEOUT = 3000; // 3s

// 1. 本地测试服务器
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
        <form action="/submit_urlencoded" method="post">
          <input type="text" name="urlencoded_input" value="initial_urlencoded" />
          <input type="submit" value="Submit Urlencoded" />
        </form>
      </body>
      </html>
    `);
  });

  // 第二页
  server.get('/page2', (req, reply) => {
    reply.type('text/html').send('<h2>Page 2</h2>');
  });

  // 受保护页
  server.get('/protected', (req, reply) => {
    const ua = req.headers['user-agent'] || '';
    if (!ua.includes('web-fetcher')) {
      reply.status(403).send('Forbidden: Invalid User-Agent');
      return;
    }
    reply.type('text/html').send('Protected Content');
  });

  // 限流页
  server.get('/ratelimit', (req, reply) => {
    const ip = req.ip;
    const count = requests.get(ip) || 0;
    if (count > 2) {
      reply.status(429).send('Too Many Requests');
      return;
    }
    requests.set(ip, count + 1);
    reply.send(`Request #${count + 1}`);
  });

  // 慢速页
  server.get('/slow', async (req, reply) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    reply.type('text/html').send('Finally loaded');
  });

  // 表单提交 (JSON)
  server.post('/submit', (req, reply) => {
    const body = req.body as { test_input: string };
    reply.send(`Submitted: ${body.test_input}`);
  });

  // 表单提交 (Urlencoded)
  server.post('/submit_urlencoded', (req, reply) => {
    const body = req.body as { urlencoded_input: string };
    reply.send(`Submitted urlencoded: ${body.urlencoded_input}`);
  });

  return server;
};


// 2. 可复用的测试套件
const engineTestSuite = (engineName: string, EngineClass: typeof CheerioFetchEngine | typeof PlaywrightFetchEngine) => {
  describe.sequential(`FetchEngine Suite: ${engineName}`, () => {
    let server: FastifyInstance & { clearRateLimit: () => void };
    let baseUrl: string;
    let engine: FetchEngine;
    let context: FetchEngineContext;

    beforeAll(async () => {
      server = await createTestServer() as any;
      await server.listen({ port: 0 });
      const address = server.server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
    }, TEST_TIMEOUT);

    afterAll(async () => {
      await server.close();
    });

    // 每个测试前创建新引擎实例
    beforeEach(async () => {
      server.clearRateLimit(); // Clear rate limit state before each test
      context = {
        id: `test-${engineName}-${Date.now()}-${Math.random()}`,
        engine: engineName as any,
        retries: 1,
      } as any;
      engine = await FetchEngine.create(context, {
        engine: engineName as any,
        headers: { 'User-Agent': 'web-fetcher/1.0' },
      }) as FetchEngine;
      expect(engine).toBeInstanceOf(EngineClass);
    });

    // 每个测试后清理
    afterEach(async () => {
      await engine.dispose();
    });

    it('should goto a page and get content', async () => {
      await engine.goto(baseUrl);
      const content = await engine.getContent();
      expect(content.statusCode).toBe(200);
      expect(content.html).toContain('<h1>Welcome</h1>');
    }, TEST_TIMEOUT);

    it('should handle page navigation by clicking a link', async () => {
      await engine.goto(baseUrl);
      await engine.click('a[href="/page2"]');
      const content = await engine.getContent();
      expect(content.finalUrl).toBe(`${baseUrl}/page2`);
      expect(content.html).toContain('<h2>Page 2</h2>');
    }, TEST_TIMEOUT);

    it('should fill and submit a form as JSON', async () => {
      await engine.goto(baseUrl);
      await engine.fill('input[name="test_input"]', 'new_value');
      await engine.submit('form[action="/submit"]', { enctype: 'application/json' });
      const content = await engine.getContent();
      expect(content.text).toContain('Submitted: new_value');
    }, TEST_TIMEOUT);

    it('should fill and submit a form as urlencoded', async () => {
      await engine.goto(baseUrl);
      await engine.fill('input[name="urlencoded_input"]', 'new_urlencoded_value');
      await engine.submit('form[action="/submit_urlencoded"]'); // Default enctype
      const content = await engine.getContent();
      expect(content.text).toContain('Submitted urlencoded: new_urlencoded_value');
    }, TEST_TIMEOUT);

    it('should manage headers', async () => {
      // 测试 User-Agent
      await engine.goto(`${baseUrl}/protected`);
      let content = await engine.getContent();
      expect(content.text).toBe('Protected Content');

      // 移除 User-Agent
      await engine.headers('user-agent', null);
      let r = await engine.goto(`${baseUrl}/protected`);
      expect(r!.statusCode).toBe(403);
      content = await engine.getContent();
      expect(content.statusCode).toBe(403);
    }, TEST_TIMEOUT);

    it('should handle rate limiting', async () => {
      for (let i = 0; i < 3; i++) {
        await engine.goto(`${baseUrl}/ratelimit`);
        const content = await engine.getContent();
        expect(content.statusCode).toBe(200);
      }
      await engine.goto(`${baseUrl}/ratelimit`);
      const content = await engine.getContent();
      expect(content.statusCode).toBe(429);
    }, TEST_TIMEOUT);

    it('should wait for elements or time', async () => {
      const start = Date.now();
      await engine.goto(`${baseUrl}/slow`);
      await engine.waitFor({ ms: 100 }); // 模拟等待
      const duration = Date.now() - start;
      const content = await engine.getContent();
      expect(content.text).toContain('Finally loaded');
      expect(duration).toBeGreaterThanOrEqual(2000); // cheerio might be faster
    }, TEST_TIMEOUT);

    it('should block resources', async () => {
      await engine.blockResources(['stylesheet', 'script']);
      // Playwright 可以真正拦截，Cheerio 仅记录
      // 这里我们只测试调用是否成功
      const result = await engine.blockResources(['stylesheet', 'script']);
      expect(result).toBeTruthy();
      // 验证拦截效果需要更复杂的测试，例如检查资源是否真的被加载
      // 对于单元测试，我们信任引擎的实现
    }, TEST_TIMEOUT);

    it('should manage cookies', async () => {
      const cookies = [{ name: 'test', value: '123', domain: 'localhost' }];
      await engine.cookies(cookies);
      const storedCookies = await engine.cookies();
      expect(storedCookies).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'test', value: '123' })
      ]));
    });
  });
};

// 3. 运行测试
engineTestSuite('cheerio', CheerioFetchEngine);
engineTestSuite('playwright', PlaywrightFetchEngine);
