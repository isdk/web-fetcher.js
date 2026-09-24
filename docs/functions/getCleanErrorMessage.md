[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / getCleanErrorMessage

# Function: getCleanErrorMessage()

> **getCleanErrorMessage**(`msg`): `object`

Defined in: [packages/web-fetcher/src/engine/error-helpers.ts:13](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/engine/error-helpers.ts#L13)

Extracts only the first line of an error message (the real error).
Some errors (e.g. Playwright's `page.goto()` failures) include verbose debug
info like "Call log" after a newline. This function strips that debug info
and returns the full message separately for storage in error.data.

## Parameters

### msg

`string` \| `null` \| `undefined`

The raw error message

## Returns

`object`

An object with `clean` (first line only) and `full` (original or undefined if no newline)

### clean

> **clean**: `string`

### full

> **full**: `string` \| `undefined`
