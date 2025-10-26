import { PlaywrightCrawler, RequestQueue } from 'crawlee';
import type { PlaywrightCrawlingContext, PlaywrightCrawlerOptions } from 'crawlee';
import { FetchEngine, type GotoActionOptions, type SubmitActionOptions, type WaitForActionOptions, FetchEngineAction } from './base';
import { BaseFetcherProperties, FetchResponse } from '../core/types';
import { FetchEngineContext } from '../core/context';

const DefaultTimeoutMs = 30_000;

export class PlaywrightFetchEngine extends FetchEngine {
  static readonly id = 'playwright';
  static readonly mode = 'browser';

  protected async buildResponse(context: PlaywrightCrawlingContext): Promise<FetchResponse> {
    const { page, response, request } = context;
    // In case of failed request, page might be closed.
    if (page.isClosed()) {
      return {
        url: request.url,
        finalUrl: request.loadedUrl || request.url,
        statusCode: response?.status(),
        statusText: response?.statusText(),
        headers: (await response?.allHeaders()) || {},
        body: '',
        html: '',
        text: '',
      };
    }
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

  protected async executeAction(context: PlaywrightCrawlingContext, action: FetchEngineAction): Promise<any> {
    const { page } = context;
    const defaultTimeout = this.opts?.timeoutMs || DefaultTimeoutMs;
    switch (action.type) {
      case 'navigate': {
        const response = await page.goto(action.url, {
          waitUntil: action.opts?.waitUntil || 'domcontentloaded',
          timeout: this.opts?.timeoutMs || DefaultTimeoutMs,
        });
        if (response) context = {...context, response}
        const fetchResponse = await this.buildResponse(context);
        this.lastResponse = fetchResponse;
        return fetchResponse;
      }
      case 'click': {
        // const beforePageId = page.mainFrame().url();
        await page.click(action.selector, { timeout: defaultTimeout })
        await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
        // if (beforePageId !== page.mainFrame().url()) {
          const navResponse = await this.buildResponse(context);
          this.lastResponse = navResponse;
        // }
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
            formData.forEach((value, key) => {
              data[key] = value.toString();
            });

            const response = await fetch(form.action, {
              method: form.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            const html = await response.text();
            return {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              body: html,
              html,
              text: html,
              url: form.action,
              finalUrl: response.url,
            };
          });

          await formHandle.dispose();
          await page.setContent(result.html);

          this.lastResponse = result;
          return;
        } else {
          await el.evaluate((form: HTMLFormElement) => form.submit());
          await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
          this.lastResponse = await this.buildResponse(context);
          return;
        }
      }
      case 'getContent': {
        return this.buildResponse(context);
      }
      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  private async requestHandler(context: PlaywrightCrawlingContext): Promise<void> {
    await this._sharedRequestHandler(context);
  }

  private async failedRequestHandler(context: PlaywrightCrawlingContext): Promise<void> {
    await this._sharedFailedRequestHandler(context);
  }

  protected async _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    const headless = ctx.browser?.headless ?? true;

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
        async ({ page, request }, gotOptions) => {
          // await page.setExtraHTTPHeaders(this.hdrs);
          gotOptions.throwHttpErrors = ctx.throwHttpErrors;
          if (this.jar.length > 0) {
            await page.context().addCookies(
              this.jar.map((c) => ({
                ...c,
                url: request.url,
                domain: c.domain || new URL(request.url).hostname,
              })),
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
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    await this.requestQueue.addRequest({
      url,
      headers: this.hdrs, // update headers
      userData: { requestId, waitUntil: opts?.waitUntil || 'domcontentloaded' },
      uniqueKey: `${url}-${requestId}`,
    });

    return promise;
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

  async submit(selector?: string, options?: SubmitActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options });
  }
}

FetchEngine.register(PlaywrightFetchEngine);
