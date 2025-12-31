[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / ClickAction

# Class: ClickAction

Defined in: [packages/web-fetcher/src/action/definitions/click.ts:4](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/definitions/click.ts#L4)

## Extends

- [`FetchAction`](FetchAction.md)

## Constructors

### Constructor

> **new ClickAction**(): `ClickAction`

#### Returns

`ClickAction`

#### Inherited from

[`FetchAction`](FetchAction.md).[`constructor`](FetchAction.md#constructor)

## Properties

### capabilities

> `static` **capabilities**: `object`

Defined in: [packages/web-fetcher/src/action/definitions/click.ts:7](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/definitions/click.ts#L7)

#### browser

> **browser**: `"native"`

#### http

> **http**: `"simulate"`

#### Overrides

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities)

***

### id

> `static` **id**: `string` = `'click'`

Defined in: [packages/web-fetcher/src/action/definitions/click.ts:5](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/definitions/click.ts#L5)

#### Overrides

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id)

***

### returnType

> `static` **returnType**: `"none"`

Defined in: [packages/web-fetcher/src/action/definitions/click.ts:6](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/definitions/click.ts#L6)

#### Overrides

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:139](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L139)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities-1)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:131](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L131)

##### Returns

`string`

#### Inherited from

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id-1)

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:135](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L135)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype-1)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`afterExec`](FetchAction.md#afterexec)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`beforeExec`](FetchAction.md#beforeexec)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`delegateToEngine`](FetchAction.md#delegatetoengine)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`execute`](FetchAction.md#execute)

***

### getCapability()

> **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:126](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L126)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:167](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L167)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:145](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L145)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:144](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L144)

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

> **onExecute**(`context`, `options?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/definitions/click.ts:9](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/definitions/click.ts#L9)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`BaseFetchActionProperties`](../interfaces/BaseFetchActionProperties.md)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`FetchAction`](FetchAction.md).[`onExecute`](FetchAction.md#onexecute)

***

### create()

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:100](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L100)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

`undefined` \| [`FetchAction`](FetchAction.md)

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

#### Call Signature

> `static` **create**(`id`): `undefined` \| [`FetchAction`](FetchAction.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:101](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L101)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:96](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L96)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:122](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L122)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:109](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L109)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:113](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L113)

#### Returns

`string`[]

#### Inherited from

[`FetchAction`](FetchAction.md).[`list`](FetchAction.md#list)

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:90](https://github.com/isdk/web-fetcher.js/blob/d7b505cc39fc821039fb79f641e2e590d2fc028d/src/action/fetch-action.ts#L90)

#### Parameters

##### actionClass

*typeof* [`FetchAction`](FetchAction.md)

#### Returns

`void`

#### Inherited from

[`FetchAction`](FetchAction.md).[`register`](FetchAction.md#register)
