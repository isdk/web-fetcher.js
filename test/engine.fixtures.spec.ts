import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AddressInfo } from 'net';
import { readdir, readFile } from 'fs/promises';
import { resolve, join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { FetchEngine } from '../src/engine';
import { FetchEngineContext } from '../src/core/context';
import { absoluteUrlFrom } from '../src/utils/helpers';
import { isRegExpStr, toRegExp } from 'util-ex';


const isConditionObject = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }
  const keys = Object.keys(obj);
  return keys.some(key => ['and', 'or', 'not', 'contains', 'equals'].includes(key));
};

const checkExpectations = (value: any, expectations: any) => {
  if (Array.isArray(expectations)) {
    expectations.forEach(c => checkExpectations(value, c));
    return;
  }

  if (typeof expectations === 'string') {
    expect(String(value)).toContain(expectations);
    return;
  }

  if (typeof expectations !== 'object' || expectations === null) {
    expect(value).toEqual(expectations);
    return;
  }

  if (expectations.and) {
    expectations.and.forEach((c: any) => checkExpectations(value, c));
    return;
  }
  if (expectations.or) {
    const passed = expectations.or.some((c: any) => {
      try {
        checkExpectations(value, c);
        return true;
      } catch {
        return false;
      }
    });

    if (!passed) {
      if (expectations.or.length > 0) {
        try {
          checkExpectations(value, expectations.or[0]);
        } catch (e) {
          throw new Error(`None of the "or" conditions were met. First failure: ${(e as Error).message}`);
        }
      }
      expect.fail('None of the "or" conditions were met.');
    }
    return;
  }

  if (expectations.not) {
    const notCondition = expectations.not;
    const passed = (() => {
      try {
        checkExpectations(value, notCondition);
        return true;
      } catch {
        return false;
      }
    })();

    if(passed) {
      expect.fail(`NOT condition failed: wrapped condition should have failed but passed. Condition: ${JSON.stringify(notCondition)}`);
    }

    return;
  }

  // Matcher
  if ('contains' in expectations) {
    const { contains, caseInsensitive } = expectations;
    let target = value;
    if (typeof value === 'object' && value !== null) {
      target = JSON.stringify(value);
    } else {
      target = String(value);
    }

    if (caseInsensitive) {
      expect(target.toLowerCase()).toContain(String(contains).toLowerCase());
    } else {
      expect(target).toContain(String(contains));
    }
  }
  if ('equals' in expectations) {
    expect(value).toEqual(expectations.equals);
  }
};

interface FixtureAction {
  action: typeof FetchEngine;
  args: any[];
}

interface FixtureExpected {
  statusCode?: number;
  html?: any;
  finalUrl?: string;
  data?: any;
  error?: string;
  cookies?: any;
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
  options?: Record<string, any>;
  server?: {
    responseHeaders?: Record<string, string>;
  };
}

const TEST_TIMEOUT = 15000; // 5s
const FIXTURES_DIR = resolve(__dirname, 'fixtures');

// 1. 本地测试服务器
const createTestServer = async (fixtureDir: string, fixtureConfig?: Fixture): Promise<FastifyInstance> => {
  const server = fastify({ logger: false });

  const setHeaders = (reply: any) => {
    if (fixtureConfig?.server?.responseHeaders) {
      Object.entries(fixtureConfig.server.responseHeaders).forEach(([key, value]) => {
        reply.header(key, value);
      });
    }
  };

  // 动态提供 fixture.html
  server.get('/', async (req, reply) => {
    setHeaders(reply);
    try {
      const html = await readFile(join(fixtureDir, 'fixture.html'), 'utf-8');
      reply.type('text/html').send(html);
    } catch (e) {
      reply.status(404).send('fixture.html not found');
    }
  });

  // 动态提供其他 HTML 文件
  server.get('/:page', async (req, reply) => {
    setHeaders(reply);
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
      server = await createTestServer(caseDir, fixture);
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

      engine = await FetchEngine.create(context, {
        engine: engineName,
        ...(fixture.options || {})
      }) as any;

      expect(engine).toBeInstanceOf(FetchEngine);

      let result: any;
      let error: any;

      try {
        for (const action of fixture.actions) {
          const actionId = action.action || action.id || action.name;
          const method = (engine as any)[actionId];
          if (typeof method !== 'function') {
            throw new Error(`Action ${actionId} not supported by ${engineName}`);
          }
          const args = [...action.args];
          if (action.action === 'goto') {
            args[0] = absoluteUrlFrom(baseUrl, args[0]);
          }
          result = await method.apply(engine, args);
        }
      } catch (e) {
        error = e;
      }

      const expectedError = fixture.expected.error;
      if (expectedError) {
        expect(error).toBeDefined();
        if (expectedError !== true) {
          if (typeof expectedError === 'object') {
            Object.keys(expectedError).forEach(key => {
              const expectedValue = expectedError[key];
              const actualValue = error[key];
              if (key === 'message') {
                if (isRegExpStr(expectedValue)) {
                  expect(actualValue).toMatch(toRegExp(expectedValue));
                } else {
                  expect(actualValue).toContain(expectedValue);
                }
              } else {
                expect(actualValue).toEqual(expectedValue);
              }
            });
          } else if (isRegExpStr(expectedError)) {
            expect(error.message).toMatch(toRegExp(expectedError));
          } else if (typeof expectedError === 'string') {
            expect(error.message).toContain(expectedError);
          }
        }
        await engine.dispose();
        return;
      } else if (error) {
        throw error;
      }

      const content = await engine.getContent();

      if (fixture.expected.statusCode) {
        expect(content.statusCode).toBe(fixture.expected.statusCode);
      }
      if (fixture.expected.html) {
        checkExpectations(content.html, fixture.expected.html);
      }
      if (fixture.expected.finalUrl) {
        const expectedUrl = new URL(fixture.expected.finalUrl, baseUrl).toString();
        const actualUrl = new URL(content.finalUrl, baseUrl).toString();
        // 只比较路径
        expect(new URL(actualUrl).pathname).toBe(new URL(expectedUrl).pathname);
      }
      if (fixture.expected.cookies) {
        checkExpectations(content.cookies, fixture.expected.cookies);
      }
      if ('data' in fixture.expected) {
        if (isConditionObject(fixture.expected.data)) {
          checkExpectations(result, fixture.expected.data);
        } else {
          expect(result).toEqual(fixture.expected.data);
        }
      }

      await engine.dispose();
    }, TEST_TIMEOUT);
  });
};

// 4. 运行测试
describe('Dynamic Engine Tests', async () => {
  await runDynamicTests();
});