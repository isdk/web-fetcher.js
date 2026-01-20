[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchActionInContext

# Interface: FetchActionInContext

Defined in: [packages/web-fetcher/src/core/context.ts:18](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L18)

Represents the state of an action being executed within a context.

## Remarks

Extends the basic action properties with runtime metadata like execution index,
nesting depth, and any errors encountered during execution.

## Extends

- [`FetchActionProperties`](FetchActionProperties.md)

## Indexable

\[`key`: `string`\]: `any`

## Properties

### action?

> `optional` **action**: `string` \| [`FetchAction`](../classes/FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:49](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L49)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`action`](FetchActionProperties.md#action)

***

### args?

> `optional` **args**: `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:52](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L52)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`args`](FetchActionProperties.md#args)

***

### collectors?

> `optional` **collectors**: `_RequireAtLeastOne`\<[`BaseFetchCollectorActionProperties`](BaseFetchCollectorActionProperties.md), `"name"` \| `"id"` \| `"action"`\>[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:87](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L87)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`collectors`](FetchActionProperties.md#collectors)

***

### depth?

> `optional` **depth**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:30](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L30)

The nesting depth of the action. Top-level actions (executed directly by the session) have a depth of 0.

***

### error?

> `optional` **error**: `Error`

Defined in: [packages/web-fetcher/src/core/context.ts:26](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L26)

Error encountered during action execution, if any.

***

### failOnError?

> `optional` **failOnError**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:57](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L57)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnError`](FetchActionProperties.md#failonerror)

***

### failOnTimeout?

> `optional` **failOnTimeout**: `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:59](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L59)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`failOnTimeout`](FetchActionProperties.md#failontimeout)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:47](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L47)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`id`](FetchActionProperties.md#id)

***

### index?

> `optional` **index**: `number`

Defined in: [packages/web-fetcher/src/core/context.ts:22](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/context.ts#L22)

The 0-based index of the action in the execution sequence.

#### Overrides

[`FetchActionProperties`](FetchActionProperties.md).[`index`](FetchActionProperties.md#index)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:61](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L61)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`maxRetries`](FetchActionProperties.md#maxretries)

***

### name?

> `optional` **name**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:48](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L48)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`name`](FetchActionProperties.md#name)

***

### params?

> `optional` **params**: `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:51](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L51)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`params`](FetchActionProperties.md#params)

***

### storeAs?

> `optional` **storeAs**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:54](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L54)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`storeAs`](FetchActionProperties.md#storeas)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:60](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L60)

#### Inherited from

[`FetchActionProperties`](FetchActionProperties.md).[`timeoutMs`](FetchActionProperties.md#timeoutms)
