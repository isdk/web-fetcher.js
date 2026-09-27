[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / createErrorResponse

# Function: createErrorResponse()

> **createErrorResponse**(`url`, `loadedUrl`, `statusCode`, `statusText`): [`FetchResponse`](../interfaces/FetchResponse.md)

Defined in: [packages/web-fetcher/src/engine/error-helpers.ts:27](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/engine/error-helpers.ts#L27)

Creates a minimal error response object for when navigation fails.
Used as the `.response` property on rejected CommonError instances.

## Parameters

### url

`string`

### loadedUrl

`string` \| `undefined`

### statusCode

`number`

### statusText

`string`

## Returns

[`FetchResponse`](../interfaces/FetchResponse.md)
