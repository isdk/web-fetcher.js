[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchContext

# Interface: FetchContext

Defined in: [packages/web-fetcher/src/core/context.ts:35](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L35)

## Extends

- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:68](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L68)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`antibot`](FetchEngineContext.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:85](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L85)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`blockResources`](FetchEngineContext.md#blockresources)

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

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`browser`](FetchEngineContext.md#browser)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L72)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cookies`](FetchEngineContext.md#cookies)

***

### currentAction?

> `optional` **currentAction**: [`FetchActionInContext`](FetchActionInContext.md)

Defined in: [packages/web-fetcher/src/core/context.ts:36](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L36)

***

### debug?

> `optional` **debug**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:69](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L69)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`debug`](FetchEngineContext.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:116](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L116)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`delayBetweenRequestsMs`](FetchEngineContext.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:66](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L66)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`enableSmart`](FetchEngineContext.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:65](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L65)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`engine`](FetchEngineContext.md#engine)

***

### eventBus

> **eventBus**: `EventEmitter`

Defined in: [packages/web-fetcher/src/core/context.ts:48](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L48)

***

### finalUrl?

> `optional` **finalUrl**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:27](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L27)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`finalUrl`](FetchEngineContext.md#finalurl)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L71)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`headers`](FetchEngineContext.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:107](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L107)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`http`](FetchEngineContext.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:25](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L25)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`id`](FetchEngineContext.md#id)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:93](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L93)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`ignoreSslErrors`](FetchEngineContext.md#ignoresslerrors)

***

### internal

> **internal**: `FetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:46](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L46)

#### Overrides

[`FetchEngineContext`](FetchEngineContext.md).[`internal`](FetchEngineContext.md#internal)

***

### lastResponse?

> `optional` **lastResponse**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:29](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L29)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResponse`](FetchEngineContext.md#lastresponse)

***

### lastResult?

> `optional` **lastResult**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:30](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L30)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResult`](FetchEngineContext.md#lastresult)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:114](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L114)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxConcurrency`](FetchEngineContext.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:115](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L115)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxRequestsPerMinute`](FetchEngineContext.md#maxrequestsperminute)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L78)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`output`](FetchEngineContext.md#output)

***

### outputs

> **outputs**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/context.ts:38](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L38)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L75)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`overrideSessionState`](FetchEngineContext.md#overridesessionstate)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:83](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L83)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`proxy`](FetchEngineContext.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L113)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`requestHandlerTimeoutSecs`](FetchEngineContext.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:117](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L117)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`retries`](FetchEngineContext.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L74)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionPoolOptions`](FetchEngineContext.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L73)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionState`](FetchEngineContext.md#sessionstate)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L119)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sites`](FetchEngineContext.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:90](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L90)

Storage configuration for session isolation and persistence.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`storage`](FetchEngineContext.md#storage)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:76](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L76)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`throwHttpErrors`](FetchEngineContext.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:112](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L112)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`timeoutMs`](FetchEngineContext.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:26](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L26)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`url`](FetchEngineContext.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:67](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L67)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useSiteRegistry`](FetchEngineContext.md#usesiteregistry)

## Methods

### action()

> **action**\<`R`\>(`name`, `params?`, `options?`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:43](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L43)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### name

`string`

##### params?

`any`

##### options?

`Partial`\<`_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"name"` \| `"id"` \| `"action"`\>\>

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

***

### execute()

> **execute**\<`R`\>(`actionOptions`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:41](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/context.ts#L41)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>
