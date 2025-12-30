[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GotoActionOptions

# Interface: GotoActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:41](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L41)

Options for the [FetchEngine.goto](../classes/FetchEngine.md#goto), allowing configuration of HTTP method, payload, headers, and navigation behavior.

## Remarks

Used when navigating to a URL to specify additional parameters beyond the basic URL.

## Example

```ts
await engine.goto('https://example.com', {
  method: 'POST',
  payload: { username: 'user', password: 'pass' },
  headers: { 'Content-Type': 'application/json' },
  waitUntil: 'networkidle'
});
```

## Properties

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:44](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L44)

***

### method?

> `optional` **method**: `"GET"` \| `"HEAD"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"TRACE"` \| `"OPTIONS"` \| `"CONNECT"` \| `"PATCH"`

Defined in: [packages/web-fetcher/src/engine/base.ts:42](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L42)

***

### payload?

> `optional` **payload**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:43](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L43)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/engine/base.ts:46](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L46)

***

### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

Defined in: [packages/web-fetcher/src/engine/base.ts:45](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/engine/base.ts#L45)
