[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / PendingEngineRequest

# Interface: PendingEngineRequest

Defined in: [packages/web-fetcher/src/engine/base.ts:311](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L311)

Represents a pending navigation request awaiting resolution.

## Remarks

Tracks navigation requests that have been queued but not yet processed by the request handler.

## Properties

### reject()

> **reject**: (`reason?`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:313](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L313)

#### Parameters

##### reason?

`any`

#### Returns

`void`

***

### resolve()

> **resolve**: (`value`) => `void`

Defined in: [packages/web-fetcher/src/engine/base.ts:312](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L312)

#### Parameters

##### value

`any`

#### Returns

`void`
