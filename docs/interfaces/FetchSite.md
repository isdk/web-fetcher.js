[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSite

# Interface: FetchSite

Defined in: [packages/web-fetcher/src/core/types.ts:82](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L82)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:37](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L37)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:48](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L48)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:54](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L54)

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

Defined in: [packages/web-fetcher/src/core/types.ts:40](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L40)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L75)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### domain

> **domain**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:83](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L83)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:35](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L35)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:34](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L34)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:39](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L39)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:66](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L66)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:52](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L52)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L73)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L74)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:86](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L86)

#### source?

> `optional` **source**: `"manual"` \| `"smart"`

#### ttlMs?

> `optional` **ttlMs**: `number`

#### updatedAt?

> `optional` **updatedAt**: `number`

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:42](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L42)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### pathScope?

> `optional` **pathScope**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:84](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L84)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:46](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L46)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L72)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:76](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L76)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### reuseCookies?

> `optional` **reuseCookies**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:43](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L43)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`reuseCookies`](BaseFetcherProperties.md#reusecookies)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:41](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L41)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites**: `FetchSite`[]

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L78)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:44](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L44)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L71)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:79](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L79)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:36](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/types.ts#L36)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
