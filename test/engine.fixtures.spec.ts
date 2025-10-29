import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FetchEngine } from '../src/engine/base';
import { CheerioFetchEngine } from '../src/engine/cheerio';
import { PlaywrightFetchEngine } from '../src/engine/playwright';
import { FetchEngineContext } from '../src/core/context';
import fastify, { FastifyInstance } from 'fastify';
import { AddressInfo } from 'net';
import { readdir, readFile } from 'fs/promises';
import { resolve, join } from 'path';

const TEST_TIMEOUT = 5000; // 5s
const FIXTURES_DIR = resolve(__dirname, 'fixtures');

// 1. 本地测试服务器
const createTestServer = async (fixtureDir: string): Promise<FastifyInstance> => {
  const server = fastify({ logger: false });

  // 动态提供 fixture.html
  server.get('/', async (req, reply) => {
    try {
      const html = await readFile(join(fixtureDir, 'fixture.html'), 'utf-8');
      reply.type('text/html').send(html);
    } catch (e) {
      reply.status(404).send('fixture.html not found');
    }
  });

  // 动态提供其他 HTML 文件
  server.get('/:page', async (req, reply) => {
    const { page } = req.params as any;
    try {
      const html = await readFile(join(fixtureDir, `${page}.html`), 'utf-8');
      reply.type('text/html').send(html);
    } catch (e) {
      reply.status(404).send(`${page}.html not found`);
    }
  });

  return server;
};

// 2. 动态测试套件
const runDynamicTests = async () => {
  const testCases = await readdir(FIXTURES_DIR, { withFileTypes: true });

  for (const testCase of testCases) {
    if (!testCase.isDirectory()) continue;

    const caseDir = join(FIXTURES_DIR, testCase.name);
    const fixtureJsonPath = join(caseDir, 'fixture.json');

    try {
      const jsonContent = await readFile(fixtureJsonPath, 'utf-8');
      const fixture = JSON.parse(jsonContent);

      describe(testCase.name, () => {
        engineTestSuite(testCase.name, fixture, caseDir, CheerioFetchEngine, 'cheerio');
        engineTestSuite(testCase.name, fixture, caseDir, PlaywrightFetchEngine, 'playwright');
      });
    } catch (error) {
      console.warn(`Could not read or parse fixture.json in ${caseDir}:`, error);
    }
  }
};

// 3. 可复用的测试引擎套件
const engineTestSuite = (
  caseName: string,
  fixture: any,
  caseDir: string,
  EngineClass: typeof CheerioFetchEngine | typeof PlaywrightFetchEngine,
  engineName: 'cheerio' | 'playwright'
) => {
  describe.sequential(engineName, () => {
    let server: FastifyInstance;
    let baseUrl: string;
    let engine: FetchEngine;

    beforeAll(async () => {
      server = await createTestServer(caseDir);
      await server.listen({ port: 0 });
      const address = server.server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
    }, TEST_TIMEOUT);

    afterAll(async () => {
      await server.close();
    });

    it(fixture.title, async () => {
      const context: FetchEngineContext = {
        id: `test-${engineName}-${Date.now()}`,
        engine: engineName,
        retries: 1,
      } as any;

      engine = await FetchEngine.create(context, { engine: engineName }) as any;
      expect(engine).toBeInstanceOf(EngineClass);

      let result: any;

      for (const action of fixture.actions) {
        switch (action.action) {
          case 'goto':
            await engine.goto(`${baseUrl}${action.url}`);
            break;
          case 'click':
            await engine.click(action.selector);
            break;
          case 'extract':
            result = await engine.extract(action.schema);
            break;
          // 其他 action 可以按需添加
        }
      }

      const content = await engine.getContent();

      if (fixture.expected.statusCode) {
        expect(content.statusCode).toBe(fixture.expected.statusCode);
      }
      if (fixture.expected.html?.contains) {
        expect(content.html).toContain(fixture.expected.html.contains);
      }
      if (fixture.expected.finalUrl) {
        const expectedUrl = new URL(fixture.expected.finalUrl, baseUrl).toString();
        const actualUrl = new URL(content.finalUrl, baseUrl).toString();
        // 只比较路径
        expect(new URL(actualUrl).pathname).toBe(new URL(expectedUrl).pathname);
      }
      if (fixture.expected.data) {
        expect(result).toEqual(fixture.expected.data);
      }

      await engine.dispose();
    }, TEST_TIMEOUT);
  });
};

// 4. 运行测试
describe('Dynamic Engine Tests', async () => {
  await runDynamicTests();
});