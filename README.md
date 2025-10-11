# @isdk/web-fetcher

一个智能化的、自适应的 标准化 Web 抓取客户端库

它的核心使命是封装底层抓取技术的复杂性，提供一个极其简洁、统一且强大的API，为每一次抓取任务自动选择并应用最佳的抓取策略。让开发者能专注于数据提取的业务逻辑，而非抓取过程中的繁琐细节。

技术栈: Node/Typescript/tsup/vitest, crawlee

功能特性:

* 职责单一 (Single Responsibility): web-fetcher 只做一件事并把它做到极致：获取 Web 内容。它不关心如何解析内容，也不关心抓取流程的编排。
* 统一的API (Unified API): 无论底层是使用基于请求的 Cheerio 还是基于浏览器的 Playwright，web-fetcher 都力求提供一致的函数签名和返回结果。这使得上层应用可以无缝切换抓取引擎以应对不同类型的网站，而无需修改业务代码。
* 抽象而非泄露 (Abstraction, not Leaking): 库将常见的浏览器交互（如点击、填充、滚动）抽象为标准的浏览器动作 (Browser Actions)，而不是将 Playwright 的 page 对象等底层细节泄露给调用者。
* 事件驱动 (Event-Driven): 抓取过程中的关键节点（如请求开始/结束、内容获取、error等）都会以事件的形式通知出去。
* 智能化站点类型探测: 对于站点清单之外的未知站点，web-fetcher 可以触发一个自动探测流程
* 管理网络层面的所有复杂性（代理、Cookie、反爬）
* 充分利用 Crawlee 的并发、限速、重试、Session/Proxy 等能力，支持事件通知与可取消的后台抓取。
* 把 sites 与“智能探测站点类型”下沉到 web-fetcher 可以让 fetch 更“聪明”
  * 把“智能”做成可选、可插拔的 SmartSites 层：默认不开启；开启后 fetch 会自动选择 http 或 browser 引擎，并在需要时升级为浏览器获取，同时将探测结果写回 sites 注册表。

主要API如下:

* WebFetcher 类: 管理上下文，执行浏览器行为
  * fetch 方法: 内部是通过执行浏览器行为`goto`然后得到页面内容。
* 智能探测: 策略如下
  * 初始尝试: 总是先用最快、最轻量的 http(cheerio) 引擎进行一次试探性抓取
  * 内容分析:
    * 检查返回的HTML内容。如果`<body>`标签为空，或者包含明显的“请启用JavaScript”提示，或者只有一个`<div id="app"></div>`这样的挂载点，那么可以初步判断为`browser`类型
    * 对比直接请求的HTML和经过 `browser` 简单渲染后的HTML的DOM结构差异度。如果差异巨大，说明网站严重依赖JS渲染
  * 反爬检测:
    * 检查响应头和内容是否包含 Cloudflare、Akamai 等知名CDN的机器人质询页面特征
    * 如果 http 请求失败或超时，而 browser (尤其是在开启 antibot 后) 请求成功，则可以判定为有反爬措施
  * 生成探测结果作为 site 注册表项

抓取配置项:

* sites?: 可选的站点注册表，包含站点的 domain、抓取模式等，详见后述站点注册表配置项
* mode?: 抓取模式，可选值有 http、browser、auto、smart, 默认为 auto
  * auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smartSites，则等价为 http.
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
* captureNetworkJson?: bool
  * 在执行一系列浏览器动作后，发现响应内容是 json，则将内容转为json对象立即返回该对象作为结果。
* proxy?: string|string[],, 代理地址
* ignoreSslErrors?: bool, 忽略 SSL 错误
* antibot?: bool, 仅 browser
  * ~~camoufox?: bool~~
  * ~~stealth?: 'rebrowser' or 'patchright'~~ // 用了 camoufox 似乎没有必要再用这些！
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

浏览器动作:

很棒，站点清单这版配置已经很清晰了。下面把“浏览器行为”系统化梳理，给出一套统一的 BrowserAction 规范（对 Playwright/Puppeteer 等价），涵盖常用到进阶能力，以及差异消除策略与最佳实践。你可以直接把这些放进 CrawFlow 的 DSL 或 web-fetcher 的类型中。

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
