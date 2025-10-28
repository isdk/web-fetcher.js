# Action 脚本架构

本文档详细阐述了 `web-fetcher` 中 Action 脚本的架构、设计理念和使用方式。它旨在帮助开发者维护、扩展此系统，并帮助使用者高效地构建自动化任务。

## 1. 概述

Action 脚本系统的核心目标是提供一个**声明式、引擎无关**的方式来定义和执行一系列的网页交互。

这个系统建立在两大核心概念之上：

* **原子 Action (Atomic Actions):** 由库内置，代表一个单一、不可再分的操作，是构成所有复杂流程的基本“原子”。例如：`goto`, `click`, `fill`。
* **组合式 Action (Composite Actions):** 由库的使用者创建，代表一个具有业务语义的、由多个原子 Action 组合而成的复杂操作。这是本架构设计的精髓所在，它鼓励使用者将底层操作封装成更易于理解和复用的高级“分子”。例如：`login`, `search`, `addToCart`。

通过这种方式，使用者可以用非常直观的语义来描述一个完整的业务流程，而将具体的、与引擎相关的实现细节隐藏在底层。

## 2. 核心概念

### `FetchAction` (Action 基类)

`FetchAction` 是所有 Action 的抽象基类，它定义了一个 Action 的核心要素：

* `static id`: Action 的唯一标识符，例如 `'click'`。
* `static returnType`: Action 执行后返回结果的类型，例如 `'none'`, `'response'`。
* `static capabilities`: 声明此 Action 在不同引擎（`http`, `browser`）下的能力级别（`native`, `simulate`, `noop`）。
* `static register()`: 一个静态方法，用于将 Action 类注册到全局注册表中，使其可以通过 `id` 被动态创建。

### `onExecute` (核心执行逻辑)

每个 Action 子类都必须实现 `onExecute` 方法。这里是 Action 定义其行为的地方。

### `delegateToEngine` (委托辅助方法)

为了简化**原子 Action**的创建，`FetchAction` 基类提供了一个受保护的辅助方法 `delegateToEngine`。它将调用转发到活动引擎上的相应方法，并传递任何参数。这使得 Action 可以作为引擎功能的轻量级包装。

**示例：使用 `delegateToEngine` 后的 `fill` Action**

Action 的 `onExecute` 方法通常会解构 `params` 对象，并将其作为参数传递给 `delegateToEngine`。

```typescript
// src/action/definitions/fill.ts
export class FillAction extends FetchAction {
  // ...
  async onExecute(context: FetchContext, options?: BaseFetchActionProperties): Promise<void> {
    const { selector, value, ...restOptions } = options?.params || {};
    if (!selector) throw new Error('Selector is required for fill action');
    if (value === undefined) throw new Error('Value is required for fill action');
    // selector, value, 和 restOptions 作为参数传递给 engine.fill()
    await this.delegateToEngine(context, 'fill', selector, value, restOptions);
  }
}
```

如果底层的引擎方法需要，某些 Action 可能会传递整个 `params` 对象，例如 `extract`。

```typescript
// src/action/definitions/extract.ts
export class ExtractAction extends FetchAction {
  // ...
  async onExecute(context: FetchContext, options?: ExtractActionProperties): Promise<any> {
    const schema = options?.params;
    if (!schema) throw new Error('Schema is required for extract action');
    // 整个 schema 对象作为参数传递给 engine.extract()
    return this.delegateToEngine(context, 'extract', schema);
  }
}
```

## 3. 如何使用 (面向使用者)

使用者通过一个 JSON 格式的 `actions` 数组来定义一个完整的自动化流程。

### 使用原子 Action

对于简单的线性流程，可以直接使用库内置的原子 Action 列表。

**示例：在 Google 搜索 "gemini"**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://www.google.com" } },
    { "id": "fill", "params": { "selector": "textarea[name=q]", "value": "gemini" } },
    { "id": "submit", "params": { "selector": "form" } }
  ]
}
```

### 内置原子 Action

本库提供了一组核心的原子 Action，用于执行常见的网页交互。

#### `goto`
导航到新的 URL。
*   **`id`**: `goto`
*   **`params`**:
    *   `url` (string): 要导航到的 URL。如果省略，则使用当前上下文中的 `url`。
    *   ...其他导航选项，如 `waitUntil`, `timeout`，这些选项会传递给引擎。
*   **`returns`**: `response`
*   **示例**:
    ```json
    { "id": "goto", "params": { "url": "https://www.google.com" } }
    ```

#### `click`
点击一个由选择器指定的元素。
*   **`id`**: `click`
*   **`params`**:
    *   `selector` (string): 用于标识要点击元素的 CSS 选择器或 XPath。
*   **`returns`**: `none`
*   **示例**:
    ```json
    { "id": "click", "params": { "selector": "button#submit" } }
    ```

#### `fill`
向输入字段（如 `<input>` 或 `<textarea>`）填充指定的值。
*   **`id`**: `fill`
*   **`params`**:
    *   `selector` (string): 输入元素的选择器。
    *   `value` (string): 要填入元素中的文本。
*   **`returns`**: `none`
*   **示例**:
    ```json
    { "id": "fill", "params": { "selector": "input[name=q]", "value": "gemini" } }
    ```

#### `submit`
提交一个表单。可以在表单元素或表单内的元素上触发。
*   **`id`**: `submit`
*   **`params`**:
    *   `selector` (string, optional): 表单元素的选择器。如果未提供，引擎可能会尝试查找关联的表单。
*   **`returns`**: `none`
*   **示例**:
    ```json
    { "id": "submit", "params": { "selector": "form#login-form" } }
    ```

#### `waitFor`
暂停执行以等待特定条件满足。这对于处理动态内容和异步操作至关重要。
*   **`id`**: `waitFor`
*   **`params`**: 一个指定等待条件的对象。常用选项包括：
    *   `ms` (number): 等待固定的毫秒数。
    *   `selector` (string): 等待匹配选择器的元素出现在 DOM 中。
    *   `networkIdle` (boolean): 等待直到网络连接在一段时间内不再活跃。
*   **`returns`**: `none`
*   **示例**:
    ```json
    { "id": "waitFor", "params": { "selector": "#results", "timeout": 5000 } }
    ```
    ```json
    { "id": "waitFor", "params": { "ms": 1000 } }
    ```

#### `getContent`
获取当前页面状态的完整内容。
*   **`id`**: `getContent`
*   **`params`**: (无)
*   **`returns`**: `response` - 一个 `FetchResponse` 对象，包含页面的 `html`, `text`, `finalUrl` 等。
*   **示例**:
    ```json
    { "id": "getContent", "storeAs": "pageContent" }
    ```

#### `extract`
使用声明式 Schema 从页面中提取结构化数据。这是用于数据抓取的强大 Action。
*   **`id`**: `extract`
*   **`params`**: 一个 `ExtractSchema` 对象，定义了要提取数据的选择器和结构。
*   **`returns`**: `any` - 提取出的数据，其结构与 Schema 匹配。
*   **示例**:
    ```json
    {
      "id": "extract",
      "params": {
        "type": "object",
        "selector": ".product",
        "properties": {
          "name": { "selector": ".product-title" },
          "price": { "selector": ".product-price" }
        }
      },
      "storeAs": "productDetails"
    }
    ```

### 通过“组合”构建高级语义 Action

这是推荐给**使用者**的最佳实践，用于封装和复用业务流程。

**场景：创建一个可复用的 `LoginAction`**

假设您需要在多个脚本中执行登录操作。您可以创建一个自定义的 `LoginAction` 来封装这个流程。

**第 1 步：在您的项目中定义 `LoginAction.ts`**

```typescript
import { FetchContext, FetchAction, BaseFetchActionOptions } from '@isdk/ai-tools'; // 从库中导入

export class LoginAction extends FetchAction {
  static override id = 'login';
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { username, password, userSelector, passSelector, submitSelector } = options?.params || {};
    if (!username || !password || !userSelector || !passSelector || !submitSelector) {
      throw new Error('Username, password, and all selectors are required for login action');
    }

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    // 编排原子能力，形成一个完整的业务流程
    await engine.fill({ selector: userSelector, value: username });
    await engine.fill({ selector: passSelector, value: password });
    await engine.click({ selector: submitSelector });

    await engine.waitFor({ networkIdle: true });
  }
}
```

**第 2 步：在您的应用启动时，注册这个自定义 Action**

```typescript
import { FetchAction } from '@isdk/ai-tools';
import { LoginAction } from './path/to/LoginAction';

FetchAction.register(LoginAction);
```

**第 3 步：在脚本中使用您的 `LoginAction`**

现在，您的 Action 脚本变得非常简洁且富有语义：

```json
{
  "actions": [
    {
      "id": "login",
      "params": {
        "username": "testuser",
        "password": "password123",
        "userSelector": "#username",
        "passSelector": "#password",
        "submitSelector": "button[type=submit]"
      }
    }
  ]
}
```

## 4. 高级功能：采集器 (Collectors)

采集器（Collector）是一种强大的机制，它允许一个**主 Action**在执行期间，运行一个或多个**子 Action**来并行地、事件驱动地收集数据。

### 核心概念

采集器被定义在主 Action 的 `collectors` 数组中。它的执行由事件驱动：

* `activateOn`: 一个或多个事件名。当任一事件首次触发时，采集器进入“激活”状态，并调用其 `onBeforeExec` 钩子。
* `collectOn`: 一个或多个事件名。每当这些事件触发时，采集器就会执行其 `onExecute` 核心逻辑。
* `deactivateOn`: 一个或多个事件名。当任一事件首次触发时，采集器进入“停用”状态，调用 `onAfterExec` 钩子并停止所有监听。
* `storeAs`: 一个字符串，用于指定将采集结果存储在上下文 `context.outputs` 中的键名。所有采集结果会被收集到一个数组中。

**特殊规则**：如果一个采集器没有配置任何 `On` 事件，它将在主 Action 的 `end` 事件触发时，执行一次 `onExecute`。

### 采集器适用场景

值得注意的是，虽然机制上任何 Action 都可以被用作采集器，但只有那些**以返回数据为目的的 Action** 才具有实际意义。例如，`getContent`、`extract`（提取内容）或 `queryData`（查询数据）这类 Action 是采集器的理想选择。

相反，使用一个执行页面操作但无返回值的 Action（如 `click` 或 `fill`）作为采集器是毫无意义的，因为它无法“采集”到任何有用的信息。因此，设计或选择作为采集器的 Action 时，应确保其核心职责是**查询和返回数据**。

### 使用示例

**场景**：访问一个博客页面，并在页面加载完成后，采集所有的超链接（`<a>` 标签的 `href`）。

为此，我们需要一个能提取元素属性的原子 Action，我们称之为 `extract`（一个以返回数据为目的的 Action）。

```json
{
  "actions": [
    {
      "id": "goto",
      "params": { "url": "https://example.com/blog/my-post" },
      "collectors": [
        {
          "id": "extract", // 采集器本身也是一个 Action
          "name": "linkCollector", // 别名
          "params": {
            "selector": "a",
            "attribute": "href" // 假设 extract Action 支持提取指定属性
          },
          "storeAs": "allLinks" // 将所有采集到的 href 存到 context.outputs.allLinks
          // 此处未定义任何 `On` 事件
        }
      ]
    }
  ]
}
```

**执行流程**：

1. 主 Action `goto` 开始执行。
2. `installCollectors` 方法被调用，`linkCollector` 被初始化。
3. 由于 `linkCollector` 没有 `collectOn` 等触发器，它会默认等待主 Action `goto` 完成。
4. `goto` 成功加载页面，并触发内部的 `action:goto.end` 事件。
5. `linkCollector` 监听到此事件，执行其 `onExecute` 逻辑（提取所有 `<a>` 的 `href`）。
6. `extract` Action 的执行结果被自动推入 `context.outputs.allLinks` 数组。
7. 流程结束，`allLinks` 中包含了页面上所有的链接地址。

## 5. 如何扩展 (面向开发者)

作为库的开发者，您的主要职责是丰富**原子 Action**生态。

### a. 添加新的“原子 Action”

1. **在引擎中定义能力:** 在 `src/engine/base.ts` 的 `FetchEngine` 中添加新的抽象方法（例如 `abstract focus(params: { selector: string }): Promise<void>`），并在具体的引擎（`Cheerio`, `Playwright`）中实现它。
2. **创建 Action 类:** 创建一个新的 Action 类文件，例如 `FocusAction.ts`。
3. **实现 `onExecute`:**
    * 如果它是一个简单的委托，使用 `delegateToEngine` 辅助方法。

    ```typescript
    async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
      await this.delegateToEngine(context, 'focus', options?.params);
    }
    ```

    * 如果它有更复杂的逻辑（例如 `goto`），则手动编写 `onExecute` 的实现。
4. **注册 Action:** 在文件末尾调用 `FetchAction.register(FocusAction)`。

## 6. Action 生命周期

`FetchAction` 基类提供了一套生命周期钩子，允许在 Action 执行的核心逻辑前后注入自定义行为。

* `protected onBeforeExec?()`: 在 `onExecute` 执行前调用。
* `protected onAfterExec?()`: 在 `onExecute` 执行后调用。

对于需要管理复杂状态或资源的 Action，可以实现这些钩子。通常，对于组合式 Action，直接在 `onExecute` 中编写逻辑已经足够。
