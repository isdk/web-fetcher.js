[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSite

# Interface: FetchSite

Defined in: [packages/web-fetcher/src/core/types.ts:129](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L129)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L74)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:91](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L91)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:101](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L101)

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

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L78)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L75)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`debug`](BaseFetcherProperties.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:122](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L122)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### domain

> **domain**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:130](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L130)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L72)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L71)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:77](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L77)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L113)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:99](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L99)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:120](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L120)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:121](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L121)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:133](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L133)

#### source?

> `optional` **source**: `"manual"` \| `"smart"`

#### ttlMs?

> `optional` **ttlMs**: `number`

#### updatedAt?

> `optional` **updatedAt**: `number`

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:84](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L84)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:81](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L81)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### pathScope?

> `optional` **pathScope**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:131](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L131)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:89](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L89)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L119)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:123](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L123)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:80](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L80)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:79](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L79)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites**: `FetchSite`[]

Defined in: [packages/web-fetcher/src/core/types.ts:125](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L125)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:96](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L96)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:82](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L82)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:118](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L118)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:126](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L126)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/types.ts#L73)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
