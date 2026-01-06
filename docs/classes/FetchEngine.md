[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngine

# Abstract Class: FetchEngine\<TContext, TCrawler, TOptions\>

Defined in: [packages/web-fetcher/src/engine/base.ts:144](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L144)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:241](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L241)

***

### \_initializedSessions

> `protected` **\_initializedSessions**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:242](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L242)

***

### actionEmitter

> `protected` **actionEmitter**: `EventEmitter`

Defined in: [packages/web-fetcher/src/engine/base.ts:246](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L246)

***

### blockedTypes

> `protected` **blockedTypes**: `Set`\<`string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:251](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L251)

***

### config?

> `protected` `optional` **config**: `Configuration`

Defined in: [packages/web-fetcher/src/engine/base.ts:235](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L235)

***

### crawler?

> `protected` `optional` **crawler**: `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:232](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L232)

***

### crawlerRunPromise?

> `protected` `optional` **crawlerRunPromise**: `Promise`\<`FinalStatistics`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:234](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L234)

***

### ctx?

> `protected` `optional` **ctx**: [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:230](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L230)

***

### currentSession?

> `protected` `optional` **currentSession**: `Session`

Defined in: [packages/web-fetcher/src/engine/base.ts:243](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L243)

***

### hdrs

> `protected` **hdrs**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/web-fetcher/src/engine/base.ts:240](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L240)

***

### isCrawlerReady?

> `protected` `optional` **isCrawlerReady**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:233](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L233)

***

### isEngineDisposed

> `protected` **isEngineDisposed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:248](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L248)

***

### isPageActive

> `protected` **isPageActive**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/engine/base.ts:247](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L247)

***

### kvStore?

> `protected` `optional` **kvStore**: `KeyValueStore`

Defined in: [packages/web-fetcher/src/engine/base.ts:237](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L237)

***

### lastResponse?

> `protected` `optional` **lastResponse**: [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:250](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L250)

***

### navigationLock

> `protected` **navigationLock**: `PromiseLock`

Defined in: [packages/web-fetcher/src/engine/base.ts:249](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L249)

***

### opts?

> `protected` `optional` **opts**: [`BaseFetcherProperties`](../interfaces/BaseFetcherProperties.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:231](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L231)

***

### pendingRequests

> `protected` **pendingRequests**: `Map`\<`string`, [`PendingEngineRequest`](../interfaces/PendingEngineRequest.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:244](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L244)

***

### proxyConfiguration?

> `protected` `optional` **proxyConfiguration**: `ProxyConfiguration`

Defined in: [packages/web-fetcher/src/engine/base.ts:238](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L238)

***

### requestCounter

> `protected` **requestCounter**: `number` = `0`

Defined in: [packages/web-fetcher/src/engine/base.ts:245](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L245)

***

### requestQueue?

> `protected` `optional` **requestQueue**: `RequestQueue`

Defined in: [packages/web-fetcher/src/engine/base.ts:236](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L236)

***

### id

> `readonly` `static` **id**: `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:220](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L220)

Unique identifier for the engine implementation.

#### Remarks

Must be defined by concrete implementations. Used for registration and lookup in engine registry.

***

### mode

> `readonly` `static` **mode**: [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:228](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L228)

Execution mode of the engine (`'http'` or `'browser'`).

#### Remarks

Must be defined by concrete implementations. Indicates whether engine operates at HTTP level or uses full browser.

## Accessors

### context

#### Get Signature

> **get** **context**(): `undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:528](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L528)

Gets the fetch engine context associated with this instance.

##### Returns

`undefined` \| [`FetchEngineContext`](../interfaces/FetchEngineContext.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/engine/base.ts:503](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L503)

Gets the unique identifier of this engine implementation.

##### Returns

`string`

***

### mode

#### Get Signature

> **get** **mode**(): [`FetchEngineType`](../type-aliases/FetchEngineType.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:521](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L521)

Gets the execution mode of this engine (`'http'` or `'browser'`).

##### Returns

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

## Methods

### \_buildResponse()

> `abstract` `protected` **\_buildResponse**(`context`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:326](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L326)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:253](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L253)

#### Returns

`Promise`\<`void`\>

***

### \_commonCleanup()

> `protected` **\_commonCleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:781](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L781)

#### Returns

`Promise`\<`void`\>

***

### \_createCrawler()

> `abstract` `protected` **\_createCrawler**(`options`, `config?`): `TCrawler`

Defined in: [packages/web-fetcher/src/engine/base.ts:308](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L308)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:681](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L681)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:258](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L258)

#### Parameters

##### schema

`ExtractSchema`

##### context

`any`

#### Returns

`Promise`\<`any`\>

***

### \_extractValue()

> `abstract` `protected` **\_extractValue**(`schema`, `context`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:256](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L256)

#### Parameters

##### schema

`ExtractValueSchema`

##### context

`any`

#### Returns

`Promise`\<`any`\>

***

### \_getSpecificCrawlerOptions()

> `abstract` `protected` **\_getSpecificCrawlerOptions**(`ctx`): `Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

Defined in: [packages/web-fetcher/src/engine/base.ts:315](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L315)

**`Internal`**

Gets the crawler-specific options from the subclass.

#### Parameters

##### ctx

[`FetchEngineContext`](../interfaces/FetchEngineContext.md)

The fetch engine context.

#### Returns

`Partial`\<`TOptions`\> \| `Promise`\<`Partial`\<`TOptions`\>\>

***

### \_normalizeSchema()

> `protected` **\_normalizeSchema**(`schema`): `ExtractSchema`

Defined in: [packages/web-fetcher/src/engine/base.ts:459](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L459)

#### Parameters

##### schema

`ExtractSchema`

#### Returns

`ExtractSchema`

***

### \_querySelectorAll()

> `abstract` `protected` **\_querySelectorAll**(`context`, `selector`): `Promise`\<`any`[]\>

Defined in: [packages/web-fetcher/src/engine/base.ts:255](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L255)

#### Parameters

##### context

`any`

##### selector

`string`

#### Returns

`Promise`\<`any`[]\>

***

### \_sharedFailedRequestHandler()

> `protected` **\_sharedFailedRequestHandler**(`context`, `error?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:748](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L748)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:713](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L713)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<`void`\>

***

### blockResources()

> **blockResources**(`types`, `overwrite?`): `Promise`\<`number`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:840](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L840)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:327](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L327)

#### Parameters

##### context

`TContext`

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

***

### cleanup()

> **cleanup**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:645](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L645)

#### Returns

`Promise`\<`void`\>

***

### click()

> **click**(`selector`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:409](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L409)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:951](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L951)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:952](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L952)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:764](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L764)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:987](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L987)

Disposes of engine, cleaning up all resources.

#### Returns

`Promise`\<`void`\>

Promise resolving when disposal completes

***

### executeAction()

> `abstract` `protected` **executeAction**(`context`, `action`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:370](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L370)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:454](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L454)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:421](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L421)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:854](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L854)

Gets content of current page.

#### Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\>

Promise resolving to fetch response

#### Throws

When no content has been fetched yet

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

Defined in: [packages/web-fetcher/src/engine/base.ts:511](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L511)

Returns the current state of the engine (cookies)
that can be used to restore the session later.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

***

### goto()

> `abstract` **goto**(`url`, `params?`): `Promise`\<`void` \| [`FetchResponse`](../interfaces/FetchResponse.md)\>

Defined in: [packages/web-fetcher/src/engine/base.ts:384](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L384)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:893](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L893)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:894](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L894)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:895](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L895)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:896](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L896)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:543](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L543)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:444](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L444)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:433](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L433)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:398](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L398)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:203](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L203)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:176](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L176)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:186](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L186)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:163](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L163)

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
