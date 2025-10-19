import { CheerioCrawler, ProxyConfiguration, RequestQueue } from 'crawlee';
import type { CheerioCrawlingContext } from 'crawlee';
import { FetchEngine, type GotoOptions, type WaitForOptions } from './base';
import { BaseFetcherProperties, FetchResponse, ResourceType } from '../fetcher/types';
import { FetchContext } from '../fetcher/context';
import { isHref } from '../utils/helpers';

type CheerioAPI = NonNullable<CheerioCrawlingContext['$']>;
type CheerioSelection = ReturnType<CheerioAPI>;
type CheerioNode = ReturnType<CheerioSelection['first']>;

interface PendingRequest {
  resolve: (value: FetchResponse) => void;
  reject: (error: Error) => void;
}

export class CheerioFetchEngine extends FetchEngine {
  private crawler?: CheerioCrawler;
  private requestQueue?: RequestQueue;
  private url?: string;
  private lastResponse?: FetchResponse;
  private $?: CheerioAPI;
  private formData: Map<string, string> = new Map();
  private blockedTypes = new Set<string>();
  // 请求处理队列
  private pendingRequests = new Map<string, PendingRequest>();
  private requestCounter = 0;

  protected async _initialize(ctx: FetchContext, options?: BaseFetcherProperties): Promise<void> {
    const proxyUrls = this.opts?.proxy ? typeof this.opts.proxy === 'string' ? [this.opts.proxy] : this.opts.proxy : undefined;
    const proxy = proxyUrls ? new ProxyConfiguration({ proxyUrls }) : undefined;

    // 创建持久化的 RequestQueue
    this.requestQueue = await RequestQueue.open(`cheerio-queue-${ctx.id}`);

    this.crawler = new CheerioCrawler({
      requestQueue: this.requestQueue,

      maxConcurrency: 1,
      minConcurrency: 1,
      maxRequestRetries: ctx.retries || 3,
      requestHandlerTimeoutSecs: Math.max(5, Math.floor((this.opts?.timeoutMs || 30000) / 1000)),
      useSessionPool: true,
      persistCookiesPerSession: true, // 关键：让 Crawlee 管理 cookie
      sessionPoolOptions: {
        maxPoolSize: 1, // 单个 session，确保连续性
        sessionOptions: {
          maxUsageCount: 1000,
          maxErrorScore: 3,
        },
      },
      proxyConfiguration: proxy,
      // 预处理钩子：设置 headers
      preNavigationHooks: [
        async ({ request, session }, gotOptions) => {
          // if (Object.keys(this.hdrs).length > 0) {
          //   request.headers = { ...request.headers, ...this.hdrs };
          // }
          // 每次请求前刷新 headers/UA
          const ua = this.hdrs['user-agent'] || 'web-fetcher/0.1';
          gotOptions.headers = { ...(gotOptions.headers || {}), ...this.hdrs, 'user-agent': ua };
          // Cookie 自动通过 session.cookieJar 管理，无需手动注入
          // 你也可以在这里根据需要设置 gotOptions.responseType、timeout 等
          if (this.opts?.timeoutMs) gotOptions.timeout = { request: this.opts.timeoutMs };
        },
      ],

      // 请求处理器
      requestHandler: async (context: CheerioCrawlingContext) => {
        const { request, response, body, $ } = context;
        this.$ = $;
        this.url = request.loadedUrl || request.url;

        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(response?.headers || {})) {
          headers[k.toLowerCase()] = Array.isArray(v) ? v.join(', ') : String(v ?? '');
        }

        const text = typeof body === 'string'
          ? body
          : Buffer.isBuffer(body)
          ? body.toString('utf-8')
          : String(body ?? '');

        const fetchResponse: FetchResponse = {
          url: request.url,
          finalUrl: this.url,
          statusCode: response?.statusCode ?? 200,
          statusText: response?.statusMessage,
          headers: response?.headers as Record<string, string>,
          body,
          html: text,
          text,
        };

        this.lastResponse = fetchResponse;

        // 解析请求 ID 并触发对应的 Promise
        const requestId = request.userData.requestId as string;
        const pending = this.pendingRequests.get(requestId);

        if (pending) {
          pending.resolve(fetchResponse);
          this.pendingRequests.delete(requestId);
        }
      },

      // 失败处理器
      failedRequestHandler: async ({ request }, error) => {
        const requestId = request.userData.requestId as string;
        const pending = this.pendingRequests.get(requestId);

        if (pending) {
          pending.reject(error);
          this.pendingRequests.delete(requestId);
        }
      },
    });

    // 启动 Crawler（空运行，等待请求）
    this.crawler.run().catch((error) => {
      console.error('Crawler background error:', error);
    });
  }

  async goto(url: string, opts?: GotoOptions): Promise<void|FetchResponse> {
    if (!this.requestQueue) {
      throw new Error('RequestQueue not initialized');
    }

    this.url = url;

    // 生成唯一请求 ID
    const requestId = `req-${++this.requestCounter}`;

    // 创建 Promise 用于等待结果
    const promise = new Promise<FetchResponse>((resolve, reject) => {
      this.pendingRequests.set(requestId, { resolve, reject });
    });

    // 添加请求到队列
    if (opts?.payload && typeof opts.payload === 'object') {
      opts.payload = JSON.stringify(opts.payload);
    }
    await this.requestQueue.addRequest({
      ...opts,
      url,
      userData: { requestId },
      uniqueKey: `${url}-${requestId}`, // 确保唯一性
    });

    // 等待请求完成
    return promise;
  }

  async getContent(): Promise<FetchResponse> {
    if (!this.lastResponse) {
      throw new Error('No content available. Call goto() first.');
    }
    return this.lastResponse;
  }

  async waitFor(options?: WaitForOptions): Promise<void> {
    if (options?.ms) {
      await new Promise((resolve) => setTimeout(resolve, options.ms));
    }
    // HTTP 模式下 selector 和 networkIdle 是 noop
  }

  async click(selectorOrHref: string): Promise<void> {
    const $ = this.$;
    if (!$) throw new Error('No document loaded. Call goto() first.');
    let href = selectorOrHref;

    if (!isHref(selectorOrHref)) {
      // 模拟点击：寻找链接并导航
      const $link = $(selectorOrHref).first();
      if ($link.length === 0) throw new Error(`click: selector not found: ${selectorOrHref}`);
      if ($link.is('a') && $link.attr('href')) {
        href = $link.attr('href')!;
      } else if ($link.is('input[type="submit"], button[type="submit"], button, input')) {
        const $form = $link.closest('form');
        if ($form.length) return this.submit($form);
        throw new Error('click: submit-like element without form');
      } else throw new Error('click: unsupported element for http simulate');
    }

    try {
      const absoluteUrl = new URL(href, this.url).href;
      await this.goto(absoluteUrl);
    } catch {
      throw new Error(`Cannot click: no valid link found for "${selectorOrHref}"`);
    }
  }

  async fill(selector: string, value: string): Promise<void> {
    const $ = this.$;
    if (!$) throw new Error('No document loaded. Call goto() first.');

    const $input = $(selector).first();
    if ($input.length === 0) {
      throw new Error(`fill: selector not found: ${selector}`);
    }

    if ($input.is('input, textarea, select')) {
      const name = $input.attr('name') || selector;
      this.formData.set(name, value);
      $input.val(value);
    } else {
      throw new Error(`fill: not a form field: ${selector}`);
    }
  }

  async submit(selector?: string | CheerioNode): Promise<void> {
    const $ = this.$;
    if (!$) throw new Error('No document loaded. Call goto() first.');

    const $form = typeof selector === 'string' ? $(selector).first() : selector != null ? selector : $('form').first();
    if ($form.length === 0) { throw new Error('submit: Form not found'); }

    const action = $form.attr('action') || this.url;
    const method = ($form.attr('method') || 'GET').toUpperCase();

    if (!action) throw new Error('submit: Form action not found');

    const url = new URL(action, this.url).href;

    // 收集表单数据
    const formData = buildFormData($form);

    // 覆盖手动 fill 的值, 应该不需要，fill的时候已经改了Html表单的值
    /*
    this.formData.forEach((value, name) => {
      formData[name] = value;
    });
    */

    if (method === 'GET') {
      const urlObj = new URL(url);
      Object.entries(formData).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value);
      });
      await this.goto(urlObj.href);
    } else {
      await this.goto(url, { method: 'POST', payload: formData });
    }

    // 清空表单数据
    this.formData.clear();
  }

  async blockResources(types: ResourceType[]): Promise<boolean> {
    types.forEach(t => this.blockedTypes.add(t));
    return true;
  }

  async _cleanup() {
    // 等待所有待处理请求完成
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

    // 清理 Crawler 和 Queue
    if (this.crawler) {
      await this.crawler.teardown?.();
    }

    if (this.requestQueue) {
      await this.requestQueue.drop();
    }

    this.crawler = undefined;
    this.requestQueue = undefined;
    this.lastResponse = undefined;
    this.$ = undefined;
    this.ctx = undefined;
    this.opts = undefined;
    this.url = undefined;
    this.formData.clear();
    this.blockedTypes.clear();
  }
}

function buildFormData($form: CheerioNode) {
  const formData: Record<string, string> = {};
  $form.find('input, select, textarea').each((_, el) => {
    const $el = $form.find(el);
    const name = $el.attr('name');
    if (!name) return;
    const value = $el.val();
    if (value) {
      formData[name] = String(value);
    }
  });
  return formData;
}