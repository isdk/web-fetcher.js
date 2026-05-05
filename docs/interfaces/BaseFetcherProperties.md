[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / BaseFetcherProperties

# Interface: BaseFetcherProperties

Defined in: [packages/web-fetcher/src/core/types.ts:146](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L146)

## Extended by

- [`FetchSite`](FetchSite.md)
- [`FetcherOptions`](FetcherOptions.md)
- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:159](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L159)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:176](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L176)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:186](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L186)

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

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:163](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L163)

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:160](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L160)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:208](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L208)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:155](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L155)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:154](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L154)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:162](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L162)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:199](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L199)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:184](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L184)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:206](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L206)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:207](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L207)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:169](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L169)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:166](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L166)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:174](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L174)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:205](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L205)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:209](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L209)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:165](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L165)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:164](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L164)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:211](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L211)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:181](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L181)

Storage configuration for session isolation and persistence.

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:156](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L156)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:167](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L167)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:204](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L204)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:157](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L157)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:212](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L212)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:158](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/core/types.ts#L158)
