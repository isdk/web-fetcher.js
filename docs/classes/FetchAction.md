[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchAction

# Abstract Class: FetchAction

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:25](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L25)

## Extended by

- [`ClickAction`](ClickAction.md)
- [`FillAction`](FillAction.md)
- [`GetContentAction`](GetContentAction.md)
- [`GotoAction`](GotoAction.md)
- [`SubmitAction`](SubmitAction.md)
- [`WaitForAction`](WaitForAction.md)
- [`ExtractAction`](ExtractAction.md)
- [`PauseAction`](PauseAction.md)
- [`TrimAction`](TrimAction.md)
- [`EvaluateAction`](EvaluateAction.md)
- [`MouseMoveAction`](MouseMoveAction.md)
- [`MouseClickAction`](MouseClickAction.md)
- [`ScrollIntoViewAction`](ScrollIntoViewAction.md)
- [`MouseWheelAction`](MouseWheelAction.md)
- [`KeyboardTypeAction`](KeyboardTypeAction.md)
- [`KeyboardPressAction`](KeyboardPressAction.md)

## Constructors

### Constructor

> **new FetchAction**(): `FetchAction`

#### Returns

`FetchAction`

## Properties

### capabilities

> `static` **capabilities**: [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:72](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L72)

***

### id

> `static` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:70](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L70)

***

### returnType

> `static` **returnType**: [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `'any'`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:71](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L71)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:94](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L94)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:86](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L86)

##### Returns

`string`

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:90](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L90)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:322](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L322)

Action 结束生命周期
负责：调用钩子、赋值lastResult, 触发事件、清理 stack、恢复 currentAction

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`BaseFetchCollectorActionProperties`](../interfaces/BaseFetchCollectorActionProperties.md)

##### result?

[`FetchActionResult`](../interfaces/FetchActionResult.md)\<[`FetchReturnType`](../type-aliases/FetchReturnType.md)\>

##### scope?

###### collectors?

`CollectorsRuntime`

###### entry

[`FetchActionInContext`](../type-aliases/FetchActionInContext.md)

#### Returns

`Promise`\<`void`\>

***

### beforeExec()

> **beforeExec**(`context`, `options?`): `Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: `Required`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"action"`\>\> & `Partial`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"id"` \| `"name"`\>\> & `object` & `object`; \}\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:278](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L278)

Action 开始生命周期
负责：初始化 stack、设置 currentAction、触发事件、调用钩子

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: `Required`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"action"`\>\> & `Partial`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"id"` \| `"name"`\>\> & `object` & `object`; \}\>

***

### delegateToEngine()

> `protected` **delegateToEngine**(`context`, `method`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:115](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L115)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### method

keyof [`FetchEngine`](FetchEngine.md)\<`any`, `any`, `any`\>

##### args

...`any`[]

#### Returns

`Promise`\<`any`\>

***

### execute()

> **execute**\<`R`\>(`context`, `options?`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:392](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L392)

#### Type Parameters

##### R

`R` *extends* [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `"any"`

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

***

### getCapability()

> **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:81](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L81)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `CollectorsRuntime` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:132](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L132)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`CollectorsRuntime` \| `undefined`

***

### onAfterExec()?

> `protected` `optional` **onAfterExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:103](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L103)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onBeforeExec()?

> `protected` `optional` **onBeforeExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:99](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L99)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`void` \| `Promise`\<`void`\>

***

### onExecute()

> `abstract` **onExecute**(`context`, `options?`, `eventPayload?`): `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:109](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L109)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

##### eventPayload?

`any`

#### Returns

`any`

***

### create()

#### Call Signature

> `static` **create**(`id`): `FetchAction` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:44](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L44)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`FetchAction` \| `undefined`

#### Call Signature

> `static` **create**(`id`): `FetchAction` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:45](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L45)

##### Parameters

###### id

`string`

##### Returns

`FetchAction` \| `undefined`

***

### get()

> `static` **get**(`id`): `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:40](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L40)

#### Parameters

##### id

`string`

#### Returns

`any`

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:77](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L77)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:61](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L61)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:65](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L65)

#### Returns

`string`[]

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:29](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L29)

#### Parameters

##### actionClass

`any`

#### Returns

`void`

***

### unregister()

> `static` **unregister**(`id`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:35](https://github.com/isdk/web-fetcher.js/blob/bf9c111d3175cbd43514341884a53a14f7b3a93b/src/action/fetch-action.ts#L35)

#### Parameters

##### id

`string`

#### Returns

`void`
