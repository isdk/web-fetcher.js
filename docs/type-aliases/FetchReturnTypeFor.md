[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchReturnTypeFor

# Type Alias: FetchReturnTypeFor\<R\>

> **FetchReturnTypeFor**\<`R`\> = `R` *extends* keyof [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md) ? [`FetchReturnTypeRegistry`](../interfaces/FetchReturnTypeRegistry.md)\[`R`\] : `never`

Defined in: [packages/web-fetcher/src/core/fetch-return-type.ts:27](https://github.com/isdk/web-fetcher.js/blob/ff2bf8a6938cad6b2dc7c85fb1380de226cb3724/src/core/fetch-return-type.ts#L27)

## Type Parameters

### R

`R` *extends* [`FetchReturnType`](FetchReturnType.md)
