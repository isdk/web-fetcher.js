[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:259](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L259)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:260](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L260)

***

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:262](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L262)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:261](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L261)

#### Parameters

##### value?

`any`

#### Returns

`void`
