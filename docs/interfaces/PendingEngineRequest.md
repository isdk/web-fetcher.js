[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:112](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/engine/base.ts#L112)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:114](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/engine/base.ts#L114)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:113](https://github.com/isdk/web-fetcher.js/blob/3d2bbdd587d2e2a817155af67327a042c516fd6f/src/engine/base.ts#L113)

#### Parameters

##### value

`any`

#### Returns

`void`
