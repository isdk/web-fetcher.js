[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:97](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/engine/base.ts#L97)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:98](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/engine/base.ts#L98)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:100](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/engine/base.ts#L100)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:99](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/engine/base.ts#L99)

#### Parameters

##### value?

`any`

#### Returns

`void`
