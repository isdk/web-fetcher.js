[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngine

# Abstract Class: FetchEngine\<TContext, TCrawler, TOptions\>

Defined in: [packages/web-fetcher/src/engine/base.ts:172](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L172)

## Extended by

- [`CheerioFetchEngine`](CheerioFetchEngine.md)
- [`PlaywrightFetchEngine`](PlaywrightFetchEngine.md)

## Type Parameters

### TContext

`TContext` *extends* `CrawlingContext` = `any`

### TCrawler

`TCrawler` *extends* `BasicCrawler`\<`TContext`\> = `any`

### TOptions

`TOptions` *extends* `BasicCrawlerOptions`\<`TContext`\> = `any`

## Constructors

### Constructor

> **new FetchEngine**\<`TContext`, `TCrawler`, `TOptions`\>(): `FetchEngine`\<`TContext`, `TCrawler`, `TOptions`\>

#### Returns

`FetchEngine`\<`TContext`, `TCrawler`, `TOptions`\>

## Properties

### \_initialCookies?

> `protected` `optional` **\_initialCookies**: [`Cookie`](../interfaces/Cookie.md)[]

Defined in: [packages/web-fetcher/src/engine/base.ts:278](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L278)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:279](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L279)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:283](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L283)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:288](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L288)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:272](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L272)

***

### crawler?

> `protected` `optional` **crawler**: `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:269](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L269)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:271](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L271)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:267](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L267)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:280](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L280)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:277](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L277)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:270](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L270)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:285](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L285)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:284](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L284)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:274](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L274)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:287](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L287)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:286](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L286)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:268](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L268)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:281](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L281)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:275](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L275)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:282](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L282)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:273](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L273)

***

### id

> `readonly` `static` **id**: `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:257](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L257)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

***

### mode

> `readonly` `static` **mode**: [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:265](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L265)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

## Accessors

### context

#### Get Signature

> **get** **context**(): `undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:938](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L938)

Gets the fetch engine context associated with this instance.

##### Returns

`undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:913](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L913)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:931](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L931)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

## Methods

### \_buildResponse()

> `abstract` `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:722](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L722)

**`Internal`**

Abstract method for building standard [FetchResponse] from Crawlee context.

#### Parameters

##### context

`TContext`

Crawlee crawling context

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to [FetchResponse] object

#### Remarks

Converts implementation-specific context (Playwright `page` or Cheerio `$`) to standardized response.

***

### \_cleanup()?

> `protected` `optional` **\_cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:290](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L290)

#### Returns

`Promise`\<`void`\>

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1239](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1239)

#### Returns

`Promise`\<`void`\>

***

### \_createCrawler()

> `abstract` `protected` **\_createCrawler**(`options`, `config?`): `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:699](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L699)

**`Internal`**

Creates the crawler instance for the specific engine implementation.

#### Parameters

##### options

`TOptions`

The final crawler options.

##### config?

`Configuration`

#### Returns

`TCrawler`

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

`TContext`

The active Crawlee crawling context containing the page/$ object

#### Returns

`Promise`\<`void`\>

#### See

[\_sharedRequestHandler](#_sharedrequesthandler)

#### Throws

If called outside valid page context window (`!this.isPageActive`)
 Engine infrastructure method - not for direct consumer use

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

***

### \_extractValue()

> `abstract` `protected` **\_extractValue**(`schema`, `context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:309](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L309)

**`Internal`**

Extracts a primitive value from the element based on schema.

#### Parameters

##### schema

`ExtractValueSchema`

Value extraction schema.

##### context

`any`

The element context.

#### Returns

`Promise`\<`any`\>

***

### \_getSpecificCrawlerOptions()

> `abstract` `protected` **\_getSpecificCrawlerOptions**(`ctx`): `Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

Defined in: [packages/web-fetcher/src/engine/base.ts:709](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L709)

**`Internal`**

Gets the crawler-specific options from the subclass.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

The fetch engine context.

#### Returns

`Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

***

### \_isImplicitObject()

> `protected` **\_isImplicitObject**(`schema`): `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:344](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L344)

#### Parameters

##### schema

`any`

#### Returns

`boolean`

***

### \_isSameElement()

> `abstract` `protected` **\_isSameElement**(`element1`, `element2`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:327](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L327)

**`Internal`**

Checks if two elements are the same.

#### Parameters

##### element1

`any`

First element.

##### element2

`any`

Second element.

#### Returns

`Promise`\<`boolean`\>

***

### \_nextSiblingsUntil()

> `abstract` `protected` **\_nextSiblingsUntil**(`element`, `untilSelector?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:339](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L339)

**`Internal`**

Gets all subsequent siblings of an element until a sibling matches the selector.
Used in 'segmented' extraction mode.

#### Parameters

##### element

`any`

The anchor element.

##### untilSelector?

`string`

Optional selector that marks the end of the segment.

#### Returns

`Promise`\<`any`[]\>

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

***

### \_normalizeSchema()

> `protected` **\_normalizeSchema**(`schema`): `ExtractSchema`

Defined in: [packages/web-fetcher/src/engine/base.ts:867](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L867)

#### Parameters

##### schema

`ExtractSchema`

#### Returns

`ExtractSchema`

***

### \_parentElement()

> `abstract` `protected` **\_parentElement**(`element`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:319](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L319)

**`Internal`**

Gets the parent element of the given element.

#### Parameters

##### element

`any`

The element.

#### Returns

`Promise`\<`any`\>

***

### \_querySelectorAll()

> `abstract` `protected` **\_querySelectorAll**(`context`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:298](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L298)

**`Internal`**

Finds all elements matching the selector within the given context.

#### Parameters

##### context

`any`

The context to search in (Engine-specific element/node or array of nodes).

##### selector

`string`

CSS selector.

#### Returns

`Promise`\<`any`[]\>

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1196](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1196)

#### Parameters

##### context

`TContext`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

***

### \_sharedRequestHandler()

> `protected` **\_sharedRequestHandler**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1156](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1156)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<`void`\>

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

***

### buildResponse()

> `protected` **buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:723](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L723)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

***

### cleanup()

> **cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1084](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1084)

#### Returns

`Promise`\<`void`\>

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

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1454](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L1454)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

***

### executeAction()

> `abstract` `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:772](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L772)

**`Internal`**

Abstract method for executing action within current page context.

#### Parameters

##### context

`TContext`

Crawlee crawling context

##### action

[`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Action to execute

#### Returns

`Promise`\<`any`\>

Promise resolving to action result

#### Remarks

Handles specific user interactions using underlying technology (Playwright/Cheerio).

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

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

Defined in: [packages/web-fetcher/src/engine/base.ts:921](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L921)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

***

### goto()

> `abstract` **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:789](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/engine/base.ts#L789)

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
