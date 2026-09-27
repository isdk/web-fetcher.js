[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GotoActionOptions

# Interface: GotoActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:207](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L207)

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

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/engine/base.ts:219](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L219)

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"CONNECT"` \| `"HEAD"` \| `"TRACE"` \| `"OPTIONS"`

Defined in: [packages/web-fetcher/src/engine/base.ts:208](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L208)

***

### payload?

> `optional` **payload?**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:218](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L218)

***

### simulate?

> `optional` **simulate?**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:222](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L222)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/engine/base.ts:221](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L221)

***

### waitUntil?

> `optional` **waitUntil?**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

Defined in: [packages/web-fetcher/src/engine/base.ts:220](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L220)
