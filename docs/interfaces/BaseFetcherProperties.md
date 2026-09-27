[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / BaseFetcherProperties

# Interface: BaseFetcherProperties

Defined in: [packages/web-fetcher/src/core/types.ts:229](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L229)

## Extended by

- [`FetchSite`](FetchSite.md)
- [`FetcherOptions`](FetcherOptions.md)
- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### additionalMimeTypes?

> `optional` **additionalMimeTypes?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:358](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L358)

额外的 MIME 类型，允许引擎下载并返回非 HTML 响应体，例如 `['application/pdf', 'text/csv']`。

#### Remarks

- `http`（cheerio）引擎：透传给 Crawlee 的 `CheerioCrawler.additionalMimeTypes`。Crawlee 默认只允许
  HTML/XML/JSON 类型的响应体，白名单之外的类型会被直接跳过（请求报错）；配置后对应的响应体会
  以原始 Buffer 保存在 `FetchResponse.body` 中。
- `browser`（playwright）引擎：通过 Playwright 的 `download` 事件捕获触发下载的响应（如 `Content-Disposition: attachment`），
  读取原始二进制内容返回 `FetchResponse.body`；同样受该白名单约束（文本类 MIME 始终允许）。
- 值会统一规范化为小写并去重，且始终与引擎自身允许的类型（如 `text/plain`）合并。
- 支持通配符（`*` 斜杠 `*` 表示允许所有类型）。
- 默认不启用任何额外类型；需要下载非 HTML 内容时请显式配置。

***

### antibot?

> `optional` **antibot?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:243](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L243)

***

### blockResources?

> `optional` **blockResources?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L274)

***

### browser?

> `optional` **browser?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:299](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L299)

#### engine?

> `optional` **engine?**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless?**: `boolean`

#### launchOptions?

> `optional` **launchOptions?**: `Record`\<`string`, `any`\>

#### waitUntil?

> `optional` **waitUntil?**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

***

### cache?

> `optional` **cache?**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:284](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L284)

Cache configuration for persistent HTTP caching.

***

### cookies?

> `optional` **cookies?**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:261](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L261)

***

### debug?

> `optional` **debug?**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:258](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L258)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:363](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L363)

***

### enableSmart?

> `optional` **enableSmart?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:238](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L238)

***

### engine?

> `optional` **engine?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:237](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L237)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

***

### headerGeneratorOptions?

> `optional` **headerGeneratorOptions?**: `false` \| \{ `browsers?`: `object`[]; `devices?`: (`"desktop"` \| `"mobile"`)[]; `http1Headers?`: `Record`\<`string`, `string`\>; `http2Headers?`: `Record`\<`string`, `string`\>; `httpVersion?`: `1` \| `2`; `locales?`: `string`[]; `operatingSystems?`: (`"windows"` \| `"macos"` \| `"android"` \| `"ios"` \| `"linux"`)[]; \}

Defined in: [packages/web-fetcher/src/core/types.ts:330](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L330)

`got-scraping`（http 引擎）的浏览器头生成器配置。

#### Remarks

got-scraping 默认会随机生成一整套浏览器指纹头（含 `sec-ch-ua` client hints、
`sec-fetch-*` 等）注入请求。当调用方显式指定 `User-Agent` 时，生成的头可能与
自定义 UA 不匹配（如生成 Chromium 的 client hints 但 UA 是 Firefox），这种
自相矛盾的指纹会被部分 WAF/反bot（如 4get.nadeko.net）直接拒绝（401）。
通过 `headerGeneratorOptions` 把生成器固定为与 UA 一致的浏览器即可避免。

- 设为 `false`（`useHeaderGenerator`）可完全禁用自动头生成，只用 `headers`。
- 设为 `{ browsers: [{ name: 'firefox' }] }` 可强制生成 Firefox 一致的头。

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:260](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L260)

***

### http?

> `optional` **http?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:312](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L312)

#### body?

> `optional` **body?**: `any`

#### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:287](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L287)

***

### maxConcurrency?

> `optional` **maxConcurrency?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:361](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L361)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:362](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L362)

***

### output?

> `optional` **output?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:267](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L267)

#### cookies?

> `optional` **cookies?**: `boolean`

#### sessionState?

> `optional` **sessionState?**: `boolean`

***

### overrideSessionState?

> `optional` **overrideSessionState?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:264](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L264)

***

### proxy?

> `optional` **proxy?**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:272](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L272)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:360](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L360)

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:364](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L364)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions?**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:263](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L263)

***

### sessionState?

> `optional` **sessionState?**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:262](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L262)

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/web-fetcher/src/core/types.ts:256](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L256)

外部中断信号（AbortSignal）。

#### Remarks

传入后可通过 `signal.abort(reason)` 中断当前会话：
- 尚未开始的动作会立即以 `AbortError` 失败；
- 进行中的导航/请求会被取消（`dispose()` 内部会先中止会话再清理资源）；
- 会话中止后不可恢复，再次使用会抛 `AbortError`。

也可不传 signal，直接调用 `session.abort(reason)` 手动中止。

***

### sites?

> `optional` **sites?**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:366](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L366)

***

### storage?

> `optional` **storage?**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:279](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L279)

Storage configuration for session isolation and persistence.

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:239](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L239)

***

### throwHttpErrors?

> `optional` **throwHttpErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:265](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L265)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:297](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L297)

请求超时（毫秒）。默认 30000（30 秒）。

#### Remarks

- `http`（cheerio）引擎：作为 got 的 `timeout.request` 与 goto 导航超时。
- `browser`（playwright）引擎：作为导航与页面默认超时。
- 公共 API / 搜索引擎类站点的响应通常在数秒内返回；慢站点可按需调大。

***

### upgradeOnJsContent?

> `optional` **upgradeOnJsContent?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:240](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L240)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:241](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L241)

***

### url?

> `optional` **url?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:367](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L367)

***

### useHeaderGenerator?

> `optional` **useHeaderGenerator?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:343](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L343)

完全禁用 got-scraping 的自动浏览器头生成（仅发送 `headers` 中显式声明的头）。

***

### useSiteRegistry?

> `optional` **useSiteRegistry?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:242](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L242)
