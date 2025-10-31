[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:108](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/engine/base.ts#L108)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:110](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/engine/base.ts#L110)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:109](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/engine/base.ts#L109)

#### Parameters

##### value

`any`

#### Returns

`void`
