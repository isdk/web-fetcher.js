[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / CheerioFetchEngine

# Class: CheerioFetchEngine

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:17](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L17)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:278](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L278)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initialCookies`](FetchEngine.md#_initialcookies)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:279](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L279)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initializedSessions`](FetchEngine.md#_initializedsessions)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:283](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L283)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionEmitter`](FetchEngine.md#actionemitter)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:288](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L288)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockedTypes`](FetchEngine.md#blockedtypes)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:272](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L272)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`config`](FetchEngine.md#config)

***

### crawler?

> `protected` `optional` **crawler**: `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:269](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L269)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawler`](FetchEngine.md#crawler)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:271](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L271)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawlerRunPromise`](FetchEngine.md#crawlerrunpromise)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:267](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L267)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`ctx`](FetchEngine.md#ctx)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:280](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L280)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`currentSession`](FetchEngine.md#currentsession)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:277](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L277)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`hdrs`](FetchEngine.md#hdrs)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:270](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L270)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isCrawlerReady`](FetchEngine.md#iscrawlerready)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:285](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L285)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isEngineDisposed`](FetchEngine.md#isenginedisposed)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:284](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L284)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isPageActive`](FetchEngine.md#ispageactive)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:274](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L274)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`kvStore`](FetchEngine.md#kvstore)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:287](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L287)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`lastResponse`](FetchEngine.md#lastresponse)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:286](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L286)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`navigationLock`](FetchEngine.md#navigationlock)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:268](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L268)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`opts`](FetchEngine.md#opts)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:281](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L281)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pendingRequests`](FetchEngine.md#pendingrequests)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:275](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L275)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`proxyConfiguration`](FetchEngine.md#proxyconfiguration)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:282](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L282)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestCounter`](FetchEngine.md#requestcounter)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:273](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L273)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestQueue`](FetchEngine.md#requestqueue)

***

### id

> `readonly` `static` **id**: `"cheerio"` = `'cheerio'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:22](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L22)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id)

***

### mode

> `readonly` `static` **mode**: `"http"` = `'http'`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:23](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L23)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode)

## Accessors

### context

#### Get Signature

> **get** **context**(): `undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:938](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L938)

Gets the fetch engine context associated with this instance.

##### Returns

`undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`context`](FetchEngine.md#context)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:913](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L913)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id-1)

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:931](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L931)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode-1)

## Methods

### \_buildResponse()

> `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:41](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L41)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:290](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L290)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_cleanup`](FetchEngine.md#_cleanup)

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1239](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1239)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_commonCleanup`](FetchEngine.md#_commoncleanup)

***

### \_createCrawler()

> `protected` **\_createCrawler**(`options`, `config?`): `CheerioCrawler`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:395](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L395)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1120](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1120)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:365](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L365)

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

### \_extractColumnar()

> `protected` **\_extractColumnar**(`schema`, `container`, `opts?`): `Promise`\<`null` \| `any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:489](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L489)

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

`Promise`\<`null` \| `any`[]\>

An array of extracted items, or null if requirements aren't met.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractColumnar`](FetchEngine.md#_extractcolumnar)

***

### \_extractNested()

> `protected` **\_extractNested**(`items`, `elements`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:469](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L469)

**`Internal`**

Performs standard nested array extraction.

#### Parameters

##### items

`ExtractSchema`

The schema for each item.

##### elements

`any`[]

The list of item elements.

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractNested`](FetchEngine.md#_extractnested)

***

### \_extractSegmented()

> `protected` **\_extractSegmented**(`schema`, `container`, `opts?`): `Promise`\<`null` \| `any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:651](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L651)

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

`Promise`\<`null` \| `any`[]\>

An array of extracted items.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_extractSegmented`](FetchEngine.md#_extractsegmented)

***

### \_extractValue()

> `protected` **\_extractValue**(`schema`, `context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:146](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L146)

**`Internal`**

Extracts a primitive value from the element based on schema.

#### Parameters

##### schema

`ExtractValueSchema`

Value extraction schema.

##### context

The element context.

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_extractValue`](FetchEngine.md#_extractvalue)

***

### \_getSpecificCrawlerOptions()

> `protected` **\_getSpecificCrawlerOptions**(`ctx`): `CheerioCrawlerOptions`

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:402](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L402)

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

### \_isImplicitObject()

> `protected` **\_isImplicitObject**(`schema`): `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:344](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L344)

#### Parameters

##### schema

`any`

#### Returns

`boolean`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_isImplicitObject`](FetchEngine.md#_isimplicitobject)

***

### \_isSameElement()

> `protected` **\_isSameElement**(`context1`, `context2`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:139](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L139)

**`Internal`**

Checks if two elements are the same.

#### Parameters

##### context1

###### el

`Cheerio`

##### context2

###### el

`Cheerio`

#### Returns

`Promise`\<`boolean`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_isSameElement`](FetchEngine.md#_issameelement)

***

### \_nextSiblingsUntil()

> `protected` **\_nextSiblingsUntil**(`context`, `untilSelector?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:118](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L118)

**`Internal`**

Gets all subsequent siblings of an element until a sibling matches the selector.
Used in 'segmented' extraction mode.

#### Parameters

##### context

###### $

`CheerioAPI`

###### el

`Cheerio`

##### untilSelector?

`string`

Optional selector that marks the end of the segment.

#### Returns

`Promise`\<`any`[]\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_nextSiblingsUntil`](FetchEngine.md#_nextsiblingsuntil)

***

### \_normalizeArrayMode()

> `protected` **\_normalizeArrayMode**(`mode?`): `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:455](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L455)

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

### \_normalizeSchema()

> `protected` **\_normalizeSchema**(`schema`): `ExtractSchema`

Defined in: [packages/web-fetcher/src/engine/base.ts:867](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L867)

#### Parameters

##### schema

`ExtractSchema`

#### Returns

`ExtractSchema`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_normalizeSchema`](FetchEngine.md#_normalizeschema)

***

### \_parentElement()

> `protected` **\_parentElement**(`context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:129](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L129)

**`Internal`**

Gets the parent element of the given element.

#### Parameters

##### context

###### $

`CheerioAPI`

###### el

`Cheerio`

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_parentElement`](FetchEngine.md#_parentelement)

***

### \_querySelectorAll()

> `protected` **\_querySelectorAll**(`context`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:95](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L95)

**`Internal`**

Finds all elements matching the selector within the given context.

#### Parameters

##### context

The context to search in (Engine-specific element/node or array of nodes).

`any`[] | \{ `$`: `CheerioAPI`; `el`: `any`; \}

##### selector

`string`

CSS selector.

#### Returns

`Promise`\<`any`[]\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_querySelectorAll`](FetchEngine.md#_queryselectorall)

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1196](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1196)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1156](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1156)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1302](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1302)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:723](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L723)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1084](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1084)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cleanup`](FetchEngine.md#cleanup)

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:817](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L817)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1418](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1418)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1419](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1419)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1219](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1219)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1454](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1454)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispose`](FetchEngine.md#dispose)

***

### executeAction()

> `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:183](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L183)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:862](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L862)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:829](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L829)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1316](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1316)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:921](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L921)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getState`](FetchEngine.md#getstate)

***

### goto()

> **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/cheerio.ts:422](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/cheerio.ts#L422)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1357](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1357)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1358](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1358)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1359](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1359)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1363](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1363)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:953](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L953)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:852](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L852)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:841](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L841)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:806](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L806)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:231](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L231)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:204](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L204)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:214](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L214)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:191](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L191)

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
