[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / normalizeGotoMethodPayload

# Function: normalizeGotoMethodPayload()

> **normalizeGotoMethodPayload**(`params?`): `object`

Defined in: [packages/web-fetcher/src/engine/base.ts:234](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/base.ts#L234)

规范化 goto 参数中的 method/payload，以便安全地传给 Crawlee 的 `Request`。

## Parameters

### params?

`Pick`\<[`GotoActionOptions`](../interfaces/GotoActionOptions.md), `"method"` \| `"payload"`\>

## Returns

`object`

### contentType?

> `optional` **contentType?**: `string`

### method?

> `optional` **method?**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` \| `"CONNECT"` \| `"HEAD"` \| `"TRACE"` \| `"OPTIONS"`

### payload?

> `optional` **payload?**: `string`

## Remarks

Crawlee 的 `Request` 构造器要求：`payload` 必须是 string/Uint8Array（对象会被 ow 校验拒绝），
且 GET/HEAD 请求不允许携带 payload（直接抛错）。本函数将对象 payload 序列化为 JSON 字符串，
并在 GET/HEAD 请求上剔除 payload；对象 payload 序列化时同时返回建议的 JSON Content-Type，
供调用方在用户未显式指定 content-type 时自动补全。
