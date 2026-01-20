[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchContext

# Interface: FetchContext

Defined in: [packages/web-fetcher/src/core/context.ts:110](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L110)

The full execution context for a Web Fetcher session or action batch.

## Remarks

This object is the central state container for the fetch operation. It provides
access to configuration, the event bus, shared outputs, and the execution engine.
It is passed to every action during execution.

## Extends

- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L74)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`antibot`](FetchEngineContext.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:91](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L91)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`blockResources`](FetchEngineContext.md#blockresources)

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

[`FetchEngineContext`](FetchEngineContext.md).[`browser`](FetchEngineContext.md#browser)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:78](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L78)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cookies`](FetchEngineContext.md#cookies)

***

### currentAction?

> `optional` **currentAction**: [`FetchActionInContext`](FetchActionInContext.md)

Defined in: [packages/web-fetcher/src/core/context.ts:114](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L114)

Metadata about the action currently being executed.

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L75)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`debug`](FetchEngineContext.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:122](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L122)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`delayBetweenRequestsMs`](FetchEngineContext.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L72)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`enableSmart`](FetchEngineContext.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L71)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`engine`](FetchEngineContext.md#engine)

***

### eventBus

> **eventBus**: `EventEmitter`

Defined in: [packages/web-fetcher/src/core/context.ts:154](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L154)

The central event bus for publishing and subscribing to session and action events.

***

### finalUrl?

> `optional` **finalUrl**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:85](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L85)

The final URL after all redirects have been followed.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`finalUrl`](FetchEngineContext.md#finalurl)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:77](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L77)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`headers`](FetchEngineContext.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:113](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L113)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`http`](FetchEngineContext.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:77](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L77)

Unique identifier for the session or request batch.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`id`](FetchEngineContext.md#id)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:99](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L99)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`ignoreSslErrors`](FetchEngineContext.md#ignoresslerrors)

***

### internal

> **internal**: `FetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:149](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L149)

Internal state for engine and lifecycle management.

#### Overrides

[`FetchEngineContext`](FetchEngineContext.md).[`internal`](FetchEngineContext.md#internal)

***

### lastResponse?

> `optional` **lastResponse**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:90](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L90)

The standardized response object from the most recent navigation.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResponse`](FetchEngineContext.md#lastresponse)

***

### lastResult?

> `optional` **lastResult**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:94](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L94)

The result object from the most recent action execution.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResult`](FetchEngineContext.md#lastresult)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:120](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L120)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxConcurrency`](FetchEngineContext.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:121](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L121)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxRequestsPerMinute`](FetchEngineContext.md#maxrequestsperminute)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:84](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L84)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`output`](FetchEngineContext.md#output)

***

### outputs

> **outputs**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/context.ts:120](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L120)

A shared key-value store for storing data extracted from pages or
metadata generated during action execution.

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:81](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L81)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`overrideSessionState`](FetchEngineContext.md#overridesessionstate)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:89](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L89)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`proxy`](FetchEngineContext.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:119](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L119)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`requestHandlerTimeoutSecs`](FetchEngineContext.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:123](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L123)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`retries`](FetchEngineContext.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:80](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L80)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionPoolOptions`](FetchEngineContext.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:79](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L79)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionState`](FetchEngineContext.md#sessionstate)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:125](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L125)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sites`](FetchEngineContext.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:96](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L96)

Storage configuration for session isolation and persistence.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`storage`](FetchEngineContext.md#storage)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:82](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L82)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`throwHttpErrors`](FetchEngineContext.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:118](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L118)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`timeoutMs`](FetchEngineContext.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:81](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L81)

The target URL for the next navigation, if specified.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`url`](FetchEngineContext.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/types.ts#L73)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useSiteRegistry`](FetchEngineContext.md#usesiteregistry)

## Methods

### action()

> **action**\<`R`\>(`name`, `params?`, `options?`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:140](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L140)

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

`Partial`\<`_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"name"` \| `"id"` \| `"action"`\>\>

Additional execution options (e.g., storeAs, failOnError).

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

A promise that resolves to the action's result.

***

### execute()

> **execute**\<`R`\>(`actionOptions`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:128](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L128)

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
