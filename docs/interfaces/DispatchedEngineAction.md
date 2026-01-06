[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:101](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L101)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:102](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L102)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:104](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L104)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:103](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L103)

#### Parameters

##### value?

`any`

#### Returns

`void`
