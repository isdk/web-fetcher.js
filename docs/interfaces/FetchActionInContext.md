[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchActionInContext

# Interface: FetchActionInContext

Defined in: [packages/web-fetcher/src/core/context.ts:7](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/context.ts#L7)

## Extends

- [`FetchActionProperties`](FetchActionProperties.md)

## Indexable

\[`key`: `string`\]: `any`

## Properties

### action?

> `optional` **action**: `string` \| [`FetchAction`](../classes/FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:47](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L47)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`action`](FetchActionProperties.md#action)

***

### args?

> `optional` **args**: `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:49](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L49)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`args`](FetchActionProperties.md#args)

***

### collectors?

> `optional` **collectors**: `_RequireAtLeastOne`\<[`BaseFetchCollectorActionProperties`](BaseFetchCollectorActionProperties.md), `"name"` \| `"id"` \| `"action"`\>[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:77](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L77)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`collectors`](FetchActionProperties.md#collectors)

***

### depth?

> `optional` **depth**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:10](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/context.ts#L10)

***

### error?

> `optional` **error**: `Error`

Defined in: [packages/web-fetcher/src/core/context.ts:9](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/context.ts#L9)

***

### failOnError?

> `optional` **failOnError**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:54](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L54)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnError`](FetchActionProperties.md#failonerror)

***

### failOnTimeout?

> `optional` **failOnTimeout**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:56](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L56)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnTimeout`](FetchActionProperties.md#failontimeout)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:45](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L45)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`id`](FetchActionProperties.md#id)

***

### index?

> `optional` **index**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:8](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/core/context.ts#L8)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:58](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L58)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`maxRetries`](FetchActionProperties.md#maxretries)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:46](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L46)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`name`](FetchActionProperties.md#name)

***

### params?

> `optional` **params**: `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:48](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L48)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`params`](FetchActionProperties.md#params)

***

### storeAs?

> `optional` **storeAs**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:51](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L51)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`storeAs`](FetchActionProperties.md#storeas)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:57](https://github.com/isdk/web-fetcher.js/blob/c6694f50698959edc7c0cdb928907e3e0ef9bb70/src/action/fetch-action.ts#L57)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`timeoutMs`](FetchActionProperties.md#timeoutms)
