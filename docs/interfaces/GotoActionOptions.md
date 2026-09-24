[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GotoActionOptions

# Interface: GotoActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:111](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L111)

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

Defined in: [packages/web-fetcher/src/engine/base.ts:123](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L123)

***

### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"CONNECT"` \| `"HEAD"` \| `"TRACE"` \| `"OPTIONS"`

Defined in: [packages/web-fetcher/src/engine/base.ts:112](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L112)

***

### payload?

> `optional` **payload?**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:122](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L122)

***

### simulate?

> `optional` **simulate?**: `boolean`

Defined in: [packages/web-fetcher/src/engine/base.ts:126](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L126)

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/web-fetcher/src/engine/base.ts:125](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L125)

***

### waitUntil?

> `optional` **waitUntil?**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

Defined in: [packages/web-fetcher/src/engine/base.ts:124](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/base.ts#L124)
