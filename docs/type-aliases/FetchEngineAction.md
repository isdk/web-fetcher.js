[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchEngineAction

# Type Alias: FetchEngineAction

> **FetchEngineAction** = \{ `selector`: `string`; `type`: `"click"`; \} \| \{ `selector`: `string`; `type`: `"fill"`; `value`: `string`; \} \| \{ `params`: \{ `selector?`: `string`; `steps?`: `number`; `x?`: `number`; `y?`: `number`; \}; `type`: `"mouseMove"`; \} \| \{ `params`: \{ `button?`: `"left"` \| `"right"` \| `"middle"`; `clickCount?`: `number`; `delay?`: `number`; `steps?`: `number`; `x?`: `number`; `y?`: `number`; \}; `type`: `"mouseClick"`; \} \| \{ `params`: \{ `deltaX?`: `number`; `deltaY?`: `number`; `selector?`: `string`; `steps?`: `number`; `x?`: `number`; `y?`: `number`; \}; `type`: `"mouseWheel"`; \} \| \{ `params`: \{ `delay?`: `number`; `text`: `string`; \}; `type`: `"keyboardType"`; \} \| \{ `params`: \{ `delay?`: `number`; `key`: `string`; \}; `type`: `"keyboardPress"`; \} \| \{ `params`: \{ `selector`: `string`; \}; `type`: `"scrollIntoView"`; \} \| \{ `options?`: [`WaitForActionOptions`](../interfaces/WaitForActionOptions.md); `type`: `"waitFor"`; \} \| \{ `options?`: [`SubmitActionOptions`](../interfaces/SubmitActionOptions.md); `selector?`: `any`; `type`: `"submit"`; \} \| \{ `type`: `"getContent"`; \} \| \{ `opts?`: [`GotoActionOptions`](../interfaces/GotoActionOptions.md); `type`: `"navigate"`; `url`: `string`; \} \| \{ `schema`: `ExtractSchema`; `type`: `"extract"`; \} \| \{ `message?`: `string`; `type`: `"pause"`; \} \| \{ `options`: [`TrimActionOptions`](../interfaces/TrimActionOptions.md); `type`: `"trim"`; \} \| \{ `params`: [`EvaluateActionOptions`](../interfaces/EvaluateActionOptions.md); `type`: `"evaluate"`; \} \| \{ `type`: `"dispose"`; \}

Defined in: [packages/web-fetcher/src/engine/base.ts:210](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/engine/base.ts#L210)

Union type representing all possible engine actions that can be dispatched.

## Remarks

Defines the command structure processed during page interactions. Each action type corresponds to
a specific user interaction or navigation command within the action loop architecture.
