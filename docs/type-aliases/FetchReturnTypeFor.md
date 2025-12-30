[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:22](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/core/fetch-return-type.ts#L22)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
