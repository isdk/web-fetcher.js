[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / BaseFetcherProperties

# Interface: BaseFetcherProperties

Defined in: [packages/web-fetcher/src/core/types.ts:209](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L209)

## Extended by

- [`FetchSite`](FetchSite.md)
- [`FetcherOptions`](FetcherOptions.md)
- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:223](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L223)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:240](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L240)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:255](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L255)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### launchOptions?

> `optional` **launchOptions**: `Record`\<`string`, `any`\>

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

***

### cache?

> `optional` **cache**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:250](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L250)

Cache configuration for persistent HTTP caching.

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:227](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L227)

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:224](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L224)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:277](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L277)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:218](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L218)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:217](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L217)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:226](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L226)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:268](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L268)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:253](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L253)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:275](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L275)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:276](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L276)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:233](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L233)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:230](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L230)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:238](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L238)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L274)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:278](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L278)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:229](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L229)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:228](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L228)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:280](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L280)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:245](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L245)

Storage configuration for session isolation and persistence.

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:219](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L219)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:231](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L231)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:273](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L273)

***

### upgradeOnJsContent?

> `optional` **upgradeOnJsContent**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:220](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L220)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:221](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L221)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:281](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L281)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:222](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/core/types.ts#L222)
