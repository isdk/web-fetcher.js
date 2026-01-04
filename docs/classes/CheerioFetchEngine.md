[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / CheerioFetchEngine

# Class: CheerioFetchEngine

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:20](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L20)

## Extends

- [`FetchEngine`](FetchEngine.md)\<`CheerioCrawlingContext`, `CheerioCrawler`, `CheerioCrawlerOptions`\>

## Constructors

### Constructor

> **new CheerioFetchEngine**(): `CheerioFetchEngine`

#### Returns

`CheerioFetchEngine`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`constructor`](FetchEngine.md#constructor)

## Properties

### \_initialCookies?

> `protected` `optional` **\_initialCookies**: [`Cookie`](../interfaces/Cookie.md)[]

Defined in: [packages/web-fetcher/src/engine/base.ts:239](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L239)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initialCookies`](FetchEngine.md#_initialcookies)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:240](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L240)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initializedSessions`](FetchEngine.md#_initializedsessions)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:244](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L244)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionEmitter`](FetchEngine.md#actionemitter)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:249](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L249)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockedTypes`](FetchEngine.md#blockedtypes)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:234](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L234)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`config`](FetchEngine.md#config)

***

### crawler?

> `protected` `optional` **crawler**: `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:231](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L231)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawler`](FetchEngine.md#crawler)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:233](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L233)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawlerRunPromise`](FetchEngine.md#crawlerrunpromise)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:229](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L229)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`ctx`](FetchEngine.md#ctx)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:241](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L241)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`currentSession`](FetchEngine.md#currentsession)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:238](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L238)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`hdrs`](FetchEngine.md#hdrs)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:232](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L232)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isCrawlerReady`](FetchEngine.md#iscrawlerready)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:246](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L246)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isEngineDisposed`](FetchEngine.md#isenginedisposed)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:245](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L245)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isPageActive`](FetchEngine.md#ispageactive)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:236](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L236)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`kvStore`](FetchEngine.md#kvstore)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:248](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L248)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`lastResponse`](FetchEngine.md#lastresponse)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:247](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L247)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`navigationLock`](FetchEngine.md#navigationlock)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:230](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L230)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`opts`](FetchEngine.md#opts)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:242](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L242)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pendingRequests`](FetchEngine.md#pendingrequests)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:243](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L243)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestCounter`](FetchEngine.md#requestcounter)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:235](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L235)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestQueue`](FetchEngine.md#requestqueue)

***

### id

> `readonly` `static` **id**: `"cheerio"` = `'cheerio'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:25](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L25)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id)

***

### mode

> `readonly` `static` **mode**: `"http"` = `'http'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:26](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L26)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode)

## Accessors

### context

#### Get Signature

> **get** **context**(): `undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:516](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L516)

Gets the fetch engine context associated with this instance.

##### Returns

`undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`context`](FetchEngine.md#context)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:491](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L491)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id-1)

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:509](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L509)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode-1)

## Methods

### \_buildResponse()

> `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:39](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L39)

**`Internal`**

Abstract method for building standard [FetchResponse] from Crawlee context.

#### Parameters

##### context

`CheerioCrawlingContext`

Crawlee crawling context

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to [FetchResponse] object

#### Remarks

Converts implementation-specific context (Playwright `page` or Cheerio `$`) to standardized response.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_buildResponse`](FetchEngine.md#_buildresponse)

***

### \_cleanup()?

> `protected` `optional` **\_cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:251](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L251)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_cleanup`](FetchEngine.md#_cleanup)

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:764](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L764)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_commonCleanup`](FetchEngine.md#_commoncleanup)

***

### \_createCrawler()

> `protected` **\_createCrawler**(`options`, `config?`): `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:234](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L234)

**`Internal`**

Creates the crawler instance for the specific engine implementation.

#### Parameters

##### options

`CheerioCrawlerOptions`

The final crawler options.

##### config?

`Configuration`

#### Returns

`CheerioCrawler`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_createCrawler`](FetchEngine.md#_createcrawler)

***

### \_executePendingActions()

> `protected` **\_executePendingActions**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:664](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L664)

**`Internal`**

Executes all pending fetch engine actions within the current Crawlee request handler context.

**Critical Execution Constraint**: This method **MUST** be awaited within the synchronous execution path
of Crawlee's [requestHandler](https://crawlee.dev/js/api/basic-crawler) (before any `await` that yields control back to the event loop).

### Why This Constraint Exists
- Crawlee's page context ([PlaywrightCrawler](https://crawlee.dev/js/api/playwright-crawler)'s `page` or [CheerioCrawler](https://crawlee.dev/js/api/cheerio-crawler)'s `$`)
  is **only valid during the synchronous execution phase** of the request handler
- After any `await` (e.g., `await page.goto()`), the page context may be destroyed
  due to Crawlee's internal resource management

### How It Works
1. Processes all actions queued via [dispatchAction](#dispatchaction) (click, fill, submit, etc.)
2. Maintains the page context validity window via [isPageActive](#ispageactive) lifecycle flag
3. Automatically cleans up event listeners upon completion

Usage see [\_sharedRequestHandler](#_sharedrequesthandler)

#### Parameters

##### context

`CheerioCrawlingContext`

The active Crawlee crawling context containing the page/$ object

#### Returns

`Promise`\<`void`\>

#### See

[\_sharedRequestHandler](#_sharedrequesthandler)

#### Throws

If called outside valid page context window (`!this.isPageActive`)
 Engine infrastructure method - not for direct consumer use

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_executePendingActions`](FetchEngine.md#_executependingactions)

***

### \_extract()

> `protected` **\_extract**(`schema`, `context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:256](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L256)

#### Parameters

##### schema

`ExtractSchema`

##### context

`any`

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extract`](FetchEngine.md#_extract)

***

### \_extractValue()

> `protected` **\_extractValue**(`schema`, `context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:75](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L75)

#### Parameters

##### schema

`ExtractValueSchema`

##### context

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_extractValue`](FetchEngine.md#_extractvalue)

***

### \_getSpecificCrawlerOptions()

> `protected` **\_getSpecificCrawlerOptions**(`ctx`): `CheerioCrawlerOptions`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:238](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L238)

**`Internal`**

Gets the crawler-specific options from the subclass.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

The fetch engine context.

#### Returns

`CheerioCrawlerOptions`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_getSpecificCrawlerOptions`](FetchEngine.md#_getspecificcrawleroptions)

***

### \_normalizeSchema()

> `protected` **\_normalizeSchema**(`schema`): `ExtractSchema`

Defined in: [packages/web-fetcher/src/engine/base.ts:447](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L447)

#### Parameters

##### schema

`ExtractSchema`

#### Returns

`ExtractSchema`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_normalizeSchema`](FetchEngine.md#_normalizeschema)

***

### \_querySelectorAll()

> `protected` **\_querySelectorAll**(`context`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:70](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L70)

#### Parameters

##### context

###### $

`CheerioAPI`

###### el

`Cheerio`

##### selector

`string`

#### Returns

`Promise`\<`any`[]\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_querySelectorAll`](FetchEngine.md#_queryselectorall)

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:731](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L731)

#### Parameters

##### context

`CheerioCrawlingContext`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_sharedFailedRequestHandler`](FetchEngine.md#_sharedfailedrequesthandler)

***

### \_sharedRequestHandler()

> `protected` **\_sharedRequestHandler**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:696](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L696)

#### Parameters

##### context

`CheerioCrawlingContext`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_sharedRequestHandler`](FetchEngine.md#_sharedrequesthandler)

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:823](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L823)

Blocks specified resource types from loading.

#### Parameters

##### types

`string`[]

Resource types to block

##### overwrite?

`boolean`

Whether to replace existing blocked types

#### Returns

`Promise`\<`number`\>

Number of blocked resource types

#### Example

```ts
await engine.blockResources(['image', 'stylesheet']);
await engine.blockResources(['script'], true); // Replace existing
```

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockResources`](FetchEngine.md#blockresources)

***

### buildResponse()

> `protected` **buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:325](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L325)

#### Parameters

##### context

`CheerioCrawlingContext`

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`buildResponse`](FetchEngine.md#buildresponse)

***

### cleanup()

> **cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:628](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L628)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cleanup`](FetchEngine.md#cleanup)

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:397](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L397)

Clicks on element matching selector.

#### Parameters

##### selector

`string`

CSS selector of element to click

#### Returns

`Promise`\<`void`\>

Promise resolving when click is processed

#### Throws

When no active page context exists

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`click`](FetchEngine.md#click)

***

### cookies()

#### Call Signature

> **cookies**(): `Promise`\<[`Cookie`](../interfaces/Cookie.md)[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:934](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L934)

Manages cookies for current session with multiple overloads.

Gets all cookies.

##### Returns

`Promise`\<[`Cookie`](../interfaces/Cookie.md)[]\>

Array of cookies

Sets cookies for session.

##### Example

```ts
const cookies = await engine.cookies();
await engine.cookies([{ name: 'session', value: '123' }]);
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`cookies`](FetchEngine.md#cookies)

#### Call Signature

> **cookies**(`cookies`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:935](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L935)

Manages cookies for current session with multiple overloads.

Gets all cookies.

##### Parameters

###### cookies

[`Cookie`](../interfaces/Cookie.md)[]

Cookies to set

##### Returns

`Promise`\<`boolean`\>

Array of cookies

Sets cookies for session.

##### Example

```ts
const cookies = await engine.cookies();
await engine.cookies([{ name: 'session', value: '123' }]);
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`cookies`](FetchEngine.md#cookies)

***

### dispatchAction()

> `protected` **dispatchAction**\<`T`\>(`action`): `Promise`\<`T`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:747](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L747)

#### Type Parameters

##### T

`T`

#### Parameters

##### action

[`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

#### Returns

`Promise`\<`T`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispatchAction`](FetchEngine.md#dispatchaction)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:970](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L970)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispose`](FetchEngine.md#dispose)

***

### executeAction()

> `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:103](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L103)

**`Internal`**

Abstract method for executing action within current page context.

#### Parameters

##### context

`CheerioCrawlingContext`

Crawlee crawling context

##### action

[`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Action to execute

#### Returns

`Promise`\<`any`\>

Promise resolving to action result

#### Remarks

Handles specific user interactions using underlying technology (Playwright/Cheerio).

#### Overrides

[`FetchEngine`](FetchEngine.md).[`executeAction`](FetchEngine.md#executeaction)

***

### extract()

> **extract**\<`T`\>(`schema`): `Promise`\<`T`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:442](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L442)

Extracts structured data from the current page content.

#### Type Parameters

##### T

`T`

#### Parameters

##### schema

`ExtractSchema`

An object defining the data to extract.

#### Returns

`Promise`\<`T`\>

A promise that resolves to an object with the extracted data.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`extract`](FetchEngine.md#extract)

***

### fill()

> **fill**(`selector`, `value`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:409](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L409)

Fills input element with specified value.

#### Parameters

##### selector

`string`

CSS selector of input element

##### value

`string`

Value to fill

#### Returns

`Promise`\<`void`\>

Promise resolving when fill operation completes

#### Throws

When no active page context exists

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`fill`](FetchEngine.md#fill)

***

### getContent()

> **getContent**(): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:837](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L837)

Gets content of current page.

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to fetch response

#### Throws

When no content has been fetched yet

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getContent`](FetchEngine.md#getcontent)

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

Defined in: [packages/web-fetcher/src/engine/base.ts:499](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L499)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getState`](FetchEngine.md#getstate)

***

### goto()

> **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:258](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/cheerio.ts#L258)

Navigates to the specified URL.

#### Parameters

##### url

`string`

Target URL

##### params?

[`GotoActionOptions`](../interfaces/GotoActionOptions.md)

Navigation options

#### Returns

`Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving when navigation completes

#### Example

```ts
await engine.goto('https://example.com');
```

#### Overrides

[`FetchEngine`](FetchEngine.md).[`goto`](FetchEngine.md#goto)

***

### headers()

#### Call Signature

> **headers**(): `Promise`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/web-fetcher/src/engine/base.ts:876](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L876)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

All headers as record

Gets specific header value.

##### Example

```ts
const allHeaders = await engine.headers();
const userAgent = await engine.headers('user-agent');
await engine.headers({ 'x-custom': 'value' });
await engine.headers('auth', 'token');
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`headers`](FetchEngine.md#headers)

#### Call Signature

> **headers**(`name`): `Promise`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:877](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L877)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Parameters

###### name

`string`

Header name

##### Returns

`Promise`\<`string`\>

All headers as record

Gets specific header value.

##### Example

```ts
const allHeaders = await engine.headers();
const userAgent = await engine.headers('user-agent');
await engine.headers({ 'x-custom': 'value' });
await engine.headers('auth', 'token');
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`headers`](FetchEngine.md#headers)

#### Call Signature

> **headers**(`headers`, `replaced?`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:878](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L878)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Parameters

###### headers

`Record`\<`string`, `string`\>

Headers to set

###### replaced?

`boolean`

Whether to replace all existing headers

##### Returns

`Promise`\<`boolean`\>

All headers as record

Gets specific header value.

##### Example

```ts
const allHeaders = await engine.headers();
const userAgent = await engine.headers('user-agent');
await engine.headers({ 'x-custom': 'value' });
await engine.headers('auth', 'token');
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`headers`](FetchEngine.md#headers)

#### Call Signature

> **headers**(`name`, `value`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:879](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L879)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Parameters

###### name

`string`

Header name

###### value

Header value or `null` to remove

`null` | `string`

##### Returns

`Promise`\<`boolean`\>

All headers as record

Gets specific header value.

##### Example

```ts
const allHeaders = await engine.headers();
const userAgent = await engine.headers('user-agent');
await engine.headers({ 'x-custom': 'value' });
await engine.headers('auth', 'token');
```

##### Inherited from

[`FetchEngine`](FetchEngine.md).[`headers`](FetchEngine.md#headers)

***

### initialize()

> **initialize**(`context`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:531](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L531)

Initializes the fetch engine with provided context and options.

#### Parameters

##### context

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Fetch engine context

##### options?

[`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Configuration options

#### Returns

`Promise`\<`void`\>

Promise resolving when initialization completes

#### Remarks

Sets up internal state and calls implementation-specific [_initialize](file:///home/riceball/Documents/mywork/public/@isdk/ai-tools/packages/web-fetcher/src/engine/cheerio.ts#L169-L204) method.
Automatically called when creating engine via `FetchEngine.create()`.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`initialize`](FetchEngine.md#initialize)

***

### pause()

> **pause**(`message?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:432](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L432)

Pauses execution, allowing for manual intervention or inspection.

#### Parameters

##### message?

`string`

Optional message to display during pause

#### Returns

`Promise`\<`void`\>

Promise resolving when execution is resumed

#### Throws

When no active page context exists

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pause`](FetchEngine.md#pause)

***

### submit()

> **submit**(`selector?`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:421](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L421)

Submits a form.

#### Parameters

##### selector?

`any`

Optional form/submit button selector

##### options?

[`SubmitActionOptions`](../interfaces/SubmitActionOptions.md)

Submission options

#### Returns

`Promise`\<`void`\>

Promise resolving when form is submitted

#### Throws

When no active page context exists

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`submit`](FetchEngine.md#submit)

***

### waitFor()

> **waitFor**(`params?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:386](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L386)

Waits for specified condition before continuing.

#### Parameters

##### params?

[`WaitForActionOptions`](../interfaces/WaitForActionOptions.md)

Wait conditions

#### Returns

`Promise`\<`void`\>

Promise resolving when wait condition is met

#### Example

```ts
await engine.waitFor({ ms: 1000 }); // Wait 1 second
await engine.waitFor({ selector: '#content' }); // Wait for element
```

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`waitFor`](FetchEngine.md#waitfor)

***

### create()

> `static` **create**(`ctx`, `options?`): `Promise`\<`undefined` \| `AnyFetchEngine`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:202](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L202)

Factory method to create and initialize a fetch engine instance.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Fetch engine context

##### options?

[`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Configuration options

#### Returns

`Promise`\<`undefined` \| `AnyFetchEngine`\>

Initialized fetch engine instance

#### Throws

When no suitable engine implementation is found

#### Remarks

Primary entry point for engine creation. Selects appropriate implementation based on `engine` name of the option or context.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`create`](FetchEngine.md#create)

***

### get()

> `static` **get**(`id`): `undefined` \| `AnyFetchEngineCtor`

Defined in: [packages/web-fetcher/src/engine/base.ts:175](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L175)

Retrieves a fetch engine implementation by its unique ID.

#### Parameters

##### id

`string`

The ID of the engine to retrieve

#### Returns

`undefined` \| `AnyFetchEngineCtor`

Engine class if found, otherwise `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`get`](FetchEngine.md#get)

***

### getByMode()

> `static` **getByMode**(`mode`): `undefined` \| `AnyFetchEngineCtor`

Defined in: [packages/web-fetcher/src/engine/base.ts:185](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L185)

Retrieves a fetch engine implementation by execution mode.

#### Parameters

##### mode

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

Execution mode (`'http'` or `'browser'`)

#### Returns

`undefined` \| `AnyFetchEngineCtor`

Engine class if found, otherwise `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getByMode`](FetchEngine.md#getbymode)

***

### register()

> `static` **register**(`engineClass`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:162](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/engine/base.ts#L162)

Registers a fetch engine implementation with the global registry.

#### Parameters

##### engineClass

`AnyFetchEngineCtor`

The engine class to register

#### Returns

`void`

#### Throws

When engine class lacks static `id` or ID is already registered

#### Example

```ts
FetchEngine.register(CheerioFetchEngine);
```

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`register`](FetchEngine.md#register)
