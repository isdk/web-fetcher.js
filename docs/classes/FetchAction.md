[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchAction

# Abstract Class: FetchAction

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:86](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L86)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:120](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L120)

***

### id

> `static` **id**: `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:118](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L118)

***

### returnType

> `static` **returnType**: [`FetchReturnType`](../type-aliases/FetchReturnType.md) = `'any'`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:119](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L119)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:139](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L139)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:131](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L131)

##### Returns

`string`

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:135](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L135)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:313](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L313)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:267](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L267)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:150](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L150)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:365](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L365)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:126](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L126)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `undefined` \| `CollectorsRuntime`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:167](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L167)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:145](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L145)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:144](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L144)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:148](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L148)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:100](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L100)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`undefined` \| `FetchAction`

#### Call Signature

> `static` **create**(`id`): `undefined` \| `FetchAction`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:101](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L101)

##### Parameters

###### id

`string`

##### Returns

`undefined` \| `FetchAction`

***

### get()

> `static` **get**(`id`): `undefined` \| *typeof* `FetchAction`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:96](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L96)

#### Parameters

##### id

`string`

#### Returns

`undefined` \| *typeof* `FetchAction`

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:122](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L122)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:109](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L109)

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:113](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L113)

#### Returns

`string`[]

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:90](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L90)

#### Parameters

##### actionClass

*typeof* `FetchAction`

#### Returns

`void`
