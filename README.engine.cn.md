# ⚙️ Fetch Engine 架构

[English](./README.engine.md) | 简体中文

> 本文档全面概述了 Fetch Engine 的架构，旨在抽象化网页内容抓取和交互。它适用于需要理解、维护或扩展抓取引擎功能的开发人员。

---

## 🎯 1. 概述

`engine` 目录包含 Web Fetcher 的核心逻辑。其主要职责是为与网页交互提供统一的接口，无论底层技术如何（例如，简单的 HTTP 请求或功能齐全的浏览器）。这是通过抽象的 `FetchEngine` 类和利用不同抓取技术的具体实现来实现的。

> ℹ️ 该系统建立在 [Crawlee](https://crawlee.dev/) 库之上，并使用其强大的爬虫抽象。

### Debug 模式与追踪 (Debug Mode & Tracing)

当启用 `debug: true` 选项时，引擎会提供其内部操作的详细追踪信息：

1. **详细日志追踪**：每个主要步骤（请求处理、元素选择、数据提取）都会记录到控制台，并带有 `[FetchEngine:id]` 前缀。
2. **提取洞察**：在执行 `extract()` 期间，引擎会记录每个选择器匹配到的元素数量以及正在提取的具体值，这使得调试复杂或错位的 Schema 变得更加容易。
3. **元数据 (Metadata)**：`FetchResponse` 将包含一个丰富的 `metadata` 对象，其中包含引擎详情、计时指标（如果可用）和代理信息。

---

## 🧩 2. 核心概念

### `FetchEngine` (base.ts)

这是定义所有抓取引擎契约的抽象基类。

* **职责**：为导航、内容检索和用户交互等操作提供一致的高级 API。它充当核心 **动作分发器 (Action Dispatcher)**，统一处理引擎无关的逻辑（如 `extract`、`pause`、`getContent`），并将其余动作委托给具体实现。
* **关键抽象**：
  * **生命周期**：`initialize()` 和 `cleanup()` 方法。
  * **核心操作**：`goto()`、`getContent()`、`click()`、`fill()`、`submit()`、`waitFor()`、`extract()`。
  * **DOM 原子操作 (Primitives)**: `_querySelectorAll()`、`_extractValue()`、`_parentElement()`、`_nextSiblingsUntil()`。
  * **配置与状态**：`headers()`、`cookies()`、`blockResources()`、`getState()`、`sessionPoolOptions`。
* **静态注册表**：它维护所有可用引擎实现的静态注册表（`FetchEngine.register`），允许通过 `id` 或 `mode` 动态选择引擎。

### `FetchElementScope`

**`FetchElementScope`** 是引擎相关的 DOM 元素“句柄”或“上下文”。

- 在 **`CheerioFetchEngine`** 中，它是 Cheerio API (`$`) 与当前选择 (`el`) 的组合。
- 在 **`PlaywrightFetchEngine`** 中，它是 `Locator`。

所有提取和交互的原子操作都基于此 Scope 运行，确保了在不同底层技术之上引用元素的统一方式。

### `FetchEngine.create(context, options)`

此静态工厂方法是创建引擎实例的指定入口点。它会自动选择并初始化合适的引擎。

### `FetchSession(options)`

`FetchSession` 类管理抓取操作的生命周期。您可以在 `options` 中指定 `engine` 来为该会话强制指定特定的引擎实现。

```typescript
const session = new FetchSession({ engine: 'browser' });
```

#### 引擎选择优先级 (Engine Selection Priority)

引擎在执行第一个动作时延迟初始化，并在会话持续期间保持固定。选择遵循以下规则：

1. **显式选项**: 如果在 `FetchSession` 的 `options.engine`（或 `executeAll` 的临时上下文覆盖）中提供了引擎且不为 `'auto'`。
    * ⚠️ **快速失败 (Fail-Fast)**: 如果请求的引擎不可用（例如缺少依赖），将立即抛出错误。
2. **站点注册表 (Site Registry)**: 如果设置为 `'auto'`（默认），系统会尝试根据目标 URL 匹配 `sites` 注册表。
3. **智能升级 (Smart Upgrade)**: 如果启用，系统可能会根据响应特征（如机器人检测或大量 JS）动态从 `http` 升级到 `browser`。
4. **默认**: 回退到 `'http'` (Cheerio)。

#### 带有覆盖的批量执行 (Batch Execution with Overrides)

您可以执行一系列动作，并指定临时的配置覆盖（例如 headers、timeout）。这些覆盖仅应用于当前批次，不会修改会话的全局状态。

```typescript
// 使用临时的自定义 header 和超时执行动作
await session.executeAll([
  { name: 'goto', params: { url: '...' } },
  { name: 'extract', params: { ... } }
], {
  headers: { 'x-custom-priority': 'high' },
  timeoutMs: 30000
});
```

### 会话管理与状态持久化

引擎支持在多次执行之间持久化和恢复会话状态（主要是 Cookie）。

* **灵活的会话隔离与存储控制**：库提供了对会话数据存储和隔离的精细控制，通过 `storage` 配置实现：
  * **`id`**：自定义存储标识符。
    * **隔离（默认）**：如果省略，每个会话将获得一个唯一 ID，确保 `RequestQueue`、`KeyValueStore` 和 `SessionPool` 完全隔离。
    * **共享**：在不同会话中提供相同的 `id` 可以让它们共享底层存储，适用于保持持久登录状态。
  * **`persist`**：(boolean) 是否启用磁盘持久化（对应 Crawlee 的 `persistStorage`）。默认为 `false`（仅在内存中）。
  * **`purge`**：(boolean) 会话关闭时是否删除存储（清理 `RequestQueue` 和 `KeyValueStore`）。默认为 `true`。
    * 设置 `purge: false` 并配合固定的 `id`，可以创建跨应用重启依然存在的持久会话。
  * **`config`**：允许向底层 Crawlee 实例传递原生配置。
    * **注意**：当 `persist` 为 true 时，在 config 中使用 `localDataDirectory` 指定存储路径（例如：`storage: { persist: true, config: { localDataDirectory: './my-data' } }`）。
* **`sessionState`**: 一个完整的状态对象（源自 Crawlee 的 SessionPool），可用于完全恢复之前的会话。该状态会**自动包含在每个 `FetchResponse` 中**，方便进行持久化，并在以后初始化引擎时通过选项传回。
* **`sessionPoolOptions`**: 允许对底层的 Crawlee `SessionPool` 进行高级配置（例如 `maxUsageCount`, `maxPoolSize`）。
* **`overrideSessionState`**: 如果设置为 `true`，则强制引擎使用提供的 `sessionState` 覆盖存储中的任何现有持久化状态。当你希望确保会话以确切提供的状态启动，忽略持久化层中的任何陈旧数据时，这非常有用。
* **`cookies`**: 用于会话的显式 Cookie 数组。

> **一致性说明**: 引擎使用 Crawlee 的 `Session` 作为 Cookie 的唯一真理源。在 `browser` 模式下，Cookie 会在交互（如点击）期间实时从浏览器同步到 Session，确保 `getContent()` 或 `extract()` 始终反映最新状态。

**优先级规则：**
如果同时提供了 `sessionState` 和 `cookies`，引擎将采用**“合并并覆盖”**策略：

1. 首先从 `sessionState` 恢复会话。
2. 然后在之上应用显式的 `cookies`。
   * **结果**：`sessionState` 中任何冲突的 Cookie 都会被显式的 `cookies` **覆盖**。
   * 如果两者同时存在，系统将记录一条警告日志，以提醒用户这种覆盖行为。

---

## 🏗️ 3. 架构和工作流程

引擎架构旨在解决一个关键挑战：在 Crawlee 根本上**无状态、异步**的请求处理之上，提供一个简单的、**类似有状态的 API**（先 `goto()`，再 `click()`，再 `fill()`）。

### 核心问题：短暂的页面上下文

在 Crawlee 中，页面上下文（Playwright 中的 `page` 对象或 Cheerio 中的 `$` 函数）**仅在 `requestHandler` 函数的同步作用域内可用**。一旦处理程序完成或 `await`，上下文就会丢失。这使得无法直接实现 `await engine.goto(); await engine.click();` 这样的序列。

### 解决方案：使用动作循环桥接作用域

我们的引擎通过在外部 API 调用和内部 `requestHandler` 作用域之间创建桥梁来解决此问题。这是设计中最关键的部分。

**工作流程如下：**

1. **初始化**：消费者调用 `FetchEngine.create()`，初始化一个私有的 `Configuration` 并在后台启动一个 Crawlee 爬虫（例如 `PlaywrightCrawler`）。
2. **导航 (`goto`)**：消费者调用 `await engine.goto(url)`。此方法将 URL 添加到引擎私有的 `RequestQueue`，并返回一个 `Promise`，该 `Promise` 将在页面加载后被解析。
3. **Crawlee 处理**：后台爬虫接收请求并调用引擎的 `requestHandler`，向其传递关键的页面上下文。
4. **页面激活和动作循环**：在 `requestHandler` 内部：
    * 页面上下文用于解析 `goto()` 调用返回的 `Promise`。
    * 页面被标记为“活动”状态 (`isPageActive = true`)。
    * 至关重要的是，在 `requestHandler` 返回之前，它会启动一个**动作循环** (`_executePendingActions`)。此循环通过监听 `EventEmitter` 上的事件，有效地**暂停 `requestHandler`**，从而保持页面上下文的存活。
5. **交互式动作 (`click`, `fill` 等)**：消费者现在可以调用 `await engine.click(...)`。此方法将一个动作分派到 `EventEmitter` 并返回一个新的 `Promise`。
6. **动作执行**：仍在原始 `requestHandler` 作用域内运行的动作循环，会监听到该事件。
    * **统一处理的动作**：像 `extract`、`pause` 和 `getContent` 这样的动作会直接由 `FetchEngine` 基类使用统一的逻辑进行处理。
    * **委托执行的动作**：引擎相关的交互（如 `click`、`fill`）会委托给子类的 `executeAction` 实现。
7. **健壮的清理**：当调用 `dispose()` 或 `cleanup()` 时：
    * 设置 `isEngineDisposed` 标志以阻止新动作。
    * 发出 `dispose` 信号以唤醒并终止动作循环。
    * 释放所有活动的锁（如 `navigationLock`）。
    * 关闭爬虫 (`teardown`)，并删除私有的 `RequestQueue` 和 `KeyValueStore` 以确保清理干净。

---

## 🛠️ 4. 实现

主要有两种引擎实现：

### `CheerioFetchEngine` (http 模式)

* **ID**: `cheerio`
* **机制**: 使用 `CheerioCrawler` 通过原始 HTTP 请求抓取页面并解析静态 HTML。
* **行为**:
  * ✅ **快速轻量**：非常适合追求速度和低资源消耗的场景。
  * ❌ **无 JavaScript 执行**：无法与客户端渲染的内容交互。
  * ⚙️ **模拟交互**：像 `click` 和 `submit` 这样的动作是通过发起新的 HTTP 请求来模拟的。
* **用例**: 抓取静态网站、服务器渲染页面或 API。

### `PlaywrightFetchEngine` (browser 模式)

* **ID**: `playwright`
* **机制**: 使用 `PlaywrightCrawler` 控制一个真实的无头浏览器。
* **行为**:
  * ✅ **完整的浏览器环境**：执行 JavaScript，原生处理 Cookie、会话和复杂的用户交互。
  * ✅ **强大的交互**：动作能准确模拟真实用户行为。
  * ⚠️ **资源密集型**：比 Cheerio 引擎慢，需要更多的内存/CPU。
* **用例**: 与现代动态 Web 应用程序（SPA）或任何严重依赖 JavaScript 的网站进行交互。

#### 反爬虫/反屏蔽 (`antibot` 选项)

为了对抗复杂的反机器人措施，`PlaywrightFetchEngine` 提供了一个 `antibot` 模式。启用后，它会集成 [Camoufox](https://github.com/prescience-data/camoufox) 来增强其规避能力。

* **机制**:
  * 通过 `camoufox-js` 使用一个经过加固的 Firefox 浏览器。
  * 禁用默认的指纹伪装，由 Camoufox 管理浏览器指纹。
  * 自动尝试解决在导航过程中遇到的 Cloudflare 挑战。
* **如何启用**: 在创建 fetcher 属性时设置 `antibot: true` 选项。
* **用例**: 抓取受 Cloudflare 或其他高级机器人检测系统保护的网站。
* **注意**: 此功能需要额外的依赖项（`camoufox-js`, `firefox`），并可能带来性能开销。

---

## 📊 5. 使用 `extract()` 进行数据提取

`extract()` 方法提供了一种强大的声明式方式来从网页中提取结构化数据。它通过一个 **Schema (模式)** 来定义您期望的 JSON 输出结构,引擎会自动处理 DOM 遍历和数据提取。

### 核心设计: 三层提取架构

为了确保不同引擎之间的一致性并保持高质量,提取系统分为三个层次:

1. **规范化层 (`src/core/normalize-extract-schema.ts`)**: 将用户提供的各种简写模式预处理为统一的内部格式,处理 CSS 筛选器的合并。
2. **核心提取逻辑 (`src/core/extract.ts`)**: 引擎无关层,管理提取的“工作流”,包括递归、数组模式切换（Nested, Columnar, Segmented）以及严格模式/必填字段验证。它在 **`FetchElementScope`** 之上运行。
3. **引擎接口层 (`IExtractEngine`)**: 在核心层定义,由各引擎在 `base.ts` 及其子类中实现,提供底层的 DOM 原子操作，这些操作均接受并返回上述 Scope。

#### `IExtractEngine` 实现准则

为了保持跨引擎的一致性，所有实现必须遵循以下规则：

- **`_querySelectorAll`**:
  - 必须按 **DOM 文档顺序**返回匹配的元素。
  - 必须检查 Scope 元素**自身**是否匹配选择器。
  - 必须搜索每个 Scope 元素的**后代**。
- **`_nextSiblingsUntil`**:
  - 必须返回一个平铺的兄弟节点列表，从起始锚点之后开始，到第一个匹配 `untilSelector` 的元素之前停止（不含边界）。
- **`_bubbleUpToScope`**:
  - 必须实现深度限制（默认 1000），防止在损坏的 DOM 结构中陷入死循环。

这种解耦确保了诸如 **列对齐 (Columnar Alignment)**、**分段扫描 (Segmented Scanning)** 以及 **属性锚点跳转 (Anchor Jumping)** 等复杂功能,无论是在快速的 Cheerio 引擎还是完整的 Playwright 浏览器中,其行为都完全一致。

### Schema 规范化

为了提升易用性和灵活性,`extract` 方法在内部实现了一个**“规范化 (Normalization)”**层。这意味着您可以提供语义清晰的简写形式,在执行前,引擎会自动将其转换为标准的内部格式。

#### 1. 简写规则

- **字符串简写**: 一个简单的字符串（如 `'h1'`）会自动扩展为 `{ selector: 'h1', type: 'string', mode: 'text' }`。
- **隐式对象简写**: 如果你提供一个没有显式 `type: 'object'` 的对象，它会被视为一个 `object` 模式，其中对象的键即为要提取的属性名。
  - *示例*: `{ "title": "h1" }` 变为 `{ "type": "object", "properties": { "title": { "selector": "h1" } } }`。
- **筛选器简写**: 如果在提供 `selector` 的同时提供了 `has` 或 `exclude`，它们会自动使用 `:has()` 和 `:not()` 伪类合并到 CSS 选择器中。
  - *示例*: `{ "selector": "div", "has": "p" }` 变为 `{ "selector": "div:has(p)" }`。
- **数组简写**: 在 `array` 模式下直接提供 `attribute` 会作为其 `items` 的简写。
  - *示例*: `{ "type": "array", "attribute": "href" }` 变为 `{ "type": "array", "items": { "type": "string", "attribute": "href" } }`。

#### 2. 上下文 vs. 数据 (关键字分离)

在**隐式对象**中，引擎必须区分*配置*（在哪里找）和*数据*（提取什么）。

- **上下文关键字**: `selector`、`has`、`exclude`、`required` 和 `strict` 被保留用于定义提取上下文和验证。它们保留在 Schema 的根部。
- **数据关键字**: 所有其他键（包括 `items`、`attribute`、`mode`，甚至名为 `type` 的字段）都会被移动到 `properties` 对象中，作为要提取的数据字段。
- **冲突处理**: 只要字段值不是保留的 Schema 类型关键字（`string`、`number`、`boolean`、`html`、`object`、`array`），你就可以安全地提取名为 `type` 的字段。

#### 3. 跨引擎一致性

规范化层确保了无论你使用的是 `cheerio` (http) 还是 `playwright` (browser) 引擎，复杂的简写逻辑行为都完全一致，提供了一个统一的“AI 友好”接口。

一个 Schema 可以是以下三种类型之一:

* **值提取 (`ExtractValueSchema`)**: 提取单个值。
  * `selector`: (可选) 用于定位元素的 CSS 选择器。
  * `type`: (可选) 提取值的类型,如 `'string'` (默认), `'number'`, `'boolean'`, 或 `'html'` (提取内部 HTML)。
  * `attribute`: (可选) 如果提供,则提取元素的指定属性值(例如 `href`),而不是其文本内容。
* **对象提取 (`ExtractObjectSchema`)**: 提取一个 JSON 对象。
  * `selector`: (可选) 对象数据的根元素。
  * `properties`: 定义对象每个字段的子提取规则。
* **数组提取 (`ExtractArraySchema`)**: 提取一个数组。
  * `selector`: 用于匹配列表中每个项目元素的 CSS 选择器。
  * `items`: (可选) 应用于每个项目元素的提取规则。**如果省略,默认为提取元素的文本内容**。

### 高级功能 (通过规范化实现)

#### 1. 简写语法

为了简化常见场景,我们支持以下简写:

* **提取属性数组**: 您可以在 `array` 类型的 Schema 上直接使用 `attribute` 属性,作为 `items: { attribute: '...' }` 的简写。

    **简写:**

    ```json
    {
      "type": "array",
      "selector": ".post a",
      "attribute": "href"
    }
    ```

    **等效于:**

    ```json
    {
      "type": "array",
      "selector": ".post a",
      "items": { "attribute": "href" }
    }
    ```

* **提取文本数组**: 只需提供选择器,省略 `items` 即可。

    **简写:**

    ```json
    {
      "type": "array",
      "selector": ".tags li"
    }
    ```

    **等效于:**

    ```json
    {
      "type": "array",
      "selector": ".tags li",
      "items": { "type": "string" }
    }
    ```

#### 2. 精确筛选: `has` 和 `exclude`

您可以在任何包含 `selector` 的 Schema 中使用 `has` 和 `exclude` 字段来精确控制元素的选择。

* `has`: 一个 CSS 选择器,用于确保所选元素**必须包含**匹配此选择器的后代元素 (类似 `:has()`)。
* `exclude`: 一个 CSS 选择器,用于从结果中**排除**匹配此选择器的元素 (类似 `:not()`)。

### 完整示例

假设我们有以下 HTML,我们想提取所有"重要"文章的标题和链接,同时排除掉"存档"文章。

```html
<div id="articles">
  <div class="post important">
    <a href="/post/1"><h3>Post 1</h3></a>
  </div>
  <div class="post">
    <!-- This one is NOT important, lacks h3 -->
    <a href="/post/2">Post 2</a>
  </div>
  <div class="post important archived">
    <!-- This one is important but archived -->
    <a href="/post/3"><h3>Archived Post 3</h3></a>
  </div>
</div>
```

我们可以使用以下 Schema:

```typescript
const schema = {
  type: 'array',
  selector: '.post',      // 1. 选择所有 post
  has: 'h3',              // 2. 只保留包含 <h3> 的 post (重要文章)
  exclude: '.archived',   // 3. 排除包含 .archived 类名的 post
  items: {
    type: 'object',
    properties: {
      title: { selector: 'h3' },
      link: { selector: 'a', attribute: 'href' },
    }
  }
};

const data = await engine.extract(schema);

/*
 预计输出:
 [
   {
     "title": "Post 1",
     "link": "/post/1"
   }
 ]
*/
```

---

## 🧑‍💻 6. 如何扩展引擎

添加新的抓取引擎非常简单：

1. **创建类**：定义一个扩展泛型 `FetchEngine` 的新类，并提供具体的 `Context`、`Crawler` 和 `Options` 类型。

    ```typescript
    import { PlaywrightCrawler, PlaywrightCrawlerOptions, PlaywrightCrawlingContext } from 'crawlee';

    class MyPlaywrightEngine extends FetchEngine<
      PlaywrightCrawlingContext,
      PlaywrightCrawler,
      PlaywrightCrawlerOptions
    > {
      // ...
    }
    ```

2. **定义静态属性**：设置唯一的 `id` 和 `mode`。
3. **实现抽象方法**：为基类的抽象方法提供具体实现：
    * `_getSpecificCrawlerOptions()`: 返回一个包含爬虫特定选项的对象（例如，`headless` 模式、`preNavigationHooks`）。
    * `_createCrawler()`: 返回一个新的爬虫实例（例如，`new PlaywrightCrawler(options)`）。
    * `buildResponse()`: 将爬取上下文转换为标准的 `FetchResponse`。
    * `executeAction()`: 处理特定引擎的动作实现，如 `click`、`fill` 等。
4. **注册引擎**：调用 `FetchEngine.register(MyNewEngine)`。

---

## ✅ 7. 测试

`engine.spec.ts` 文件包含一个全面的测试套件。`engineTestSuite` 函数定义了一组标准测试，该套件会针对 `CheerioFetchEngine` 和 `PlaywrightFetchEngine` 运行，以确保它们在功能上等效并符合 `FetchEngine` API 契约。
