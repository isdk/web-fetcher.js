[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchActionInContext

# Interface: FetchActionInContext

Defined in: [packages/web-fetcher/src/core/context.ts:7](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/core/context.ts#L7)

## Extends

- [`FetchActionProperties`](FetchActionProperties.md)

## Indexable

\[`key`: `string`\]: `any`

## Properties

### collectors?

> `optional` **collectors**: `_RequireAtLeastOne`\<[`BaseFetchCollectorActionProperties`](BaseFetchCollectorActionProperties.md), `"name"` \| `"id"`\>[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:75](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L75)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`collectors`](FetchActionProperties.md#collectors)

***

### depth?

> `optional` **depth**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:10](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/core/context.ts#L10)

***

### error?

> `optional` **error**: `Error`

Defined in: [packages/web-fetcher/src/core/context.ts:9](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/core/context.ts#L9)

***

### failOnError?

> `optional` **failOnError**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:52](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L52)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnError`](FetchActionProperties.md#failonerror)

***

### failOnTimeout?

> `optional` **failOnTimeout**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:54](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L54)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnTimeout`](FetchActionProperties.md#failontimeout)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:45](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L45)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`id`](FetchActionProperties.md#id)

***

### index?

> `optional` **index**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:8](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/core/context.ts#L8)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:56](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L56)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`maxRetries`](FetchActionProperties.md#maxretries)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:46](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L46)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`name`](FetchActionProperties.md#name)

***

### params?

> `optional` **params**: `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:47](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L47)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`params`](FetchActionProperties.md#params)

***

### storeAs?

> `optional` **storeAs**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:49](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L49)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`storeAs`](FetchActionProperties.md#storeas)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:55](https://github.com/isdk/web-fetcher.js/blob/454450fb9b2c03ba1bee72ac0677a667dd8faece/src/action/fetch-action.ts#L55)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`timeoutMs`](FetchActionProperties.md#timeoutms)
