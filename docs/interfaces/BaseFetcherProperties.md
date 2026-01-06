[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / BaseFetcherProperties

# Interface: BaseFetcherProperties

Defined in: [packages/web-fetcher/src/core/types.ts:57](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L57)

## Extended by

- [`FetchSite`](FetchSite.md)
- [`FetcherOptions`](FetcherOptions.md)
- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:68](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L68)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:85](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L85)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:95](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L95)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L72)

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:69](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L69)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:116](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L116)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:66](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L66)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:65](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L65)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L71)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:107](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L107)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:93](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L93)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:114](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L114)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:115](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L115)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L78)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L75)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:83](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L83)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L113)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:117](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L117)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L74)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L73)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L119)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:90](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L90)

Storage configuration for session isolation and persistence.

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:76](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L76)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:112](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L112)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:120](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L120)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:67](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L67)
