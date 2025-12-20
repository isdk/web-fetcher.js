[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:96](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/engine/base.ts#L96)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:97](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/engine/base.ts#L97)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:99](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/engine/base.ts#L99)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:98](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/engine/base.ts#L98)

#### Parameters

##### value?

`any`

#### Returns

`void`
