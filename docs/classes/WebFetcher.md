[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / WebFetcher

# Class: WebFetcher

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:17](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/web-fetcher.ts#L17)

High-level entry point for the Web Fetcher library.

## Remarks

The `WebFetcher` provides a simplified API for fetching web content without manually managing sessions.
It can be used for one-off requests or as a factory for more complex `FetchSession` instances.

## Example

```ts
const fetcher = new WebFetcher();
const { result } = await fetcher.fetch('https://example.com');
```

## Constructors

### Constructor

> **new WebFetcher**(`defaults`): `WebFetcher`

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:23](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/web-fetcher.ts#L23)

Creates a new WebFetcher with default options.

#### Parameters

##### defaults

[`FetcherOptions`](../interfaces/FetcherOptions.md) = `{}`

Default configuration options applied to all sessions and requests.

#### Returns

`WebFetcher`

## Methods

### createSession()

> **createSession**(`options?`): `Promise`\<[`FetchSession`](FetchSession.md)\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:31](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/web-fetcher.ts#L31)

Creates a new FetchSession.

#### Parameters

##### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md)

Configuration options for the session, merged with defaults.

#### Returns

`Promise`\<[`FetchSession`](FetchSession.md)\>

A promise resolving to a new FetchSession instance.

***

### fetch()

#### Call Signature

> **fetch**(`url`, `options?`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:47](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/web-fetcher.ts#L47)

Fetches content from a URL or executes a complex action script.

##### Parameters

###### url

`string`

The target URL or a complete FetcherOptions object.

###### options?

[`FetcherOptions`](../interfaces/FetcherOptions.md)

Additional options when the first parameter is a URL string.

##### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

A promise resolving to the final response and any extracted outputs.

##### Remarks

This method automatically creates a session, executes the specified actions,
retrieves the content, and disposes of the session.

#### Call Signature

> **fetch**(`options`): `Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

Defined in: [packages/web-fetcher/src/core/web-fetcher.ts:54](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/core/web-fetcher.ts#L54)

Fetches content from a URL or executes a complex action script.

##### Parameters

###### options

[`FetcherOptions`](../interfaces/FetcherOptions.md)

Additional options when the first parameter is a URL string.

##### Returns

`Promise`\<\{ `outputs`: `Record`\<`string`, `any`\>; `result`: `undefined` \| [`FetchResponse`](../interfaces/FetchResponse.md); \}\>

A promise resolving to the final response and any extracted outputs.

##### Remarks

This method automatically creates a session, executes the specified actions,
retrieves the content, and disposes of the session.
