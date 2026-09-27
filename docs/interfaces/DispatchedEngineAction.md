[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / DispatchedEngineAction

# Interface: DispatchedEngineAction

Defined in: [packages/web-fetcher/src/engine/base.ts:428](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L428)

Represents an action that has been dispatched and is awaiting execution in the active page context.

## Remarks

Connects the action request with its resolution mechanism. Used internally by the action dispatch system
to handle promises while maintaining the page context validity window.

## Properties

### action

> **action**: [`FetchEngineAction`](../type-aliases/FetchEngineAction.md)

Defined in: [packages/web-fetcher/src/engine/base.ts:429](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L429)

***

### reject

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:431](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L431)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve

> **resolve**: (`value?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:430](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L430)

#### Parameters

##### value?

`any`

#### Returns

`void`
