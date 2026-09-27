[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSession

# Class: FetchSession

Defined in: [packages/web-fetcher/src/core/session.ts:27](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L27)

Represents a stateful web fetching session.

## Remarks

A `FetchSession` manages the lifecycle of a single crawling operation, including engine initialization,
cookie persistence, and sequential action execution. It maintains a `FetchContext` that stores
session-level configurations and outputs.

Sessions are isolated; each has its own unique ID and (by default) its own storage and cookies.

## Constructors

### Constructor

> **new FetchSession**(`options?`): `FetchSession`

Defined in: [packages/web-fetcher/src/core/session.ts:48](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L48)

Creates a new FetchSession.

#### Parameters

##### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

Configuration options for the fetcher.

#### Returns

`FetchSession`

## Properties

### abortedError?

> `protected` `optional` **abortedError?**: `Error`

Defined in: [packages/web-fetcher/src/core/session.ts:41](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L41)

中止信息：一旦被设置，会话不可再执行任何动作。

***

### closed

> `protected` **closed**: `boolean` = `false`

Defined in: [packages/web-fetcher/src/core/session.ts:38](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L38)

***

### context

> `readonly` **context**: [`FetchContext`](../interfaces/FetchContext.md)

Defined in: [packages/web-fetcher/src/core/session.ts:35](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L35)

The execution context for this session, containing configurations, event bus, and shared state.

***

### id

> `readonly` **id**: `string`

Defined in: [packages/web-fetcher/src/core/session.ts:31](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L31)

Unique identifier for the session.

***

### options

> `protected` **options**: [`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

Defined in: [packages/web-fetcher/src/core/session.ts:48](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L48)

Configuration options for the fetcher.

## Accessors

### aborted

#### Get Signature

> **get** **aborted**(): `boolean`

Defined in: [packages/web-fetcher/src/core/session.ts:70](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L70)

会话是否已被中止。

##### Returns

`boolean`

## Methods

### \_execute()

> `protected` **\_execute**\<`R`\>(`actionOptions`, `context?`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/session.ts:121](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L121)

Executes a single action within the session.

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"response"`

The expected return type of the action.

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

Configuration for the action to be executed.

##### context?

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

### \_logDebug()

> `protected` **\_logDebug**(`category`, ...`args`): `void`

Defined in: [packages/web-fetcher/src/core/session.ts:100](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L100)

#### Parameters

##### category

`string`

##### args

...`any`[]

#### Returns

`void`

***

### abort()

> **abort**(`reason?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/core/session.ts:87](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L87)

中止当前会话。

#### Parameters

##### reason?

`any`

可选的中止原因（错误或描述信息）。

#### Returns

`Promise`\<`void`\>

#### Remarks

中止后：
- 后续所有动作立即以 `AbortError` 失败；
- 进行中的动作会因 `dispose()` 清理（reject 所有 pending 请求与排队动作）而被取消；
- 会话不可恢复。

幂等：重复调用无副作用。

***

### createContext()

> `protected` **createContext**(`options?`): [`FetchContext`](../interfaces/FetchContext.md)

Defined in: [packages/web-fetcher/src/core/session.ts:362](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L362)

#### Parameters

##### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `...`

#### Returns

[`FetchContext`](../interfaces/FetchContext.md)

***

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/core/session.ts:307](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L307)

Disposes of the session and its associated engine.

#### Returns

`Promise`\<`void`\>

#### Remarks

This method should be called when the session is no longer needed to free up resources
(e.g., closing browser instances, purging temporary storage).

***

### execute()

> **execute**\<`R`\>(`actionOptions`, `context?`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/session.ts:177](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L177)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"response"`

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

##### context?

[`FetchContext`](../interfaces/FetchContext.md) = `...`

#### Returns

`Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

***

### executeAll()

> **executeAll**(`actions`, `options?`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: [`FetchResponse`](../interfaces/FetchResponse.md) \| `undefined`; \}\>

Defined in: [packages/web-fetcher/src/core/session.ts:205](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L205)

Executes a sequence of actions.

#### Parameters

##### actions

`_RequireAtLeastOne`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"id"` \| `"name"` \| `"action"`\>[]

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

Defined in: [packages/web-fetcher/src/core/session.ts:285](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L285)

Retrieves all outputs accumulated during the session.

#### Returns

`Record`\<`string`, `any`\>

A record of stored output data.

***

### getState()

> **getState**(): `Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \} \| `undefined`\>

Defined in: [packages/web-fetcher/src/core/session.ts:294](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/session.ts#L294)

Gets the current state of the session, including cookies and engine-specific state.

#### Returns

`Promise`\<\{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \} \| `undefined`\>

A promise resolving to the session state, or undefined if no engine is initialized.
