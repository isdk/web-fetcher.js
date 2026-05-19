[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:299](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/engine/base.ts#L299)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:300](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/engine/base.ts#L300)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:302](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/engine/base.ts#L302)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:301](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/engine/base.ts#L301)

#### Parameters

##### value?

`any`

#### Returns

`void`
