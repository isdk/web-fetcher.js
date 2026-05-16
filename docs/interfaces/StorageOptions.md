[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / StorageOptions

# Interface: StorageOptions

Defined in: [packages/web-fetcher/src/core/types.ts:121](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L121)

Storage configuration options for the fetch engine.

## Remarks

Controls how Crawlee's internal storage (RequestQueue, KeyValueStore, SessionPool) is managed.

## Properties

### config?

> `optional` **config**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/types.ts:143](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L143)

Additional Crawlee configuration options.
Allows fine-grained control over the underlying Crawlee instance.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:127](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L127)

Custom identifier for the storage.
If provided, multiple sessions can share the same storage by using the same ID.
If not provided, a unique session ID is used (strong isolation).

***

### persist?

> `optional` **persist**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:133](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L133)

Whether to persist storage to disk.
If true, uses Crawlee's disk persistence. If false, data might be stored in memory or temporary directory.
Corresponds to Crawlee's `persistStorage` configuration.

***

### purge?

> `optional` **purge**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:138](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L138)

Whether to delete the storage (RequestQueue and KeyValueStore) when the session is closed.
Defaults to true. Set to false if you want to keep data for future reuse with the same `id`.
