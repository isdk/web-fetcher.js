[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:299](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L299)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:300](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L300)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:302](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L302)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:301](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L301)

#### Parameters

##### value?

`any`

#### Returns

`void`
