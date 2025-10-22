import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import type { PlaywrightCrawlingContext } from 'crawlee';
import { FetchEngine, type GotoActionOptions, type WaitForActionOptions } from './base';
import { BaseFetcherProperties, FetchResponse } from '../fetcher/types';
import { FetchEngineContext } from '../fetcher/context';

type Page = NonNullable<PlaywrightCrawlingContext['page']>;

interface PendingRequest {
  resolve: (value: FetchResponse) => void;
  reject: (error: Error) => void;
}

const DefaultTimeoutMs = 30_000;

export class PlaywrightFetchEngine extends FetchEngine {
  static readonly id = 'playwright';
  static readonly mode = 'browser';

  private crawler?: PlaywrightCrawler;
  private requestQueue?: RequestQueue;
  private lastResponse?: FetchResponse;
  private currentPage?: Page;
  private blockedTypes: Set<string> = new Set();
  private pendingRequests = new Map<string, PendingRequest>();
  private requestCounter = 0;

  private async applyBlockResources() {
    const page = this.currentPage;
    if (!page) return;
    // 资源拦截（必须在每个页面上设置）
    if (this.blockedTypes.size > 0) {
      await page.route('**/*', async (route) => {
        const resourceType = route.request().resourceType();
        if (this.blockedTypes.has(resourceType)) {
          await route.abort();
        } else {
          await route.continue();
        }
      });
    }
  }
  // ============ 初始化 Crawler（仅一次）============
  protected async _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    const headless = ctx.browser?.headless ?? true;
    this.requestQueue = await RequestQueue.open(`playwright-queue-${ctx.id}`);

    this.crawler = new PlaywrightCrawler({
      requestQueue: this.requestQueue,

      maxRequestRetries: ctx.retries || 3,
      maxConcurrency: 1,
      headless,

      // 启用 Session Pool
      useSessionPool: true,
      persistCookiesPerSession: true,
      sessionPoolOptions: {
        maxPoolSize: 1,
        persistenceOptions: {
          enable: false,
        },
        sessionOptions: {
          maxUsageCount: 1000,
          maxErrorScore: 3,
        },
      },

      requestHandler: async (context: PlaywrightCrawlingContext) => {
        const { page, request, response } = context;
        this.currentPage = page;

        await this.applyBlockResources();

        const body = await page.content();

        const fetchResponse: FetchResponse = {
          url: request.url,
          finalUrl: request.loadedUrl ?? request.url,
          statusCode: response?.status(),
          statusText: response?.statusText(),
          headers: response?.headers() as Record<string, string>,
          body,
          html: body,
          text: body,
        };

        this.lastResponse = fetchResponse;
        const requestId = request.userData.requestId as string;
        const pending = this.pendingRequests.get(requestId);

        if (pending) {
          pending.resolve(fetchResponse);
          this.pendingRequests.delete(requestId);
        }
      },

      failedRequestHandler: async ({ request }, error) => {
        const requestId = request.userData.requestId as string;
        const pending = this.pendingRequests.get(requestId);

        if (pending) {
          pending.reject(error);
          this.pendingRequests.delete(requestId);
        }
      },

      // 预导航钩子
      preNavigationHooks: [
        async ({ page, request, session }) => {
          // 设置 headers
          if (Object.keys(this.hdrs).length > 0) {
            await page.setExtraHTTPHeaders(this.hdrs);
          }

          // 设置 cookies（Crawlee Session 会自动管理）
          if (this.jar.length > 0) {
            await page.context().addCookies(
              this.jar.map((c) => ({
                ...c,
                url: request.url,
                domain: c.domain || new URL(request.url).hostname,
              }))
            );
          }
        },
      ],
      /*
      launchContext: {
        launchOptions: {
          headless,
        },
      },
      */
    });

    // 启动 Crawler
    this.crawler.run().catch((error) => {
      console.error('Crawler background error:', error);
    });
  }

  async goto(url: string, opts?: GotoActionOptions): Promise<FetchResponse> {

    if (!this.requestQueue) {
      throw new Error('RequestQueue not initialized');
    }

    const requestId = `req-${++this.requestCounter}`;

    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    await this.requestQueue.addRequest({
      url,
      userData: {
        requestId,
        waitUntil: opts?.waitUntil || 'domcontentloaded',
      },
      uniqueKey: `${url}-${requestId}`,
    });

    return promise;
  }

  async getContent(): Promise<FetchResponse> {
    if (!this.currentPage) {
      throw new Error('No page available. Call goto() first.');
    }

    const html = await this.currentPage.content();
    const url = this.currentPage.url();

    return { url, finalUrl: url, body: html, html, text: html, headers: this.lastResponse?.headers || {} };
  }

  async waitFor(options?: WaitForActionOptions): Promise<void> {
    const page = this.currentPage;
    if (!page) throw new Error('No page available');

    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs;
    if (options?.selector) {
      await page!.waitForSelector(options.selector, { timeout: defaultTimeout });
    }
    if (options?.networkIdle) {
      await page!.waitForLoadState('networkidle', { timeout: defaultTimeout });
    }
    if (options?.ms) {
      await page.waitForTimeout(options.ms);
    }
  }
  async click(selector: string): Promise<void> {
    const page = this.currentPage;
    if (!page) throw new Error('No page available');

    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs;
    await page.click(selector, { timeout: defaultTimeout });
    await page.waitForLoadState('domcontentloaded');
  }

  async fill(selector: string, value: string): Promise<void> {
    if (!this.currentPage) throw new Error('No page available');
    await this.currentPage.fill(selector, value, { timeout: this.opts?.timeoutMs || DefaultTimeoutMs });
  }


  async submit(selector?: string): Promise<void> {
    const page = this.currentPage;
    if (!page) throw new Error('No page available');

    const formSelector = selector || 'form';
    const el = page.locator(formSelector).first();
    if (await el.count() === 0) {
      throw new Error(`submit: selector not found ${formSelector}`);
    }

    const submitButton = el
      .locator(`button[type="submit"], input[type="submit"]`)
      .first();
    const hasButton = await submitButton.count() > 0;

    if (hasButton) {
      await submitButton.click();
    } else {
      await page.locator(formSelector).press('Enter');
    }

    await page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async blockResources(types: string[]): Promise<boolean> {
    types.forEach((type) => this.blockedTypes.add(type));
    return true;
  }

  async _cleanup() {
    // 等待待处理的请求
    const pendingPromises = Array.from(this.pendingRequests.values()).map(
      (pending) => new Promise((resolve) => {
        const timeout = setTimeout(() => {
          pending.reject(new Error('Cleanup timeout'));
          resolve(undefined);
        }, 5000);

        Promise.race([
          pending.resolve,
          pending.reject,
        ]).finally(() => {
          clearTimeout(timeout);
          resolve(undefined);
        });
      })
    );

    await Promise.allSettled(pendingPromises);
    this.pendingRequests.clear();

    if (this.currentPage) {
      await this.currentPage.close().catch(() => {});
      this.currentPage = undefined;
    }

    if (this.crawler) {
      await this.crawler.teardown?.();
    }

    if (this.requestQueue) {
      await this.requestQueue.drop();
    }

    this.crawler = undefined;
    this.requestQueue = undefined;
    this.lastResponse = undefined;
  }
}
FetchEngine.register(PlaywrightFetchEngine);
