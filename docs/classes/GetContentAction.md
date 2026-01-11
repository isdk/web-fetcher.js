[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / GetContentAction

# Class: GetContentAction

Defined in: [packages/web-fetcher/src/action/definitions/get-content.ts:4](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/definitions/get-content.ts#L4)

## Extends

- [`FetchAction`](FetchAction.md)

## Constructors

### Constructor

> **new GetContentAction**(): `GetContentAction`

#### Returns

`GetContentAction`

#### Inherited from

[`FetchAction`](FetchAction.md).[`constructor`](FetchAction.md#constructor)

## Properties

### capabilities

> `static` **capabilities**: `object`

Defined in: [packages/web-fetcher/src/action/definitions/get-content.ts:7](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/definitions/get-content.ts#L7)

#### browser

> **browser**: `"native"`

#### http

> **http**: `"native"`

#### Overrides

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities)

***

### id

> `static` **id**: `string` = `'getContent'`

Defined in: [packages/web-fetcher/src/action/definitions/get-content.ts:5](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/definitions/get-content.ts#L5)

#### Overrides

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id)

***

### returnType

> `static` **returnType**: `"response"`

Defined in: [packages/web-fetcher/src/action/definitions/get-content.ts:6](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/definitions/get-content.ts#L6)

#### Overrides

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:163](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L163)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities-1)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:155](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L155)

##### Returns

`string`

#### Inherited from

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id-1)

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:159](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L159)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype-1)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:391](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L391)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:347](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L347)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:184](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L184)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:448](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L448)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:150](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L150)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:201](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L201)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:172](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L172)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:168](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L168)

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

Defined in: [packages/web-fetcher/src/action/definitions/get-content.ts:12](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/definitions/get-content.ts#L12)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`BaseFetchActionProperties`](../interfaces/BaseFetchActionProperties.md)

#### Returns

`Promise`\<`any`\>

#### Overrides

[`FetchAction`](FetchAction.md).[`onExecute`](FetchAction.md#onexecute)

***

### create()

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:113](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L113)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`undefined` \| [`FetchAction`](FetchAction.md)

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:114](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L114)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:109](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L109)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:146](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L146)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:130](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L130)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:134](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L134)

#### Returns

`string`[]

#### Inherited from

[`FetchAction`](FetchAction.md).[`list`](FetchAction.md#list)

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:103](https://github.com/isdk/web-fetcher.js/blob/61e40bab9fc20e6de9e2060909d088d8c6cc7b99/src/action/fetch-action.ts#L103)

#### Parameters

##### actionClass

*typeof* [`FetchAction`](FetchAction.md)

#### Returns

`void`

#### Inherited from

[`FetchAction`](FetchAction.md).[`register`](FetchAction.md#register)
