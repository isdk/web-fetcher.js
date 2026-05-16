[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GotoActionOptions

# Interface: GotoActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:110](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L110)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:122](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L122)

***

### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"HEAD"` \| `"TRACE"` \| `"OPTIONS"` \| `"CONNECT"`

Defined in: [packages/web-fetcher/src/engine/base.ts:111](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L111)

***

### payload?

> `optional` **payload**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:121](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L121)

***

### simulate?

> `optional` **simulate**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:125](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L125)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/engine/base.ts:124](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L124)

***

### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

Defined in: [packages/web-fetcher/src/engine/base.ts:123](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/engine/base.ts#L123)
