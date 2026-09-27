[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSite

# Interface: FetchSite

Defined in: [packages/web-fetcher/src/core/types.ts:370](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L370)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

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

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`additionalMimeTypes`](BaseFetcherProperties.md#additionalmimetypes)

***

### antibot?

> `optional` **antibot?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:243](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L243)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L274)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

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

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`browser`](BaseFetcherProperties.md#browser)

***

### cache?

> `optional` **cache?**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:284](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L284)

Cache configuration for persistent HTTP caching.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cache`](BaseFetcherProperties.md#cache)

***

### cookies?

> `optional` **cookies?**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:261](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L261)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### debug?

> `optional` **debug?**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:258](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L258)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`debug`](BaseFetcherProperties.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:363](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L363)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### domain

> **domain**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:371](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L371)

***

### enableSmart?

> `optional` **enableSmart?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:238](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L238)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:237](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L237)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

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

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headerGeneratorOptions`](BaseFetcherProperties.md#headergeneratoroptions)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:260](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L260)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:312](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L312)

#### body?

> `optional` **body?**: `any`

#### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:287](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L287)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:361](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L361)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:362](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L362)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### meta?

> `optional` **meta?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:374](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L374)

#### source?

> `optional` **source?**: `"manual"` \| `"smart"`

#### ttlMs?

> `optional` **ttlMs?**: `number`

#### updatedAt?

> `optional` **updatedAt?**: `number`

***

### output?

> `optional` **output?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:267](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L267)

#### cookies?

> `optional` **cookies?**: `boolean`

#### sessionState?

> `optional` **sessionState?**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:264](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L264)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### pathScope?

> `optional` **pathScope?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:372](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L372)

***

### proxy?

> `optional` **proxy?**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:272](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L272)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:360](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L360)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:364](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L364)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions?**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:263](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L263)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState?**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:262](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L262)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

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

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`signal`](BaseFetcherProperties.md#signal)

***

### sites?

> `optional` **sites?**: `FetchSite`[]

Defined in: [packages/web-fetcher/src/core/types.ts:366](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L366)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage?**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:279](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L279)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:239](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L239)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`syncStateOnUpgrade`](BaseFetcherProperties.md#syncstateonupgrade)

***

### throwHttpErrors?

> `optional` **throwHttpErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:265](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L265)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:297](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L297)

请求超时（毫秒）。默认 30000（30 秒）。

#### Remarks

- `http`（cheerio）引擎：作为 got 的 `timeout.request` 与 goto 导航超时。
- `browser`（playwright）引擎：作为导航与页面默认超时。
- 公共 API / 搜索引擎类站点的响应通常在数秒内返回；慢站点可按需调大。

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### upgradeOnJsContent?

> `optional` **upgradeOnJsContent?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:240](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L240)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`upgradeOnJsContent`](BaseFetcherProperties.md#upgradeonjscontent)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:241](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L241)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`upgradeThresholdMs`](BaseFetcherProperties.md#upgradethresholdms)

***

### url?

> `optional` **url?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:367](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L367)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useHeaderGenerator?

> `optional` **useHeaderGenerator?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:343](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L343)

完全禁用 got-scraping 的自动浏览器头生成（仅发送 `headers` 中显式声明的头）。

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useHeaderGenerator`](BaseFetcherProperties.md#useheadergenerator)

***

### useSiteRegistry?

> `optional` **useSiteRegistry?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:242](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L242)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
