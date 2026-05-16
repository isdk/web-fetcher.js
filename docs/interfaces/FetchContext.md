[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchContext

# Interface: FetchContext

Defined in: [packages/web-fetcher/src/core/context.ts:109](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L109)

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

Defined in: [packages/web-fetcher/src/core/types.ts:222](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L222)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`antibot`](FetchEngineContext.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:239](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L239)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`blockResources`](FetchEngineContext.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:254](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L254)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### launchOptions?

> `optional` **launchOptions**: `Record`\<`string`, `any`\>

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`browser`](FetchEngineContext.md#browser)

***

### cache?

> `optional` **cache**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:249](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L249)

Cache configuration for persistent HTTP caching.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cache`](FetchEngineContext.md#cache)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:226](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L226)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cookies`](FetchEngineContext.md#cookies)

***

### currentAction?

> `optional` **currentAction**: [`FetchActionInContext`](../type-aliases/FetchActionInContext.md)

Defined in: [packages/web-fetcher/src/core/context.ts:113](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L113)

Metadata about the action currently being executed.

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:223](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L223)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`debug`](FetchEngineContext.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:276](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L276)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`delayBetweenRequestsMs`](FetchEngineContext.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:218](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L218)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`enableSmart`](FetchEngineContext.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:217](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L217)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`engine`](FetchEngineContext.md#engine)

***

### eventBus

> **eventBus**: `EventEmitter`

Defined in: [packages/web-fetcher/src/core/context.ts:153](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L153)

The central event bus for publishing and subscribing to session and action events.

***

### finalUrl?

> `optional` **finalUrl**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:84](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L84)

The final URL after all redirects have been followed.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`finalUrl`](FetchEngineContext.md#finalurl)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:225](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L225)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`headers`](FetchEngineContext.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:267](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L267)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`http`](FetchEngineContext.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:76](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L76)

Unique identifier for the session or request batch.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`id`](FetchEngineContext.md#id)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:252](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L252)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`ignoreSslErrors`](FetchEngineContext.md#ignoresslerrors)

***

### internal

> **internal**: `FetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:148](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L148)

Internal state for engine and lifecycle management.

#### Overrides

[`FetchEngineContext`](FetchEngineContext.md).[`internal`](FetchEngineContext.md#internal)

***

### lastResponse?

> `optional` **lastResponse**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:89](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L89)

The standardized response object from the most recent navigation.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResponse`](FetchEngineContext.md#lastresponse)

***

### lastResult?

> `optional` **lastResult**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:93](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L93)

The result object from the most recent action execution.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResult`](FetchEngineContext.md#lastresult)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L274)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxConcurrency`](FetchEngineContext.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:275](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L275)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxRequestsPerMinute`](FetchEngineContext.md#maxrequestsperminute)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:232](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L232)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`output`](FetchEngineContext.md#output)

***

### outputs

> **outputs**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/context.ts:119](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L119)

A shared key-value store for storing data extracted from pages or
metadata generated during action execution.

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:229](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L229)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`overrideSessionState`](FetchEngineContext.md#overridesessionstate)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:237](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L237)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`proxy`](FetchEngineContext.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:273](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L273)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`requestHandlerTimeoutSecs`](FetchEngineContext.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:277](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L277)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`retries`](FetchEngineContext.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:228](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L228)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionPoolOptions`](FetchEngineContext.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:227](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L227)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sessionState`](FetchEngineContext.md#sessionstate)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:279](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L279)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sites`](FetchEngineContext.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:244](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L244)

Storage configuration for session isolation and persistence.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`storage`](FetchEngineContext.md#storage)

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:219](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L219)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`syncStateOnUpgrade`](FetchEngineContext.md#syncstateonupgrade)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:230](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L230)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`throwHttpErrors`](FetchEngineContext.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:272](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L272)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`timeoutMs`](FetchEngineContext.md#timeoutms)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:220](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L220)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`upgradeThresholdMs`](FetchEngineContext.md#upgradethresholdms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:80](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L80)

The target URL for the next navigation, if specified.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`url`](FetchEngineContext.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:221](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L221)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useSiteRegistry`](FetchEngineContext.md#usesiteregistry)

## Methods

### action()

> **action**\<`R`\>(`name`, `params?`, `options?`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:139](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L139)

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

Defined in: [packages/web-fetcher/src/core/context.ts:127](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/context.ts#L127)

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
