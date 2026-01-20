[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSession

# Class: FetchSession

Defined in: [packages/web-fetcher/src/core/session.ts:24](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L24)

Represents a stateful web fetching session.

## Remarks

A `FetchSession` manages the lifecycle of a single crawling operation, including engine initialization,
cookie persistence, and sequential action execution. It maintains a `FetchContext` that stores
session-level configurations and outputs.

Sessions are isolated; each has its own unique ID and (by default) its own storage and cookies.

## Constructors

### Constructor

> **new FetchSession**(`options`): `FetchSession`

Defined in: [packages/web-fetcher/src/core/session.ts:42](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L42)

Creates a new FetchSession.

#### Parameters

##### options

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

Configuration options for the fetcher.

#### Returns

`FetchSession`

## Properties

### closed

> `protected` **closed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/core/session.ts:35](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L35)

***

### context

> `readonly` **context**: [`FetchContext`](../interfaces/FetchContext.md)

Defined in: [packages/web-fetcher/src/core/session.ts:32](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L32)

The execution context for this session, containing configurations, event bus, and shared state.

***

### id

> `readonly` **id**: `string`

Defined in: [packages/web-fetcher/src/core/session.ts:28](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L28)

Unique identifier for the session.

***

### options

> `protected` **options**: [`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

Defined in: [packages/web-fetcher/src/core/session.ts:42](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L42)

Configuration options for the fetcher.

## Methods

### \_logDebug()

> `protected` **\_logDebug**(`category`, ...`args`): `void`

Defined in: [packages/web-fetcher/src/core/session.ts:47](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L47)

#### Parameters

##### category

`string`

##### args

...`any`[]

#### Returns

`void`

***

### createContext()

> `protected` **createContext**(`options`): [`FetchContext`](../interfaces/FetchContext.md)

Defined in: [packages/web-fetcher/src/core/session.ts:235](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L235)

#### Parameters

##### options

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `...`

#### Returns

[`FetchContext`](../interfaces/FetchContext.md)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/core/session.ts:204](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L204)

Disposes of the session and its associated engine.

#### Returns

`Promise`\<`void`\>

#### Remarks

This method should be called when the session is no longer needed to free up resources
(e.g., closing browser instances, purging temporary storage).

***

### execute()

> **execute**\<`R`\>(`actionOptions`, `context`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/session.ts:68](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L68)

Executes a single action within the session.

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"response"`

The expected return type of the action.

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

Configuration for the action to be executed.

##### context

[`FetchContext`](../interfaces/FetchContext.md) = `...`

Optional context override for this specific execution. Defaults to the session context.

#### Returns

`Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

A promise that resolves to the result of the action.

#### Example

```ts
await session.execute({ name: 'goto', params: { url: 'https://example.com' } });
```

***

### executeAll()

> **executeAll**(`actions`, `options?`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: [`FetchResponse`](../interfaces/FetchResponse.md) \| `undefined`; \}\>

Defined in: [packages/web-fetcher/src/core/session.ts:130](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L130)

Executes a sequence of actions.

#### Parameters

##### actions

`_RequireAtLeastOne`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"name"` \| `"id"` \| `"action"`\>[]

An array of action options to be executed in order.

##### options?

`Partial`\<[`FetcherOptions`](../interfaces/FetcherOptions.md)\> & `object`

Optional temporary configuration overrides (e.g., timeoutMs, headers) for this batch of actions.
                 These overrides do not affect the main session context.

#### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: [`FetchResponse`](../interfaces/FetchResponse.md) \| `undefined`; \}\>

A promise that resolves to an object containing the result of the last action and all accumulated outputs.

#### Example

```ts
const { result, outputs } = await session.executeAll([
  { name: 'goto', params: { url: 'https://example.com' } },
  { name: 'extract', params: { schema: { title: 'h1' } }, storeAs: 'data' }
], { timeoutMs: 30000 });
```

***

### getOutputs()

> **getOutputs**(): `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/session.ts:182](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L182)

Retrieves all outputs accumulated during the session.

#### Returns

`Record`\<`string`, `any`\>

A record of stored output data.

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \} \| `undefined`\>

Defined in: [packages/web-fetcher/src/core/session.ts:191](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/session.ts#L191)

Gets the current state of the session, including cookies and engine-specific state.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \} \| `undefined`\>

A promise resolving to the session state, or undefined if no engine is initialized.
