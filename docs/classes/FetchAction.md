[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchAction

# Abstract Class: FetchAction

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:84](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L84)

## Extended by

- [`ClickAction`](ClickAction.md)
- [`FillAction`](FillAction.md)
- [`GetContentAction`](GetContentAction.md)
- [`GotoAction`](GotoAction.md)
- [`SubmitAction`](SubmitAction.md)
- [`WaitForAction`](WaitForAction.md)
- [`ExtractAction`](ExtractAction.md)
- [`PauseAction`](PauseAction.md)

## Constructors

### Constructor

> **new FetchAction**(): `FetchAction`

#### Returns

`FetchAction`

## Properties

### capabilities

> `static` **capabilities**: [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:118](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L118)

***

### id

> `static` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:116](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L116)

***

### returnType

> `static` **returnType**: [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `'any'`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:117](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L117)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:137](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L137)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:129](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L129)

##### Returns

`string`

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:133](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L133)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:311](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L311)

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

> **beforeExec**(`context`, `options?`): `Promise`\<\{ `collectors`: `undefined` \| `CollectorsRuntime`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:265](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L265)

Action 开始生命周期
负责：初始化 stack、设置 currentAction、触发事件、调用钩子

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<\{ `collectors`: `undefined` \| `CollectorsRuntime`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

***

### delegateToEngine()

> `protected` **delegateToEngine**(`context`, `method`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:148](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L148)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:363](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L363)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:124](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L124)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `undefined` \| `CollectorsRuntime`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:165](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L165)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`undefined` \| `CollectorsRuntime`

***

### onAfterExec()?

> `protected` `optional` **onAfterExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:143](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L143)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:142](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L142)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:146](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L146)

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

> `static` **create**(`id`): `undefined` \| `FetchAction`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:98](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L98)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`undefined` \| `FetchAction`

#### Call Signature

> `static` **create**(`id`): `undefined` \| `FetchAction`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:99](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L99)

##### Parameters

###### id

`string`

##### Returns

`undefined` \| `FetchAction`

***

### get()

> `static` **get**(`id`): `undefined` \| *typeof* `FetchAction`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:94](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L94)

#### Parameters

##### id

`string`

#### Returns

`undefined` \| *typeof* `FetchAction`

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:120](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L120)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:107](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L107)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:111](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L111)

#### Returns

`string`[]

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:88](https://github.com/isdk/web-fetcher.js/blob/ad509e5c670ead64b82e31f8e0f1d7a384833452/src/action/fetch-action.ts#L88)

#### Parameters

##### actionClass

*typeof* `FetchAction`

#### Returns

`void`
