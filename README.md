# @isdk/web-fetcher

web-fetcher是一个智能化的、自适应的 标准化 Web 抓取客户端库

它的核心使命是封装底层抓取技术的复杂性，提供一个简单、统一且强大的API，为每一次抓取任务自动选择并应用最佳的抓取策略。让开发者能专注于数据提取的业务逻辑，而非抓取过程中的繁琐细节。

技术栈: Node/Typescript/tsup/vitest, crawlee

功能特性:

* 职责单一 (Single Responsibility): web-fetcher 只做一件事并把它做到极致：获取 Web 内容。它不关心如何解析内容，也不关心抓取流程的编排。
* 统一的API (Unified API): 无论底层是使用基于请求的 Cheerio 还是基于浏览器的 Playwright，web-fetcher 都力求提供一致的函数签名和返回结果。这使得上层应用可以无缝切换抓取引擎以应对不同类型的网站，而无需修改业务代码。
* 动作集合和统一语义: web-fetcher 使用动作来描述抓取流程
  * 动作分为http和浏览器都支持的(包括可以通过模拟支持的，如click(检查到是元素并且有href,或者是表单的选择元素都可模拟), fill, submit);仅浏览器支持的(浏览器支持的是http的超集，http的所有能力浏览器都应该支持);用户自定义的动作(需要标明支持的能力)，
* 抽象而非泄露 (Abstraction, not Leaking):
  * 本库将常见的http行为和浏览器交互（如点击、填充、滚动）抽象为标准的动作，而不是将例如 Playwright 的 page 对象等底层细节泄露给调用者。
* 事件驱动 (Event-Driven): 抓取过程中的关键节点（如请求开始/结束、内容获取、error等）都会以事件的形式通知出去。
  * 许多事件存在于crawlee 的事件管理者中: `const config = Configuration.getGlobalConfig(); const eventemitter = config.getEventManager();`
  * 还有 hook 中
* 智能化站点类型探测: 对于站点清单之外的未知站点，web-fetcher 可以触发一个自动探测流程
* 管理网络层面的所有复杂性（代理、Cookie、反爬）
* 充分利用 Crawlee 的并发、限速、重试、Session/Proxy 等能力，支持事件通知与可取消的后台抓取。
* 把 sites 与“智能探测站点类型”下沉到 web-fetcher 可以让 fetch 更“聪明”
  * 把“智能”做成可选、可插拔的 Smart 层：默认不开启；开启后 fetch 会自动选择 http 或 browser 引擎，并在需要时升级为浏览器获取，同时将探测结果写回 sites 注册表。

主要API如下:

* WebFetcher 类: 管理上下文，获取内容，执行浏览器行为
  * fetch 方法: 默认内部是通过执行一个标准动作然后得到页面内容, 不过允许在参数中传入可选的执行动作列表代替默认动作。
  * 创建抓取会话，允许分步执行，通过会话的上下文有效的在各个步骤之间传递信息。
* 智能探测: 策略如下
  * 初始尝试: 总是先用最快、最轻量的 http(CheerioCrawler) 引擎进行一次试探性抓取
  * 内容分析:
    * 检查返回的HTML内容。如果`<body>`标签为空，或者包含明显的“请启用JavaScript”提示，或者只有一个`<div id="app"></div>`这样的挂载点，那么可以初步判断为`browser`类型
    * 对比直接请求的HTML和经过 `browser` 简单渲染后的HTML的DOM结构差异度。如果差异巨大，说明网站严重依赖JS渲染
  * 反爬探测:
    * 检查响应头和内容是否包含 Cloudflare、Akamai 等知名CDN的机器人质询页面特征
    * 如果 http 请求失败或超时，而 browser (尤其是在开启 antibot 后) 请求成功，则可以判定为有反爬措施，设置 antibot 为 true
  * 生成探测结果作为 site 注册表项

配置项的优先级: 配置参数 > 站点注册表 > 全局配置

WebFetcher的配置项:

* sites?: 可选的站点注册表，包含站点的 domain、抓取模式等，详见后述站点注册表配置项
* mode?: 抓取模式，可选值有 http、browser、auto、smart, 默认为 auto
  * auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.
* browser: 浏览器配置项，当抓取模式最终确认为browser时使用
  * engine?: 浏览器引擎，可选值有 playwright、puppeteer, 默认为 playwright
  * headless?: bool, 浏览器是否无头模式
  * waitUntil?: string, 等待页面加载完成的默认条件,networkidle 对于SPA网站通常是好的选择，但可能较慢。load, domcontentloaded, networkidle, commit, 默认为 domcontentloaded
  * blockResources?: string[], 阻止加载特定类型的资源以加快页面加载速度和节省带宽。
    * images, stylesheets, fonts, scripts, media
* headers?: 请求头
* http?: http 配置项
  * method?: 请求方法，仅限http模式下使用
  * body?: 请求体, 仅限http模式下使用
* proxy?: string|string[],, 代理地址
* ignoreSslErrors?: bool, 忽略 SSL 错误
  * browser 模式下，需要根据浏览器类型设置浏览器内部配置。
* antibot?: bool, 仅 browser
* timeoutMs?: number, 抓取超时时间
* maxConcurrency?: number, 最大并发数
* maxRequestsPerMinute?: number, 每分钟允许发出的最大请求数
* delayBetweenRequestsMs?: number, 请求之间的延迟时间

站点注册表配置项:

* domain: 站点主域名（后缀匹配）
* pathScope?: 可选路径匹配列表,路径前缀限制，仅对匹配到该前缀的 URL 应用此配置
* mode?: 抓取模式，可选值有 http、browser、auto、smart, 默认为 auto
* engine?: 浏览器引擎，可选值有 playwright、puppeteer, 默认为 playwright
* antibot?: bool, 仅 browser
* defaultHeaders?: 为该域的请求统一追加的请求头
  * 优先级：请求级 headers > 站点 defaultHeaders > 全局 defaultHeaders
* proxy?: string|string[], 该域默认代理
* auth?:
  * reuseCookies?: boolean, 对该域启用 CookieStore 读写（加载/保存登录态）, 默认为 true
  * preloadCookies?: Cookie[], 预置 Cookie（首次加载时注入）
* ignoreSslErrors?: bool, 忽略 SSL 错误
* timeoutMs?: number, 抓取超时时间
* maxConcurrency?: number, 最大并发数
* maxRequestsPerMinute?: number, 每分钟允许发出的最大请求数
* delayBetweenRequestsMs?: number, 请求之间的延迟时间

抓取的返回结果大致有4类，返回响应，上下文，最后一个动作的结果，结构化的输出对象(outputs)



让我们首先想清楚如何实现，如何具体定义类，整理好具体思路，不要急于写代码，我们第一步先把所有事情先讨论清楚，整理出一个最小可行框架。

首先思考:

1. 会话中需要上下文，方便记录上一次的动作、响应、结果，调用API等。
2. 应该允许动作自定义返回结果。不过多数情况下返回的抓取结果。
3. 有时候我们需要动作附加得到一些东西，比如，截屏，或者捕获从中出现的json数据，这些副作用应该是可自由扩展的，这些附加信息可以通过结构化的名称输出。
4. captureNetworkJson 是与具体动作相关的参数，不应该在抓取配置中。


* captureNetworkJson?: bool 已经清楚了，作为 action collector 配置。
  * 在执行一系列浏览器动作后，发现响应内容是 json，则将内容转为json对象立即返回该对象作为结果。

最后考虑如何架构

当最终模式为http时，检测到动作中包括仅浏览器支持的时，自动升级为browser模式，如果是一次性的fetch,这个可以通过遍历actions检测， 但是如果在分步执行过程中，如何升级？




## API 初稿 v0.1

```ts
export type FetchMode = 'http' | 'browser' | 'auto' | 'smart';
export type BrowserEngine = 'playwright' | 'puppeteer';
export type Headers = Record<string, string | string[]>;

export interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number | Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

export interface FetchResult {
  url: string;
  finalUrl: string; // 重定向后的最终URL
  statusCode?: number;
  statusText?: string;
  headers: Headers;
  contentType?: string;
  html?: string;
  text?: string;
  json?: any;
  cookies?: Cookie[];

  metadata?: {
    engine: 'http' | 'browser';
    timings?: {
      total: number;
      ttfb: number;
      dns?: number;
      tcp?: number;
      firstByte?: number;
      download?: number;
    };
    proxy?: string;
    [key: string]: any;
  };
}

export interface FetchContext {
  id: string;
  strategy: FetchStrategy;   // 抓取策略统一的抓取接口

  url?: string;
  finalUrl?: string;

  headers: Record<string, string>;
  cookies: Cookie[];
  proxy?: string;

  lastResponse?: FetchResult; // 仅“页面内容响应”
  lastResult?: ActionResult;  // 最近一次动作返回（响应/JSON/自定义）

  currentAction?: {
    name: string;
    params?: any;
    index?: number;
    startedAt: number;
    finishedAt?: number;
    error?: { message: string; code?: string };
  };

  // 累积的命名输出
  outputs: Map<string, any>;
}

// 动作结果约定（非强制；内置动作遵循；自定义动作建议遵循）
export interface ActionResult {
  kind: 'response' | 'json' | 'custom';
  sourceAction: string; at?: number;
  response?: FetchResult; // 仅 kind 为 response 时有效
  json?: any; // 仅 kind 为 json 时有效
  data?: any; // 仅 kind 为 custom 时有效
}

export const isPageResponse = (r: any): r is Extract<ActionResult, { kind: 'response' }> =>
  !!r && r.kind === 'response';

/* 执行返回类型选择器 */
export type ReturnKind = 'response' | 'context' | 'result' | 'outputs' | 'none';

export type ReturnTypeFor<R extends ReturnKind> =
  R extends 'response' ? FetchResult :
  R extends 'context'  ? ContextSnapshot :
  R extends 'result'   ? ActionResult | undefined :
  R extends 'outputs'  ? Record<string, any> :
  void;

/* =========================
   动作系统（可扩展）
   ========================= */

export interface JsonCaptureSpec {
  match?: {
    urlIncludes?: string | string[];
    urlRegex?: RegExp;
    contentType?: string | RegExp; // 默认 application/json
    status?: number | number[];    // 默认 2xx
    sameOrigin?: boolean;          // 默认 true
  };
  take?: 'first' | 'last' | 'largest'; // 默认 last
  storeAs?: string; // 默认 'lastJson' 键名
}

export interface ScreenshotSpec {
  fullPage?: boolean;
  selector?: string;
  format?: 'png' | 'jpeg';
  quality?: number; // jpeg only
  filename?: string; // 没有文件名则作为 base64 直接存放
  storeAs?: string;
}

export interface ActionEffects {
  captureNetworkJson?: JsonCaptureSpec;
  screenshot?: ScreenshotSpec;
  [custom: string]: any; // 自定义 effect 扩展点
}

/* 实例化动作（开放式） */
export interface BrowserAction<TName extends string = string, TParams = any> {
  type: TName;
  params?: TParams;
  effects?: ActionEffects;
  storeAs?: string; // 动作产物塞入 session.vars[storeAs]
}

/* 动作定义（注册） */
export interface ActionDefinition<TName extends string, TParams = any, TResult = any> {
  name: TName;
  validate?: (params: unknown) => TParams;
  supports: { http?: boolean; browser?: boolean };
  run?: (ctx: ActionRunContext, params: TParams) => Promise<ActionOutcome<TResult> | any | void>;
  upgradeHint?: string; // 例如：需要浏览器，已升级
}

/* 动作执行上下文（提供最小安全面） */
export interface ActionRunContext {
  sessionId: string;
  mode: 'http' | 'browser';
  engine?: BrowserEngine;

  api: {
    // 基础
    goto(url: string, opts?: { waitUntil?: 'load'|'domcontentloaded'|'networkidle'|'commit'; timeoutMs?: number }): Promise<void>;
    getContent(opts?: { as?: 'html'|'text' }): Promise<{ html?: string; text?: string; url: string }>;

    click?(selector: string, opts?: { button?: 'left'|'right'|'middle'; clickCount?: number; delayMs?: number }): Promise<void>;
    fill?(selector: string, value: string): Promise<void>;
    type?(selector: string, text: string, opts?: { delayMs?: number }): Promise<void>;
    select?(selector: string, value: string | string[]): Promise<void>;
    hover?(selector: string): Promise<void>;
    scroll?(opts?: { to?: 'top'|'bottom'; x?: number; y?: number; selector?: string }): Promise<void>;
    waitFor?(opts: { selector?: string; timeoutMs?: number; state?: 'visible'|'hidden'|'attached'|'detached'|'stable' }): Promise<void>;
    waitForNetworkIdle?(timeoutMs?: number): Promise<void>;
    evaluate?<T=unknown>(fnOrStr: string | ((...args:any[])=>T), args?: any[]): Promise<T>;
  };

  vars: Map<string, any>;
  headers: Record<string, string>;
  cookies: Cookie[];

  network: {
    enableJsonCapture(spec: JsonCaptureSpec): void;
    disableJsonCapture(): void;
    lastJson?: { url: string; body: any } | null;
  };
}

/* 动作执行返回（执行器会规范化为 ActionResult） */
export interface ActionOutcome<TResult = any> {
  output?: TResult;                  // 若提供 storeAs，会同步写入 session.vars
  sideEffects?: Record<string, any>; // 如截图路径、统计信息
}

export interface ActionRegistry {
  register<TName extends string>(def: ActionDefinition<TName, any, any>): void;
  unregister(name: string): void;
  get(name: string): ActionDefinition<any> | undefined;
  has(name: string): boolean;
  list(): string[];
}

/* =========================
   执行选项与上下文
   ========================= */

export interface FetchOptions<R extends ReturnKind = 'response'> {
  actions?: BrowserAction[];
  returns?: R;               // 默认 'response'
  signal?: AbortSignal;
  continueOnError?: boolean; // 默认 false
  emitNetworkEvents?: boolean; // 默认 false
  siteOverride?: Partial<SiteEntry>;
  mode?: FetchMode;
}

export interface ExecuteOptions<R extends ReturnKind = 'context'> {
  returns?: R;                 // 默认 'context'
  signal?: AbortSignal;
  continueOnError?: boolean;   // 默认 false；true 时单次执行内遇错继续后续动作
  emitNetworkEvents?: boolean; // 默认 false
}

/* =========================
   SmartDetector（可插拔）
   ========================= */

export interface SmartDetector {
  detect(input: {
    url: string;
    headers?: Record<string, string>;
    siteHint?: Partial<SiteEntry>;
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<{
    mode: 'http' | 'browser';
    engine?: BrowserEngine;
    antibot?: boolean;
    confidence?: number;
    reason?: string;
    ttlMs?: number;
  }>;

  load?(): Promise<void>;
  persist?(): Promise<void>;
}

/* =========================
   站点注册表（SiteRegistry）
   ========================= */

export interface SiteEntry {
  domain: string;
  pathScope?: string[];

  mode?: FetchMode;                 // 默认 auto；未启用 smartDetector 时 auto 等价 http
  engine?: BrowserEngine;           // 浏览器实现，默认 playwright
  antibot?: boolean;                // 默认 false
  defaultHeaders?: Record<string, string>;
  proxy?: string | string[];

  auth?: {
    reuseCookies?: boolean;         // 默认 true
    preloadCookies?: Cookie[];
  };

  ignoreSslErrors?: boolean;        // 默认 false

  timeoutMs?: number;
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
  delayBetweenRequestsMs?: number;

  browser?: {
    headless?: boolean;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    blockResources?: Array<'images'|'stylesheets'|'fonts'|'scripts'|'media'>; // 默认不阻止
  };

  http?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
  };

  meta?: {
    updatedAt?: number;
    ttlMs?: number;
    source?: 'manual' | 'smart';
  };
}

export interface SiteRegistry {
  register(entry: SiteEntry): void;
  unregister(domain: string): void;
  resolve(url: string): SiteEntry | undefined; // 按 domain + pathScope 最长匹配
  load?(): Promise<void>;
  persist?(): Promise<void>;
  list(): SiteEntry[];
}

/* =========================
   配置（WebFetcherConfig）
   ========================= */

export interface WebFetcherConfig {
  sites?: SiteEntry[];
  mode?: FetchMode; // 默认 auto（未启用 smartDetector 时等价 http）

  headers?: Record<string, string>;
  proxy?: string | string[];
  ignoreSslErrors?: boolean;

  timeoutMs?: number;
  maxConcurrency?: number;
  maxRequestsPerMinute?: number;
  delayBetweenRequestsMs?: number;

  browser?: {
    engine?: BrowserEngine; // 默认 playwright
    headless?: boolean;     // 默认 true
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  };

  http?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
  };

  antibot?: boolean; // 默认 false；开启后一个会话内保持一致
  smartDetector?: SmartDetector; // 未开启时 auto/smart 等价 http

  actions?: {
    allowOverride?: 'error' | 'override' | 'ignore'; // 默认 'error'
  };

  events?: {
    networkDetailsDefault?: boolean; // 默认 false
  };

  hooks?: Partial<Hooks>;
}

/* =========================
   WebFetcher / FetchSession / 事件 / Hooks
   ========================= */

export type WebFetcherEvent =
  | 'lifecycle:initialized'
  | 'lifecycle:closed'
  | 'request:start'
  | 'request:finished'
  | 'request:error'
  | 'engine:selected'
  | 'engine:upgraded'
  | 'actions:start'
  | 'actions:finished'
  | 'action:before'
  | 'action:after'
  | 'content:ready'
  | 'smart:detect:start'
  | 'smart:detect:finished'
  | 'network:response'
  | 'network:error'
  | 'actions:registry:register'
  | 'actions:registry:override'
  | 'actions:registry:duplicateIgnored';

export interface WebFetcherEventPayloads {
  'request:start': { url: string; mode: FetchMode; sessionId: string };
  'request:finished': { url: string; sessionId: string; result?: FetchResult };
  'request:error': { url: string; sessionId: string; error: WebFetcherError };
  'engine:selected': { mode: 'http' | 'browser'; engine?: BrowserEngine; reason?: string; sessionId: string };
  'engine:upgraded': { from: 'http'|'browser'; to: 'browser'; engine?: BrowserEngine; reason?: string; sessionId: string };
  'actions:start': { sessionId: string; count: number };
  'actions:finished': { sessionId: string; durationMs: number };
  'action:before': { sessionId: string; name: string; params?: any; index: number; startedAt: number };
  'action:after': { sessionId: string; name: string; outcome?: ActionResult; index: number; finishedAt: number };
  'content:ready': { sessionId: string; result: FetchResult };
  'smart:detect:start': { url: string };
  'smart:detect:finished': { url: string; outcome: any };
  'network:response': { sessionId: string; url: string; status: number; type?: string; headers?: Headers; size?: number };
  'network:error': { sessionId: string; url: string; error: any };
  'actions:registry:register': { name: string };
  'actions:registry:override': { name: string };
  'actions:registry:duplicateIgnored': { name: string };
}

export interface Hooks {
  beforeRequest?(ctx: { url: string; headers: Record<string, string>; proxy?: string; site?: SiteEntry }): Promise<void> | void;
  beforeActions?(ctx: ContextSnapshot): Promise<void> | void;
  afterContent?(result: FetchResult, ctx: ContextSnapshot): Promise<FetchResult | void> | void;
  onError?(error: WebFetcherError, ctx?: ContextSnapshot): Promise<void> | void;
}

export interface WebFetcher {
  fetch<R extends ReturnKind = 'response'>(url: string, opts?: FetchOptions<R>): Promise<ReturnTypeFor<R>>;

  execute<R extends ReturnKind = 'context'>(actions: BrowserAction | BrowserAction[], opts?: ExecuteOptions<R>): Promise<ReturnTypeFor<R>>;

  createSession(opts?: {
    url?: string;                   // 若提供，作为首次 goto（不自动 capture）
    siteOverride?: Partial<SiteEntry>;
    mode?: FetchMode;
  }): Promise<FetchSession>;

  getRegistry(): SiteRegistry;

  on<K extends WebFetcherEvent>(event: K, handler: (payload: WebFetcherEventPayloads[K]) => void): void;
  off<K extends WebFetcherEvent>(event: K, handler: (payload: WebFetcherEventPayloads[K]) => void): void;

  close(): Promise<void>;
}

export interface FetchSession {
  id: string;

  execute<R extends ReturnKind = 'context'>(actions: BrowserAction | BrowserAction[], opts?: ExecuteOptions<R>): Promise<ReturnTypeFor<R>>;

  getContext(): ContextSnapshot;

  setVars(vars: Record<string, any>): void;
  getVar<T = unknown>(key: string): T | undefined;

  upgradeToBrowser(engine?: BrowserEngine): Promise<void>;

  close(): Promise<void>;
}

/* =========================
   错误
   ========================= */

export type WebFetcherErrorCode =
  | 'FETCH_ERROR'
  | 'TIMEOUT'
  | 'ENGINE_UPGRADE_FAILED'
  | 'ANTIBOT_BLOCKED'
  | 'SSL_ERROR'
  | 'ACTION_NOT_SUPPORTED'
  | 'ACTION_FAILED'
  | 'SMART_DETECT_FAILED'
  | 'CONFIG_ERROR';

export class WebFetcherError extends Error {
  code: WebFetcherErrorCode;
  context?: {
    url?: string;
    mode?: 'http' | 'browser';
    engine?: BrowserEngine;
    proxy?: string;
    lastAction?: string;
  };
  cause?: unknown;

  constructor(code: WebFetcherErrorCode, message: string, extras?: { context?: WebFetcherError['context']; cause?: unknown }) {
    super(message);
    this.code = code;
    this.context = extras?.context;
    this.cause = extras?.cause;
  }
}
```

下面把“浏览器行为”系统化梳理，给出一套统一的 BrowserAction 规范（对 Playwright/Puppeteer 等价），涵盖常用到进阶能力，以及差异消除策略与最佳实践。

一、BrowserAction 统一设计目标

- 单一语义：同一动作在 Playwright 与 Puppeteer 下行为一致。
- KISS + 可扩展：常用动作开箱即用，进阶能力通过少量扩展字段实现。
- 稳定性优先：默认有合理的 wait/scrollIntoView/retry，尽量避免“随机挂”。

通用参数（所有动作可选）

- timeoutMs: number（默认 30s）
- retry: number（默认 0）
- retryDelayMs: number（默认 500）
- if/unless: string（表达式，渲染后为 truthy/falsey 决定是否执行）
- desc: string（仅用于日志）
- screenshotOnError: boolean（默认 false，用于 debug）
- target: 选择器上下文（详见第六节）
  - frame?: { name?: string; urlIncludes?: string; index?: number }
  - within?: string（容器选择器，后续 selector 在容器内查找）
  - nth?: number（匹配第 n 个）
  - visible?: boolean（默认 true）
  - strict?: boolean（默认 true，要求唯一匹配）

二、动作分类与定义（v1.0）
导航类

- goto: { url, waitUntil?: 'domcontentloaded'|'networkidle', timeoutMs? }
- reload: { waitUntil?, timeoutMs? }
- back / forward: { waitUntil?, timeoutMs? }

等待类

- waitForNavigation: { state?: 'load'|'domcontentloaded'|'networkidle', timeoutMs? }
- waitForSelector: { selector, state?: 'attached'|'visible'|'hidden'|'detached', timeoutMs? }
- waitForLoadState: { state?: 'domcontentloaded'|'networkidle', timeoutMs? }
- waitForFunction: { script: string, pollingMs?: number, timeoutMs? }
- sleep: { ms }

输入/交互类

- click: { selector, button?: 'left'|'middle'|'right', clickCount?: 1|2, delayMs?: number }
- dblclick: { selector, delayMs?: number }（同 click，clickCount=2）
- hover: { selector }
- fill: { selector, value }
- type: { selector, text, delayMs?: number }（模拟人打字）
- press: { selector?, key: 'Control+S'|'Enter'|'ArrowDown'... }
- selectOption: { selector, values: string|string[] }（value/label/index 自动判断）
- check / uncheck: { selector }
- uploadFiles: { selector, files: string[] }

滚动/视窗类

- scrollTo: { x?: number, y?: number, selector?: string, behavior?: 'auto'|'smooth' }
- scrollToBottom: { times?: number, delayMs?: number }
- scrollIntoView: { selector, block?: 'start'|'center'|'end' }
- setViewport: { width, height, deviceScaleFactor?: number, isMobile?: boolean }

资源/网络类

- blockResources: { types?: ('image'|'media'|'font'|'stylesheet')[], urls?: string[] }（route 拦截）
- setExtraHTTPHeaders: { headers: Record<string,string> }（仅对后续导航有效）
- setOffline: { offline: boolean }
- throttleNetwork: { downloadKbps?: number, uploadKbps?: number, latencyMs?: number }
- intercept: { pattern: string, action: { abort?: boolean, respond?: { status, body, headers }, continue?: { headers?, url?, method?, postData? } } }

存储/权限/上下文

- cookies: { cookies: [{ name, value, domain?, path?, expires? }] }
  * 没有参数，则返回 cookies 内容
- localStorage: { items: Record<string,string> }
  * 没有参数，则返回 loccalStorage 内容
- sessionStorage: { items: Record<string,string> }
  * 没有参数，则返回 sessionStorage 内容
- permissions: { permissions: ('geolocation'|'notifications'|'clipboard-read'...)[], origin?: string }
  * 没有参数，则返回权限内容
- geolocation: { latitude, longitude, accuracy?: number }
  * 没有参数，则返回当前 geolocation 内容
- timezone: { timezoneId }
  * 没有参数，则返回当前 timezone 内容
- locale: { locale: 'zh-CN' }
  * 没有参数，则返回当前 locale 内容

对话框/下载/调试

- handleDialog: { action: 'accept'|'dismiss', promptText?: string }
- onDownload: { saveAs?: string }（在本动作之后到下一个导航/超时窗口内捕获一次下载）
- screenshot: { path?: string, fullPage?: boolean, selector?: string, type?: 'png'|'jpeg', quality?: 80 }
- snapshotHtml: { path?: string }（保存当前 HTML）
- evaluate: { script: string, args?: any[] }（在页面上下文执行）

三、Playwright vs Puppeteer 差异消除

- waitUntil/networkidle
  - PW: 'networkidle' 等待网络空闲（0）
  - Pptr: 对应 'networkidle2' 更接近
- selectOption
  - PW 内置；Pptr 需根据 value/label 执行 DOM 操作；统一封装
- setExtraHTTPHeaders
  - PW 在 context/page 层；Pptr 在 page.setExtraHTTPHeaders；统一延后到下一次导航才生效
- blockResources/intercept
  - PW: page.route；Pptr: page.setRequestInterception + request.respond/continue/abort；提供统一 action
- 下载
  - PW: page.on('download') 提供保存；Pptr: page._client 或 browser API；统一封装 onDownload 窗口
- 权限/地理/时区/UA
  - 强烈建议放在“fetch 请求级 options.context”配置中，而不是动作（上下文级别创建时才能生效）

四、选择器与目标定位（target）
为稳定与可读，建议：

- 默认 CSS 选择器；需要文本匹配时支持 text: '...'（内部转为对应引擎表达式）
- target 作为通用字段，使所有动作都能“限定范围”
  - frame: 支持按 name/url/index 定位 frame（在对应 frame 中执行）
  - within: 容器选择器（动作的 selector 相对容器查找）
  - nth: 第 n 个匹配元素
  - visible/strict: 默认 visible=true、strict=true（保证唯一且可见）
- 影子 DOM：默认支持穿透（PW 的 :light 选择器；Pptr 使用 querySelectorAll + shadowRoot 遍历），遇到复杂影子树可增加 pierce: true 开关

示例

```yaml
- browser.click:
    selector: "button.buy"
    target:
      within: "#product-detail"
      frame: { urlIncludes: "/checkout" }
      visible: true
      strict: true
```

五、常见高阶场景的动作组合

- 稳定登录
  - goto + waitForSelector(#user) + fill + fill + click + waitForNavigation(networkidle)
- 无限滚动
  - scrollToBottom: { times: N, delayMs: 800 }
  - 或 scrollUntil: { maxPasses: 20, stopWhen: { selectorVisible: ".list-end" | noHeightChangeAfterMs: 1500 } }（可做一个复合动作）
- 懒加载图片修复
  - evaluate: 替换 data-src -> src 并触发加载
- A/B/弹窗处理
  - handleDialog + click(".close") + waitForSelectorHidden
- 降本加速
  - blockResources: { types: ['image','font','media'] } + throttleNetwork（谨慎使用）












六、建议的 BrowserAction 类型定义（TS）
你可以在 web-fetcher 里定义如下类型，确保 Playwright/Puppeteer 一套通吃。

```ts
type Target = {
  frame?: { name?: string; urlIncludes?: string; index?: number };
  within?: string;
  nth?: number;
  visible?: boolean;
  strict?: boolean;
};

type Common = {
  timeoutMs?: number;
  retry?: number;
  retryDelayMs?: number;
  if?: string;
  unless?: string;
  desc?: string;
  screenshotOnError?: boolean;
  target?: Target;
};

export type BrowserAction =
  | ({ goto: { url: string; waitUntil?: 'domcontentloaded'|'networkidle' } } & Common)
  | ({ reload: { waitUntil?: 'domcontentloaded'|'networkidle' } } & Common)
  | ({ back: { waitUntil?: 'domcontentloaded'|'networkidle' } } & Common)
  | ({ forward: { waitUntil?: 'domcontentloaded'|'networkidle' } } & Common)
  | ({ waitForNavigation: { state?: 'load'|'domcontentloaded'|'networkidle' } } & Common)
  | ({ waitForSelector: { selector: string; state?: 'attached'|'visible'|'hidden'|'detached' } } & Common)
  | ({ waitForLoadState: { state?: 'domcontentloaded'|'networkidle' } } & Common)
  | ({ waitForFunction: { script: string; pollingMs?: number } } & Common)
  | ({ sleep: { ms: number } } & Common)
  | ({ click: { selector: string; button?: 'left'|'middle'|'right'; clickCount?: 1|2; delayMs?: number } } & Common)
  | ({ dblclick: { selector: string; delayMs?: number } } & Common)
  | ({ hover: { selector: string } } & Common)
  | ({ fill: { selector: string; value: string } } & Common)
  | ({ type: { selector: string; text: string; delayMs?: number } } & Common)
  | ({ press: { selector?: string; key: string } } & Common)
  | ({ selectOption: { selector: string; values: string|string[] } } & Common)
  | ({ check: { selector: string } } & Common)
  | ({ uncheck: { selector: string } } & Common)
  | ({ uploadFiles: { selector: string; files: string[] } } & Common)
  | ({ scrollTo: { x?: number; y?: number; selector?: string; behavior?: 'auto'|'smooth' } } & Common)
  | ({ scrollToBottom: { times?: number; delayMs?: number } } & Common)
  | ({ scrollIntoView: { selector: string; block?: 'start'|'center'|'end' } } & Common)
  | ({ setViewport: { width: number; height: number; deviceScaleFactor?: number; isMobile?: boolean } } & Common)
  | ({ blockResources: { types?: Array<'image'|'media'|'font'|'stylesheet'>; urls?: string[] } } & Common)
  | ({ setExtraHTTPHeaders: { headers: Record<string,string> } } & Common)
  | ({ setOffline: { offline: boolean } } & Common)
  | ({ throttleNetwork: { downloadKbps?: number; uploadKbps?: number; latencyMs?: number } } & Common)
  | ({ intercept: { pattern: string; action: { abort?: boolean; respond?: { status: number; body?: string; headers?: Record<string,string> }; continue?: { headers?: Record<string,string>; url?: string; method?: string; postData?: string } } } } & Common)
  | ({ addCookies: { cookies: Array<{ name: string; value: string; domain?: string; path?: string; expires?: number }> } } & Common)
  | ({ clearCookies: {} } & Common)
  | ({ localStorageSet: { items: Record<string,string> } } & Common)
  | ({ sessionStorageSet: { items: Record<string,string> } } & Common)
  | ({ grantPermissions: { permissions: string[]; origin?: string } } & Common)
  | ({ setGeolocation: { latitude: number; longitude: number; accuracy?: number } } & Common)
  | ({ setTimezone: { timezoneId: string } } & Common)
  | ({ setLocale: { locale: string } } & Common)
  | ({ handleDialog: { action: 'accept'|'dismiss'; promptText?: string } } & Common)
  | ({ onDownload: { saveAs?: string } } & Common)
  | ({ screenshot: { path?: string; fullPage?: boolean; selector?: string; type?: 'png'|'jpeg'; quality?: number } } & Common)
  | ({ snapshotHtml: { path?: string } } & Common)
  | ({ evaluate: { script: string; args?: any[] } } & Common);
```

七、CrawFlow（Crawlfile）中的示例
登录 + 无限滚动 + 提取

```yaml
- browser.goto: { url: "https://example.com/login" }
- browser.fill: { selector: "#username", value: "{{inputs.username}}" }
- browser.fill: { selector: "#password", value: "{{inputs.password}}" }
- browser.click: { selector: "button[type=submit]" }
- browser.waitForNavigation: { state: "networkidle" }
- browser.blockResources: { types: ["image","font","media"] }   # 降本
- browser.goto: { url: "https://example.com/search?q={{inputs.query}}", waitUntil: "domcontentloaded" }
- browser.scrollToBottom: { times: 6, delayMs: 800 }
- extract: { rulesRef: "example.list" }                         # 交给 extractor
```

处理弹窗 + 文件上传

```yaml
- browser.handleDialog: { action: "dismiss" }
- browser.uploadFiles: { selector: "input[type=file]", files: ["./assets/photo.jpg"] }
- browser.click: { selector: "button.save" }
```

网络拦截（注入鉴权头）

```yaml
- browser.intercept:
    pattern: "https://api.example.com/*"
    action:
      continue:
        headers:
          Authorization: "Bearer {{ctx.vars.token}}"
```

八、与站点清单字段的对接要点

- ignoreSslErrors
  - 映射到 Playwright/Puppeteer 的 ignoreHTTPSErrors（launch/context 级）与 HTTP 客户端的 rejectUnauthorized=false
- timeoutMs
  - 映射到 requestHandlerTimeoutSecs / 每个动作的默认 timeoutMs
- maxConcurrency / maxRequestsPerMinute / delayBetweenRequestsMs
- antibot
  - engine=playwright 时可启 camoufox；puppeteer 由调用方接入 stealth 插件（不在动作里做）
- auth.reuseCookies/preloadCookies
  - 放在 fetch/request 级别的 cookieStore 与 preNavigationHooks 处理，不作为动作

九、稳定性与反爬建议

- 等待策略：交互后尽量 waitForNavigation('networkidle') 或 waitForSelector(成功标志)
- 选择器稳健：优先 data-testid / data-qa；减少纯文本定位
- 节流与并发：WebFetcher 配置 rpm/concurrency，避免失控
- 资源拦截：在非必要页面关闭图片/视频加载
- Cookie/UA/Locale 一致性：与登录阶段保持一致，减少指纹漂移
