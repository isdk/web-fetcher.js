import { CheerioCrawler, ProxyConfiguration } from 'crawlee';
import type { CheerioCrawlingContext, CheerioCrawlerOptions } from 'crawlee';
import * as cheerio from 'cheerio';
import {
  FetchEngine,
  type GotoActionOptions,
  type SubmitActionOptions,
  type WaitForActionOptions,
  FetchEngineAction,
} from './base';
import { BaseFetcherProperties, FetchResponse } from '../core/types';
import { FetchEngineContext } from '../core/context';
import { createPromiseLock } from './promise-lock';
import { CommonError, ErrorCode, NotFoundError } from '@isdk/common-error';
import { ExtractSchema, ExtractValueSchema } from '../core/extract';

type CheerioAPI = NonNullable<CheerioCrawlingContext['$']>;
type CheerioSelection = ReturnType<CheerioAPI>;
type CheerioNode = ReturnType<CheerioSelection['first']>;

export class CheerioFetchEngine extends FetchEngine {
  static readonly id = 'cheerio';
  static readonly mode = 'http';

  protected async buildResponse(context: CheerioCrawlingContext): Promise<FetchResponse> {
    const { request, response, body, $ } = context;
    const newHtml = $?.html();
    let text = typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf-8') : String(body ?? '');
    if (newHtml && newHtml !== text) {
      text = newHtml;
    }
    return {
      url: request.url,
      finalUrl: request.loadedUrl || request.url,
      statusCode: response?.statusCode ?? 200,
      statusText: response?.statusMessage,
      headers: response?.headers as Record<string, string>,
      body,
      html: text,
      text,
    };
  }

  protected async _querySelectorAll(context: {$: CheerioAPI, el: CheerioNode}, selector: string): Promise<any[]> {
    const { $, el } = context;
    return el.find(selector).toArray().map(e => ({ $, el: $(e) }));
  }

  protected async _extractValue(schema: ExtractValueSchema, context: { el: CheerioNode }): Promise<any> {
    const { el } = context;
    const { attribute, type = 'string' } = schema;

    if (el.length === 0) return null;

    let value: string | null = '';
    if (attribute) {
      value = el.attr(attribute) ?? null;
    } else if (type === 'html') {
      value = el.html();
    } else {
      value = el.text().trim();
    }

    if (value === null) return null;

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

  protected async executeAction(context: CheerioCrawlingContext, action: FetchEngineAction): Promise<any> {
    const { $ } = context;
    switch (action.type) {
      case 'dispose':
        // This action is used by the base class cleanup logic.
        return;
      case 'extract': {
        if (!$) throw new CommonError(`Cheerio context not available for action: ${action.type}`, 'extract');
        return this._extract(action.schema, { $, el: $.root() });
      }
      case 'click': {
        if (!$) throw new CommonError(`Cheerio context not available for action: ${action.type}`, 'click');
        const selector = action.selector;
        const $link = $(selector).first();

        let absoluteUrl: string;

        if ($link.length === 0) {
          // Selector not found. Let's assume it's a URL.
          try {
            absoluteUrl = new URL(selector, context.request.loadedUrl || context.request.url).href;
          } catch {
            throw new CommonError(`click: selector not found or invalid URL: ${selector}`, 'click');
          }
        } else if ($link.is('a') && $link.attr('href')) {
          const href = $link.attr('href')!;
          absoluteUrl = new URL(href, context.request.loadedUrl || context.request.url).href;
        } else if ($link.is('input[type="submit"], button[type="submit"], button, input')) {
          const $form = $link.closest('form');
          if ($form.length) return this.executeAction(context, { type: 'submit', selector: $form });
          throw new CommonError('click: submit-like element without form', 'click');
        } else {
          throw new CommonError(`click: unsupported element for http simulate. Selector: ${selector}`, 'click');
        }

        const loadedRequest = await context.sendRequest({ url: absoluteUrl });
        this._updateStateAfterNavigation(context, loadedRequest);
        return;
      }
      case 'fill': {
        if (!$) throw new CommonError(`Cheerio context not available for action: ${action.type}`), 'fill';
        const $input = $(action.selector).first();
        if ($input.length === 0) throw new CommonError(`fill: selector not found: ${action.selector}`);
        if ($input.is('input, textarea, select')) {
          $input.val(action.value);
          const res = this.buildResponse(context) as any;
          this.lastResponse = res;
        } else {
          throw new CommonError(`fill: not a form field: ${action.selector}`, 'fill');
        }
        return;
      }
      case 'waitFor':
        if (action.options?.ms) {
          await new Promise((resolve) => setTimeout(resolve, action.options!.ms));
        }
        return;
      case 'pause':
        // Pause is a no-op in Cheerio engine
        return;
      case 'submit': {
        if (!$) throw new CommonError(`Cheerio context not available for action: ${action.type}`, 'submit');
        const $form: CheerioNode = typeof action.selector === 'string' ? $(action.selector).first() : action.selector != null ? action.selector : $('form').first();
        if ($form.length === 0) throw new NotFoundError(action.selector, 'submit');
        const actionAttr = $form.attr('action') || context.request.loadedUrl || context.request.url;
        const method = ($form.attr('method') || 'GET').toUpperCase();
        const url = new URL(actionAttr, context.request.loadedUrl || context.request.url).href;
        const formData: Record<string, string> = {};
        $form.find('input, select, textarea').each((_, el) => {
          const $el = $(el);
          const name = $el.attr('name');
          if (!name) return;
          const value = $el.val();
          if (value != null) {
            formData[name] = String(value);
          }
        });

        let loadedRequest: any;
        if (method === 'GET') {
          const urlObj = new URL(url);
          Object.entries(formData).forEach(([key, value]) => urlObj.searchParams.set(key, value));
          loadedRequest = await context.sendRequest({ url: urlObj.href, method: 'GET' });
        } else {
          const enctype = action.options?.enctype || ($form.attr('enctype') as any) || 'application/x-www-form-urlencoded';
          let body: any;
          const headers: Record<string, string> = {};

          if (enctype === 'application/json') {
            body = JSON.stringify(formData);
            headers['Content-Type'] = 'application/json';
          } else {
            body = new URLSearchParams(formData).toString();
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
          }
          loadedRequest = await context.sendRequest({ url, method: 'POST', body, headers });
        }

        this._updateStateAfterNavigation(context, loadedRequest);
        return;
      }
      case 'getContent':
        return this.buildResponse(context);
      default:
        throw new CommonError(`Unknown action type: ${(action as any).type}`, 'CheerioFetchEngine.executeAction', ErrorCode.NotSupported);
    }
  }

  private _updateStateAfterNavigation(context: CheerioCrawlingContext, loadedRequest: any) {
    const response = loadedRequest.response || loadedRequest;

    const { body, headers, statusCode, statusMessage } = response;
    const { url, loadedUrl } = loadedRequest;

    const text = typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf-8') : String(body ?? '');

    if (headers && headers['content-type']?.includes('html')) {
      context.$ = cheerio.load(text) as any;
    }

    this.lastResponse = {
      url,
      finalUrl: loadedUrl || url,
      statusCode,
      statusText: statusMessage,
      headers: (headers as Record<string, string>) || {},
      body,
      html: text,
      text,
    };
  }

  private async requestHandler(context: CheerioCrawlingContext): Promise<void> {
    await this._sharedRequestHandler(context);
  }

  private async failedRequestHandler(context: CheerioCrawlingContext, error: Error): Promise<void> {
    await this._sharedFailedRequestHandler(context, error);
  }

  protected async _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    const proxyUrls = this.opts?.proxy ? (typeof this.opts.proxy === 'string' ? [this.opts.proxy] : this.opts.proxy) : undefined;
    const proxy = proxyUrls?.length ? new ProxyConfiguration({ proxyUrls }) : undefined;

    const crawlerOptions: CheerioCrawlerOptions = {
      additionalMimeTypes: ['text/plain'],
      requestQueue: this.requestQueue,
      maxConcurrency: 1,
      minConcurrency: 1,
      maxRequestRetries: 1,
      requestHandlerTimeoutSecs: Math.max(5, Math.floor((this.opts?.timeoutMs || 30000) / 1000)),
      useSessionPool: true,
      persistCookiesPerSession: true,
      sessionPoolOptions: {
        maxPoolSize: 1,
        persistenceOptions: { enable: false },
        sessionOptions: { maxUsageCount: 1000, maxErrorScore: 3 },
      },
      proxyConfiguration: proxy,
      preNavigationHooks: [
        (crawlingContext, gotOptions) => {
          // gotOptions.headers = { ...this.hdrs }; // 已经移到 goto 处理
          gotOptions.throwHttpErrors = ctx.throwHttpErrors;
          if (this.opts?.timeoutMs) gotOptions.timeout = { request: this.opts.timeoutMs };
        },
      ],
      requestHandler: this.requestHandler.bind(this),
      errorHandler: this.failedRequestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    };

    this.crawler = new CheerioCrawler(crawlerOptions);
    this.crawler.run().catch((error) => {
      console.error('Crawler background error:', error);
    });
  }

  async goto(url: string, params?: GotoActionOptions): Promise<void | FetchResponse> {
    // If a page is already active, tell it to clean up.
    if (this.isPageActive) {
      // We don't await this, as that would re-introduce the deadlock.
      this.dispatchAction({ type: 'dispose' }).catch(() => {
        // Ignore errors, we just want to signal disposal.
      });
    }

    const requestId = `req-${++this.requestCounter}`;
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      const timeoutMs = params?.timeoutMs || this.opts?.timeoutMs || 30000;
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.navigationLock.release(); // Release lock on timeout
        reject(new CommonError(`goto timed out after ${timeoutMs}ms.`, 'gotoTimeout', ErrorCode.RequestTimeout));
      }, timeoutMs);

      const cleanupAndResolve = (response: FetchResponse) => {
        clearTimeout(timeoutId);
        resolve(response);
      };

      const cleanupAndReject = (error: any) => {
        clearTimeout(timeoutId);
        reject(error);
      };

      this.pendingRequests.set(requestId, { resolve: cleanupAndResolve, reject: cleanupAndReject });
    });

    // Add the request to the queue BEFORE awaiting the lock.
    // This prevents a race condition where the crawler might shut down
    // thinking the queue is empty.
    this.requestQueue!.addRequest({
      ...params,
      url,
      headers: { ...this.hdrs, ...params?.headers },
      userData: { requestId },
      uniqueKey: `${url}-${requestId}`,
    }).catch(error => {
      const pending = this.pendingRequests.get(requestId);
      if (pending) {
        this.pendingRequests.delete(requestId);
        this.navigationLock.release();
        pending.reject(error);
      }
    });

    // Now, wait for the previous handler to finish and release its lock.
    await this.navigationLock;

    // Set a new lock for this navigation session.
    this.navigationLock = createPromiseLock();

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

  async submit(selector?: string | CheerioNode, options?: SubmitActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options });
  }

  async pause(message?: string): Promise<void> {
    return this.dispatchAction({ type: 'pause', message });
  }


}

FetchEngine.register(CheerioFetchEngine);
