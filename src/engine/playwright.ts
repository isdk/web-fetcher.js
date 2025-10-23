import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import type { PlaywrightCrawlingContext, PlaywrightCrawlerOptions, PlaywrightFailedCrawlingContext } from 'crawlee';
import { FetchEngine, type GotoActionOptions, type SubmitOptions, type WaitForActionOptions } from './base';
import { BaseFetcherProperties, FetchResponse } from '../core/types';
import { FetchEngineContext } from '../core/context';
import { EventEmitter } from 'events';
import type { Page, Response } from 'playwright';

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

type Action =
  | { type: 'click'; selector: string }
  | { type: 'fill'; selector: string; value: string }
  | { type: 'waitFor'; options?: WaitForActionOptions }
  | { type: 'submit'; selector?: string; options?: SubmitOptions }
  | { type: 'getContent' }
  | { type: 'navigate', url: string, opts?: GotoActionOptions }
  | { type: 'dispose' };

interface DispatchedAction {
  action: Action;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

const DefaultTimeoutMs = 30_000;

export class PlaywrightFetchEngine extends FetchEngine {
  static readonly id = 'playwright';
  static readonly mode = 'browser';

  private crawler?: PlaywrightCrawler;
  private requestQueue?: RequestQueue;
  private lastPlaywrightResponse?: Response | null;
  private blockedTypes: Set<string> = new Set();
  private pendingRequests = new Map<string, PendingRequest>();
  private requestCounter = 0;
  private actionEmitter = new EventEmitter();
  private isPageActive = false;

  private async buildResponse(page: Page, response: Response | null): Promise<FetchResponse> {
    const body = await page.content();
    const text = await page.textContent('body');
    return {
      url: page.url(),
      finalUrl: page.url(),
      statusCode: response?.status(),
      statusText: response?.statusText(),
      headers: (await response?.allHeaders()) || {},
      body,
      html: body,
      text: text || '',
    };
  }

  private async _actionLoop(page: Page) {
    await new Promise<void>((resolveLoop) => {
      const listener = async ({ action, resolve, reject }: DispatchedAction) => {
        try {
          if (action.type === 'dispose') {
            resolveLoop();
            resolve(); // Resolve the promise for the dispose action itself
            return;
          }
          const result = await this.executeAction(page, action);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      this.actionEmitter.on('dispatch', listener);
      this.actionEmitter.once('dispose', () => {
        this.actionEmitter.removeListener('dispatch', listener);
        resolveLoop();
      });
    });
  }

  private async requestHandler(context: PlaywrightCrawlingContext): Promise<void> {
    const { page, request, response } = context;
    this.isPageActive = true;
    this.lastPlaywrightResponse = response;

    const gotoPromise = this.pendingRequests.get(request.userData.requestId);
    if (gotoPromise) {
      const fetchResponse = await this.buildResponse(page, response);
      gotoPromise.resolve(fetchResponse);
      this.pendingRequests.delete(request.userData.requestId);
    }

    await this._actionLoop(page);

    this.isPageActive = false;
  }

  private async failedRequestHandler(context: PlaywrightFailedCrawlingContext): Promise<void> {
    const { page, request, response } = context;
    this.isPageActive = true;
    this.lastPlaywrightResponse = response;

    const gotoPromise = this.pendingRequests.get(request.userData.requestId);
    if (gotoPromise) {
      const fetchResponse = await this.buildResponse(page, response);
      gotoPromise.resolve(fetchResponse);
      this.pendingRequests.delete(request.userData.requestId);
    }

    await this._actionLoop(page);

    this.isPageActive = false;
  }

  private async executeAction(page: Page, action: Action): Promise<any> {
    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs;
    switch (action.type) {
      case 'navigate': {
        const response = await page.goto(action.url, {
            waitUntil: action.opts?.waitUntil || 'domcontentloaded',
            timeout: this.opts?.timeoutMs || DefaultTimeoutMs,
        });
        this.lastPlaywrightResponse = response;
        return this.buildResponse(page, response);
      }
      case 'click': {
        const [navResponse] = await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: defaultTimeout }).catch(() => null),
          page.click(action.selector, { timeout: defaultTimeout }),
        ]);
        if (navResponse) this.lastPlaywrightResponse = navResponse;
        return;
      }
      case 'fill':
        await page.fill(action.selector, action.value, { timeout: defaultTimeout });
        return;
      case 'waitFor':
        if (action.options?.selector) {
          await page.waitForSelector(action.options.selector, { timeout: defaultTimeout });
        }
        if (action.options?.networkIdle) {
          await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
        }
        if (action.options?.ms) {
          await page.waitForTimeout(action.options.ms);
        }
        return;
      case 'submit': {
        const formSelector = action.selector || 'form';
        const el = page.locator(formSelector).first();
        if ((await el.count()) === 0) {
          throw new Error(`submit: selector not found ${formSelector}`);
        }

        const enctype = action.options?.enctype || 'application/x-www-form-urlencoded';

        if (enctype === 'application/json') {
          const formHandle = await el.elementHandle();
          if (!formHandle) {
            throw new Error(`submit: could not get form handle for ${formSelector}`);
          }

          const result = await formHandle.evaluate(async (form: HTMLFormElement) => {
            const formData = new FormData(form);
            const data: Record<string, string> = {};
            formData.forEach((value, key) => { data[key] = value.toString(); });
        
            const response = await fetch(form.action, {
                method: form.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        
            return {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                html: await response.text(),
                url: response.url,
            };
          });

          await formHandle.dispose();
          await page.setContent(result.html);

          this.lastPlaywrightResponse = {
            status: () => result.status,
            statusText: () => result.statusText,
            headers: () => result.headers,
            url: () => result.url,
            ok: () => result.status >= 200 && result.status < 300,
            body: async () => Buffer.from(result.html),
            text: async () => result.html,
            allHeaders: async () => result.headers,
            finished: async () => 'succeeded',
          } as Response;

          return;
        } else {
          const [submitNavResponse] = await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: defaultTimeout }).catch(() => null),
            el.evaluate((form: HTMLFormElement) => form.submit()),
          ]);
          if (submitNavResponse) this.lastPlaywrightResponse = submitNavResponse;
          return;
        }
      }
      case 'getContent': {
        return this.buildResponse(page, this.lastPlaywrightResponse);
      }
      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  private async dispatchAction<T>(action: Action): Promise<T> {
    if (!this.isPageActive) {
      throw new Error('No active page. Call goto() before performing actions.');
    }
    return new Promise<T>((resolve, reject) => {
      this.actionEmitter.emit('dispatch', { action, resolve, reject });
    });
  }

  protected async _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    const headless = ctx.browser?.headless ?? true;
    this.requestQueue = await RequestQueue.open(`playwright-queue-${ctx.id}`);

    const crawlerOptions: PlaywrightCrawlerOptions = {
      requestQueue: this.requestQueue,
      maxRequestRetries: ctx.retries || 3,
      maxConcurrency: 1,
      headless,
      useSessionPool: true,
      persistCookiesPerSession: true,
      sessionPoolOptions: {
        maxPoolSize: 1,
        persistenceOptions: { enable: false },
        sessionOptions: { maxUsageCount: 1000, maxErrorScore: 3 },
      },
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
      preNavigationHooks: [
        async ({ page, request }) => {
          if (this.jar.length > 0) {
            await page.context().addCookies(
              this.jar.map((c) => ({
                ...c,
                url: request.url,
                domain: c.domain || new URL(request.url).hostname,
              }))
            );
          }
          const blockedTypes = this.blockedTypes;
          if (blockedTypes.size > 0) {
            await page.route('**/*', (route) => {
              if (blockedTypes.has(route.request().resourceType())) {
                route.abort();
              } else {
                route.continue();
              }
            });
          }
        },
      ],
    };

    this.crawler = new PlaywrightCrawler(crawlerOptions);
    this.crawler.run().catch((error) => {
      console.error('Crawler background error:', error);
    });
  }

  async goto(url: string, opts?: GotoActionOptions): Promise<FetchResponse> {
    if (this.isPageActive) {
      return this.dispatchAction({ type: 'navigate', url, opts });
    }

    if (!this.requestQueue) {
      throw new Error('RequestQueue not initialized');
    }

    const requestId = `req-${++this.requestCounter}`;
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set( requestId, { resolve, reject });
    });

    await this.requestQueue.addRequest({
      url,
      headers: this.hdrs,
      userData: { requestId, waitUntil: opts?.waitUntil || 'domcontentloaded' },
      uniqueKey: `${url}-${requestId}`,
    });

    return promise;
  }

  async getContent(): Promise<FetchResponse> {
    return this.dispatchAction({ type: 'getContent' });
  }

  async waitFor(options?: WaitForActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'waitFor', options });
  }

  async click(selector: string): Promise<void> {
    return this.dispatchAction({ type: 'click', selector });
  }

  async fill(selector: string, value: string): Promise<void> {
    return this.dispatchAction({ type: 'fill', selector, value });
  }

  async submit(selector?: string, options?: SubmitOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options });
  }

  async blockResources(types: string[]): Promise<boolean> {
    this.blockedTypes = new Set(types);
    return true;
  }

  async _cleanup() {
    if (this.isPageActive) {
        await this.dispatchAction({ type: 'dispose' });
    }
    
    this.actionEmitter.removeAllListeners();

    if (this.crawler) {
      await this.crawler.teardown?.();
      this.crawler = undefined;
    }

    if (this.requestQueue) {
      await this.requestQueue.drop();
      this.requestQueue = undefined;
    }
    
    this.pendingRequests.clear();
  }
}

FetchEngine.register(PlaywrightFetchEngine);
