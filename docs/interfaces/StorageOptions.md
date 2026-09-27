[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / StorageOptions

# Interface: StorageOptions

Defined in: [packages/web-fetcher/src/core/types.ts:121](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L121)

Storage configuration options for the fetch engine.

## Remarks

Controls how Crawlee's internal storage (RequestQueue, KeyValueStore, SessionPool) is managed.

## Properties

### config?

> `optional` **config?**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/types.ts:143](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L143)

Additional Crawlee configuration options.
Allows fine-grained control over the underlying Crawlee instance.

***

### id?

> `optional` **id?**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:127](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L127)

Custom identifier for the storage.
If provided, multiple sessions can share the same storage by using the same ID.
If not provided, a unique session ID is used (strong isolation).

***

### persist?

> `optional` **persist?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:133](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L133)

Whether to persist storage to disk.
If true, uses Crawlee's disk persistence. If false, data might be stored in memory or temporary directory.
Corresponds to Crawlee's `persistStorage` configuration.

***

### poolStartTimeoutMs?

> `optional` **poolStartTimeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:153](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L153)

Maximum time (ms) to wait for the crawler's autoscaled pool to start before
tearing it down during disposal.

`AutoscaledPool.abort()` is a no-op unless the pool's own `run()` has
started, so the engine waits for it first; otherwise the crawler would turn
into a zombie that never settles and keeps the process alive. Defaults to
10s. Raise it for slow-starting browser crawlers.

***

### purge?

> `optional` **purge?**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:138](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L138)

Whether to delete the storage (RequestQueue and KeyValueStore) when the session is closed.
Defaults to true. Set to false if you want to keep data for future reuse with the same `id`.

***

### taskSettleTimeoutMs?

> `optional` **taskSettleTimeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:163](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/types.ts#L163)

Maximum time (ms) to wait for in-flight crawler tasks to settle before the
request queue and key-value store are dropped during disposal.

`abort()` does not wait for running tasks, yet those tasks still touch the
storages after the request handler returns. Defaults to 120s. When the
timeout elapses the storages are kept instead of crashing the settling
tasks ("Request queue ... does not exist").
