[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:26](https://github.com/isdk/web-fetcher.js/blob/c1517484868ef8b225a00e5e38d64af2889681fb/src/core/fetch-return-type.ts#L26)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
