[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:22](https://github.com/isdk/web-fetcher.js/blob/7bb51cb9bc54b4138642b08ddf371740d89af7ca/src/core/fetch-return-type.ts#L22)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
