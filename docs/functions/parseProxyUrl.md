[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / parseProxyUrl

# Function: parseProxyUrl()

> **parseProxyUrl**(`url`): [`ProxyConfig`](../interfaces/ProxyConfig.md)

Defined in: [packages/web-fetcher/src/utils/check-proxy.ts:30](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/utils/check-proxy.ts#L30)

解析代理 URL 为配置
支持格式:
- http://127.0.0.1:7890
- http://user:pass@127.0.0.1:7890
- socks5://127.0.0.1:1080
- socks5://user:pass@127.0.0.1:1080

## Parameters

### url

`string`

## Returns

[`ProxyConfig`](../interfaces/ProxyConfig.md)
