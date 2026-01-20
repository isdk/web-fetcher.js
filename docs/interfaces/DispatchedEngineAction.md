[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:229](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L229)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:230](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L230)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:232](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L232)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:231](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L231)

#### Parameters

##### value?

`any`

#### Returns

`void`
