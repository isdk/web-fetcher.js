[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / createNavigationError

# Function: createNavigationError()

> **createNavigationError**(`message`, `statusCode`, `originalMessage?`): `CommonError` & `object`

Defined in: [packages/web-fetcher/src/engine/error-helpers.ts:49](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/error-helpers.ts#L49)

Creates a CommonError with standardized 'request' code and optional
originalMessage in data for multi-line debug info (e.g. Playwright "Call log").

## Parameters

### message

`string`

### statusCode

`number`

### originalMessage?

`string`

## Returns

`CommonError` & `object`
