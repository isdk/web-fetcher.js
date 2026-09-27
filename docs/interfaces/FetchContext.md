[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchContext

# Interface: FetchContext

Defined in: [packages/web-fetcher/src/core/context.ts:109](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L109)

The full execution context for a Web Fetcher session or action batch.

## Remarks

This object is the central state container for the fetch operation. It provides
access to configuration, the event bus, shared outputs, and the execution engine.
It is passed to every action during execution.

## Extends

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

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`additionalMimeTypes`](FetchEngineContext.md#additionalmimetypes)

***

### antibot?

> `optional` **antibot?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:243](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L243)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`antibot`](FetchEngineContext.md#antibot)

***

### blockResources?

> `optional` **blockResources?**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L274)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`blockResources`](FetchEngineContext.md#blockresources)

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

[`FetchEngineContext`](FetchEngineContext.md).[`browser`](FetchEngineContext.md#browser)

***

### cache?

> `optional` **cache?**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:284](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L284)

Cache configuration for persistent HTTP caching.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cache`](FetchEngineContext.md#cache)

***

### cookies?

> `optional` **cookies?**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:261](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L261)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cookies`](FetchEngineContext.md#cookies)

***

### currentAction?

> `optional` **currentAction?**: [`FetchActionInContext`](../type-aliases/FetchActionInContext.md)

Defined in: [packages/web-fetcher/src/core/context.ts:113](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L113)

Metadata about the action currently being executed.

***

### debug?

> `optional` **debug?**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:258](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L258)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`debug`](FetchEngineContext.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:363](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L363)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`delayBetweenRequestsMs`](FetchEngineContext.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:238](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L238)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`enableSmart`](FetchEngineContext.md#enablesmart)

***

### engine?

> `optional` **engine?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:237](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L237)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`engine`](FetchEngineContext.md#engine)

***

### eventBus

> **eventBus**: `EventEmitter`

Defined in: [packages/web-fetcher/src/core/context.ts:153](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L153)

The central event bus for publishing and subscribing to session and action events.

***

### finalUrl?

> `optional` **finalUrl?**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:84](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L84)

The final URL after all redirects have been followed.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`finalUrl`](FetchEngineContext.md#finalurl)

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

[`FetchEngineContext`](FetchEngineContext.md).[`headerGeneratorOptions`](FetchEngineContext.md#headergeneratoroptions)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:260](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L260)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`headers`](FetchEngineContext.md#headers)

***

### http?

> `optional` **http?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:312](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L312)

#### body?

> `optional` **body?**: `any`

#### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`http`](FetchEngineContext.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:76](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L76)

Unique identifier for the session or request batch.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`id`](FetchEngineContext.md#id)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:287](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L287)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`ignoreSslErrors`](FetchEngineContext.md#ignoresslerrors)

***

### internal

> **internal**: `FetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:148](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L148)

Internal state for engine and lifecycle management.

#### Overrides

[`FetchEngineContext`](FetchEngineContext.md).[`internal`](FetchEngineContext.md#internal)

***

### lastResponse?

> `optional` **lastResponse?**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:89](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L89)

The standardized response object from the most recent navigation.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResponse`](FetchEngineContext.md#lastresponse)

***

### lastResult?

> `optional` **lastResult?**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:93](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L93)

The result object from the most recent action execution.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResult`](FetchEngineContext.md#lastresult)

***

### maxConcurrency?

> `optional` **maxConcurrency?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:361](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L361)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxConcurrency`](FetchEngineContext.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:362](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L362)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxRequestsPerMinute`](FetchEngineContext.md#maxrequestsperminute)

***

### output?

> `optional` **output?**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:267](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L267)

#### cookies?

> `optional` **cookies?**: `boolean`

#### sessionState?

> `optional` **sessionState?**: `boolean`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`output`](FetchEngineContext.md#output)

***

### outputs

> **outputs**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/context.ts:119](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L119)

A shared key-value store for storing data extracted from pages or
metadata generated during action execution.

***

### overrideSessionState?

> `optional` **overrideSessionState?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:264](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L264)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`overrideSessionState`](FetchEngineContext.md#overridesessionstate)

***

### proxy?

> `optional` **proxy?**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:272](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L272)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`proxy`](FetchEngineContext.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:360](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L360)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`requestHandlerTimeoutSecs`](FetchEngineContext.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:364](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L364)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`retries`](FetchEngineContext.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions?**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:263](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L263)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionPoolOptions`](FetchEngineContext.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState?**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:262](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L262)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionState`](FetchEngineContext.md#sessionstate)

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

[`FetchEngineContext`](FetchEngineContext.md).[`signal`](FetchEngineContext.md#signal)

***

### sites?

> `optional` **sites?**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:366](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L366)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sites`](FetchEngineContext.md#sites)

***

### storage?

> `optional` **storage?**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:279](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L279)

Storage configuration for session isolation and persistence.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`storage`](FetchEngineContext.md#storage)

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:239](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L239)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`syncStateOnUpgrade`](FetchEngineContext.md#syncstateonupgrade)

***

### throwHttpErrors?

> `optional` **throwHttpErrors?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:265](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L265)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`throwHttpErrors`](FetchEngineContext.md#throwhttperrors)

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

[`FetchEngineContext`](FetchEngineContext.md).[`timeoutMs`](FetchEngineContext.md#timeoutms)

***

### upgradeOnJsContent?

> `optional` **upgradeOnJsContent?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:240](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L240)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`upgradeOnJsContent`](FetchEngineContext.md#upgradeonjscontent)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:241](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L241)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`upgradeThresholdMs`](FetchEngineContext.md#upgradethresholdms)

***

### url?

> `optional` **url?**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:80](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L80)

The target URL for the next navigation, if specified.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`url`](FetchEngineContext.md#url)

***

### useHeaderGenerator?

> `optional` **useHeaderGenerator?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:343](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L343)

完全禁用 got-scraping 的自动浏览器头生成（仅发送 `headers` 中显式声明的头）。

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useHeaderGenerator`](FetchEngineContext.md#useheadergenerator)

***

### useSiteRegistry?

> `optional` **useSiteRegistry?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:242](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L242)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useSiteRegistry`](FetchEngineContext.md#usesiteregistry)

## Methods

### action()

> **action**\<`R`\>(`name`, `params?`, `options?`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:139](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L139)

Convenience method to execute an action by its registered name or ID.

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### name

`string`

The registered name or ID of the action.

##### params?

`any`

Parameters specific to the action type.

##### options?

`Partial`\<`_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"id"` \| `"name"` \| `"action"`\>\>

Additional execution options (e.g., storeAs, failOnError).

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

A promise that resolves to a result.

***

### execute()

> **execute**\<`R`\>(`actionOptions`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:127](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/context.ts#L127)

Executes a FetchAction within the current context.

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

Configuration for the action to be executed.

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

A promise that resolves to the action's result.
