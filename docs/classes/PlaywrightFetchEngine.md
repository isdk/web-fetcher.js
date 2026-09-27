[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PlaywrightFetchEngine

# Class: PlaywrightFetchEngine

Defined in: [packages/web-fetcher/src/engine/playwright.ts:20](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L20)

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

### \_inFlightCrawlerTasks

> `protected` **\_inFlightCrawlerTasks**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:575](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L575)

Number of crawler task invocations (`_runTaskFunction`) that have not
settled yet. See dropStoragesWhenSettled for why this is needed.

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_inFlightCrawlerTasks`](FetchEngine.md#_inflightcrawlertasks)

***

### \_initialCookies?

> `protected` `optional` **\_initialCookies?**: [`Cookie`](../interfaces/Cookie.md)[]

Defined in: [packages/web-fetcher/src/engine/base.ts:583](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L583)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initialCookies`](FetchEngine.md#_initialcookies)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:584](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L584)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_initializedSessions`](FetchEngine.md#_initializedsessions)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:588](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L588)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionEmitter`](FetchEngine.md#actionemitter)

***

### actionQueue

> `protected` **actionQueue**: [`DispatchedEngineAction`](../interfaces/DispatchedEngineAction.md)[] = `[]`

Defined in: [packages/web-fetcher/src/engine/base.ts:595](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L595)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`actionQueue`](FetchEngine.md#actionqueue)

***

### activeContext?

> `protected` `optional` **activeContext?**: `PlaywrightCrawlingContext`\<`Dictionary`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:592](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L592)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`activeContext`](FetchEngine.md#activecontext)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:598](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L598)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`blockedTypes`](FetchEngine.md#blockedtypes)

***

### cacheStoragePath?

> `protected` `optional` **cacheStoragePath?**: `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:597](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L597)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cacheStoragePath`](FetchEngine.md#cachestoragepath)

***

### config?

> `protected` `optional` **config?**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:576](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L576)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`config`](FetchEngine.md#config)

***

### crawler?

> `protected` `optional` **crawler?**: `PlaywrightCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:568](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L568)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawler`](FetchEngine.md#crawler)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise?**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:570](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L570)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`crawlerRunPromise`](FetchEngine.md#crawlerrunpromise)

***

### ctx?

> `protected` `optional` **ctx?**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:566](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L566)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`ctx`](FetchEngine.md#ctx)

***

### currentMousePos

> `protected` **currentMousePos**: `object`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:527](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L527)

#### x

> **x**: `number` = `0`

#### y

> **y**: `number` = `0`

***

### currentSession?

> `protected` `optional` **currentSession?**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:585](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L585)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`currentSession`](FetchEngine.md#currentsession)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:582](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L582)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`hdrs`](FetchEngine.md#hdrs)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady?**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:569](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L569)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isCrawlerReady`](FetchEngine.md#iscrawlerready)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:590](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L590)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isEngineDisposed`](FetchEngine.md#isenginedisposed)

***

### isExecutingAction

> `protected` **isExecutingAction**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:593](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L593)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isExecutingAction`](FetchEngine.md#isexecutingaction)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:589](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L589)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isPageActive`](FetchEngine.md#ispageactive)

***

### isProcessingActionLoop

> `protected` **isProcessingActionLoop**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:596](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L596)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isProcessingActionLoop`](FetchEngine.md#isprocessingactionloop)

***

### kvStore?

> `protected` `optional` **kvStore?**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:578](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L578)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`kvStore`](FetchEngine.md#kvstore)

***

### lastResponse?

> `protected` `optional` **lastResponse?**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:594](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L594)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`lastResponse`](FetchEngine.md#lastresponse)

***

### mouseInitialized

> `protected` **mouseInitialized**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:560](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L560)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:591](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L591)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`navigationLock`](FetchEngine.md#navigationlock)

***

### opts?

> `protected` `optional` **opts?**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:567](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L567)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`opts`](FetchEngine.md#opts)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:586](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L586)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`pendingRequests`](FetchEngine.md#pendingrequests)

***

### preNavigationHooks

> `protected` **preNavigationHooks**: `any`[] = `[]`

Defined in: [packages/web-fetcher/src/engine/base.ts:580](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L580)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`preNavigationHooks`](FetchEngine.md#prenavigationhooks)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration?**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:579](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L579)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`proxyConfiguration`](FetchEngine.md#proxyconfiguration)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:587](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L587)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestCounter`](FetchEngine.md#requestcounter)

***

### requestQueue?

> `protected` `optional` **requestQueue?**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:577](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L577)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`requestQueue`](FetchEngine.md#requestqueue)

***

### id

> `readonly` `static` **id**: `"playwright"` = `'playwright'`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:25](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L25)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id)

***

### mode

> `readonly` `static` **mode**: `"browser"` = `'browser'`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:26](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L26)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode)

## Accessors

### context

#### Get Signature

> **get** **context**(): [`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

Defined in: [packages/web-fetcher/src/engine/base.ts:1172](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1172)

Gets the fetch engine context associated with this instance.

##### Returns

[`FetchEngineContext`](../interfaces/FetchEngineContext.md) \| `undefined`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`context`](FetchEngine.md#context)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:1147](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1147)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`id`](FetchEngine.md#id-1)

***

### isAlive

#### Get Signature

> **get** **isAlive**(): `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:600](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L600)

##### Returns

`boolean`

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`isAlive`](FetchEngine.md#isalive)

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:1165](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1165)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mode`](FetchEngine.md#mode-1)

## Methods

### \_applyPreNavigationHooks()

> `protected` **\_applyPreNavigationHooks**(`context`, `gotOptions`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:916](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L916)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### gotOptions

`any`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_applyPreNavigationHooks`](FetchEngine.md#_applyprenavigationhooks)

***

### \_buildResponse()

> `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:28](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L28)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:612](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L612)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_cleanup`](FetchEngine.md#_cleanup)

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1827](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1827)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_commonCleanup`](FetchEngine.md#_commoncleanup)

***

### \_contains()

> **\_contains**(`container`, `element`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:200](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L200)

**`Internal`**

Checks if the `container` scope contains the `element` scope.

#### Parameters

##### container

`Locator`

The potential ancestor element.

##### element

`Locator`

The potential descendant element.

#### Returns

`Promise`\<`boolean`\>

A promise resolving to `true` if `container` contains `element`.

#### See

IExtractEngine.\_contains for implementation details.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_contains`](FetchEngine.md#_contains)

***

### \_createCrawler()

> `protected` **\_createCrawler**(`options`, `config?`): `PlaywrightCrawler`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:1165](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L1165)

**`Internal`**

Creates the crawler instance for the specific engine implementation.

#### Parameters

##### options

`PlaywrightCrawlerOptions`

The final crawler options.

##### config?

`Configuration`

#### Returns

`PlaywrightCrawler`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_createCrawler`](FetchEngine.md#_createcrawler)

***

### \_enrichResponse()

> `protected` **\_enrichResponse**(`context`, `result`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:863](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L863)

**`Internal`**

为 [FetchResponse] 补充统一字段：contentType、cookies、sessionState、metadata 等。

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### result

[`FetchResponse`](../interfaces/FetchResponse.md)

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

#### Remarks

供各引擎构建响应后统一调用；非页面响应（如浏览器捕获的下载）也可复用。

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_enrichResponse`](FetchEngine.md#_enrichresponse)

***

### \_ensureVisible()

> `protected` **\_ensureVisible**(`context`, `selector`): `Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:766](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L766)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### selector

`string`

#### Returns

`Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

***

### \_executePendingActions()

> `protected` **\_executePendingActions**(`context`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1491](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1491)

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

> `protected` **\_extract**(`schema`, `scope`, `parentStrict?`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:755](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L755)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:797](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L797)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:780](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L780)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:814](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L814)

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:353](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L353)

**`Internal`**

Extracts a primitive value from the element based on schema.

#### Parameters

##### schema

`ExtractValueSchema`

Value extraction schema.

##### scope

`Locator`

The element scope.

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:164](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L164)

**`Internal`**

Finds the closest ancestor of `scope` (including itself) that exists in the `candidates` array.

#### Parameters

##### scope

`Locator`

The starting element.

##### candidates

`Locator`[]

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:212](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L212)

**`Internal`**

Finds the Lowest Common Ancestor (LCA) of two element scopes.

#### Parameters

##### scope1

`Locator`

The first element scope.

##### scope2

`Locator`

The second element scope.

#### Returns

`Promise`\<`any`\>

A promise resolving to the LCA element scope, or `null` if none found.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_findCommonAncestor`](FetchEngine.md#_findcommonancestor)

***

### \_findContainerChild()

> **\_findContainerChild**(`element`, `container`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:285](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L285)

**`Internal`**

Finds the direct child of container that contains element.

#### Parameters

##### element

`Locator`

The descendant element.

##### container

`Locator`

The container element.

#### Returns

`Promise`\<`any`\>

The child element of container, or null.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_findContainerChild`](FetchEngine.md#_findcontainerchild)

***

### \_getInitialElementScope()

> `protected` **\_getInitialElementScope**(`context`): `any`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:397](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L397)

**`Internal`**

Gets the initial scope for extraction for the specific engine.

#### Parameters

##### context

`PlaywrightCrawlingContext`

Crawlee crawling context

#### Returns

`any`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_getInitialElementScope`](FetchEngine.md#_getinitialelementscope)

***

### \_getSpecificCrawlerOptions()

> `protected` **\_getSpecificCrawlerOptions**(`ctx`): `Promise`\<`Partial`\<`PlaywrightCrawlerOptions`\>\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:1183](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L1183)

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

### \_getTrajectory()

> `protected` **\_getTrajectory**(`start`, `end`, `steps?`): `object`[]

Defined in: [packages/web-fetcher/src/engine/playwright.ts:669](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L669)

#### Parameters

##### start

###### x

`number`

###### y

`number`

##### end

###### x

`number`

###### y

`number`

##### steps?

`number` = `-1`

#### Returns

`object`[]

***

### \_getTrimInfo()

> `protected` **\_getTrimInfo**(`options`): `object`

Defined in: [packages/web-fetcher/src/engine/base.ts:614](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L614)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1451](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1451)

#### Parameters

##### action

###### message?

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_handlePause`](FetchEngine.md#_handlepause)

***

### \_initializeMousePos()

> `protected` **\_initializeMousePos**(`page`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:638](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L638)

#### Parameters

##### page

`Page`

#### Returns

`Promise`\<`void`\>

***

### \_isSameElement()

> **\_isSameElement**(`scope1`, `scope2`): `Promise`\<`boolean`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:151](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L151)

**`Internal`**

Checks if two elements are the same identity.

#### Parameters

##### scope1

`Locator`

First element scope.

##### scope2

`Locator`

Second element scope.

#### Returns

`Promise`\<`boolean`\>

True if they are the same DOM node.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_isSameElement`](FetchEngine.md#_issameelement)

***

### \_logDebug()

> **\_logDebug**(`category`, ...`args`): `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:604](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L604)

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

### \_moveToPos()

> `protected` **\_moveToPos**(`context`, `target`, `steps?`): `Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:706](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L706)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### target

###### x

`number`

###### y

`number`

##### steps?

`number` = `-1`

#### Returns

`Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

***

### \_moveToSelector()

> `protected` **\_moveToSelector**(`context`, `selector`, `steps?`): `Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:787](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L787)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### selector

`string`

##### steps?

`number` = `-1`

#### Returns

`Promise`\<\{ `x`: `number`; `y`: `number`; \}\>

***

### \_nextSiblingsUntil()

> **\_nextSiblingsUntil**(`scope`, `untilSelector?`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:128](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L128)

**`Internal`**

Gets all subsequent siblings of an element until a sibling matches the selector.
Used in 'segmented' extraction mode.

#### Parameters

##### scope

`Locator`

The anchor element scope.

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

Defined in: [packages/web-fetcher/src/engine/base.ts:768](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L768)

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:145](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L145)

**`Internal`**

Gets the parent element of the given element.

#### Parameters

##### scope

`Locator`

The element scope.

#### Returns

`Promise`\<`any`\>

Parent element or null.

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_parentElement`](FetchEngine.md#_parentelement)

***

### \_processAction()

> `protected` **\_processAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1422](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1422)

**`Internal`**

Unified action processor that handles engine-agnostic actions.

#### Parameters

##### context

`PlaywrightCrawlingContext`

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:88](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L88)

**`Internal`**

Finds all elements matching the selector within the given scope.

#### Parameters

##### scope

`Locator` \| `Locator`[]

The scope to search in (Engine-specific element/node or array of nodes).

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

### \_resolveWaitUntil()

> `protected` **\_resolveWaitUntil**(`opts?`): `NonNullable`\<`"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"` \| `undefined`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:1175](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L1175)

解析导航 waitUntil：action 参数 > browser.waitUntil 全局配置 > 'domcontentloaded'。

#### Parameters

##### opts?

[`GotoActionOptions`](../interfaces/GotoActionOptions.md)

#### Returns

`NonNullable`\<`"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"` \| `undefined`\>

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:545](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L545)

#### Parameters

##### context

`PlaywrightCrawlingContext`\<`Dictionary`\> & `object`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_sharedFailedRequestHandler`](FetchEngine.md#_sharedfailedrequesthandler)

***

### \_sharedRequestHandler()

> `protected` **\_sharedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:529](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L529)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### error?

`Error`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`FetchEngine`](FetchEngine.md).[`_sharedRequestHandler`](FetchEngine.md#_sharedrequesthandler)

***

### \_toAbortError()

> `protected` **\_toAbortError**(`error`): `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:1807](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1807)

**`Internal`**

将底层清理/取消错误规范化为 AbortError。

#### Parameters

##### error

`any`

#### Returns

`any`

#### Remarks

引擎清理（`_commonCleanup`）会取消 pending 请求（"Cleanup:Request cancelled"），
浏览器引擎导航被中断时会抛 Playwright 的中断类错误。这些错误对调用方而言都应
表现为可识别的中断错误（`name === 'AbortError'` / `code === ErrorCode.Aborted`），
以便上层（如搜索引擎并发竞争）与真实失败区分开来。

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`_toAbortError`](FetchEngine.md#_toaborterror)

***

### \_waitForNavigation()

> `protected` **\_waitForNavigation**(`context`, `oldUrl`, `actionType`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:409](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L409)

#### Parameters

##### context

`PlaywrightCrawlingContext`

##### oldUrl

`string`

##### actionType

`string`

#### Returns

`Promise`\<`void`\>

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1940](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1940)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:851](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L851)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1392](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1392)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`cleanup`](FetchEngine.md#cleanup)

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:981](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L981)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:2056](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L2056)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:2057](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L2057)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1767](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1767)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:2092](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L2092)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`dispose`](FetchEngine.md#dispose)

***

### evaluate()

> **evaluate**(`params`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1126](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1126)

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

Defined in: [packages/web-fetcher/src/engine/playwright.ts:796](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L796)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1136](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1136)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1070](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1070)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1954](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1954)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1155](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1155)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`getState`](FetchEngine.md#getstate)

***

### goto()

> **goto**(`url`, `opts?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/playwright.ts:1280](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L1280)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1995](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1995)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1996](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1996)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1997](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1997)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:2001](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L2001)

Manages HTTP headers for requests with multiple overloads.

Gets all headers.

##### Parameters

###### name

`string`

Header name

###### value

`string` \| `null`

Header value or `null` to remove

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1187](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1187)

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

### isPageContextValid()

> `protected` **isPageContextValid**(`context`): `boolean`

Defined in: [packages/web-fetcher/src/engine/playwright.ts:405](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/playwright.ts#L405)

#### Parameters

##### context

`PlaywrightCrawlingContext`

#### Returns

`boolean`

#### Overrides

[`FetchEngine`](FetchEngine.md).[`isPageContextValid`](FetchEngine.md#ispagecontextvalid)

***

### keyboardPress()

> **keyboardPress**(`key`, `delay?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1055](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1055)

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

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`keyboardPress`](FetchEngine.md#keyboardpress)

***

### keyboardType()

> **keyboardType**(`text`, `delay?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1045](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1045)

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

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`keyboardType`](FetchEngine.md#keyboardtype)

***

### mouseClick()

> **mouseClick**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1004](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1004)

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

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mouseClick`](FetchEngine.md#mouseclick)

***

### mouseMove()

> **mouseMove**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:990](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L990)

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

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mouseMove`](FetchEngine.md#mousemove)

***

### mouseWheel()

> **mouseWheel**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1019](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1019)

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

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`mouseWheel`](FetchEngine.md#mousewheel)

***

### pause()

> **pause**(`message?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1104](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1104)

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

### scrollIntoView()

> **scrollIntoView**(`params`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1035](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1035)

Scrolls the element into view.

#### Parameters

##### params

Scroll parameters (selector)

###### selector

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`FetchEngine`](FetchEngine.md).[`scrollIntoView`](FetchEngine.md#scrollintoview)

***

### submit()

> **submit**(`selector?`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:1082](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1082)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:1093](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L1093)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:970](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L970)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:530](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L530)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:503](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L503)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:513](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L513)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:490](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L490)

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
