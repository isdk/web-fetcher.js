[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchCacheOptions

# Interface: FetchCacheOptions

Defined in: [packages/web-fetcher/src/core/types.ts:146](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L146)

## Properties

### backgroundUpdate?

> `optional` **backgroundUpdate**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:178](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L178)

Whether to enable SWR background asynchronous update. Default is true.

***

### body?

> `optional` **body**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:190](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L190)

JSON request body field filtering.

***

### cacheRules?

> `optional` **cacheRules**: `any`[]

Defined in: [packages/web-fetcher/src/core/types.ts:166](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L166)

Fine-grained cache interception rules.

***

### cookies?

> `optional` **cookies**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:186](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L186)

Cookie field filtering.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:150](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L150)

Whether to enable caching.

***

### forceCache?

> `optional` **forceCache**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:198](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L198)

Whether to ignore server directives and force caching.

***

### headers?

> `optional` **headers**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:174](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L174)

Request header filtering.

***

### maxMemorySize?

> `optional` **maxMemorySize**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:202](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L202)

Max memory size for a single file content in bytes.

***

### maxTotalMemorySize?

> `optional` **maxTotalMemorySize**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:206](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L206)

Max total memory size for the LRU cache in bytes.

***

### methods?

> `optional` **methods**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:162](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L162)

Allowed HTTP methods for caching. Default is ['GET', 'HEAD'].

***

### offline?

> `optional` **offline**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:154](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L154)

Explicit offline mode. If true, network requests are prohibited and MISS results will throw OfflineCacheMissError.

***

### query?

> `optional` **query**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:170](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L170)

URL query parameter filtering.

***

### refresh?

> `optional` **refresh**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:182](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L182)

Force refresh: ignore existing cache and re-validate/heal it.

***

### staleIfError?

> `optional` **staleIfError**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:194](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L194)

Whether to force return stale cache if network request fails.

***

### storagePath?

> `optional` **storagePath**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:158](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L158)

Custom storage path for the cache.
