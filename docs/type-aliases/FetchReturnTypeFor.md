[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:27](https://github.com/isdk/web-fetcher.js/blob/e691a2370f59d15979b47994c8ca14d7b7d2edd3/src/core/fetch-return-type.ts#L27)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
