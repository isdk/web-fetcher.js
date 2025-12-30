[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PlaywrightFetchEngine

# Class: PlaywrightFetchEngine

Defined in: [packages/web-fetcher/src/engine/playwright.ts:16](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L16)

## Extends

- [`FetchEngine`](FetchEngine.md)\<`PlaywrightCrawlingContext`, `PlaywrightCrawler`, `PlaywrightCrawlerOptions`\>

## Constructors

### Constructor

> **new PlaywrightFetchEngine**(): `PlaywrightFetchEngine`

#### Returns

`PlaywrightFetchEngine`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`constructor`](FetchEngine.md#constructor)

## Properties

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:235](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L235)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionEmitter`](FetchEngine.md#actionemitter)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:239](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L239)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockedTypes`](FetchEngine.md#blockedtypes)

***

### crawler?

> `protected` `optional` **crawler**: `PlaywrightCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:227](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L227)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawler`](FetchEngine.md#crawler)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:225](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L225)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`ctx`](FetchEngine.md#ctx)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:231](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L231)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`hdrs`](FetchEngine.md#hdrs)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:228](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L228)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isCrawlerReady`](FetchEngine.md#iscrawlerready)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:236](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L236)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isPageActive`](FetchEngine.md#ispageactive)

***

### jar

> `protected` **jar**: [`Cookie`](../interfaces/Cookie.md)[] = `[]`

Defined in: [packages/web-fetcher/src/engine/base.ts:232](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L232)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`jar`](FetchEngine.md#jar)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:238](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L238)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`lastResponse`](FetchEngine.md#lastresponse)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:237](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L237)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`navigationLock`](FetchEngine.md#navigationlock)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:226](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L226)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`opts`](FetchEngine.md#opts)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:233](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L233)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pendingRequests`](FetchEngine.md#pendingrequests)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:234](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L234)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestCounter`](FetchEngine.md#requestcounter)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:229](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L229)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestQueue`](FetchEngine.md#requestqueue)

***

### id

> `readonly` `static` **id**: `"playwright"` = `'playwright'`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:21](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L21)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id)

***

### mode

> `readonly` `static` **mode**: `"browser"` = `'browser'`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:22](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L22)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode)

## Accessors

### context

#### Get Signature

> **get** **context**(): `undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:480](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L480)

Gets the fetch engine context associated with this instance.

##### Returns

`undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`context`](FetchEngine.md#context)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:466](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L466)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id-1)

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:473](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L473)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode-1)

## Methods

### \_buildResponse()

> `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:24](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L24)

**`Internal`**

Abstract method for building standard [FetchResponse] from Crawlee context.

#### Parameters

##### context

`PlaywrightCrawlingContext`

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

Defined in: [packages/web-fetcher/src/engine/base.ts:241](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L241)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_cleanup`](FetchEngine.md#_cleanup)

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:664](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L664)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_commonCleanup`](FetchEngine.md#_commoncleanup)

***

### \_createCrawler()

> `protected` **\_createCrawler**(`options`): `PlaywrightCrawler`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:202](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L202)

**`Internal`**

Creates the crawler instance for the specific engine implementation.

#### Parameters

##### options

`PlaywrightCrawlerOptions`

The final crawler options.

#### Returns

`PlaywrightCrawler`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_createCrawler`](FetchEngine.md#_createcrawler)

***

### \_executePendingActions()

> `protected` **\_executePendingActions**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:580](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L580)

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

`PlaywrightCrawlingContext`

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

Defined in: [packages/web-fetcher/src/engine/base.ts:246](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L246)

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:57](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L57)

#### Parameters

##### schema

`ExtractValueSchema`

##### context

`Locator`

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_extractValue`](FetchEngine.md#_extractvalue)

***

### \_getSpecificCrawlerOptions()

> `protected` **\_getSpecificCrawlerOptions**(`ctx`): `Promise`\<`Partial`\<`PlaywrightCrawlerOptions`\>\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:206](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L206)

**`Internal`**

Gets the crawler-specific options from the subclass.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

The fetch engine context.

#### Returns

`Promise`\<`Partial`\<`PlaywrightCrawlerOptions`\>\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_getSpecificCrawlerOptions`](FetchEngine.md#_getspecificcrawleroptions)

***

### \_normalizeSchema()

> `protected` **\_normalizeSchema**(`schema`): `ExtractSchema`

Defined in: [packages/web-fetcher/src/engine/base.ts:422](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L422)

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:53](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L53)

#### Parameters

##### context

`Locator`

##### selector

`string`

#### Returns

`Promise`\<`any`[]\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_querySelectorAll`](FetchEngine.md#_queryselectorall)

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:631](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L631)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_sharedFailedRequestHandler`](FetchEngine.md#_sharedfailedrequesthandler)

***

### \_sharedRequestHandler()

> `protected` **\_sharedRequestHandler**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:603](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L603)

#### Parameters

##### context

`PlaywrightCrawlingContext`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_sharedRequestHandler`](FetchEngine.md#_sharedrequesthandler)

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:708](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L708)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:315](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L315)

#### Parameters

##### context

`PlaywrightCrawlingContext`

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`buildResponse`](FetchEngine.md#buildresponse)

***

### cleanup()

> **cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:544](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L544)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cleanup`](FetchEngine.md#cleanup)

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:372](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L372)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:819](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L819)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:820](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L820)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:647](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L647)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:837](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L837)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispose`](FetchEngine.md#dispose)

***

### executeAction()

> `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:85](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L85)

**`Internal`**

Abstract method for executing action within current page context.

#### Parameters

##### context

`PlaywrightCrawlingContext`

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

Defined in: [packages/web-fetcher/src/engine/base.ts:417](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L417)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:384](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L384)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:722](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L722)

Gets content of current page.

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to fetch response

#### Throws

When no content has been fetched yet

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getContent`](FetchEngine.md#getcontent)

***

### goto()

> **goto**(`url`, `opts?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:265](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/playwright.ts#L265)

Navigates to the specified URL.

#### Parameters

##### url

`string`

Target URL

##### opts?

[`GotoActionOptions`](../interfaces/GotoActionOptions.md)

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

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

Defined in: [packages/web-fetcher/src/engine/base.ts:761](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L761)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:762](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L762)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:763](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L763)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:764](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L764)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:495](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L495)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:407](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L407)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:396](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L396)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:361](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L361)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:198](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L198)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:171](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L171)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:181](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L181)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:158](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L158)

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
