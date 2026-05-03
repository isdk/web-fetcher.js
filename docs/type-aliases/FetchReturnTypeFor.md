[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:27](https://github.com/isdk/web-fetcher.js/blob/65ab5500b355c69b13e50e6c5787424ee7b1e1f4/src/core/fetch-return-type.ts#L27)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
