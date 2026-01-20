[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:27](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/core/fetch-return-type.ts#L27)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
