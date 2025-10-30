import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AddressInfo } from 'net';
import { readdir, readFile } from 'fs/promises';
import { resolve, join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { FetchEngine } from '../src/engine';
import { FetchEngineContext } from '../src/core/context';
import { absoluteUrlFrom } from '../src/utils/helpers';

interface FixtureAction {
  action: typeof FetchEngine;
  args: any[];
}

interface FixtureExpected {
  statusCode?: number;
  html?: {
    contains: string;
  };
  finalUrl?: string;
  data?: any;
}

interface Fixture {
  name: string;
  caseDir: string;
  title: string;
  actions: FixtureAction[];
  expected: FixtureExpected;
  skip?: boolean;
  only?: boolean;
  engine?: string;
}

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

async function getTestcases() {
  const testCaseDirs = await readdir(FIXTURES_DIR, { withFileTypes: true });
  let result = [] as Fixture[];
  let hasOnly: boolean = false;

  for (const testCase of testCaseDirs) {
    if (!testCase.isDirectory()) continue;

    const caseDir = join(FIXTURES_DIR, testCase.name);
    const fixtureJsonPath = join(caseDir, 'fixture.json');

    try {
      const jsonContent = await readFile(fixtureJsonPath, 'utf-8');
      const fixture = JSON.parse(jsonContent);
      if (fixture.skip) continue;
      if (!fixture.name) fixture.name = testCase.name;
      if (fixture.only) hasOnly = true;
      fixture.caseDir = caseDir;
      result.push(fixture)
    } catch (error) {
      console.warn(`Could not read or parse fixture.json in ${caseDir}:`, error);
    }
  }

  if (hasOnly) result = result.filter(fixture => fixture.only);

  return result;
}

// 2. 动态测试套件
const runDynamicTests = async () => {
  const testCases = await getTestcases();

  for (const testCase of testCases) {
    describe(testCase.name, () => {
      if (testCase.engine) {
        engineTestSuite(testCase, testCase.caseDir, testCase.engine);
      } else {
        engineTestSuite(testCase, testCase.caseDir, 'cheerio');
        engineTestSuite(testCase, testCase.caseDir, 'playwright');
      }
    });
  }
};

// 3. 可复用的测试引擎套件
const engineTestSuite = (
  fixture: any,
  caseDir: string,
  engineName: 'cheerio' | 'playwright' | string,
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
      expect(engine).toBeInstanceOf(FetchEngine);

      let result: any;

      for (const action of fixture.actions) {
        const method = (engine as any)[action.action];
        if (typeof method !== 'function') {
          throw new Error(`Action ${action.action} not supported by ${engineName}`);
        }
        const args = [...action.args];
        if (action.action === 'goto') {
          args[0] = absoluteUrlFrom(baseUrl, args[0]);
        }
        result = await method.apply(engine, args);
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