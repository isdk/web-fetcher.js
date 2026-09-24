[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchActionInContext

# Type Alias: FetchActionInContext

> **FetchActionInContext** = [`FetchActionOptions`](FetchActionOptions.md) & `object`

Defined in: [packages/web-fetcher/src/core/context.ts:17](https://github.com/isdk/web-fetcher.js/blob/0bc2320e338a4948a0a7406bd326e792d033f11e/src/core/context.ts#L17)

Represents the state of an action being executed within a context.

## Type Declaration

### depth?

> `optional` **depth?**: `number`

The nesting depth of the action. Top-level actions (executed directly by the session) have a depth of 0.

### error?

> `optional` **error?**: `Error`

Error encountered during action execution, if any.

### index?

> `optional` **index?**: `number`

The 0-based index of the action in the execution sequence.

## Remarks

Extends the basic action properties with runtime metadata like execution index,
nesting depth, and any errors encountered during execution.
