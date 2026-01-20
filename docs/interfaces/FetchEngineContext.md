[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngineContext

# Interface: FetchEngineContext

Defined in: [packages/web-fetcher/src/core/context.ts:73](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L73)

Context provided to the Fetch Engine during navigation and request handling.

## Remarks

This interface contains the minimum set of properties required by an engine
to perform a fetch operation and build a response.

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Extended by

- [`FetchContext`](FetchContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L74)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:91](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L91)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:101](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L101)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`browser`](BaseFetcherProperties.md#browser)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L78)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L75)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`debug`](BaseFetcherProperties.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:122](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L122)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L72)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L71)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### finalUrl?

> `optional` **finalUrl**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:85](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L85)

The final URL after all redirects have been followed.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:77](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L77)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L113)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:77](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L77)

Unique identifier for the session or request batch.

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:99](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L99)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### internal

> **internal**: `BaseFetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:99](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L99)

Engine-specific internal state.

***

### lastResponse?

> `optional` **lastResponse**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:90](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L90)

The standardized response object from the most recent navigation.

***

### lastResult?

> `optional` **lastResult**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:94](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L94)

The result object from the most recent action execution.

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:120](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L120)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:121](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L121)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:84](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L84)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:81](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L81)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:89](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L89)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L119)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:123](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L123)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:80](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L80)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:79](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L79)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:125](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L125)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:96](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L96)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:82](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L82)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:118](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L118)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:81](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L81)

The target URL for the next navigation, if specified.

#### Overrides

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L73)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
