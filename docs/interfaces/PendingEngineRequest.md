[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:271](https://github.com/isdk/web-fetcher.js/blob/65ab5500b355c69b13e50e6c5787424ee7b1e1f4/src/engine/base.ts#L271)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:273](https://github.com/isdk/web-fetcher.js/blob/65ab5500b355c69b13e50e6c5787424ee7b1e1f4/src/engine/base.ts#L273)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:272](https://github.com/isdk/web-fetcher.js/blob/65ab5500b355c69b13e50e6c5787424ee7b1e1f4/src/engine/base.ts#L272)

#### Parameters

##### value

`any`

#### Returns

`void`
