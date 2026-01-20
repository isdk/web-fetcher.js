[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchAction

# Abstract Class: FetchAction

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:99](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L99)

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

## Constructors

### Constructor

> **new FetchAction**(): `FetchAction`

#### Returns

`FetchAction`

## Properties

### capabilities

> `static` **capabilities**: [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:141](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L141)

***

### id

> `static` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:139](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L139)

***

### returnType

> `static` **returnType**: [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `'any'`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:140](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L140)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:163](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L163)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:155](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L155)

##### Returns

`string`

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:159](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L159)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:391](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L391)

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

[`FetchActionInContext`](../interfaces/FetchActionInContext.md)

#### Returns

`Promise`\<`void`\>

***

### beforeExec()

> **beforeExec**(`context`, `options?`): `Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:347](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L347)

Action 开始生命周期
负责：初始化 stack、设置 currentAction、触发事件、调用钩子

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

***

### delegateToEngine()

> `protected` **delegateToEngine**(`context`, `method`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:184](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L184)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:448](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L448)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:150](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L150)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `CollectorsRuntime` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:201](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L201)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:172](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L172)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:168](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L168)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:178](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L178)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:113](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L113)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`FetchAction` \| `undefined`

#### Call Signature

> `static` **create**(`id`): `FetchAction` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:114](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L114)

##### Parameters

###### id

`string`

##### Returns

`FetchAction` \| `undefined`

***

### get()

> `static` **get**(`id`): *typeof* `FetchAction` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:109](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L109)

#### Parameters

##### id

`string`

#### Returns

*typeof* `FetchAction` \| `undefined`

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:146](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L146)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:130](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L130)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:134](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L134)

#### Returns

`string`[]

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:103](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/action/fetch-action.ts#L103)

#### Parameters

##### actionClass

*typeof* `FetchAction`

#### Returns

`void`
