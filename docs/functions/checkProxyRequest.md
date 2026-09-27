[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / checkProxyRequest

# Function: checkProxyRequest()

> **checkProxyRequest**(`config`, `testUrl?`, `timeout?`): `Promise`\<\{ `error?`: `string`; `latency?`: `number`; `working`: `boolean`; \}\>

Defined in: [packages/web-fetcher/src/utils/check-proxy.ts:153](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/utils/check-proxy.ts#L153)

通过代理发送 HTTP 请求检测

## Parameters

### config

[`ProxyConfig`](../interfaces/ProxyConfig.md)

### testUrl?

`string` = `'http://httpbin.org/ip'`

### timeout?

`number` = `10000`

## Returns

`Promise`\<\{ `error?`: `string`; `latency?`: `number`; `working`: `boolean`; \}\>
