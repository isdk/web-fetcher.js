[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngine

# Abstract Class: FetchEngine\<TContext, TCrawler, TOptions\>

Defined in: [packages/web-fetcher/src/engine/base.ts:302](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L302)

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

## Implements

- `IExtractEngine`

## Constructors

### Constructor

> **new FetchEngine**\<`TContext`, `TCrawler`, `TOptions`\>(): `FetchEngine`\<`TContext`, `TCrawler`, `TOptions`\>

#### Returns

`FetchEngine`\<`TContext`, `TCrawler`, `TOptions`\>

## Properties

### \_initialCookies?

> `protected` `optional` **\_initialCookies**: [`Cookie`](../interfaces/Cookie.md)[]

Defined in: [packages/web-fetcher/src/engine/base.ts:409](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L409)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:410](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L410)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:414](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L414)

***

### actionQueue

> `protected` **actionQueue**: [`DispatchedEngineAction`](../interfaces/DispatchedEngineAction.md)[] = `[]`

Defined in: [packages/web-fetcher/src/engine/base.ts:421](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L421)

***

### activeContext?

> `protected` `optional` **activeContext**: `TContext`

Defined in: [packages/web-fetcher/src/engine/base.ts:418](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L418)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:423](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L423)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:403](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L403)

***

### crawler?

> `protected` `optional` **crawler**: `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:400](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L400)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:402](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L402)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:398](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L398)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:411](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L411)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:408](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L408)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:401](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L401)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:416](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L416)

***

### isExecutingAction

> `protected` **isExecutingAction**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:419](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L419)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:415](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L415)

***

### isProcessingActionLoop

> `protected` **isProcessingActionLoop**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:422](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L422)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:405](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L405)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:420](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L420)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:417](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L417)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:399](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L399)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:412](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L412)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:406](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L406)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:413](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L413)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:404](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L404)

***

### id

> `readonly` `static` **id**: `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:388](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L388)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

***

### mode

> `readonly` `static` **mode**: [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:396](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L396)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

## Accessors

### context

#### Get Signature

> **get** **context**(): [`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:963](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L963)

Gets the fetch engine context associated with this instance.

##### Returns

[`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:938](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L938)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:956](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L956)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

## Methods

### \_buildResponse()

> `abstract` `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:671](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L671)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:433](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L433)

#### Returns

`Promise`\<`void`\>

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1395](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1395)

#### Returns

`Promise`\<`void`\>

***

### \_contains()

> `abstract` **\_contains**(`container`, `element`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:545](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L545)

**`Internal`**

Checks if the `container` scope contains the `element` scope.

#### Parameters

##### container

`any`

The potential ancestor element.

##### element

`any`

The potential descendant element.

#### Returns

`Promise`\<`boolean`\>

A promise resolving to `true` if `container` contains `element`.

#### See

IExtractEngine.\_contains for implementation details.

#### Implementation of

`IExtractEngine._contains`

***

### \_createCrawler()

> `abstract` `protected` **\_createCrawler**(`options`, `config?`): `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:648](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L648)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1206](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1206)

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

> `protected` **\_extract**(`schema`, `scope`, `parentStrict?`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:576](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L576)

#### Parameters

##### schema

`ExtractSchema`

##### scope

`any`

##### parentStrict?

`boolean`

#### Returns

`Promise`\<`any`\>

***

### \_extractColumnar()

> `protected` **\_extractColumnar**(`schema`, `container`, `opts?`): `Promise`\<`any`[] \| `null`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:618](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L618)

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

***

### \_extractNested()

> `protected` **\_extractNested**(`items`, `elements`, `opts?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:601](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L601)

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

***

### \_extractSegmented()

> `protected` **\_extractSegmented**(`schema`, `container`, `opts?`): `Promise`\<`any`[] \| `null`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:635](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L635)

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

***

### \_extractValue()

> `abstract` **\_extractValue**(`schema`, `scope`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:479](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L479)

**`Internal`**

Extracts a primitive value from the element based on schema.

#### Parameters

##### schema

`ExtractValueSchema`

Value extraction schema.

##### scope

`any`

The element scope.

#### Returns

`Promise`\<`any`\>

Extracted value.

#### See

IExtractEngine.\_extractValue for behavior contract.

#### Implementation of

`IExtractEngine._extractValue`

***

### \_findClosestAncestor()

> `abstract` **\_findClosestAncestor**(`scope`, `candidates`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:531](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L531)

**`Internal`**

Finds the closest ancestor of `scope` (including itself) that exists in the `candidates` array.

#### Parameters

##### scope

`any`

The starting element.

##### candidates

`any`[]

The array of potential ancestor scopes.

#### Returns

`Promise`\<`any`\>

A promise resolving to the matching candidate scope, or `null` if none found.

#### See

IExtractEngine.\_findClosestAncestor for implementation details.

#### Implementation of

`IExtractEngine._findClosestAncestor`

***

### \_findCommonAncestor()

> `abstract` **\_findCommonAncestor**(`scope1`, `scope2`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:558](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L558)

**`Internal`**

Finds the Lowest Common Ancestor (LCA) of two element scopes.

#### Parameters

##### scope1

`any`

The first element scope.

##### scope2

`any`

The second element scope.

#### Returns

`Promise`\<`any`\>

A promise resolving to the LCA element scope, or `null` if none found.

#### Implementation of

`IExtractEngine._findCommonAncestor`

***

### \_findContainerChild()

> `abstract` **\_findContainerChild**(`element`, `container`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:571](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L571)

**`Internal`**

Finds the direct child of container that contains element.

#### Parameters

##### element

`any`

The descendant element.

##### container

`any`

The container element.

#### Returns

`Promise`\<`any`\>

The child element of container, or null.

#### Implementation of

`IExtractEngine._findContainerChild`

***

### \_getInitialElementScope()

> `abstract` `protected` **\_getInitialElementScope**(`context`): `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:1127](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1127)

**`Internal`**

Gets the initial scope for extraction for the specific engine.

#### Parameters

##### context

`TContext`

Crawlee crawling context

#### Returns

`any`

***

### \_getSpecificCrawlerOptions()

> `abstract` `protected` **\_getSpecificCrawlerOptions**(`ctx`): `Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

Defined in: [packages/web-fetcher/src/engine/base.ts:658](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L658)

**`Internal`**

Gets the crawler-specific options from the subclass.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

The fetch engine context.

#### Returns

`Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

***

### \_getTrimInfo()

> `protected` **\_getTrimInfo**(`options`): `object`

Defined in: [packages/web-fetcher/src/engine/base.ts:435](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L435)

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

***

### \_handlePause()

> `protected` **\_handlePause**(`action`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1166](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1166)

#### Parameters

##### action

###### message?

`string`

#### Returns

`Promise`\<`void`\>

***

### \_isSameElement()

> `abstract` **\_isSameElement**(`scope1`, `scope2`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:503](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L503)

**`Internal`**

Checks if two elements are the same identity.

#### Parameters

##### scope1

`any`

First element scope.

##### scope2

`any`

Second element scope.

#### Returns

`Promise`\<`boolean`\>

True if they are the same DOM node.

#### Implementation of

`IExtractEngine._isSameElement`

***

### \_logDebug()

> **\_logDebug**(`category`, ...`args`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:425](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L425)

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

#### Implementation of

`IExtractEngine._logDebug`

***

### \_nextSiblingsUntil()

> `abstract` **\_nextSiblingsUntil**(`scope`, `untilSelector?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:517](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L517)

**`Internal`**

Gets all subsequent siblings of an element until a sibling matches the selector.
Used in 'segmented' extraction mode.

#### Parameters

##### scope

`any`

The anchor element scope.

##### untilSelector?

`string`

Optional selector that marks the end of the segment (exclusive).

#### Returns

`Promise`\<`any`[]\>

List of sibling elements between anchor and untilSelector.

#### Implementation of

`IExtractEngine._nextSiblingsUntil`

***

### \_normalizeArrayMode()

> `protected` **\_normalizeArrayMode**(`mode?`): `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:589](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L589)

**`Internal`**

Normalizes the array extraction mode into an options object.

#### Parameters

##### mode?

`ExtractArrayMode`

The mode string or options object.

#### Returns

`any`

***

### \_parentElement()

> `abstract` **\_parentElement**(`scope`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:491](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L491)

**`Internal`**

Gets the parent element of the given element.

#### Parameters

##### scope

`any`

The element scope.

#### Returns

`Promise`\<`any`\>

Parent element or null.

#### Implementation of

`IExtractEngine._parentElement`

***

### \_processAction()

> `protected` **\_processAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1137](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1137)

**`Internal`**

Unified action processor that handles engine-agnostic actions.

#### Parameters

##### context

`TContext`

Crawlee crawling context

##### action

[`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Action to execute

#### Returns

`Promise`\<`any`\>

***

### \_querySelectorAll()

> `abstract` **\_querySelectorAll**(`scope`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:465](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L465)

**`Internal`**

Finds all elements matching the selector within the given scope.

#### Parameters

##### scope

`any`

The scope to search in (Engine-specific element/node or array of nodes).

##### selector

`string`

CSS selector.

#### Returns

`Promise`\<`any`[]\>

List of matching elements.

#### See

IExtractEngine.\_querySelectorAll for behavior contract.

#### Implementation of

`IExtractEngine._querySelectorAll`

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1319](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1319)

#### Parameters

##### context

`TContext` & `object`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

***

### \_sharedRequestHandler()

> `protected` **\_sharedRequestHandler**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1272](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1272)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<`void`\>

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1459](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1459)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:672](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L672)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

***

### cleanup()

> **cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1109](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1109)

#### Returns

`Promise`\<`void`\>

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:772](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L772)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1575](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1575)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1576](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1576)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1366](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1366)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1611](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1611)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

***

### evaluate()

> **evaluate**(`params`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:917](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L917)

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

***

### executeAction()

> `abstract` `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:727](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L727)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:927](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L927)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:861](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L861)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1473](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1473)

Gets content of current page.

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to fetch response

#### Throws

When no content has been fetched yet

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

Defined in: [packages/web-fetcher/src/engine/base.ts:946](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L946)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

***

### goto()

> `abstract` **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:744](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L744)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1514](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1514)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1515](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1515)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1516](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1516)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1520](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L1520)

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

***

### initialize()

> **initialize**(`context`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:978](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L978)

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

### keyboardPress()

> **keyboardPress**(`key`, `delay?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:846](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L846)

Presses specified key.

#### Parameters

##### key

`string`

Key to press

##### delay?

`number`

Delay after key press

#### Returns

`Promise`\<`void`\>

***

### keyboardType()

> **keyboardType**(`text`, `delay?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:836](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L836)

Types text into current focused element.

#### Parameters

##### text

`string`

Text to type

##### delay?

`number`

Delay between key presses

#### Returns

`Promise`\<`void`\>

***

### mouseClick()

> **mouseClick**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:795](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L795)

Clicks at current position or specified position.

#### Parameters

##### params

Click parameters (x, y, button, clickCount, delay)

###### button?

`"left"` \| `"right"` \| `"middle"`

###### clickCount?

`number`

###### delay?

`number`

###### x?

`number`

###### y?

`number`

#### Returns

`Promise`\<`void`\>

***

### mouseMove()

> **mouseMove**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:781](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L781)

Moves mouse to specified position or element.

#### Parameters

##### params

Move parameters (x, y, selector, steps)

###### selector?

`string`

###### steps?

`number`

###### x?

`number`

###### y?

`number`

#### Returns

`Promise`\<`void`\>

***

### mouseWheel()

> **mouseWheel**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:810](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L810)

Scrolls the mouse wheel.

#### Parameters

##### params

Wheel parameters (x, y, selector, deltaX, deltaY, steps)

###### deltaX?

`number`

###### deltaY?

`number`

###### selector?

`string`

###### steps?

`number`

###### x?

`number`

###### y?

`number`

#### Returns

`Promise`\<`void`\>

***

### pause()

> **pause**(`message?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:895](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L895)

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

### scrollIntoView()

> **scrollIntoView**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:826](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L826)

Scrolls the element into view.

#### Parameters

##### params

Scroll parameters (selector)

###### selector

`string`

#### Returns

`Promise`\<`void`\>

***

### submit()

> **submit**(`selector?`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:873](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L873)

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

### trim()

> **trim**(`options`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:884](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L884)

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

***

### waitFor()

> **waitFor**(`params?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:761](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L761)

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

> `static` **create**(`ctx`, `options?`): `Promise`\<`AnyFetchEngine` \| `undefined`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:362](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L362)

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

***

### get()

> `static` **get**(`id`): `AnyFetchEngineCtor` \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:335](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L335)

Retrieves a fetch engine implementation by its unique ID.

#### Parameters

##### id

`string`

The ID of the engine to retrieve

#### Returns

`AnyFetchEngineCtor` \| `undefined`

Engine class if found, otherwise `undefined`

***

### getByMode()

> `static` **getByMode**(`mode`): `AnyFetchEngineCtor` \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:345](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L345)

Retrieves a fetch engine implementation by execution mode.

#### Parameters

##### mode

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

Execution mode (`'http'` or `'browser'`)

#### Returns

`AnyFetchEngineCtor` \| `undefined`

Engine class if found, otherwise `undefined`

***

### register()

> `static` **register**(`engineClass`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:322](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L322)

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
