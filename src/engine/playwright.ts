import { PlaywrightCrawler } from 'crawlee';
import type { PlaywrightCrawlingContext, PlaywrightCrawlerOptions } from 'crawlee';
import { firefox } from 'playwright';
import { FetchEngine, type GotoActionOptions, FetchEngineAction } from './base';
import { FetchResponse, type OnFetchPauseCallback } from '../core/types';
import { FetchEngineContext } from '../core/context';
import { CommonError, ErrorCode, NotFoundError } from '@isdk/common-error';
import { ExtractValueSchema } from '../core/extract';

const DefaultTimeoutMs = 30_000;

type Page = NonNullable<PlaywrightCrawlingContext['page']>;
type Locator = ReturnType<Page['locator']>;

export class PlaywrightFetchEngine extends FetchEngine<
  PlaywrightCrawlingContext,
  PlaywrightCrawler,
  PlaywrightCrawlerOptions
> {
  static readonly id = 'playwright';
  static readonly mode = 'browser';

  protected async _buildResponse(context: PlaywrightCrawlingContext): Promise<FetchResponse> {
    const { page, response, request, session } = context;
    // In case of failed request, page might be closed.
    if (!page || page.isClosed()) {
      return {
        url: request.url,
        finalUrl: request.loadedUrl || request.url,
        statusCode: response?.status(),
        statusText: response?.statusText(),
        headers: (await response?.allHeaders()) || {},
        cookies: [],
        body: '',
        html: '',
        text: '',
      };
    }
    const body = await page.content();
    const text = await page.textContent('body');
    const cookies = await page.context().cookies();
    console.log('[PlaywrightEngine] Cookies from page context:', cookies);
    if (session) {
      session.setCookies(cookies, request.url);
    }
    return {
      url: page.url(),
      finalUrl: page.url(),
      statusCode: response?.status(),
      statusText: response?.statusText(),
      headers: (await response?.allHeaders()) || {},
      cookies,
      body,
      html: body,
      text: text || '',
    };
  }

  protected async _querySelectorAll(context: Locator, selector: string): Promise<any[]> {
    return context.locator(selector).all();
  }

  protected async _extractValue(schema: ExtractValueSchema, context: Locator): Promise<any> {
    const { attribute, type = 'string' } = schema;

    if (await context.count() === 0) return null;

    let value: string | null = '';
    if (attribute) {
      value = await context.getAttribute(attribute);
    } else if (type === 'html') {
      value = await context.innerHTML();
    } else {
      value = await context.textContent();
    }

    if (value === null) return null;
    value = value.trim();

    switch (type) {
      case 'number':
        return parseFloat(value.replace(/[^0-9.-]+/g, '')) || null;
      case 'boolean':
        const lowerValue = value.toLowerCase();
        return lowerValue === 'true' || lowerValue === '1';
      default:
        return value;
    }
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
        if (response) context = { ...context, response };
        const fetchResponse = await this.buildResponse(context);
        this.lastResponse = fetchResponse;
        return fetchResponse;
      }
      case 'extract': {
        const result = await this._extract(action.schema, page.locator('body'));
        this.lastResponse = await this.buildResponse(context);
        return result;
      }
      case 'click': {
        // const beforePageId = page.mainFrame().url();
        await page.click(action.selector, { timeout: defaultTimeout });
        await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
        // if (beforePageId !== page.mainFrame().url()) {
        const navResponse = await this.buildResponse(context);
        this.lastResponse = navResponse;
        // }
        return;
      }
      case 'fill':
        await page.fill(action.selector, action.value, { timeout: defaultTimeout });
        const navResponse = await this.buildResponse(context);
        this.lastResponse = navResponse;
        return;
      case 'waitFor':
        try {
          if (action.options?.selector) {
            await page.waitForSelector(action.options.selector, { timeout: defaultTimeout });
          }
          if (action.options?.networkIdle) {
            await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
          }
        } catch (e) {
          if (action.options?.failOnTimeout === false) {
             // ignore error
          } else {
            throw e;
          }
        }
        if (action.options?.ms) {
          await page.waitForTimeout(action.options.ms);
        }
        return;
      case 'submit': {
        const formSelector = action.selector || 'form';
        const el = page.locator(formSelector).first();
        if ((await el.count()) === 0) {
          throw new NotFoundError(formSelector, 'submit');
        }

        const enctype = action.options?.enctype || 'application/x-www-form-urlencoded';

        if (enctype === 'application/json') {
          const formHandle = await el.elementHandle();
          if (!formHandle) {
            throw new CommonError(`submit: could not get form handle for ${formSelector}`, 'submit');
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
      case 'pause': {
        const onPauseHandler = (this.ctx as any)?.onPause as OnFetchPauseCallback | undefined;
        if (onPauseHandler) {
          console.info(action.message || 'Execution paused for manual intervention.');
          await onPauseHandler({ message: action.message });
          console.info('Resuming execution...');
        } else {
          console.warn(
            '[PauseAction] was called, but no `onPause` handler was provided in fetchWeb options. Skipped.',
          );
        }
        return;
      }
      case 'getContent': {
        return this.buildResponse(context);
      }
      default:
        throw new CommonError(`Unknown action type: ${(action as any).type}`, 'PlaywrightFetchEngine.executeAction', ErrorCode.NotSupported);
    }
  }

  protected _createCrawler(options: PlaywrightCrawlerOptions): PlaywrightCrawler {
    return new PlaywrightCrawler(options);
  }

  protected async _getSpecificCrawlerOptions(ctx: FetchEngineContext): Promise<Partial<PlaywrightCrawlerOptions>> {
    const headless = ctx.browser?.headless ?? true;

    const crawlerOptions: Partial<PlaywrightCrawlerOptions> = {
      maxRequestRetries: ctx.retries || 3,
      headless,
      requestHandlerTimeoutSecs: ctx.requestHandlerTimeoutSecs,
      preNavigationHooks: [
        async ({ page, request }, gotOptions) => {
          // await page.setExtraHTTPHeaders(this.hdrs);
          gotOptions.throwHttpErrors = ctx.throwHttpErrors;

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

    if (this.opts?.antibot) {
      crawlerOptions.browserPoolOptions = {
        // Disable the default fingerprint spoofing to avoid conflicts with Camoufox.
        useFingerprints: false,
      };

      const { launchOptions } = await import('camoufox-js');
      const lo = await launchOptions({
          headless,
      });

      crawlerOptions.launchContext = {
        launcher: firefox,
        launchOptions: lo,
      };

      crawlerOptions.postNavigationHooks = [
        async ({ page, handleCloudflareChallenge }) => {
            await handleCloudflareChallenge();
        },
      ];
    }

    return crawlerOptions;
  }

  async goto(url: string, opts?: GotoActionOptions): Promise<FetchResponse> {
    if (this.isPageActive) {
      return this.dispatchAction({ type: 'navigate', url, opts });
    }

    if (!this.requestQueue) {
      throw new CommonError('RequestQueue not initialized', 'goto');
    }

    const requestId = `req-${++this.requestCounter}`;
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    await this.requestQueue.addRequest({
      url,
      headers: this.hdrs, // update headers
      userData: {
        requestId,
        waitUntil: opts?.waitUntil || 'domcontentloaded',
      },
      uniqueKey: `${url}-${requestId}`,
    });

    return promise;
  }

}

FetchEngine.register(PlaywrightFetchEngine);
