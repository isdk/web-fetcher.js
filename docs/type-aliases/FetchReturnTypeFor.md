[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:26](https://github.com/isdk/web-fetcher.js/blob/0924820473b072934504dffda99bb10cd207ce06/src/core/fetch-return-type.ts#L26)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
