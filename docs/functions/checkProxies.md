[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / checkProxies

# Function: checkProxies()

> **checkProxies**(`configs`, `timeout?`, `concurrency?`): `Promise`\<`Map`\<`string`, [`ProxyCheckResult`](../interfaces/ProxyCheckResult.md)\>\>

Defined in: [packages/web-fetcher/src/utils/check-proxy.ts:475](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/utils/check-proxy.ts#L475)

批量检测代理

## Parameters

### configs

(`string` \| [`ProxyConfig`](../interfaces/ProxyConfig.md))[]

代理配置或 URL 字符串数组

### timeout?

`number` = `5000`

### concurrency?

`number` = `5`

## Returns

`Promise`\<`Map`\<`string`, [`ProxyCheckResult`](../interfaces/ProxyCheckResult.md)\>\>
