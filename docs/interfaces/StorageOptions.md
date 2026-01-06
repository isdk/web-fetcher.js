[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / StorageOptions

# Interface: StorageOptions

Defined in: [packages/web-fetcher/src/core/types.ts:32](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L32)

Storage configuration options for the fetch engine.

## Remarks

Controls how Crawlee's internal storage (RequestQueue, KeyValueStore, SessionPool) is managed.

## Properties

### config?

> `optional` **config**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/types.ts:54](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L54)

Additional Crawlee configuration options.
Allows fine-grained control over the underlying Crawlee instance.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:38](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L38)

Custom identifier for the storage.
If provided, multiple sessions can share the same storage by using the same ID.
If not provided, a unique session ID is used (strong isolation).

***

### persist?

> `optional` **persist**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:44](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L44)

Whether to persist storage to disk.
If true, uses Crawlee's disk persistence. If false, data might be stored in memory or temporary directory.
Corresponds to Crawlee's `persistStorage` configuration.

***

### purge?

> `optional` **purge**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:49](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/core/types.ts#L49)

Whether to delete the storage (RequestQueue and KeyValueStore) when the session is closed.
Defaults to true. Set to false if you want to keep data for future reuse with the same `id`.
