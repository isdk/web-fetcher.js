[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:241](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L241)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:243](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L243)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:242](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L242)

#### Parameters

##### value

`any`

#### Returns

`void`
