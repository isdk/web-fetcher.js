[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchContext

# Interface: FetchContext

Defined in: [packages/web-fetcher/src/core/context.ts:35](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L35)

## Extends

- [`FetchEngineContext`](FetchEngineContext.md)

## Properties

### antibot?

> `optional` **antibot**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:37](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L37)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`antibot`](FetchEngineContext.md#antibot)

***

### blockResources?

> `optional` **blockResources**: `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:46](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L46)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`blockResources`](FetchEngineContext.md#blockresources)

***

### browser?

> `optional` **browser**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:52](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L52)

#### engine?

> `optional` **engine**: [`BrowserEngine`](../type-aliases/BrowserEngine.md)

浏览器引擎，默认为 playwright

- `playwright`: 使用 Playwright 引擎
- `puppeteer`: 使用 Puppeteer 引擎

#### headless?

> `optional` **headless**: `boolean`

#### waitUntil?

> `optional` **waitUntil**: `"load"` \| `"domcontentloaded"` \| `"networkidle"` \| `"commit"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`browser`](FetchEngineContext.md#browser)

***

### cookies?

> `optional` **cookies**: [`Cookie`](Cookie.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:40](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L40)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`cookies`](FetchEngineContext.md#cookies)

***

### currentAction?

> `optional` **currentAction**: [`FetchActionInContext`](FetchActionInContext.md)

Defined in: [packages/web-fetcher/src/core/context.ts:36](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L36)

***

### delayBetweenRequestsMs?

> `optional` **delayBetweenRequestsMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:72](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L72)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`delayBetweenRequestsMs`](FetchEngineContext.md#delaybetweenrequestsms)

***

### enableSmart?

> `optional` **enableSmart**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:35](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L35)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`enableSmart`](FetchEngineContext.md#enablesmart)

***

### engine?

> `optional` **engine**: `string`

Defined in: [packages/web-fetcher/src/core/types.ts:34](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L34)

抓取模式

- `http`: 使用 HTTP 进行抓取
- `browser`: 使用浏览器进行抓取
- `auto`: auto 会走“智能探测”选择 http 或 browser, 但是如果没有启用 smart，并且在站点注册表中没有，那么则等价为 http.

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`engine`](FetchEngineContext.md#engine)

***

### eventBus

> **eventBus**: `EventEmitter`

Defined in: [packages/web-fetcher/src/core/context.ts:48](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L48)

***

### finalUrl?

> `optional` **finalUrl**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:27](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L27)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`finalUrl`](FetchEngineContext.md#finalurl)

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [packages/web-fetcher/src/core/types.ts:39](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L39)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`headers`](FetchEngineContext.md#headers)

***

### http?

> `optional` **http**: `object`

Defined in: [packages/web-fetcher/src/core/types.ts:64](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L64)

#### body?

> `optional` **body**: `any`

#### method?

> `optional` **method**: `"GET"` \| `"POST"` \| `"PUT"` \| `"DELETE"` \| `"PATCH"`

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`http`](FetchEngineContext.md#http)

***

### id

> **id**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:25](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L25)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`id`](FetchEngineContext.md#id)

***

### ignoreSslErrors?

> `optional` **ignoreSslErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:50](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L50)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`ignoreSslErrors`](FetchEngineContext.md#ignoresslerrors)

***

### internal

> **internal**: `FetchContextInteralState`

Defined in: [packages/web-fetcher/src/core/context.ts:46](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L46)

#### Overrides

[`FetchEngineContext`](FetchEngineContext.md).[`internal`](FetchEngineContext.md#internal)

***

### lastResponse?

> `optional` **lastResponse**: [`FetchResponse`](FetchResponse.md)

Defined in: [packages/web-fetcher/src/core/context.ts:29](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L29)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResponse`](FetchEngineContext.md#lastresponse)

***

### lastResult?

> `optional` **lastResult**: [`FetchActionResult`](FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

Defined in: [packages/web-fetcher/src/core/context.ts:30](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L30)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`lastResult`](FetchEngineContext.md#lastresult)

***

### maxConcurrency?

> `optional` **maxConcurrency**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:70](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L70)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxConcurrency`](FetchEngineContext.md#maxconcurrency)

***

### maxRequestsPerMinute?

> `optional` **maxRequestsPerMinute**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:71](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L71)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`maxRequestsPerMinute`](FetchEngineContext.md#maxrequestsperminute)

***

### outputs

> **outputs**: `Record`\<`string`, `any`\>

Defined in: [packages/web-fetcher/src/core/context.ts:38](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L38)

***

### proxy?

> `optional` **proxy**: `string` \| `string`[]

Defined in: [packages/web-fetcher/src/core/types.ts:44](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L44)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`proxy`](FetchEngineContext.md#proxy)

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:73](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L73)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`retries`](FetchEngineContext.md#retries)

***

### reuseCookies?

> `optional` **reuseCookies**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:41](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L41)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`reuseCookies`](FetchEngineContext.md#reusecookies)

***

### sites?

> `optional` **sites**: [`FetchSite`](FetchSite.md)[]

Defined in: [packages/web-fetcher/src/core/types.ts:75](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L75)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`sites`](FetchEngineContext.md#sites)

***

### throwHttpErrors?

> `optional` **throwHttpErrors**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:42](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L42)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`throwHttpErrors`](FetchEngineContext.md#throwhttperrors)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/web-fetcher/src/core/types.ts:69](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L69)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`timeoutMs`](FetchEngineContext.md#timeoutms)

***

### url?

> `optional` **url**: `string`

Defined in: [packages/web-fetcher/src/core/context.ts:26](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L26)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`url`](FetchEngineContext.md#url)

***

### useSiteRegistry?

> `optional` **useSiteRegistry**: `boolean`

Defined in: [packages/web-fetcher/src/core/types.ts:36](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/types.ts#L36)

#### Inherited from

[`FetchEngineContext`](FetchEngineContext.md).[`useSiteRegistry`](FetchEngineContext.md#usesiteregistry)

## Methods

### action()

> **action**\<`R`\>(`name`, `params?`, `options?`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:43](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L43)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### name

`string`

##### params?

`any`

##### options?

`Partial`\<`_RequireAtLeastOne`\<[`FetchActionProperties`](FetchActionProperties.md), `"name"` \| `"id"`\>\>

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

***

### execute()

> **execute**\<`R`\>(`actionOptions`): `Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/core/context.ts:41](https://github.com/isdk/web-fetcher.js/blob/db611cb04a516e006310c5e147f90026827d6d80/src/core/context.ts#L41)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### actionOptions

`_RequireAtLeastOne`

#### Returns

`Promise`\<[`FetchActionResult`](FetchActionResult.md)\<`R`\>\>
