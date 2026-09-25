[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetcherOptions

# Interface: FetcherOptions

Defined in: [packages/web-fetcher/src/core/types.ts:314](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L314)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Properties

### actions?

> `optional` **actions?**: `_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"id"` \| `"name"` \| `"action"`\>[]

Defined in: [packages/web-fetcher/src/core/types.ts:315](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L315)

***

### additionalMimeTypes?

> `optional` **additionalMimeTypes?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:286](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L286)

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

Defined in: [packages/web-fetcher/src/core/types.ts:223](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L223)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:240](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L240)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:255](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L255)

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

Defined in: [packages/web-fetcher/src/core/types.ts:250](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L250)

Cache configuration for persistent HTTP caching.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cache`](BaseFetcherProperties.md#cache)

***

### cookies?

> `optional` **cookies?**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:227](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L227)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### debug?

> `optional` **debug?**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:224](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L224)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`debug`](BaseFetcherProperties.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:292](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L292)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:218](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L218)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:217](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L217)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:226](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L226)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:268](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L268)

#### body?

> `optional` **body?**: `any`

#### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:253](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L253)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:290](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L290)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:291](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L291)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### onPause?

> `optional` **onPause?**: [`OnFetchPauseCallback`](../type-aliases/OnFetchPauseCallback.md)

Defined in: [packages/web-fetcher/src/core/types.ts:316](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L316)

***

### output?

> `optional` **output?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:233](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L233)

#### cookies?

> `optional` **cookies?**: `boolean`

#### sessionState?

> `optional` **sessionState?**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:230](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L230)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### proxy?

> `optional` **proxy?**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:238](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L238)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:289](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L289)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:293](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L293)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions?**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:229](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L229)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState?**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:228](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L228)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites?**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:295](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L295)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage?**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:245](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L245)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:219](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L219)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`syncStateOnUpgrade`](BaseFetcherProperties.md#syncstateonupgrade)

***

### throwHttpErrors?

> `optional` **throwHttpErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:231](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L231)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:288](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L288)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### upgradeOnJsContent?

> `optional` **upgradeOnJsContent?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:220](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L220)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`upgradeOnJsContent`](BaseFetcherProperties.md#upgradeonjscontent)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:221](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L221)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`upgradeThresholdMs`](BaseFetcherProperties.md#upgradethresholdms)

***

### url?

> `optional` **url?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:296](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L296)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:222](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/types.ts#L222)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
