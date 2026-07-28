# TODO: @isdk/web-fetcher Roadmap

## 🚀 High Priority: Scoped Actions (`within`)

The core architecture for `FetchElementScope` is now ready. The next major step is implementing the `within` action to allow scoped interactions and extractions.

- [ ] **Design `within` Action Schema**:
    - Define the structure: `{ "action": "within", "params": { "selector": "...", "actions": [...] } }`.
- [ ] **Implement Scope Stack in `FetchEngine`**:
    - Modify the action dispatcher to track the current active `FetchElementScope`.
    - Ensure nested `within` calls push/pop from this stack.
- [ ] **Update Scoped Actions**:
    - Refactor `click`, `fill`, `submit`, and `extract` to always check the current active scope.
- [ ] **Add Fixture Tests**:
    - Create test cases for nested `within` extraction and interaction.

## 🚀 Future Engines: OpenCLI Integration

Integrating [OpenCLI](https://github.com/jackwener/OpenCLI) as a third engine to handle high-difficulty anti-bot measures and complex login states.

- [ ] **Research & Prototype `OpenCLIFetchEngine`**:
    - Implement `IFetchEngine` interface.
    - Connect to real browser instances via OpenCLI's local daemon.
- [ ] **Action Mapping**:
    - Map `web-fetcher` actions (`goto`, `click`, `fill`, etc.) to OpenCLI commands.
    - Support utilizing OpenCLI's 90+ built-in site adapters.
- [ ] **Session & Login State Reuse**:
    - Leverage OpenCLI's ability to use existing Chrome/Chromium sessions.

## 🛠️ Architectural Refinement

- [ ] **Standardize Internal Variable Names**: Rename `context` to `scope` in engine implementations.
- [ ] **Pause Timeout Fix**: Address Crawlee's `requestHandlerTimeoutSecs` limit during `pause`.
- [ ] **Action Loop Robustness**: Explicit error handling for post-disposal dispatches.
- [ ] **Optimize `buildResponse` Performance**:
    - Explore **Lazy Response** or **Batch Response** mode.
    - Reduce overhead of multiple `page.content()` calls during high-frequency simulation actions (e.g., typing 20 characters) by only generating the final response once at the end of the action sequence.

## 📝 Documentation & Housekeeping

- [ ] **Finalize `CONTRIBUTING.md`**: Merge `CONTRIBUTING.v2.md` into the main document.
- [ ] **TypeScript Type Improvements**: Refine `FetchElementScope` type definitions.

---

## 📖 详细说明 (Detailed Explanation)

### 1. 作用域动作 (`within`) 的意义
目前所有的动作（如 `click`, `fill`, `extract`）都是基于页面的根节点运行的。虽然 `extract` 内部支持嵌套，但无法在特定 DOM 区域内执行一系列组合动作。
`within` 的引入将允许：
- **局部交互**：在一个特定的列表项或模态框内执行点击和填充。
- **逻辑解耦**：开发者可以先定位到一个“容器”，然后在容器内部进行操作，而不需要编写冗长的完整 CSS 选择器。

### 2. 作用域栈 (Scope Stack)
为了支持嵌套的 `within`（例如：在列表内找到某一行，再在行内的某个按钮组执行操作），`FetchEngine` 需要维护一个作用域栈。
- 初始状态：栈内只有 `_getInitialElementScope()` 返回的根作用域。
- 进入 `within`：将选择器定位到的新 `FetchElementScope` 压入栈。
- 退出 `within`：弹出栈顶，恢复上一级作用域。

### 3. 引擎实现的差异化处理
- **Playwright**: 利用 Locator 的链式调用特性（`parentLocator.locator(subSelector)`），这天然支持作用域隔离。
- **Cheerio**: 利用其选择器上下文特性（`$(selector, context)`），确保只在指定的 DOM 子树中搜索。

---

## 🔄 开发工作流 (Development Workflow)

建议按以下步骤推进后续开发：

### 第一阶段：基础设施 (Infrastructure)
1. **定义 Schema**：在 `src/action/definitions/` 中创建 `within.ts`。
2. **建立栈管理**：在 `FetchEngine` (base.ts) 中添加 `scopeStack` 成员及 `pushScope/popScope` 方法。
3. **修改分发器**：更新 `_processAction`，当遇到 `within` 类型时，递归执行其内部动作集，并在执行前后管理栈状态。

### 第二阶段：动作迁移 (Action Migration)
1. **重构现有动作**：修改 `click`, `fill` 等动作的实现，使其从 `this.getCurrentScope()` 获取目标，而不是直接使用全局选择器。
2. **兼容性检查**：确保如果没有 `within` 包装，动作依然默认在根作用域执行。

### 第三阶段：引擎适配 (Engine Implementation)
1. **更新 `_querySelectorAll`**：确保它能处理传入的 `scope` 是一个已存在的 `FetchElementScope` 的情况。
2. **验证 Locator 链**：在 Playwright 引擎中测试多层嵌套的 Locator 是否符合预期。

### 第四阶段：验证与文档 (Verification)
1. **编写 Fixture**：在 `test/fixtures/` 中增加作用域操作的测试用例。
2. **同步文档**：更新 `README.action.md`，向用户介绍如何使用 `within` 关键字。
