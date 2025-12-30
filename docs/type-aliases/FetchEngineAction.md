[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngineAction

# Type Alias: FetchEngineAction

> **FetchEngineAction** = \{ `selector`: `string`; `type`: `"click"`; \} \| \{ `selector`: `string`; `type`: `"fill"`; `value`: `string`; \} \| \{ `options?`: [`WaitForActionOptions`](../interfaces/WaitForActionOptions.md); `type`: `"waitFor"`; \} \| \{ `options?`: [`SubmitActionOptions`](../interfaces/SubmitActionOptions.md); `selector?`: `any`; `type`: `"submit"`; \} \| \{ `type`: `"getContent"`; \} \| \{ `opts?`: [`GotoActionOptions`](../interfaces/GotoActionOptions.md); `type`: `"navigate"`; `url`: `string`; \} \| \{ `schema`: `ExtractSchema`; `type`: `"extract"`; \} \| \{ `message?`: `string`; `type`: `"pause"`; \} \| \{ `type`: `"dispose"`; \}

Defined in: [packages/web-fetcher/src/engine/base.ts:79](https://github.com/isdk/web-fetcher.js/blob/8bd7a48c89b74012f283a5397c5c3b526fdb7b09/src/engine/base.ts#L79)

Union type representing all possible engine actions that can be dispatched.

## Remarks

Defines the command structure processed during page interactions. Each action type corresponds to
a specific user interaction or navigation command within the action loop architecture.
