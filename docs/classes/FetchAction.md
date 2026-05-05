[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchAction

# Abstract Class: FetchAction

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:25](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L25)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:67](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L67)

***

### id

> `static` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:65](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L65)

***

### returnType

> `static` **returnType**: [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `'any'`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:66](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L66)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:89](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L89)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:81](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L81)

##### Returns

`string`

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:85](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L85)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:317](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L317)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:273](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L273)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:110](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L110)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:387](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L387)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:76](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L76)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `CollectorsRuntime` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:127](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L127)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:98](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L98)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:94](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L94)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:104](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L104)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:39](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L39)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`FetchAction` \| `undefined`

#### Call Signature

> `static` **create**(`id`): `FetchAction` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:40](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L40)

##### Parameters

###### id

`string`

##### Returns

`FetchAction` \| `undefined`

***

### get()

> `static` **get**(`id`): `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:35](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L35)

#### Parameters

##### id

`string`

#### Returns

`any`

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:72](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L72)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:56](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L56)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:60](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L60)

#### Returns

`string`[]

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:29](https://github.com/isdk/web-fetcher.js/blob/4cd06ed0bedeb2fc8c9242e05d3d068c125ab8a8/src/action/fetch-action.ts#L29)

#### Parameters

##### actionClass

`any`

#### Returns

`void`
