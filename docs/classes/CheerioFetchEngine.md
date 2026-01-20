[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / CheerioFetchEngine

# Class: CheerioFetchEngine

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:17](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L17)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:379](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L379)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initialCookies`](FetchEngine.md#_initialcookies)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:380](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L380)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initializedSessions`](FetchEngine.md#_initializedsessions)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:384](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L384)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionEmitter`](FetchEngine.md#actionemitter)

***

### actionQueue

> `protected` **actionQueue**: [`DispatchedEngineAction`](../interfaces/DispatchedEngineAction.md)[] = `[]`

Defined in: [packages/web-fetcher/src/engine/base.ts:391](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L391)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionQueue`](FetchEngine.md#actionqueue)

***

### activeContext?

> `protected` `optional` **activeContext**: `CheerioCrawlingContext`\<`any`, `any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:388](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L388)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`activeContext`](FetchEngine.md#activecontext)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:393](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L393)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockedTypes`](FetchEngine.md#blockedtypes)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:373](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L373)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`config`](FetchEngine.md#config)

***

### crawler?

> `protected` `optional` **crawler**: `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:370](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L370)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawler`](FetchEngine.md#crawler)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:372](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L372)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawlerRunPromise`](FetchEngine.md#crawlerrunpromise)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:368](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L368)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`ctx`](FetchEngine.md#ctx)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:381](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L381)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`currentSession`](FetchEngine.md#currentsession)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:378](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L378)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`hdrs`](FetchEngine.md#hdrs)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:371](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L371)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isCrawlerReady`](FetchEngine.md#iscrawlerready)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:386](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L386)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isEngineDisposed`](FetchEngine.md#isenginedisposed)

***

### isExecutingAction

> `protected` **isExecutingAction**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:389](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L389)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isExecutingAction`](FetchEngine.md#isexecutingaction)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:385](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L385)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isPageActive`](FetchEngine.md#ispageactive)

***

### isProcessingActionLoop

> `protected` **isProcessingActionLoop**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:392](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L392)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isProcessingActionLoop`](FetchEngine.md#isprocessingactionloop)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:375](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L375)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`kvStore`](FetchEngine.md#kvstore)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:390](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L390)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`lastResponse`](FetchEngine.md#lastresponse)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:387](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L387)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`navigationLock`](FetchEngine.md#navigationlock)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:369](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L369)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`opts`](FetchEngine.md#opts)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:382](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L382)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pendingRequests`](FetchEngine.md#pendingrequests)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:376](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L376)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`proxyConfiguration`](FetchEngine.md#proxyconfiguration)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:383](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L383)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestCounter`](FetchEngine.md#requestcounter)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:374](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L374)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestQueue`](FetchEngine.md#requestqueue)

***

### id

> `readonly` `static` **id**: `"cheerio"` = `'cheerio'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:22](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L22)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id)

***

### mode

> `readonly` `static` **mode**: `"http"` = `'http'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:23](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L23)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode)

## Accessors

### context

#### Get Signature

> **get** **context**(): [`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:846](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L846)

Gets the fetch engine context associated with this instance.

##### Returns

[`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`context`](FetchEngine.md#context)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:821](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L821)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id-1)

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:839](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L839)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode-1)

## Methods

### \_buildResponse()

> `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:41](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L41)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:399](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L399)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_cleanup`](FetchEngine.md#_cleanup)

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1237](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1237)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_commonCleanup`](FetchEngine.md#_commoncleanup)

***

### \_contains()

> **\_contains**(`container`, `element`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:172](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L172)

**`Internal`**

Checks if the `container` scope contains the `element` scope.

#### Parameters

##### container

The potential ancestor element.

###### $

`CheerioAPI`

###### el

`Cheerio`

##### element

The potential descendant element.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`boolean`\>

A promise resolving to `true` if `container` contains `element`.

#### See

IExtractEngine.\_contains for implementation details.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_contains`](FetchEngine.md#_contains)

***

### \_createCrawler()

> `protected` **\_createCrawler**(`options`, `config?`): `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:674](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L674)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1089](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1089)

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

> `protected` **\_extract**(`schema`, `scope`, `parentStrict?`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:542](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L542)

#### Parameters

##### schema

`ExtractSchema`

##### scope

`any`

##### parentStrict?

`boolean`

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extract`](FetchEngine.md#_extract)

***

### \_extractColumnar()

> `protected` **\_extractColumnar**(`schema`, `container`, `opts?`): `Promise`\<`any`[] \| `null`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:584](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L584)

**`Internal`**

Performs columnar extraction (Column Alignment Mode).

#### Parameters

##### schema

`ExtractSchema`

The schema for a single item (must be an object or implicit object).

##### container

`any`

The container element to search within.

##### opts?

`ColumnarOptions`

Columnar extraction options (strict, inference).

#### Returns

`Promise`\<`any`[] \| `null`\>

An array of extracted items, or null if requirements aren't met.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractColumnar`](FetchEngine.md#_extractcolumnar)

***

### \_extractNested()

> `protected` **\_extractNested**(`items`, `elements`, `opts?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:567](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L567)

**`Internal`**

Performs standard nested array extraction.

#### Parameters

##### items

`ExtractSchema`

The schema for each item.

##### elements

`any`[]

The list of item elements.

##### opts?

###### strict?

`boolean`

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractNested`](FetchEngine.md#_extractnested)

***

### \_extractSegmented()

> `protected` **\_extractSegmented**(`schema`, `container`, `opts?`): `Promise`\<`any`[] \| `null`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:601](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L601)

**`Internal`**

Performs segmented extraction (Anchor-based Scanning).

#### Parameters

##### schema

`ExtractSchema`

The schema for a single item (must be an object).

##### container

`any`

The container element to scan.

##### opts?

`SegmentedOptions`

Segmented extraction options (anchor).

#### Returns

`Promise`\<`any`[] \| `null`\>

An array of extracted items.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractSegmented`](FetchEngine.md#_extractsegmented)

***

### \_extractValue()

> **\_extractValue**(`schema`, `scope`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:240](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L240)

**`Internal`**

Extracts a primitive value from the element based on schema.

#### Parameters

##### schema

`ExtractValueSchema`

Value extraction schema.

##### scope

The element scope.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

Extracted value.

#### See

IExtractEngine.\_extractValue for behavior contract.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_extractValue`](FetchEngine.md#_extractvalue)

***

### \_findClosestAncestor()

> **\_findClosestAncestor**(`scope`, `candidates`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:151](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L151)

**`Internal`**

Finds the closest ancestor of `scope` (including itself) that exists in the `candidates` array.

#### Parameters

##### scope

The starting element.

###### $

`CheerioAPI`

###### el

`Cheerio`

##### candidates

`object`[]

The array of potential ancestor scopes.

#### Returns

`Promise`\<`any`\>

A promise resolving to the matching candidate scope, or `null` if none found.

#### See

IExtractEngine.\_findClosestAncestor for implementation details.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_findClosestAncestor`](FetchEngine.md#_findclosestancestor)

***

### \_findCommonAncestor()

> **\_findCommonAncestor**(`scope1`, `scope2`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:186](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L186)

**`Internal`**

Finds the Lowest Common Ancestor (LCA) of two element scopes.

#### Parameters

##### scope1

The first element scope.

###### $

`CheerioAPI`

###### el

`Cheerio`

##### scope2

The second element scope.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

A promise resolving to the LCA element scope, or `null` if none found.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_findCommonAncestor`](FetchEngine.md#_findcommonancestor)

***

### \_findContainerChild()

> **\_findContainerChild**(`element`, `container`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:209](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L209)

**`Internal`**

Finds the direct child of container that contains element.

#### Parameters

##### element

The descendant element.

###### $

`CheerioAPI`

###### el

`Cheerio`

##### container

The container element.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

The child element of container, or null.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_findContainerChild`](FetchEngine.md#_findcontainerchild)

***

### \_getInitialElementScope()

> `protected` **\_getInitialElementScope**(`context`): `any`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:281](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L281)

**`Internal`**

Gets the initial scope for extraction for the specific engine.

#### Parameters

##### context

`CheerioCrawlingContext`

Crawlee crawling context

#### Returns

`any`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_getInitialElementScope`](FetchEngine.md#_getinitialelementscope)

***

### \_getSpecificCrawlerOptions()

> `protected` **\_getSpecificCrawlerOptions**(`ctx`): `CheerioCrawlerOptions`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:681](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L681)

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

### \_getTrimInfo()

> `protected` **\_getTrimInfo**(`options`): `object`

Defined in: [packages/web-fetcher/src/engine/base.ts:401](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L401)

#### Parameters

##### options

[`TrimActionOptions`](../interfaces/TrimActionOptions.md)

#### Returns

`object`

##### removeComments

> **removeComments**: `boolean`

##### removeHidden

> **removeHidden**: `boolean`

##### selectors

> **selectors**: `string`[] = `allSelectors`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_getTrimInfo`](FetchEngine.md#_gettriminfo)

***

### \_handlePause()

> `protected` **\_handlePause**(`action`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1049](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1049)

#### Parameters

##### action

###### message?

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_handlePause`](FetchEngine.md#_handlepause)

***

### \_isSameElement()

> **\_isSameElement**(`scope1`, `scope2`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:144](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L144)

**`Internal`**

Checks if two elements are the same identity.

#### Parameters

##### scope1

First element scope.

###### el

`Cheerio`

##### scope2

Second element scope.

###### el

`Cheerio`

#### Returns

`Promise`\<`boolean`\>

True if they are the same DOM node.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_isSameElement`](FetchEngine.md#_issameelement)

***

### \_logDebug()

> **\_logDebug**(`category`, ...`args`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:395](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L395)

Logs debug information if debug mode is enabled.

#### Parameters

##### category

`string`

The category of the log message.

##### args

...`any`[]

Arguments to log.

#### Returns

`void`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_logDebug`](FetchEngine.md#_logdebug)

***

### \_nextSiblingsUntil()

> **\_nextSiblingsUntil**(`scope`, `untilSelector?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:123](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L123)

**`Internal`**

Gets all subsequent siblings of an element until a sibling matches the selector.
Used in 'segmented' extraction mode.

#### Parameters

##### scope

The anchor element scope.

###### $

`CheerioAPI`

###### el

`Cheerio`

##### untilSelector?

`string`

Optional selector that marks the end of the segment (exclusive).

#### Returns

`Promise`\<`any`[]\>

List of sibling elements between anchor and untilSelector.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_nextSiblingsUntil`](FetchEngine.md#_nextsiblingsuntil)

***

### \_normalizeArrayMode()

> `protected` **\_normalizeArrayMode**(`mode?`): `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:555](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L555)

**`Internal`**

Normalizes the array extraction mode into an options object.

#### Parameters

##### mode?

`ExtractArrayMode`

The mode string or options object.

#### Returns

`any`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_normalizeArrayMode`](FetchEngine.md#_normalizearraymode)

***

### \_parentElement()

> **\_parentElement**(`scope`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:134](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L134)

**`Internal`**

Gets the parent element of the given element.

#### Parameters

##### scope

The element scope.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

Parent element or null.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_parentElement`](FetchEngine.md#_parentelement)

***

### \_processAction()

> `protected` **\_processAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1020](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1020)

**`Internal`**

Unified action processor that handles engine-agnostic actions.

#### Parameters

##### context

`CheerioCrawlingContext`

Crawlee crawling context

##### action

[`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Action to execute

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_processAction`](FetchEngine.md#_processaction)

***

### \_querySelectorAll()

> **\_querySelectorAll**(`scope`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:95](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L95)

**`Internal`**

Finds all elements matching the selector within the given scope.

#### Parameters

##### scope

The scope to search in (Engine-specific element/node or array of nodes).

`any`[] | \{ `$`: `CheerioAPI`; `el`: `any`; \}

##### selector

`string`

CSS selector.

#### Returns

`Promise`\<`any`[]\>

List of matching elements.

#### See

IExtractEngine.\_querySelectorAll for behavior contract.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_querySelectorAll`](FetchEngine.md#_queryselectorall)

***

### \_requestWithRedirects()

> `protected` **\_requestWithRedirects**(`context`, `options`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:583](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L583)

#### Parameters

##### context

`CheerioCrawlingContext`

##### options

###### body?

`any`

###### headers?

`Record`\<`string`, `string`\>

###### method

`string`

###### url

`string`

#### Returns

`Promise`\<`any`\>

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1185](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1185)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1144](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1144)

#### Parameters

##### context

`CheerioCrawlingContext`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_sharedRequestHandler`](FetchEngine.md#_sharedrequesthandler)

***

### \_updateStateAfterNavigation()

> `protected` **\_updateStateAfterNavigation**(`context`, `loadedRequest`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:656](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L656)

#### Parameters

##### context

`CheerioCrawlingContext`

##### loadedRequest

`any`

#### Returns

`Promise`\<`void`\>

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1301](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1301)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:638](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L638)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:992](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L992)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cleanup`](FetchEngine.md#cleanup)

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:732](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L732)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1417](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1417)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1418](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1418)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1208](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1208)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1453](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1453)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispose`](FetchEngine.md#dispose)

***

### evaluate()

> **evaluate**(`params`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:800](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L800)

Executes a custom function or expression within the current page context.

#### Parameters

##### params

[`EvaluateActionOptions`](../interfaces/EvaluateActionOptions.md)

Configuration for the execution, including the function and arguments.

#### Returns

`Promise`\<`any`\>

A promise resolving to the result of the execution.

#### Remarks

This is a powerful action that allows running custom logic to interact with the DOM,
calculate values, or trigger navigations.

- In **Browser Mode**, it runs in the real browser.
- In **HTTP Mode**, it runs in a Node.js sandbox with a mocked DOM.

The action handles automatic navigation if `window.location` is modified.

#### Throws

If no active page context exists or if execution fails.

#### See

[EvaluateActionOptions](../interfaces/EvaluateActionOptions.md) for detailed parameter options and examples.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`evaluate`](FetchEngine.md#evaluate)

***

### executeAction()

> `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:289](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L289)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:810](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L810)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:744](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L744)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1315](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1315)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:829](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L829)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getState`](FetchEngine.md#getstate)

***

### goto()

> **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:701](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/cheerio.ts#L701)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1356](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1356)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1357](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1357)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1358](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1358)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1362](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L1362)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Parameters

###### name

`string`

Header name

###### value

Header value or `null` to remove

`string` | `null`

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

Defined in: [packages/web-fetcher/src/engine/base.ts:861](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L861)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:778](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L778)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:756](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L756)

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

### trim()

> **trim**(`options`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:767](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L767)

Removes elements from the DOM based on selectors and presets.

#### Parameters

##### options

[`TrimActionOptions`](../interfaces/TrimActionOptions.md)

Trim options specifying selectors and presets

#### Returns

`Promise`\<`void`\>

Promise resolving when trim operation completes

#### Throws

When no active page context exists

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`trim`](FetchEngine.md#trim)

***

### waitFor()

> **waitFor**(`params?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:721](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L721)

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

> `static` **create**(`ctx`, `options?`): `Promise`\<`AnyFetchEngine` \| `undefined`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:332](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L332)

Factory method to create and initialize a fetch engine instance.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Fetch engine context

##### options?

[`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Configuration options

#### Returns

`Promise`\<`AnyFetchEngine` \| `undefined`\>

Initialized fetch engine instance

#### Throws

When no suitable engine implementation is found

#### Remarks

Primary entry point for engine creation. Selects appropriate implementation based on `engine` name of the option or context.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`create`](FetchEngine.md#create)

***

### get()

> `static` **get**(`id`): `AnyFetchEngineCtor` \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:305](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L305)

Retrieves a fetch engine implementation by its unique ID.

#### Parameters

##### id

`string`

The ID of the engine to retrieve

#### Returns

`AnyFetchEngineCtor` \| `undefined`

Engine class if found, otherwise `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`get`](FetchEngine.md#get)

***

### getByMode()

> `static` **getByMode**(`mode`): `AnyFetchEngineCtor` \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:315](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L315)

Retrieves a fetch engine implementation by execution mode.

#### Parameters

##### mode

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

Execution mode (`'http'` or `'browser'`)

#### Returns

`AnyFetchEngineCtor` \| `undefined`

Engine class if found, otherwise `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getByMode`](FetchEngine.md#getbymode)

***

### register()

> `static` **register**(`engineClass`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:292](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L292)

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
