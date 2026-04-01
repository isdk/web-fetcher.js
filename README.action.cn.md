# 📜 Action 脚本架构

[English](./README.action.md) | 简体中文

> 本文档详细阐述了 `@isdk/web-fetcher` 中 Action 脚本的架构、设计理念和使用方式。它旨在帮助开发者维护、扩展此系统，并帮助使用者高效地构建自动化任务。

## 🎯 1. 概述

Action 脚本系统的核心目标是提供一个**声明式、引擎无关**的方式来定义和执行一系列的网页交互。

这个系统建立在两大核心概念之上：

* **⚛️ 原子 Action (Atomic Actions):** 由库内置，代表一个单一、不可再分的操作，是构成所有复杂流程的基本“原子”。例如：`goto`, `click`, `fill`。
* **🧩 组合式 Action (Composite Actions):** 由库的使用者创建，代表一个具有业务语义的、由多个原子 Action 组合而成的复杂操作。这是本架构设计的精髓所在，它鼓励使用者将底层操作封装成更易于理解和复用的高级“分子”。例如：`login`, `search`, `addToCart`。

通过这种方式，使用者可以用非常直观的语义来描述一个完整的业务流程，而将具体的、与引擎相关的实现细节隐藏在底层。

---

## 🛠️ 2. 核心概念

### `FetchAction` (Action 基类)

`FetchAction` 是所有 Action 的抽象基类，它定义了一个 Action 的核心要素：

* `static id`: Action 的唯一标识符，例如 `'click'`。在 Action 脚本中，你可以使用 `id`、`name` 或 `action` 来指定此标识符。
* `static returnType`: Action 执行后返回结果的类型，例如 `'none'`, `'response'`。
* `static capabilities`: 声明此 Action 在不同引擎（`http`, `browser`）下的能力级别（`native`, `simulate`, `noop`）。
* `static register()`: 一个静态方法，用于将 Action 类注册到全局注册表中，使其可以通过 `id` 被动态创建。

### `onExecute` (核心执行逻辑)

每个 Action 子类都必须实现 `onExecute` 方法。这里是 Action 定义其行为的地方。

### `delegateToEngine` (委托辅助方法)

为了简化**原子 Action**的创建，`FetchAction` 基类提供了一个受保护的辅助方法 `delegateToEngine`。它将调用转发到活动引擎上的相应方法，并传递任何参数。这使得 Action 可以作为引擎功能的轻量级包装。

**示例：使用 `delegateToEngine` 后的 `fill` Action**

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

---

## 🚀 3. 如何使用 (面向使用者)

使用者通过一个 JSON 格式的 `actions` 数组来定义一个完整的自动化流程。

### 使用原子 Action

对于简单的线性流程，可以直接使用库内置的原子 Action 列表。

> **💡 提示**：你可以使用 `action` 或 `name` 作为 `id` 的别名，使用 `args` 作为 `params` 的别名。

**示例：在 Google 搜索 "gemini"**

```json
{
  "actions": [
    { "action": "goto", "args": { "url": "https://www.google.com" } },
    { "action": "fill", "args": { "selector": "textarea[name=q]", "value": "gemini" } },
    { "action": "submit", "args": { "selector": "form" } }
  ]
}
```

### 内置原子 Action

本库提供了一组核心的原子 Action，用于执行常见的网页交互。

#### `goto`

将浏览器导航至指定 URL。

* **`id`**: `goto`
* **`params`**:
  * `url` (string): 要导航到的 URL。
  * ...其他导航选项，如 **`waitUntil`**, **`timeout`**，这些选项会传递给引擎。
* **`returns`**: `response`

> **注意**：此 Action 可以在单个会话脚本中多次调用。引擎确保每次导航都已完成且其对应的 Action 循环已稳定，然后再处理序列中的下一个 Action。

#### `click`

点击由 **`selector`** (CSS 选择器) 指定的元素。

* **`id`**: `click`
* **`params`**:
  * **`selector`** (string): 用于标识要点击元素的 CSS 选择器。
* **`returns`**: `none`

#### `fill`

向输入字段填充指定的值。

* **`id`**: `fill`
* **`params`**:
  * **`selector`** (string): 输入元素的选择器。
  * `value` (string): 要填入元素中的文本。
* **`returns`**: `response`

> **注意**：返回内容的具体行为在不同引擎之间存在差异。
>
> * **`cheerio`**：此引擎直接操作其内部的 HTML 表示，因此返回的内容会包含填充的值。
> * **`playwright`**：此引擎返回的是页面的渲染后 HTML (类似于 `document.documentElement.outerHTML`)。然而，当 `page.fill()` 更新输入框时，它修改的是该输入框元素的内部 `value` 属性。这个属性不总会被序列化为 HTML 源代码中的 `value` 特性。因此，调用 `page.content()` 所返回的 HTML 中将**不会**看到填充的值。

#### `submit`

提交一个表单。

* **`id`**: `submit`
* **`params`**:
  * **`selector`** (string, optional): 表单元素的选择器。
* **`returns`**: `none`

#### `trim`

从 DOM 中移除特定元素以在提取前清理页面。这会对当前会话的页面状态进行持久修改。

* **`id`**: `trim`
* **`params`**:
  * **`selectors`** (string | string[], optional): 一个或多个要移除元素的 CSS 选择器。
  * **`presets`** (string | string[], optional): 预定义的移除元素组。支持的预设：
    * `scripts`: 移除所有 `<script>` 标签。
    * `styles`: 移除所有 `<style>` 和 `<link rel="stylesheet">` 标签。
    * `svgs`: 移除所有 `<svg>` 元素。
    * `images`: 移除 `<img>`, `<picture>` 和 `<canvas>` 元素。
    * `comments`: 移除 HTML 注释。
    * `hidden`: 移除带有 `hidden` 属性或内联 `display:none` 的元素。在 **browser** 模式下，它还会检测并移除通过外部 CSS（如样式表中的 `display: none` 或 `visibility: hidden`）隐藏的元素。
    * `all`: 包含上述所有预设。
* **`returns`**: `none`

**示例：在提取前清理页面**

```json
{
  "actions": [
    { "action": "goto", "params": { "url": "https://example.com" } },
    {
      "action": "trim",
      "params": {
        "selectors": ["#ad-banner", ".popup"],
        "presets": ["scripts", "styles", "comments"]
      }
    },
    { "action": "extract", "params": { "schema": { "content": "#main-content" } } }
  ]
}
```

#### `waitFor`

暂停执行，以等待一个或多个条件的满足。

在 `browser` 模式下，如果提供了多个条件，它们将按顺序依次等待。例如，它会先等待选择器出现，然后等待网络空闲，**最后**再等待指定的毫秒数 (`ms`)。

* **`id`**: `waitFor`
* **`params`**: 一个指定等待条件的对象，可包含以下一个或多个键：
  * **`selector`** (string): 等待匹配的选择器出现在页面中。仅 `browser` 模式支持。
  * **`networkIdle`** (boolean): 等待直到网络空闲（即，在一段时间内没有新的网络请求）。仅 `browser` 模式支持。
  * **`ms`** (number): 在满足其他条件**之后**，继续等待指定的毫秒数。两个引擎都支持。
* **`returns`**: `none`

> **⚠️ 关键区别: `ms` (延迟) vs 超时**
>
> 请勿将 **`ms`** 参数与“超时时间”混淆。
>
> * **`ms` (持续时长)**: 这是一个强制的“睡眠”或“延迟”时间。如果与 `selector` 一起使用，它表示在找到元素**之后**，还要额外等待的时间。
> * **超时 (Deadline)**: 等待条件（如 `selector` 或 `networkIdle`）满足的最长等待时间是由会话级别的 **`timeoutMs`** 选项控制的（默认通常是 30秒），而不是这个 `ms` 参数。

#### `pause`

暂停 Action 脚本的执行，以允许用户手动介入（例如，解决验证码）。此 Action **必须**在 **`fetchWeb`** 的选项中提供一个 **`onPause`** 回调处理器。当此 Action 被触发时，它会调用 **`onPause`** 处理器并等待其执行完成。

* **`id`**: `pause`
* **`params`**:
  * **`selector`** (string, optional): 如果提供，仅当匹配此选择器的元素存在时，Action 才会暂停。
  * **`attribute`** (string, optional): 与 **`selector`** 配合使用。如果提供，仅当元素存在且拥有该指定属性时，Action 才会暂停。
  * **`message`** (string, optional): 一个将传递给 **`onPause`** 处理器的消息，可用于向用户显示提示信息。
* **`returns`**: `none`

**示例：在 Google 搜索中处理 CAPTCHA**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://www.google.com/search?q=gemini" } },
    {
      "id": "pause",
      "params": {
        "selector": "#recaptcha",
        "message": "检测到 Google CAPTCHA，请在浏览器中手动解决后按回车键继续。"
      }
    },
    { "id": "waitFor", "params": { "selector": "#search" } }
  ]
}
```

**`onPause` 处理器示例:**

```typescript
// 在调用 fetchWeb 的代码中
import { fetchWeb } from '@isdk/web-fetcher';
import readline from 'readline';

const handlePause = async ({ message }) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => {
    rl.question(message || '执行已暂停，请按回车键继续...', () => {
      rl.close();
      resolve();
    });
  });
};

await fetchWeb({
  // ...,
  engine: 'browser',
  engineOptions: { headless: false },
  onPause: handlePause,
  actions: [
    // ... 你的 actions
  ]
});
```

#### `getContent`

获取当前页面状态的完整内容。

* **`id`**: `getContent`
* **`params`**: (无)
* **`returns`**: `response`

#### `mouseMove`

将鼠标指针移动到指定的坐标或元素。在 `browser` 模式下，它使用 **贝塞尔曲线 (Bézier curve)** 来模拟真实人类的非线性移动轨迹，并带有轻微的抖动以增加真实感。

* **`id`**: `mouseMove`
* **`params`**:
  * `x` (number, 可选): 绝对 X 坐标。
  * `y` (number, 可选): 绝对 Y 坐标。
  * `selector` (string, 可选): CSS 选择器。如果提供，鼠标将移动到该元素的中心。
  * `steps` (number, 可选): 轨迹的中间步数（默认：`-1`）。设置为 `-1` 可根据距离动态计算步数（模拟自然移动速度）。
* **`returns`**: `none`

#### `mouseClick`

在当前位置或指定坐标触发鼠标点击。如果提供了 `selector`，光标会先平滑地移动到目标元素（使用动态步数），然后再执行点击。

* **`id`**: `mouseClick`
* **`params`**:
  * `x` (number, 可选): 点击的绝对 X 坐标。
  * `y` (number, 可选): 点击的绝对 Y 坐标。
  * `selector` (string, 可选): CSS 选择器。如果提供，鼠标会先移动到该元素。
  * `button` (string, 可选): 使用的鼠标按键 (`left`, `right`, 或 `middle`)。默认为 `left`。
  * `clickCount` (number, 可选): 点击次数（例如：2 表示双击）。默认为 1。
  * `delay` (number, 可选): mousedown 和 mouseup 之间的延迟（毫秒）。
* **`returns`**: `none`

#### `mouseWheel`

模拟鼠标滚轮滚动事件。如果提供了 `selector` 或坐标 (`x`, `y`)，光标会先平滑地移动到目标位置（使用动态步数），然后再执行滚动。

* **`id`**: `mouseWheel`
* **`params`**:
  * `x` (number, 可选): 滚动的绝对 X 坐标。
  * `y` (number, 可选): 滚动的绝对 Y 坐标。
  * `selector` (string, 可选): CSS 选择器。如果提供，鼠标会先移动到该元素。
  * `deltaX` (number, 可选): 水平滚动量。默认为 0。
  * `deltaY` (number, 可选): 垂直滚动量。默认为 0。
  * `steps` (number, 可选): 移动到目标位置时的中间步数（默认：`-1`）。
* **`returns`**: `none`

#### `keyboardType`

模拟真人在当前获得焦点的元素中输入文本。

* **`id`**: `keyboardType`
* **`params`**:
  * `text` (string): 要输入的文本。
  * `delay` (number, 可选): 按键之间的延迟（毫秒，默认：100）。
* **`returns`**: `none`

#### `keyboardPress`

模拟按下单个按键或组合键（例如：`Enter`, `Control+A`）。

* **`id`**: `keyboardPress`
* **`params`**:
  * `key` (string): 按键名称（例如：`Enter`, `Tab`, `Backspace`, `ArrowUp`）。
  * `delay` (number, 可选): 按键后的延迟（毫秒）。
* **`returns`**: `none`

#### `evaluate`

在页面上下文中执行 JavaScript 函数或表达式。这是一个强大的 Action，用于执行内置 Action 未涵盖的自定义逻辑。

* **`id`**: `evaluate`
* **`params`**:
  * **`fn`** (string | function): 要执行的函数或表达式。
  * **`args`** (any, 可选): 传递给函数的单个参数。如需传递多个参数，请使用数组或对象。
* **`returns`**: `any` (执行结果)

> **💡 跨引擎兼容性**:
>
> * **`browser`**: 直接在浏览器中运行。
> * **`http`**: 在 Node.js 中运行，并提供模拟环境（提供 `window`, `document` 和 `$`）。
    * **`args`**: `any` - 传递给函数的单个参数。如需传递多个值，请使用数组或对象。

**核心特性：**

- **自动导航检测**：如果代码修改了 `window.location.href` 或调用了 `assign()`/`replace()`，引擎会自动触发并等待导航完成。
- **增强型 Mock DOM (HTTP 模式)**：支持常用的 DOM 方法，如 `querySelector`, `querySelectorAll`, `getElementById`, `getElementsByClassName`，以及 `document.body` 和 `document.title` 等属性。
- **沙箱安全**：在 HTTP 模式下使用 `util-ex` 的 `newFunction`，防止全局状态污染。

**示例 (数组参数)：**

```json
{
  "action": "evaluate",
  "params": {
    "fn": "([a, b]) => a + b",
    "args": [1, 2]
  }
}
```

**示例 (导航)：**

```json
{
  "action": "evaluate",
  "params": {
    "fn": "() => { window.location.href = '/new-page'; }"
  }
}
```

#### `extract`

使用强大且声明式的 **`ExtractSchema`** 从页面中提取结构化数据。

* **`id`**: `extract`
* **`params`**: 一个 **`ExtractSchema`** 对象。
* **`returns`**: 提取出的结构化数据。

> **📚 详细手册**: 由于 `extract` 功能非常丰富（包含数组模式、作用域控制、锚点跳转等），我们准备了专门的详细文档：
>
> 👉 **[点击查看 Extract 操作详解](./README.action.extract.cn.md)**

---

### 通过“组合”构建高级语义 Action

这是推荐给**使用者**的最佳实践，用于封装和复用业务流程。

**场景：创建一个可复用的 `LoginAction`**

1. **在您的项目中定义 `LoginAction.ts`**

    ```typescript
    import { FetchContext, FetchAction, BaseFetchActionOptions } from '@isdk/web-fetcher';

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

2. **在您的应用启动时，注册这个自定义 Action**

    ```typescript
    import { FetchAction } from '@isdk/web-fetcher';
    import { LoginAction } from './path/to/LoginAction';

    FetchAction.register(LoginAction);
    ```

3. **在脚本中使用您的 `LoginAction`**

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

---

## 🧲 4. 高级功能：采集器 (Collectors)

采集器（Collector）是一种强大的机制，它允许一个**主 Action**在执行期间，运行一个或多个**子 Action**来并行地、事件驱动地收集数据。

### 核心概念

采集器被定义在主 Action 的 `collectors` 数组中。它的执行由事件驱动：

* `activateOn`: 激活采集器的事件。
* `collectOn`: 触发采集器 `onExecute` 核心逻辑的事件。
* `deactivateOn`: 停用采集器的事件。
* `storeAs`: 用于在 `context.outputs` 中存储采集结果的键名。

> **ℹ️ 特殊规则**：如果一个采集器没有配置任何 `On` 事件，它将在主 Action 的 `end` 事件触发时，执行一次 `onExecute`。

### 采集器适用场景

> **⚠️ 重要提示**: 虽然机制上任何 Action 都可以被用作采集器，但只有那些**以返回数据为目的的 Action** (例如 `getContent`, `extract`) 才具有实际意义。使用像 `click` 或 `fill` 这样不返回任何内容的 Action 作为采集器是毫无意义的。

### 使用示例

**场景**：访问一个博客页面，并在页面加载完成后，采集所有的超链接（`<a>` 标签的 `href`）。

```json
{
  "actions": [
    {
      "id": "goto",
      "params": { "url": "https://example.com/blog/my-post" },
      "collectors": [
        {
          "id": "extract",
          "name": "linkCollector",
          "params": {
            "type": "array",
            "selector": "a",
            "attribute": "href"
          },
          "storeAs": "allLinks"
        }
      ]
    }
  ]
}
```

**执行流程**：

1. 主 Action `goto` 开始执行。
2. `linkCollector` 被初始化。
3. 由于没有触发器，它默认等待 `goto` 动作完成。
4. `goto` 成功加载页面并触发其内部的 `action:goto.end` 事件。
5. `linkCollector` 监听到此事件并执行，提取所有 `<a>` 标签的 `href`。
6. 结果被推入 `context.outputs.allLinks` 数组。

---

## 🧑‍💻 5. 如何扩展 (面向开发者)

作为库的开发者，您的主要职责是丰富**原子 Action**生态。

### 添加新的“原子 Action”

1. **在引擎中定义能力:** 在 `src/engine/base.ts` 的 `FetchEngine` 中添加新的抽象方法，并在具体的引擎（`Cheerio`, `Playwright`）中实现它。
2. **创建 Action 类:** 创建一个新的 Action 类文件，例如 `src/action/definitions/MyNewAction.ts`。
3. **实现 `onExecute`:** 对于简单情况，使用 `delegateToEngine` 辅助方法。
4. **注册 Action:** 在你的新文件中调用 `FetchAction.register(MyNewAction)`。

---

## 🔄 6. Action 生命周期

`FetchAction` 基类提供了一套生命周期钩子，允许在 Action 执行的核心逻辑前后注入自定义行为。

* `protected onBeforeExec?()`: 在 `onExecute` 执行前调用。
* `protected onAfterExec?()`: 在 `onExecute` 执行后调用。

对于需要管理复杂状态或资源的 Action，可以实现这些钩子。通常，对于组合式 Action，直接在 `onExecute` 中编写逻辑已经足够。

---

## 💎 7. Action 返回类型与状态管理 (进阶)

在 `@isdk/web-fetcher` 中，Action 的 `static returnType` 不仅仅是一个类型提示。它定义了框架如何管理 **Session 状态** 以及如何在执行后自动同步数据。

### 7.1 返回类型详解

#### 🟢 `response` (页面响应)

* **定义**: 包含 HTTP 状态码、响应头、正文和 Cookie 的 `FetchResponse` 对象。
* **用途**: 将最新的页面内容和状态同步到会话中。
* **用法**: 适用于执行导航、刷新或获取当前页面快照的动作。
* **系统行为**: 框架在 `afterExec` 阶段会自动将此结果更新到 `context.lastResponse`。后续动作可以通过上下文访问它。
* **典型 Action**: `goto`, `getContent`, `fill`（在某些引擎中）。
* **示例**:

  ```typescript
  export class MyNavigateAction extends FetchAction {
    static override id = 'myGoto';
    static override returnType = 'response' as const;

    async onExecute(context, options) {
      // 返回 FetchResponse 的逻辑
      return await this.delegateToEngine(context, 'goto', options.params.url);
    }
  }
  ```

#### 🟡 `any` (通用数据 - 默认)

* **定义**: 任何可序列化的数据结构（对象、数组、字符串等）。
* **用途**: 业务数据提取的主要机制。
* **用法**: 当你的动作产生处理后的业务数据（而不是代表整个页面或系统状态）时使用。
* **系统行为**: 如果 Action 配置包含 `storeAs: "key"`，框架会自动将 `result` 保存到 `context.outputs["key"]` 中。如果目标键已包含一个对象且新结果也是一个对象，它们将被合并（浅合并）而不是覆盖。这允许通过多个 `extract` 动作将数据累积到同一个输出键中。
* **典型 Action**: `extract`。
* **示例**:

  ```typescript
  static override returnType = 'any' as const;
  async onExecute(context, options) {
    return { title: 'Hello', price: 99 }; // 如果设置了 storeAs，则保存到 outputs
  }
  ```

#### ⚪ `none` (无返回)

* **定义**: `void`。
* **用途**: 纯交互或副作用，不输出数据。
* **用法**: 执行 UI 交互或时间控制的动作。
* **典型 Action**: `click`, `submit`, `pause`, `trim`, `waitFor`。
* **示例**:

  ```typescript
  static override returnType = 'none' as const;
  async onExecute(context, options) {
    await this.delegateToEngine(context, 'click', options.params.selector);
    // 不需要返回值
  }
  ```

#### 🔵 `outputs` (累积结果)

* **定义**: 整个 `context.outputs` 记录 (`Record<string, any>`)。
* **用途**: 获取当前会话期间提取并存储的所有数据。
* **用法**: 通常用作链条末尾的“总结”动作或用于调试。
* **典型 Action**: 自定义数据总结动作。

#### 🟣 `context` (会话快照)

* **定义**: 完整的 `FetchContext` 对象。
* **用途**: 元编程和深度调试。
* **用法**: 允许调用者检查当前的会话配置（超时、代理、请求头）和内部引擎元数据。

---

### 7.2 结果包装机制 (`FetchActionResult`)

`onExecute` 返回的每个值都会被 `FetchAction.execute` 方法自动包装成 `FetchActionResult` 对象。这确保了所有动作之间一致的错误处理和元数据追踪。

**`FetchActionResult` 的结构**:

* `status`: `Success` (成功), `Failed` (失败), 或 `Skipped` (跳过)。
* `returnType`: 匹配 Action 的 `static returnType`。
* `result`: `onExecute` 返回的原始数据。
* `error`: 如果动作失败，捕获到的错误对象。
* `meta`: 诊断信息，包括执行时间、引擎类型和重试次数。

### 7.3 开发者最佳实践

1. **为导航选择 `response`**: 对于跳转到新 URL 的动作，务必使用 `response`，以确保会话的“当前页面”保持同步。
2. **利用 `any` + `storeAs`**: 对于数据提取，将数据作为 `any` 返回，并让用户通过 JSON 脚本中的 `storeAs` 决定存储键。
3. **明确使用 `none`**: 使用 `none` 可以清晰地表明该动作用于其副作用（如点击或等待），使工作流更易于理解。
