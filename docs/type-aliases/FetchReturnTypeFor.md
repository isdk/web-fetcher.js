[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:26](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/core/fetch-return-type.ts#L26)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
