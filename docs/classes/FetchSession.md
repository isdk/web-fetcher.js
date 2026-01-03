[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchSession

# Class: FetchSession

Defined in: [packages/web-fetcher/src/core/session.ts:11](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L11)

## Constructors

### Constructor

> **new FetchSession**(`options`, `engine?`): `FetchSession`

Defined in: [packages/web-fetcher/src/core/session.ts:18](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L18)

#### Parameters

##### options

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

##### engine?

`string`

#### Returns

`FetchSession`

## Properties

### context

> `readonly` **context**: [`FetchContext`](../interfaces/FetchContext.md)

Defined in: [packages/web-fetcher/src/core/session.ts:13](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L13)

***

### engine?

> `readonly` `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/session.ts:18](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L18)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/web-fetcher/src/core/session.ts:12](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L12)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/core/session.ts:91](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L91)

#### Returns

`Promise`\<`void`\>

***

### execute()

> **execute**\<`R`\>(`actionOptions`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/session.ts:27](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L27)

执行单个动作

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"response"`

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

#### Returns

`Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

***

### executeAll()

> **executeAll**(`actions`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

Defined in: [packages/web-fetcher/src/core/session.ts:61](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L61)

#### Parameters

##### actions

`_RequireAtLeastOne`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"name"` \| `"id"` \| `"action"`\>[]

#### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

***

### getOutputs()

> **getOutputs**(): `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/session.ts:83](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L83)

#### Returns

`Record`\<`string`, `any`\>

***

### getState()

> **getState**(): `Promise`\<`undefined` \| \{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>

Defined in: [packages/web-fetcher/src/core/session.ts:87](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/core/session.ts#L87)

#### Returns

`Promise`\<`undefined` \| \{ `cookies`: [`Cookie`](../interfaces/Cookie.md)[]; `sessionState?`: `any`; \}\>
