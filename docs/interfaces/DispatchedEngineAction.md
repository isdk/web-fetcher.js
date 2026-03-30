[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:246](https://github.com/isdk/web-fetcher.js/blob/e691a2370f59d15979b47994c8ca14d7b7d2edd3/src/engine/base.ts#L246)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:247](https://github.com/isdk/web-fetcher.js/blob/e691a2370f59d15979b47994c8ca14d7b7d2edd3/src/engine/base.ts#L247)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:249](https://github.com/isdk/web-fetcher.js/blob/e691a2370f59d15979b47994c8ca14d7b7d2edd3/src/engine/base.ts#L249)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:248](https://github.com/isdk/web-fetcher.js/blob/e691a2370f59d15979b47994c8ca14d7b7d2edd3/src/engine/base.ts#L248)

#### Parameters

##### value?

`any`

#### Returns

`void`
