# `_sharedRequestHandler` 重构方案

## 现状

当前 `_sharedRequestHandler` 的核心问题是**用一个 `shouldExecuteActions` 标志在多个嵌套分支中分散赋值，然后在函数底部统一消费**。这导致控制流难以追踪。

### 当前伪代码结构

```
_sharedRequestHandler(context, error?)
  │
  ├─ 设置 this.isPageActive = true
  ├─ let shouldExecuteActions = false    ← 标志
  │
  ├─ if (gotoPromise exists)
  │   ├─ try { buildResponse() }
  │   │   ├─ if (可重试 429/5xx)
  │   │   │   └─ shouldExecuteActions = false
  │   │   ├─ else
  │   │   │   ├─ 判断上下文有效性
  │   │   │   ├─ if (throwHttpErrors && isError)
  │   │   │   │   ├─ 构造错误消息
  │   │   │   │   ├─ gotoPromise.reject()
  │   │   │   │   └─ shouldExecuteActions = false
  │   │   │   ├─ elif (!shouldExecuteActions && isError)
  │   │   │   │   ├─ gotoPromise.reject()
  │   │   │   └─ else
  │   │   │       ├─ gotoPromise.resolve()
  │   │   │       └─ （隐式应执行 action loop）
  │   │   └─ pendingRequests.delete()
  │   └─ catch (buildResponse 失败)
  │       ├─ 构造错误（主要错误路径）
  │       └─ gotoPromise.reject()
  │
  └─ else (无 gotoPromise)
      └─ shouldExecuteActions = true
  │
  └─ if (shouldExecuteActions)           ← 远处消费
      └─ _executePendingActions()
  │
  └─ finally { 清理 isPageActive, session, etc. }
```

### 问题清单

1. **`shouldExecuteActions` 标志横跨多个嵌套层级**，在 4 个不同位置被赋值，然后在底部被消费
2. **`if (gotoPromise)` 内部同时处理了 reject 和 resolve**，以及是否执行 action loop 的判断，逻辑交织在一起
3. **可重试逻辑插在中间**，导致 `else` 分支需要复杂的状态判断
4. **catch 块里还有 if-else**（区分 error 是否定义），不同的消息模板
5. **goto 成功也需要执行 action loop**，这隐藏在当前逻辑中不直观

## 重构方案

### 核心思路

用**早期 return + 拆分方法**来消除 `shouldExecuteActions` 标志，将两个不同职责分离：

1. **处理 goto 结果**（reject/resolve）→ 抽取为 `_handleGotoResult()`
2. **执行 action loop** → 直接在 `_sharedRequestHandler` 的 else 分支中处理

### 新结构

```typescript
protected async _sharedRequestHandler(context: TContext, error?: Error): Promise<void> {
  const { request } = context
  const requestId = request.userData.requestId
  const originalPage = (context as any).page

  this._logDebug('request', `Processing request: ${request.url} (requestId: ${requestId})`)
  try {
    this.currentSession = context.session
    this.isPageActive = true

    const gotoPromise = this.pendingRequests.get(requestId)

    if (gotoPromise) {
      // ── 职责一：处理 goto 结果 ──
      await this._handleGotoResult(context, error, gotoPromise, requestId)
      // goto 有结果后，根据成功与否决定是否走 action loop
      // 注意：如果 gotoPromise 解析成功（页面加载完成），仍需执行后续的 action
    }

    // ── 职责二：执行 action loop ──
    // 到达这里说明：
    //   1. gotoPromise 不存在（已有页面上下文，直接执行 action）
    //   2. gotoPromise resolve 成功（页面已加载）
    if (!gotoPromise || this.pendingRequests.get(requestId) === undefined) {
      // pendingRequests 已在 _handleGotoResult 中被删除，说明 goto 已处理完成
      this._logDebug('request', `Entering action loop...`)
      await this._executePendingActions(context)
      this._logDebug('request', `Exited action loop.`)
    }
  } finally {
    // 现有 finally 清理逻辑不变
    if (this.currentSession) { /* cookies */ }
    this.isPageActive = false
    if (this.ctx) { this.ctx.internal.isUpgraded = false }
    this.actionEmitter.emit('action-loop:stop')
    this.navigationLock.release()
    // page 清理...
  }
}
```

### 提取的 `_handleGotoResult` 方法

```typescript
private async _handleGotoResult(
  context: TContext,
  error: Error | undefined,
  gotoPromise: PendingEngineRequest,
  requestId: string,
): Promise<void> {
  try {
    const fetchResponse = await this.buildResponse(context)
    // ... 现有业务逻辑
  } catch (err) {
    // ... 现有错误处理
  }
}
```

### 边界情况

| 场景 | gotoPromise | 是否执行 action loop |
|------|-------------|---------------------|
| 首次 goto | 存在且 resolve | **需要** |
| goto 失败 (throwHttpErrors) | 存在且 reject | 不需要 |
| goto 失败 (buildResponse 异常) | 存在且 reject | 不需要 |
| 后续 action (click/fill) | 不存在 | **需要** |
| 可重试错误 | 存在（暂不处理）| 不需要 |

### 注意事项

- `_handleGotoResult` 返回后，需要区分 goto 成功 vs 失败来决定是否执行 action loop
- 可以用返回值 `boolean` 或检查 gotoPromise 是否还在 pendingRequests 中
- 可重试路径：gotoPromise 不处理也不删除，直接 return，action loop 也不执行
- `_sharedFailedRequestHandler` 末尾仍调用 `_sharedRequestHandler`，这部分逻辑不变

### 后续步骤

1. 实现 `_handleGotoResult` 提取
2. 修改 `_sharedRequestHandler` 用早期 return
3. 运行现有测试确保无回归
4. Review
