[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSite

# Interface: FetchSite

Defined in: [packages/web-fetcher/src/core/types.ts:122](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L122)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:68](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L68)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:84](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L84)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:94](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L94)

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

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L71)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:115](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L115)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### domain

> **domain**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:123](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L123)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:66](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L66)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:65](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L65)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:70](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L70)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:106](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L106)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:92](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L92)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L113)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:114](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L114)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### meta?

> `optional` **meta**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:126](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L126)

#### source?

> `optional` **source**: `"manual"` \| `"smart"`

#### ttlMs?

> `optional` **ttlMs**: `number`

#### updatedAt?

> `optional` **updatedAt**: `number`

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:77](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L77)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L74)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### pathScope?

> `optional` **pathScope**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:124](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L124)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:82](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L82)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:112](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L112)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:116](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L116)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L73)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L72)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites**: `FetchSite`[]

Defined in: [packages/web-fetcher/src/core/types.ts:118](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L118)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:89](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L89)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L75)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:111](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L111)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L119)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:67](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/types.ts#L67)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
