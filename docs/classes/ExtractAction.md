[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / ExtractAction

# Class: ExtractAction

Defined in: [packages/web-fetcher/src/action/definitions/extract.ts:9](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/definitions/extract.ts#L9)

## Extends

- [`FetchAction`](FetchAction.md)

## Constructors

### Constructor

> **new ExtractAction**(): `ExtractAction`

#### Returns

`ExtractAction`

#### Inherited from

[`FetchAction`](FetchAction.md).[`constructor`](FetchAction.md#constructor)

## Properties

### capabilities

> `static` **capabilities**: `object`

Defined in: [packages/web-fetcher/src/action/definitions/extract.ts:12](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/definitions/extract.ts#L12)

#### browser

> **browser**: `"native"`

#### http

> **http**: `"native"`

#### Overrides

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities)

***

### id

> `static` **id**: `string` = `'extract'`

Defined in: [packages/web-fetcher/src/action/definitions/extract.ts:10](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/definitions/extract.ts#L10)

#### Overrides

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id)

***

### returnType

> `static` **returnType**: `"any"`

Defined in: [packages/web-fetcher/src/action/definitions/extract.ts:11](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/definitions/extract.ts#L11)

#### Overrides

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:137](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L137)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities-1)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:129](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L129)

##### Returns

`string`

#### Inherited from

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id-1)

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:133](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L133)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype-1)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:311](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L311)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`afterExec`](FetchAction.md#afterexec)

***

### beforeExec()

> **beforeExec**(`context`, `options?`): `Promise`\<\{ `collectors`: `undefined` \| `CollectorsRuntime`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:265](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L265)

Action 开始生命周期
负责：初始化 stack、设置 currentAction、触发事件、调用钩子

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<\{ `collectors`: `undefined` \| `CollectorsRuntime`; `entry`: [`FetchActionInContext`](../interfaces/FetchActionInContext.md); \}\>

#### Inherited from

[`FetchAction`](FetchAction.md).[`beforeExec`](FetchAction.md#beforeexec)

***

### delegateToEngine()

> `protected` **delegateToEngine**(`context`, `method`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:148](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L148)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### method

keyof [`FetchEngine`](FetchEngine.md)\<`any`, `any`, `any`\>

##### args

...`any`[]

#### Returns

`Promise`\<`any`\>

#### Inherited from

[`FetchAction`](FetchAction.md).[`delegateToEngine`](FetchAction.md#delegatetoengine)

***

### execute()

> **execute**\<`R`\>(`context`, `options?`): `Promise`\<[`FetchActionResult`](../interfaces/FetchActionResult.md)\<`R`\>\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:363](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L363)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`execute`](FetchAction.md#execute)

***

### getCapability()

> **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:124](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L124)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`getCapability`](FetchAction.md#getcapability)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `undefined` \| `CollectorsRuntime`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:165](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L165)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`undefined` \| `CollectorsRuntime`

#### Inherited from

[`FetchAction`](FetchAction.md).[`installCollectors`](FetchAction.md#installcollectors)

***

### onAfterExec()?

> `protected` `optional` **onAfterExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:143](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L143)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`FetchAction`](FetchAction.md).[`onAfterExec`](FetchAction.md#onafterexec)

***

### onBeforeExec()?

> `protected` `optional` **onBeforeExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:142](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L142)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`void` \| `Promise`\<`void`\>

#### Inherited from

[`FetchAction`](FetchAction.md).[`onBeforeExec`](FetchAction.md#onbeforeexec)

***

### onExecute()

> **onExecute**(`context`, `options?`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/definitions/extract.ts:14](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/definitions/extract.ts#L14)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`ExtractActionProperties`](../interfaces/ExtractActionProperties.md)

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchAction`](FetchAction.md).[`onExecute`](FetchAction.md#onexecute)

***

### create()

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:98](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L98)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`undefined` \| [`FetchAction`](FetchAction.md)

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:99](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L99)

##### Parameters

###### id

`string`

##### Returns

`undefined` \| [`FetchAction`](FetchAction.md)

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

***

### get()

> `static` **get**(`id`): `undefined` \| *typeof* [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:94](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L94)

#### Parameters

##### id

`string`

#### Returns

`undefined` \| *typeof* [`FetchAction`](FetchAction.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`get`](FetchAction.md#get)

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:120](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L120)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`getCapability`](FetchAction.md#getcapability-2)

***

### has()

> `static` **has**(`name`): `boolean`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:107](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L107)

#### Parameters

##### name

`string`

#### Returns

`boolean`

#### Inherited from

[`FetchAction`](FetchAction.md).[`has`](FetchAction.md#has)

***

### list()

> `static` **list**(): `string`[]

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:111](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L111)

#### Returns

`string`[]

#### Inherited from

[`FetchAction`](FetchAction.md).[`list`](FetchAction.md#list)

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:88](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L88)

#### Parameters

##### actionClass

*typeof* [`FetchAction`](FetchAction.md)

#### Returns

`void`

#### Inherited from

[`FetchAction`](FetchAction.md).[`register`](FetchAction.md#register)
