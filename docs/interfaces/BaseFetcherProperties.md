[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / BaseFetcherProperties

# Interface: BaseFetcherProperties

Defined in: [packages/web-fetcher/src/core/types.ts:26](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L26)

## Extended by

- [`FetchSite`](FetchSite.md)
- [`FetcherOptions`](FetcherOptions.md)
- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:37](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L37)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:49](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L49)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:55](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L55)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:40](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L40)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:76](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L76)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:35](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L35)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:34](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L34)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:39](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L39)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:67](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L67)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:53](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L53)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:74](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L74)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L75)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:43](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L43)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:47](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L47)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L73)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:77](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L77)

***

### reuseCookies?

> `optional` **reuseCookies**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:44](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L44)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:42](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L42)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:41](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L41)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:79](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L79)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:45](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L45)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L72)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:80](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L80)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:36](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/types.ts#L36)
