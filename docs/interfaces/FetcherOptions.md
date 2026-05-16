[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetcherOptions

# Interface: FetcherOptions

Defined in: [packages/web-fetcher/src/core/types.ts:298](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L298)

## Extends

- [`BaseFetcherProperties`](BaseFetcherProperties.md)

## Properties

### actions?

> `optional` **actions**: `_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"id"` \| `"name"` \| `"action"`\>[]

Defined in: [packages/web-fetcher/src/core/types.ts:299](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L299)

***

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:222](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L222)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`antibot`](BaseFetcherProperties.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:239](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L239)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`blockResources`](BaseFetcherProperties.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:254](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L254)

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

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`browser`](BaseFetcherProperties.md#browser)

***

### cache?

> `optional` **cache**: [`FetchCacheOptions`](FetchCacheOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:249](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L249)

Cache configuration for persistent HTTP caching.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cache`](BaseFetcherProperties.md#cache)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:226](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L226)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`cookies`](BaseFetcherProperties.md#cookies)

***

### debug?

> `optional` **debug**: `string` \| `boolean` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:223](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L223)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`debug`](BaseFetcherProperties.md#debug)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:276](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L276)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`delayBetweenRequestsMs`](BaseFetcherProperties.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:218](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L218)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`enableSmart`](BaseFetcherProperties.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:217](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L217)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`engine`](BaseFetcherProperties.md#engine)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:225](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L225)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`headers`](BaseFetcherProperties.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:267](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L267)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`http`](BaseFetcherProperties.md#http)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:252](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L252)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`ignoreSslErrors`](BaseFetcherProperties.md#ignoresslerrors)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:274](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L274)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxConcurrency`](BaseFetcherProperties.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:275](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L275)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`maxRequestsPerMinute`](BaseFetcherProperties.md#maxrequestsperminute)

***

### onPause?

> `optional` **onPause**: [`OnFetchPauseCallback`](../type-aliases/OnFetchPauseCallback.md)

Defined in: [packages/web-fetcher/src/core/types.ts:300](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L300)

***

### output?

> `optional` **output**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:232](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L232)

#### cookies?

> `optional` **cookies**: `boolean`

#### sessionState?

> `optional` **sessionState**: `boolean`

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`output`](BaseFetcherProperties.md#output)

***

### overrideSessionState?

> `optional` **overrideSessionState**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:229](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L229)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`overrideSessionState`](BaseFetcherProperties.md#overridesessionstate)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:237](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L237)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`proxy`](BaseFetcherProperties.md#proxy)

***

### requestHandlerTimeoutSecs?

> `optional` **requestHandlerTimeoutSecs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:273](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L273)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`requestHandlerTimeoutSecs`](BaseFetcherProperties.md#requesthandlertimeoutsecs)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:277](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L277)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`retries`](BaseFetcherProperties.md#retries)

***

### sessionPoolOptions?

> `optional` **sessionPoolOptions**: `SessionPoolOptions`

Defined in: [packages/web-fetcher/src/core/types.ts:228](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L228)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionPoolOptions`](BaseFetcherProperties.md#sessionpooloptions)

***

### sessionState?

> `optional` **sessionState**: `any`

Defined in: [packages/web-fetcher/src/core/types.ts:227](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L227)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sessionState`](BaseFetcherProperties.md#sessionstate)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:279](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L279)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`sites`](BaseFetcherProperties.md#sites)

***

### storage?

> `optional` **storage**: [`StorageOptions`](StorageOptions.md)

Defined in: [packages/web-fetcher/src/core/types.ts:244](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L244)

Storage configuration for session isolation and persistence.

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`storage`](BaseFetcherProperties.md#storage)

***

### syncStateOnUpgrade?

> `optional` **syncStateOnUpgrade**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:219](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L219)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`syncStateOnUpgrade`](BaseFetcherProperties.md#syncstateonupgrade)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:230](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L230)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`throwHttpErrors`](BaseFetcherProperties.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:272](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L272)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`timeoutMs`](BaseFetcherProperties.md#timeoutms)

***

### upgradeThresholdMs?

> `optional` **upgradeThresholdMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:220](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L220)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`upgradeThresholdMs`](BaseFetcherProperties.md#upgradethresholdms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:280](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L280)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`url`](BaseFetcherProperties.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:221](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/types.ts#L221)

#### Inherited from

[`BaseFetcherProperties`](BaseFetcherProperties.md).[`useSiteRegistry`](BaseFetcherProperties.md#usesiteregistry)
