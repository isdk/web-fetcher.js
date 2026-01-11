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

#### `extract`

使用一个强大且声明式的 **`ExtractSchema`** 从当前页面中提取结构化数据。这是进行数据采集的核心 Action。

* **`id`**: `extract`
* **`params`**: 一个 **`ExtractSchema`** 对象, 用于定义提取规则。
* **`returns`**: `any` (提取出的数据)

##### 提取 Schema 详解

`params` 对象本身就是一个 Schema, 用于描述您想提取的数据结构。

###### 1. 提取单个值

最基础的提取，可以指定 **`selector`** (CSS 选择器), **`attribute`** (要提取的属性名), **`type`** (string, number, boolean, html), 以及 **`mode`** (text, innerText)。

```json
{
  "id": "extract",
  "params": {
    "selector": "h1.main-title",
    "type": "string",
    "mode": "innerText"
  }
}
```

> **提取模式 (Extraction Modes):**
>
> * **`text`** (默认): 提取元素的 `textContent`。
> * **`innerText`**: 提取渲染后的文本，尊重 CSS 样式并处理换行。
> * **`html`**: 返回元素的 `innerHTML`。
> * **`outerHTML`**: 返回包含标签自身的完整 HTML。对于保留元素结构非常有用。
> 上例将使用 `innerText` 模式提取 class 为 `main-title` 的 `<h1>` 标签的文本内容。

###### 2. 提取对象

通过 **`type: 'object'`** 和 **`properties`** 字段来定义一个结构化对象。

```json
{
  "id": "extract",
  "params": {
    "type": "object",
    "selector": ".author-bio",
    "properties": {
      "name": { "selector": ".author-name" },
      "email": { "selector": "a.email", "attribute": "href" }
    }
  }
}
```

###### 3. 提取数组 (便捷用法)

通过 **`type: 'array'`** 来提取一个列表。为了让最常见的操作更简单，我们提供了一些便捷用法。

* **提取文本数组 (默认行为)**: 当您想提取一个文本列表时,只需提供选择器,省略 `items` 即可。这是最常见的用法。

    ```json
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": ".tags li"
      }
    }
    ```

    > 上例将返回一个包含所有 `<li>` 标签文本的数组, 如 `["tech", "news"]`。

* **提取属性数组 (快捷方式)**: 当您只想提取一个属性列表(例如所有链接的 **`href`**)时，也无需嵌套 `items`。直接在 `array` 定义中声明 **`attribute`** 即可。

    ```json

    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": ".gallery img",
        "attribute": "src"
      }
    }
    ```

    > 上例将返回一个包含所有 `<img>` 标签 `src` 属性的数组。

* **数组提取模式**: 在提取数组时，引擎支持不同的模式来处理各种 DOM 结构。

  * **`nested`** (默认): `selector` 匹配每个项目的包裹元素。
  * **`columnar`** (原 Zip 策略): `selector` 指向**容器**，`items` 中的字段是平行的列，按索引缝合在一起。
  * **`segmented`**: `selector` 指向**容器**，项目通过“锚点”字段进行分段提取。

###### 4. 列对齐模式 (Columnar Mode，原 Zip 策略)

当 `selector` 指向一个**容器**（如结果列表）且项目数据以平行的独立列散落在其中时使用。

```json
{
  "id": "extract",
  "params": {
    "type": "array",
    "selector": "#search-results",
    "mode": "columnar",
    "items": {
      "title": { "selector": ".item-title" },
      "link": { "selector": "a.item-link", "attribute": "href" }
    }
  }
}
```

> **启发式自动检测:** 如果省略了 `mode`，且 `selector` 恰好只匹配到一个元素，同时 `items` 中包含选择器，引擎会自动使用 **columnar** 模式。

**Columnar 配置参数:**

* **`strict`** (boolean, 默认: `true`): 如果为 `true`，当不同字段匹配到的数量不一致时将抛出错误。
* **`inference`** (boolean, 默认: `false`): 如果为 `true`，当字段数量不匹配时，尝试通过 DOM 树自动寻找“包裹元素”来修复错位的列表。

###### 5. 分段扫描模式 (Segmented Mode)

适用于完全“平铺”且没有包裹元素的结构。它使用第一个字段（或指定的 `anchor`）作为锚点来对容器内容进行分段。

```json
{
  "id": "extract",
  "params": {
    "type": "array",
    "selector": "#flat-container",
    "mode": { "type": "segmented", "anchor": "title" },
    "items": {
      "title": { "selector": "h3" },
      "desc": { "selector": "p" }
    }
  }
}
```

> 在此模式下，每当引擎发现一个 `h3`，就会开启一个新项目。随后找到的 `p` 标签（直到下一个 `h3` 出现前）都归属于该项目。

###### 6. 隐式对象提取 (最简语法)

为了让对象提取更简单，你可以省略 `type: 'object'` 和 `properties`。如果 schema 对象包含非保留关键字（如 `selector`, `attribute`, `type` 等）的键，它将被视为对象 schema，其中的键作为属性名。

```json
{
  "id": "extract",
  "params": {
    "selector": ".author-bio",
    "name": { "selector": ".author-name" },
    "email": { "selector": "a.email", "attribute": "href" }
  }
}
```

> 这等同于示例 2，但更简洁。

###### 6. 精确筛选: `has` 和 `exclude`

您可以在任何包含 **`selector`** 的 Schema 中使用 **`has`** 和 **`exclude`** 字段来精确控制元素的选择。

* **`has`**: 一个 CSS 选择器，用于确保所选元素**必须包含**匹配此选择器的后代元素。
* **`exclude`**: 一个 CSS 选择器，用于从结果中**排除**匹配此选择器的元素。

**完整示例: 提取包含图片且未被标记为"草稿"的文章链接**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://example.com/articles" } },
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": "div.article-card",
        "has": "img.cover-image",
        "exclude": ".draft",
        "items": {
          "selector": "a.title-link",
          "attribute": "href"
        }
      }
    }
  ]
}
```

> 上述 `extract` Action 会:
>
> 1. 找到所有 `div.article-card` 元素。
> 2. 筛选出其中必须包含 `<img class="cover-image">` 的元素。
> 3. 再从结果中排除掉自身带有 `.draft` 类的元素。
> 4. 对于最终剩下的每个 `div.article-card`, 找到其后代 `a.title-link` 并提取 `href` 属性。

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
