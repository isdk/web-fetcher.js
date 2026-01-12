import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { AddressInfo } from 'net';
import { readdir, readFile, stat } from 'fs/promises';
import { resolve, join } from 'path';
import fastify, { FastifyInstance } from 'fastify';
import { FetchEngine, WebFetcher } from '../src/index';
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
    // If expectations is an array, we need to decide if we're matching an array or multiple conditions
    if (Array.isArray(value) && expectations.length === value.length && expectations.length > 0 && !isConditionObject(expectations[0])) {
      value.forEach((v, i) => checkExpectations(v, expectations[i]));
    } else {
      expectations.forEach(c => checkExpectations(value, c));
    }
    return;
  }

  if (typeof expectations === 'string') {
    expect(String(value || '')).toContain(expectations);
    return;
  }

  if (typeof expectations !== 'object' || expectations === null) {
    expect(value).toEqual(expectations);
    return;
  }

  if (!isConditionObject(expectations)) {
    // It's a plain object, check properties recursively
    if (value === null || value === undefined) {
      expect(value).toEqual(expectations);
      return;
    }
    Object.keys(expectations).forEach(key => {
      checkExpectations(value[key], expectations[key]);
    });
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
  outputs?: Record<string, any>;
  error?: string;
  cookies?: any;
  metadata?: any;
}


interface Fixture {
  name: string;
  dirName: string;
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

  // Load custom server setup from server.mjs if it exists
  const serverScript = join(fixtureDir, 'server.mjs');
  try {
    await stat(serverScript);
    const mod = await import(serverScript);
    if (typeof mod.default === 'function') {
      await mod.default(server);
    }
  } catch (e: any) {
    if (e.code !== 'ENOENT') {
      console.warn(`Failed to load server.mjs in ${fixtureDir}:`, e);
    }
  }

  const setHeaders = (reply: any) => {
    if (fixtureConfig?.server?.responseHeaders) {
      Object.entries(fixtureConfig.server.responseHeaders).forEach(([key, value]) => {
        reply.header(key, value);
      });
    }
  };

  // 动态提供 fixture.html
  try {
    server.get('/', async (req, reply) => {
      setHeaders(reply);
      try {
        const buffer = await readFile(join(fixtureDir, 'fixture.html'));
        reply.type('text/html;charset=utf-8').send(buffer);
      } catch (e) {
        reply.status(404).send('fixture.html not found');
      }
    });
  } catch (e) {
    // Already defined in server.mjs, ignore
  }

  // 动态提供其他 HTML 文件
  try {
    server.get('/:page', async (req, reply) => {
      setHeaders(reply);
      const { page } = req.params as any;
      try {
        const html = await readFile(join(fixtureDir, `${page}.html`), 'utf-8');
        reply.type('text/html;charset=utf-8').send(html);
      } catch (e) {
        reply.status(404).send(`${page}.html not found`);
      }
    });
  } catch (e) {
    // Already defined in server.mjs, ignore
  }

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
      fixture.dirName = testCase.name;
      if (fixture.skip) continue;
      if (!fixture.name) fixture.name = testCase.name;
      if (fixture.only) hasOnly = true;

      if (fixture.options?.sessionState?.sessions) {
        const now = new Date();
        fixture.options.sessionState.sessions.forEach((s: any) => {
          s.createdAt = now.toISOString();
          s.expiresAt = new Date(now.getTime() + 3600 * 1000).toISOString(); // +1 hour
          if (s.cookieJar?.cookies) {
            s.cookieJar.cookies.forEach((c: any) => {
              c.creation = now.toISOString();
              c.lastAccessed = now.toISOString();
            });
          }
        });
      }

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
    describe(testCase.dirName, () => {
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

    beforeAll(async () => {
      server = await createTestServer(caseDir, fixture);
      await server.listen({ port: 0, host: 'localhost' });
      const address = server.server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
    }, TEST_TIMEOUT);

    afterAll(async () => {
      await server.close();
    });

    it(fixture.title ?? fixture.name, async () => {
      let consoleSpy: any;
      if (fixture.options?.debug || fixture.expected?.logs) {
        consoleSpy = vi.spyOn(console, 'log');
      }

      const fetcher = new WebFetcher();
      const session = await fetcher.createSession({
        engine: engineName,
        retries: 0,
        // debug: fixture.options?.debug,
        ...(fixture.options || {})
      });

      let result: any;
      let error: any;

      try {
        const actions = fixture.actions.map((actionConf: any) => {
          const actionId = actionConf.action || actionConf.id || actionConf.name;
          const action = { ...actionConf, id: actionId };
          if (!action.params) action.params = {};

          if (actionId === 'goto' && action.params.url) {
            action.params = {
              ...action.params,
              url: absoluteUrlFrom(baseUrl, action.params.url)
            };
          }

          if (actionId === 'extract' && !action.storeAs) {
            action.storeAs = '__test_result__';
          }

          return action;
        });

        const res = await session.executeAll(actions);
        // If the last action was extract with an auto-injected storeAs, use it as result
        if (res.outputs && '__test_result__' in res.outputs) {
          result = res.outputs.__test_result__;
        } else {
          result = res.result;
        }

        if (consoleSpy) {
          if (fixture.expected?.logs) {
            const allLogs = consoleSpy.mock.calls.map((call: any[]) =>
              call.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')
            ).join('\n');
            checkExpectations(allLogs, fixture.expected.logs);
          } else if (fixture.options?.debug) {
            // Default check if debug is on but no specific logs expected
            const debugLogs = consoleSpy.mock.calls.filter((call: any[]) =>
              String(call[0]).includes(`[FetchEngine:${engineName}]`)
            );
            expect(debugLogs.length).toBeGreaterThan(0);
          }
          consoleSpy.mockRestore();
        }

        // console.log('🚀 ~ file: engine.fixtures.spec.ts:319 ~ res.outputs:', JSON.stringify(res.outputs, null, 2))
        // Additional validation for outputs if specified in expected
        if (fixture.expected.outputs) {
          Object.keys(fixture.expected.outputs).forEach(key => {
            checkExpectations(res.outputs[key], fixture.expected.outputs[key]);
          });
        }

      } catch (e: any) {
        error = e;
      }

      if (fixture.expected.error) {
        const expectedError = fixture.expected.error;
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
        await session.dispose();
        return;
      } else if (error) {
        throw error;
      }

      // Determine the response object for metadata/content checks
      const content = (result && result.statusCode)
        ? result
        : await session.execute({ id: 'getContent' }).then(r => r.result);

      if (fixture.expected.statusCode) {
        expect(content.statusCode).toBe(fixture.expected.statusCode);
      }
      if (fixture.expected.html) {
        checkExpectations(content.html, fixture.expected.html);
      }
      if (fixture.expected.finalUrl) {
        const expectedUrl = new URL(fixture.expected.finalUrl, baseUrl).toString();
        const actualUrl = new URL(content.finalUrl, baseUrl).toString();
        expect(new URL(actualUrl).pathname).toBe(new URL(expectedUrl).pathname);
      }
      if (fixture.expected.cookies) {
        const state = await session.getState();
        checkExpectations(state?.cookies, fixture.expected.cookies);
      }
      if (fixture.expected.sessionState) {
        checkExpectations(content.sessionState, fixture.expected.sessionState);
      }
      if (fixture.expected.metadata) {
        checkExpectations(content.metadata, fixture.expected.metadata);
      }
      if ('data' in fixture.expected) {
        checkExpectations(result, fixture.expected.data);
      }

      await session.dispose();
    }, TEST_TIMEOUT);
  });
};

// 4. 运行测试
describe('Dynamic Engine Tests', async () => {
  await runDynamicTests();
});