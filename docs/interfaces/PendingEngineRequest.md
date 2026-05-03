[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:271](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L271)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:273](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L273)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:272](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/engine/base.ts#L272)

#### Parameters

##### value

`any`

#### Returns

`void`
