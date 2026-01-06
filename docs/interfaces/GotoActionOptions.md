[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GotoActionOptions

# Interface: GotoActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:45](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L45)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:48](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L48)

***

### method?

> `optional` **method**: `"GET"` \| `"HEAD"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"TRACE"` \| `"OPTIONS"` \| `"CONNECT"` \| `"PATCH"`

Defined in: [packages/web-fetcher/src/engine/base.ts:46](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L46)

***

### payload?

> `optional` **payload**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:47](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L47)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/engine/base.ts:50](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L50)

***

### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

Defined in: [packages/web-fetcher/src/engine/base.ts:49](https://github.com/isdk/web-fetcher.js/blob/1f3a81cc4fe8a2cf40fe3f3e8030d14a75c9d27c/src/engine/base.ts#L49)
