[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / WebFetcher

# Class: WebFetcher

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:4](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/web-fetcher.ts#L4)

## Constructors

### Constructor

> **new WebFetcher**(`defaults`): `WebFetcher`

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:5](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/web-fetcher.ts#L5)

#### Parameters

##### defaults

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

#### Returns

`WebFetcher`

## Methods

### createSession()

> **createSession**(`options?`): `Promise`\<[`FetchSession`](FetchSession.md)\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:7](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/web-fetcher.ts#L7)

#### Parameters

##### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md)

#### Returns

`Promise`\<[`FetchSession`](FetchSession.md)\>

***

### fetch()

#### Call Signature

> **fetch**(`url`, `options?`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:12](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/web-fetcher.ts#L12)

##### Parameters

###### url

`string`

###### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md)

##### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

#### Call Signature

> **fetch**(`options`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:13](https://github.com/isdk/web-fetcher.js/blob/67ac2abdb01356cc0cf363248f4ef8f77c28d78f/src/core/web-fetcher.ts#L13)

##### Parameters

###### options

[`FetcherOptions`](../interfaces/FetcherOptions.md)

##### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>
