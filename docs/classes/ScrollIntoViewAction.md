[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / ScrollIntoViewAction

# Class: ScrollIntoViewAction

Defined in: [packages/web-fetcher/src/action/definitions/mouse.ts:57](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/definitions/mouse.ts#L57)

## Extends

- [`FetchAction`](FetchAction.md)

## Constructors

### Constructor

> **new ScrollIntoViewAction**(): `ScrollIntoViewAction`

#### Returns

`ScrollIntoViewAction`

#### Inherited from

[`FetchAction`](FetchAction.md).[`constructor`](FetchAction.md#constructor)

## Properties

### capabilities

> `static` **capabilities**: `object`

Defined in: [packages/web-fetcher/src/action/definitions/mouse.ts:60](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/definitions/mouse.ts#L60)

#### browser

> **browser**: `"native"`

#### http

> **http**: `"noop"`

#### Overrides

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities)

***

### id

> `static` **id**: `string` = `'scrollIntoView'`

Defined in: [packages/web-fetcher/src/action/definitions/mouse.ts:58](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/definitions/mouse.ts#L58)

#### Overrides

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id)

***

### returnType

> `static` **returnType**: `"none"`

Defined in: [packages/web-fetcher/src/action/definitions/mouse.ts:59](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/definitions/mouse.ts#L59)

#### Overrides

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype)

## Accessors

### capabilities

#### Get Signature

> **get** **capabilities**(): [`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:89](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L89)

##### Returns

[`FetchActionCapabilities`](../type-aliases/FetchActionCapabilities.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`capabilities`](FetchAction.md#capabilities-1)

***

### id

#### Get Signature

> **get** **id**(): `string`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:81](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L81)

##### Returns

`string`

#### Inherited from

[`FetchAction`](FetchAction.md).[`id`](FetchAction.md#id-1)

***

### returnType

#### Get Signature

> **get** **returnType**(): [`FetchReturnType`](../type-aliases/FetchReturnType.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:85](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L85)

##### Returns

[`FetchReturnType`](../type-aliases/FetchReturnType.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`returnType`](FetchAction.md#returntype-1)

## Methods

### afterExec()

> **afterExec**(`context`, `options?`, `result?`, `scope?`): `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:317](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L317)

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

#### Inherited from

[`FetchAction`](FetchAction.md).[`afterExec`](FetchAction.md#afterexec)

***

### beforeExec()

> **beforeExec**(`context`, `options?`): `Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: `Required`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"action"`\>\> & `Partial`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"id"` \| `"name"`\>\> & `object` & `object`; \}\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:273](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L273)

Action 开始生命周期
负责：初始化 stack、设置 currentAction、触发事件、调用钩子

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`Promise`\<\{ `collectors`: `CollectorsRuntime` \| `undefined`; `entry`: `Required`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"action"`\>\> & `Partial`\<`Pick`\<[`FetchActionProperties`](../interfaces/FetchActionProperties.md), `"id"` \| `"name"`\>\> & `object` & `object`; \}\>

#### Inherited from

[`FetchAction`](FetchAction.md).[`beforeExec`](FetchAction.md#beforeexec)

***

### delegateToEngine()

> `protected` **delegateToEngine**(`context`, `method`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:110](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L110)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:387](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L387)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:76](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L76)

#### Parameters

##### mode?

[`FetchEngineType`](../type-aliases/FetchEngineType.md)

#### Returns

[`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

#### Inherited from

[`FetchAction`](FetchAction.md).[`getCapability`](FetchAction.md#getcapability)

***

### installCollectors()

> `protected` **installCollectors**(`context`, `options?`): `CollectorsRuntime` \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:127](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L127)

#### Parameters

##### context

[`FetchContext`](../interfaces/FetchContext.md)

##### options?

[`FetchActionProperties`](../interfaces/FetchActionProperties.md)

#### Returns

`CollectorsRuntime` \| `undefined`

#### Inherited from

[`FetchAction`](FetchAction.md).[`installCollectors`](FetchAction.md#installcollectors)

***

### onAfterExec()?

> `protected` `optional` **onAfterExec**(`context`, `options?`): `void` \| `Promise`\<`void`\>

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:98](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L98)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:94](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L94)

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

Defined in: [packages/web-fetcher/src/action/definitions/mouse.ts:65](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/definitions/mouse.ts#L65)

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

> `static` **create**(`id`): [`FetchAction`](FetchAction.md) \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:39](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L39)

##### Parameters

###### id

`_RequireAtLeastOne`

##### Returns

[`FetchAction`](FetchAction.md) \| `undefined`

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

#### Call Signature

> `static` **create**(`id`): [`FetchAction`](FetchAction.md) \| `undefined`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:40](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L40)

##### Parameters

###### id

`string`

##### Returns

[`FetchAction`](FetchAction.md) \| `undefined`

##### Inherited from

[`FetchAction`](FetchAction.md).[`create`](FetchAction.md#create)

***

### get()

> `static` **get**(`id`): `any`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:35](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L35)

#### Parameters

##### id

`string`

#### Returns

`any`

#### Inherited from

[`FetchAction`](FetchAction.md).[`get`](FetchAction.md#get)

***

### getCapability()

> `static` **getCapability**(`mode?`): [`FetchActionCapabilityMode`](../type-aliases/FetchActionCapabilityMode.md)

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:72](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L72)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:56](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L56)

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

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:60](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L60)

#### Returns

`string`[]

#### Inherited from

[`FetchAction`](FetchAction.md).[`list`](FetchAction.md#list)

***

### register()

> `static` **register**(`actionClass`): `void`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:29](https://github.com/isdk/web-fetcher.js/blob/bbbc9476fc1a8798bf3663ac564e568cf08714d8/src/action/fetch-action.ts#L29)

#### Parameters

##### actionClass

`any`

#### Returns

`void`

#### Inherited from

[`FetchAction`](FetchAction.md).[`register`](FetchAction.md#register)
