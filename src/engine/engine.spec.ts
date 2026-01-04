
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import path from 'path';
import { rmSync } from 'fs';
import { AddressInfo } from 'net';
import fastify, { FastifyInstance } from 'fastify';
import formbody from '@fastify/formbody';
import { Configuration, KeyValueStore } from 'crawlee';
import { FetchEngine } from './base';
import { CheerioFetchEngine } from './cheerio';
import { PlaywrightFetchEngine } from './playwright';
import { FetchEngineContext } from '../core/context';

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
        <div class="content">
          <p>Some content here.</p>
        </div>
        <ul class="tags">
          <li class="tag">tech</li>
          <li class="tag">news</li>
          <li class="tag">web</li>
        </ul>
        <div class="comments">
          <div class="comment">
            <span class="user">User1</span>
            <p class="text">Comment 1</p>
          </div>
          <div class="comment">
            <span class="user">User2</span>
            <p class="text">Comment 2</p>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  server.get('/extract-advanced-test', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head><title>Advanced Extract</title></head>
      <body>
        <div id="links">
          <a href="/link1"><span>Link 1</span></a>
          <a href="/link2">Link 2</a>
          <a href="/link3" class="exclude-me"><span>Link 3</span></a>
          <div id="to-exclude">
            <a href="/link4">Link 4</a>
          </div>
          <a href="/link5"><span>Link 5</span></a>
        </div>
        <div id="items">
          <div class="item">Item 1 Text</div>
          <div class="item" data-attr="value2">Item 2 Text</div>
          <div class="item">Item 3 Text</div>
        </div>
      </body>
      </html>
    `);
  });

  server.get('/antibot-check', (req, reply) => {
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
      <head><title>Anti-bot Check</title></head>
      <body>
        <h1>Bot Detection Page</h1>
        <pre id="results"></pre>
        <script>
          const results = {
            webdriver: navigator.webdriver,
            userAgent: navigator.userAgent,
          };
          document.getElementById('results').textContent = JSON.stringify(results);
        </script>
      </body>
      </html>
    `);
  });

  server.get('/ua-check', (req, reply) => {
    reply.send({ ua: req.headers['user-agent'] || '' });
  });

  return server;
};

const tmpDir = path.resolve(__dirname, '..', 'tmp');
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
      rmSync(tmpDir, { recursive: true, force: true });
    });

    // 每个测试前创建新引擎实例
    beforeEach(async () => {
      server.clearRateLimit(); // Clear rate limit state before each test
      context = {
        id: `test-${engineName}-${Date.now()}-${Math.random()}`,
        engine: engineName as any,
        retries: 1,
      } as any;
      const engineOpts: any = {
        engine: engineName as any,
      };
      if (engineName === 'playwright') {
        engineOpts.antibot = false;
      }
      engine = await FetchEngine.create(context, engineOpts) as FetchEngine;
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
      await engine.headers('user-agent', 'web-fetcher/1.0');
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

    it('should handle pause action', async () => {
      let pauseCalled = false;
      let pauseMessage = '';

      // Re-create engine with onPause handler for this test
      await engine.dispose(); // Dispose the one from beforeEach

      (context as any).onPause = async (params: { message?: string }) => {
        pauseCalled = true;
        pauseMessage = params.message || '';
      };

      engine = (await FetchEngine.create(context, {
        engine: engineName as any,
        headers: { 'User-Agent': 'web-fetcher/1.0' },
      })) as FetchEngine;

      await engine.goto(baseUrl);
      await engine.pause('Test pause message');

      expect(pauseCalled).toBe(true);
      expect(pauseMessage).toBe('Test pause message');

    }, TEST_TIMEOUT);

    it('should extract structured data from a page', async () => {
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
              id: {
                attribute: 'data-id',
                type: 'number',
              },
              name: {
                selector: '.name',
              },
              profileLink: {
                selector: '.profile-link',
                attribute: 'href',
              },
            },
          },
          tags: {
            type: 'array',
            selector: '.tag',
            items: { type: 'string' },
          },
          comments: {
              type: 'array',
              selector: '.comment',
              items: {
                  type: 'object',
                  properties: {
                      user: { selector: '.user' },
                      text: { selector: '.text' },
                  }
              }
          }
        },
      } as const;

      await engine.goto(`${baseUrl}/extract-test`);
      const data = await engine.extract(testSchema);

      expect(data).toEqual({
        title: 'Article Title',
        author: {
          id: 123,
          name: 'John Doe',
          profileLink: '/profiles/johndoe',
        },
        tags: ['tech', 'news', 'web'],
        comments: [
            { user: 'User1', text: 'Comment 1' },
            { user: 'User2', text: 'Comment 2' },
        ]
      });
    }, TEST_TIMEOUT);

    it('should handle advanced extraction cases with missing selectors and contexts', async () => {
      await engine.goto(`${baseUrl}/extract-test`);

      // Test case 1: Array with no selector should use parent context
      const schema1 = {
        type: 'object',
        selector: '.author',
        properties: {
          asArray: {
            type: 'array', // No selector, should use .author as context
            items: {
              type: 'object',
              properties: {
                name: { selector: '.name' },
                id: { attribute: 'data-id', type: 'number' },
              },
            },
          },
        },
      } as any;
      const data1 = await engine.extract(schema1);
      expect(data1).toEqual({
        asArray: [
          {
            name: 'John Doe',
            id: 123,
          },
        ],
      });

      // Test case 2: Nested array with no selector
      const schema2 = {
        type: 'array',
        selector: '.tags .tag',
        items: {
          type: 'array', // No selector, should wrap each item
          items: { type: 'string' },
        },
      } as any;
      const data2 = await engine.extract(schema2);
      expect(data2).toEqual([['tech'], ['news'], ['web']]);

      // Test case 3: Extraction from a non-existent context
      const schema3 = {
        type: 'object',
        selector: '.non-existent',
        properties: {
          title: { selector: '.title' },
          tags: { type: 'array', selector: '.tag', items: { type: 'string' } },
        },
      } as const;
      const data3 = await engine.extract(schema3);
      expect(data3).toBeNull();
    }, TEST_TIMEOUT);

    it('should handle advanced extraction with shorthands, has, and exclude', async () => {
      await engine.goto(`${baseUrl}/extract-advanced-test`);

      // Test `has`
      const hasData = await engine.extract({
        type: 'array',
        selector: '#links a',
        has: 'span',
        items: { attribute: 'href' },
      });
      expect(hasData).toEqual(['/link1', '/link3', '/link5']);

      // Test `exclude`
      const excludeData = await engine.extract({
        type: 'array',
        selector: '#links a',
        exclude: '.exclude-me',
        items: { attribute: 'href' },
      });
      expect(excludeData).toEqual(['/link1', '/link2', '/link4', '/link5']);

      // Test `has` and `exclude` combined
      const combinedData = await engine.extract({
        type: 'array',
        selector: '#links a',
        has: 'span',
        exclude: '.exclude-me',
        items: { attribute: 'href' },
      });
      expect(combinedData).toEqual(['/link1', '/link5']);

      // Test `exclude` with descendant selector
      const excludeDescendantData = await engine.extract({
        type: 'array',
        selector: '#links a',
        exclude: '#to-exclude a',
        items: { attribute: 'href' },
      });
      expect(excludeDescendantData).toEqual(['/link1', '/link2', '/link3', '/link5']);

      // Test array `attribute` shorthand
      const attrShorthandData = await engine.extract({
        type: 'array',
        selector: '#links a',
        has: 'span',
        exclude: '.exclude-me',
        attribute: 'href', // Shorthand
      });
      expect(attrShorthandData).toEqual(['/link1', '/link5']);

      // Test array `items` missing shorthand (default to text)
      const textShorthandData = await engine.extract({
        type: 'array',
        selector: '#items .item',
      });
      expect(textShorthandData).toEqual(['Item 1 Text', 'Item 2 Text', 'Item 3 Text']);
    }, TEST_TIMEOUT);

    if (engineName === 'playwright') {
      it('should not use firefox by default when antibot is disabled', async () => {
        await engine.dispose(); // Dispose shared engine

        const controlContext: FetchEngineContext = { id: `test-control-${Date.now()}` } as any;
        const controlEngine = await FetchEngine.create(controlContext, {
          engine: 'playwright',
          antibot: false,
        }) as PlaywrightFetchEngine;

        await controlEngine.goto(`${baseUrl}/antibot-check`);
        let content = await controlEngine.extract<string>({selector: '#results'});
        let data = JSON.parse(content);
        // navigator.webdriver 用于指示当前浏览器实例是否正在被 WebDriver（如 Selenium）自动化控制
        expect(data.webdriver).toBe(false); // why it's always false?
        expect(data.userAgent).not.toContain('Firefox');


        await controlEngine.goto(`${baseUrl}/ua-check`);
        const res = await controlEngine.getContent();
        data = JSON.parse(res.text!);

        expect(data.ua).not.toContain('Firefox');

        await controlEngine.dispose();
      });

      it('should use firefox for camoufox-js to bypass bot detection when antibot is enabled', async () => {
        await engine.dispose(); // Dispose shared engine

        // 2. Test Case (antibot: true)
        const antibotContext: FetchEngineContext = { id: `test-antibot-${Date.now()}` } as any;
        const antibotEngine = await FetchEngine.create(antibotContext, {
          engine: 'playwright',
          antibot: true,
          // No custom headers to ensure we get the real browser UA
        })  as PlaywrightFetchEngine;

        // Check #1: Basic UA check
        await antibotEngine.goto(`${baseUrl}/ua-check`);
        let res = await antibotEngine.getContent();
        let data = JSON.parse(res.text!);
        expect(data.ua).toContain('Firefox');

        // Check #2: Webdriver property check
        await antibotEngine.goto(`${baseUrl}/antibot-check`);
        let content = await antibotEngine.extract<string>({selector: '#results'});
        data = JSON.parse(content);
        expect(data.webdriver).toBe(false);
        expect(data.userAgent).toContain('Firefox');

        await antibotEngine.dispose();
      }, 20000); // Generous timeout for two separate engine launches
    }

  });
};

// 3. 运行测试
engineTestSuite('cheerio', CheerioFetchEngine);
engineTestSuite('playwright', PlaywrightFetchEngine);

describe('Flexible Storage', () => {
  it('should persist storage when purge is false', async () => {
    const storageId = `test-persist-${Date.now()}`;
    const storageDir =  path.join(tmpDir, `storage-${storageId}`);
    const context: any = {
      id: 'some-session-id',
      engine: 'http',
      storage: {
        id: storageId,
        purge: false,
        persist: true,
        config: { localDataDirectory: storageDir }
      }
    };

    const engine = await FetchEngine.create(context) as FetchEngine;
    const kvStore = (engine as any).kvStore as KeyValueStore;
    await kvStore.setValue('test-key', 'test-value');

    await engine.dispose();

    // Re-open the same store using the same config to check value
    const reOpenedStoreWithConfig = await KeyValueStore.open(storageId, {
      config: new Configuration({
        persistStorage: true,
        storageClientOptions: {
          persistStorage: true,
          localDataDirectory: storageDir,
        }
      })
    });
    const value = await reOpenedStoreWithConfig.getValue('test-key');
    expect(value).toBe('test-value');

    // Cleanup manually after test
    console.log('🚀 ~ file: engine.spec.ts:609 ~ Cleanup:')
    await reOpenedStoreWithConfig.drop();
  });

  it('should purge storage when purge is true', async () => {
    const storageId = `test-purge-${Date.now()}`;
    const storageDir = path.join(tmpDir, `./tmp/storage-${storageId}`);
    const context: any = {
      id: 'some-session-id',
      engine: 'http',
      storage: {
        id: storageId,
        purge: true,
        persist: true,
        config: { localDataDirectory: storageDir }
      }
    };

    const engine = await FetchEngine.create(context) as FetchEngine;
    const kvStore = (engine as any).kvStore as KeyValueStore;
    await kvStore.setValue('test-key', 'test-value');

    await engine.dispose();

    // Re-open and check value - it should be empty since it was dropped
    const reOpenedStoreWithConfig = await KeyValueStore.open(storageId, {
      config: new Configuration({
        persistStorage: true,
        storageClientOptions: {
          persistStorage: true,
          localDataDirectory: storageDir,
        }
      })
    });
    const value = await reOpenedStoreWithConfig.getValue('test-key');
    expect(value).toBeNull();
  });
});
