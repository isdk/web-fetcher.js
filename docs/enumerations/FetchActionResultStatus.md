[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / FetchActionResultStatus

# Enumeration: FetchActionResultStatus

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:7](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L7)

## Enumeration Members

### Failed

> **Failed**: `0`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:11](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L11)

动作执行失败但未抛出（通常因 failOnError=false）；错误信息在 error 字段

***

### Skipped

> **Skipped**: `2`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:20](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L20)

动作被判定为不执行/降级为 noop（比如引擎不支持且 degradeTo='noop'）
能力不支持且 degradeTo='noop' 时：status='skipped'，warnings 增加 { code:'capability-not-supported' }

***

### Success

> **Success**: `1`

Defined in: [packages/web-fetcher/src/action/fetch-action.ts:15](https://github.com/isdk/web-fetcher.js/blob/9d976e330f39f712a4e409b1bd1bd44a5fb476bf/src/action/fetch-action.ts#L15)

动作按预期完成（即便产生 warnings）
