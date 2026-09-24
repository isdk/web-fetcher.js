[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / checkHttpProxy

# Function: checkHttpProxy()

> **checkHttpProxy**(`config`, `targetHost?`, `targetPort?`, `timeout?`): `Promise`\<\{ `error?`: `string`; `latency?`: `number`; `working`: `boolean`; \}\>

Defined in: [packages/web-fetcher/src/utils/check-proxy.ts:107](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/utils/check-proxy.ts#L107)

通过 HTTP CONNECT 方法检测代理

## Parameters

### config

[`ProxyConfig`](../interfaces/ProxyConfig.md)

### targetHost?

`string` = `'www.google.com'`

### targetPort?

`number` = `443`

### timeout?

`number` = `500`

## Returns

`Promise`\<\{ `error?`: `string`; `latency?`: `number`; `working`: `boolean`; \}\>
