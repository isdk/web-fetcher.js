import { CheerioCrawler, ProxyConfiguration, RequestQueue } from 'crawlee';
import type { CheerioCrawlingContext, CheerioCrawlerOptions } from 'crawlee';
import { FetchEngine, type GotoActionOptions, type SubmitActionOptions, type WaitForActionOptions, FetchEngineAction } from './base';
import { BaseFetcherProperties, FetchResponse, ResourceType } from '../core/types';
import { FetchEngineContext } from '../core/context';

type CheerioAPI = NonNullable<CheerioCrawlingContext['$']>;
type CheerioSelection = ReturnType<CheerioAPI>;
type CheerioNode = ReturnType<CheerioSelection['first']>;

export class CheerioFetchEngine extends FetchEngine {
  static readonly id = 'cheerio';
  static readonly mode = 'http';

  protected async buildResponse(context: CheerioCrawlingContext): Promise<FetchResponse> {
    const { request, response, body } = context;
    const text = typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf-8') : String(body ?? '');
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

  protected async executeAction(context: CheerioCrawlingContext, action: FetchEngineAction): Promise<any> {
    const { $ } = context;
    switch (action.type) {
      case 'click': {
        if (!$) throw new Error(`Cheerio context not available for action: ${action.type}`);
        const selector = action.selector;
        const $link = $(selector).first();

        if ($link.length === 0) {
          // Selector not found. Let's assume it's a URL.
          try {
            const absoluteUrl = new URL(selector, context.request.loadedUrl || context.request.url).href;
            return this.goto(absoluteUrl);
          } catch {
            throw new Error(`click: selector not found or invalid URL: ${selector}`);
          }
        }

        if ($link.is('a') && $link.attr('href')) {
          const href = $link.attr('href')!;
          const absoluteUrl = new URL(href, context.request.loadedUrl || context.request.url).href;
          return this.goto(absoluteUrl);
        }

        if ($link.is('input[type="submit"], button[type="submit"], button, input')) {
          const $form = $link.closest('form');
          if ($form.length) return this.executeAction(context, { type: 'submit', selector: $form });
          throw new Error('click: submit-like element without form');
        }

        throw new Error(`click: unsupported element for http simulate. Selector: ${selector}`);
      }
      case 'fill': {
        if (!$) throw new Error(`Cheerio context not available for action: ${action.type}`);
        const $input = $(action.selector).first();
        if ($input.length === 0) throw new Error(`fill: selector not found: ${action.selector}`);
        if ($input.is('input, textarea, select')) {
          $input.val(action.value);
        } else {
          throw new Error(`fill: not a form field: ${action.selector}`);
        }
        return;
      }
      case 'waitFor':
        if (action.options?.ms) {
          await new Promise((resolve) => setTimeout(resolve, action.options!.ms));
        }
        return;
      case 'submit': {
        if (!$) throw new Error(`Cheerio context not available for action: ${action.type}`);
        const $form: CheerioNode = typeof action.selector === 'string' ? $(action.selector).first() : action.selector != null ? action.selector : $('form').first();
        if ($form.length === 0) throw new Error('submit: Form not found');
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
        if (method === 'GET') {
          const urlObj = new URL(url);
          Object.entries(formData).forEach(([key, value]) => urlObj.searchParams.set(key, value));
          return this.goto(urlObj.href);
        } else {
          const enctype = action.options?.enctype || 'application/x-www-form-urlencoded';
          let payload: any;
          const headers: Record<string, string> = {};

          if (enctype === 'application/json') {
            payload = JSON.stringify(formData);
            headers['Content-Type'] = 'application/json';
          } else {
            payload = new URLSearchParams(formData).toString();
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
          }
          return this.goto(url, { method: 'POST', payload, headers });
        }
      }
      case 'getContent':
        return this.buildResponse(context);
      default:
        throw new Error(`Unknown action type: ${(action as any).type}`);
    }
  }

  private async requestHandler(context: CheerioCrawlingContext): Promise<void> {
    await this._sharedRequestHandler(context);
  }

  private async failedRequestHandler(context: CheerioCrawlingContext): Promise<void> {
    await this._sharedFailedRequestHandler(context);
  }

  protected async _initialize(ctx: FetchEngineContext, options?: BaseFetcherProperties): Promise<void> {
    const proxyUrls = this.opts?.proxy ? (typeof this.opts.proxy === 'string' ? [this.opts.proxy] : this.opts.proxy) : undefined;
    const proxy = proxyUrls?.length ? new ProxyConfiguration({ proxyUrls }) : undefined;
    this.requestQueue = await RequestQueue.open(`cheerio-queue-${ctx.id}`);

    const crawlerOptions: CheerioCrawlerOptions = {
      additionalMimeTypes: ['text/plain'],
      requestQueue: this.requestQueue,
      maxConcurrency: 1,
      minConcurrency: 1,
      maxRequestRetries: ctx.retries || 3,
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
          gotOptions.throwHttpErrors = false;
          if (this.opts?.timeoutMs) gotOptions.timeout = { request: this.opts.timeoutMs };
        },
      ],
      requestHandler: this.requestHandler.bind(this),
      failedRequestHandler: this.failedRequestHandler.bind(this),
    };

    this.crawler = new CheerioCrawler(crawlerOptions);
    this.crawler.run().catch((error) => {
      console.error('Crawler background error:', error);
    });
  }

  async goto(url: string, opts?: GotoActionOptions): Promise<void | FetchResponse> {
    if (this.isPageActive) {
      await this.dispatchAction({ type: 'dispose' });
    }
    if (!this.requestQueue) throw new Error('RequestQueue not initialized');

    const requestId = `req-${++this.requestCounter}`;
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    const headers = { ...this.hdrs, ...opts?.headers };

    await this.requestQueue.addRequest({
      ...opts,
      url,
      headers,
      userData: { requestId },
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

  async submit(selector?: string | CheerioNode, options?: SubmitActionOptions): Promise<void> {
    return this.dispatchAction({ type: 'submit', selector, options });
  }
}

FetchEngine.register(CheerioFetchEngine);
