[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:109](https://github.com/isdk/web-fetcher.js/blob/8bd7a48c89b74012f283a5397c5c3b526fdb7b09/src/engine/base.ts#L109)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:111](https://github.com/isdk/web-fetcher.js/blob/8bd7a48c89b74012f283a5397c5c3b526fdb7b09/src/engine/base.ts#L111)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:110](https://github.com/isdk/web-fetcher.js/blob/8bd7a48c89b74012f283a5397c5c3b526fdb7b09/src/engine/base.ts#L110)

#### Parameters

##### value

`any`

#### Returns

`void`
