# Fetch Engine 架构

本文档全面概述了 Fetch Engine 的架构，旨在抽象化网页内容抓取和交互。它适用于需要理解、维护或扩展抓取引擎功能的开发人员。

## 1. 概述

`engine` 目录包含 Web Fetcher 的核心逻辑。其主要职责是为与网页交互提供统一的接口，无论底层技术如何（例如，简单的 HTTP 请求或功能齐全的浏览器）。这是通过抽象的 `FetchEngine` 类和利用不同抓取技术的具体实现来实现的。

该系统建立在 [Crawlee](https://crawlee.dev/) 库之上，并使用其强大的爬虫抽象。

## 2. 核心概念

### `FetchEngine` (base.ts)

这是定义所有抓取引擎契约的抽象基类。

- **职责**：为导航、内容检索和用户交互等操作提供一致的高级 API。
- **关键抽象**：
  - **生命周期**：`initialize()` 和 `cleanup()` 方法用于管理引擎的状态。
  - **核心引擎操作**：`goto()`、`getContent()`、`click()`、`fill()`、`submit()`、`waitFor()`。
  - **配置**：`headers()`、`cookies()`、`blockResources()`。
- **静态注册表**：它维护所有可用引擎实现（`FetchEngine.register`）的静态注册表。这允许通过其 `id` 或 `mode` 轻松扩展和选择引擎。
- **动作分派**：它使用事件驱动模型（`_executePendingActions` 和 `actionEmitter`）在初始 `goto()` 调用后处理活动页面上的一系列动作。

### `FetchEngine.create(context, options)`

此静态工厂方法是创建引擎实例的指定入口点。它根据提供的 `engine` 选项（例如，'http'、'browser'、'cheerio'、'playwright'）自动选择合适的引擎并对其进行初始化。

## 3. 架构和工作流程

The engine's architecture is designed to solve a key challenge: providing a simple, stateful-like API (`goto()`, then `click()`, then `fill()`) on top of Crawlee's fundamentally stateless, asynchronous request handling.

### 核心问题：短暂的页面上下文

在 Crawlee 中，页面上下文（Playwright 中的 `page` 对象或 Cheerio 中的 `$` 函数）**仅在 `requestHandler` 函数的作用域内可用**。一旦处理程序完成，上下文就会消失。这使得无法直接实现 `await engine.goto(); await engine.click();` 这样的序列。

### 解决方案：使用动作循环桥接作用域

我们的引擎通过在外部 API 调用和内部 `requestHandler` 作用域之间创建桥梁来解决此问题。这是设计中最关键和最复杂的部分。

工作流程如下：

1. **实例化和初始化**：消费者调用 `FetchEngine.create()`，它初始化适当的 Crawlee 爬虫（例如，`PlaywrightCrawler`）。爬虫在后台开始运行，等待请求。

2. **导航 (`goto`)**：消费者调用 `await engine.goto(url)`。此方法将 URL 添加到 Crawlee 的 `RequestQueue`，并返回一个存储在 `pendingRequests` 映射中的 `Promise`，该 `Promise` 将在页面加载后被解析。

3. **Crawlee 处理**：后台爬虫接收请求并调用引擎的 `requestHandler`（`_sharedRequestHandler`），向其传递关键的页面上下文。如果请求失败，则会调用 `_sharedFailedRequestHandler`，它会拒绝待处理的 `Promise`。

4. **页面激活和动作循环**：这是关键步骤。在 `requestHandler` 内部：
    * 页面上下文用于构建响应，该响应解析原始 `goto()` 调用返回的 `Promise`。消费者的 `await` 现在已完成。
    * 页面被标记为“活动”（`isPageActive = true`）。
    * 至关重要的是，在 `requestHandler` 返回之前，它会启动一个**动作循环**（`_executePendingActions`）。此循环是一个异步函数，它有效地**暂停 `requestHandler`**，保持页面上下文处于活动状态。它通过监听 `EventEmitter`（`actionEmitter`）上的事件来实现这一点。

5. **交互式动作 (`click`, `fill` 等)**：消费者现在可以调用 `await engine.click(...)`。此方法**不**直接执行点击。相反，它：
    * 检查页面是否处于活动状态。
    * 将 `click` 动作对象分派到 `actionEmitter`。
    * 返回一个新的 `Promise`，等待动作被解析。

6. **动作执行**：
    * `_executePendingActions` 循环仍在原始 `requestHandler` 的作用域内运行，它会听到 `click` 事件。
    * 因为它可以访问页面上下文，所以它现在可以正确调用引擎的 `executeAction` 方法，该方法执行**实际的**交互（例如，`page.click(...)` 或模拟 HTTP 请求）。
    * 一旦动作完成，结果将用于解析交互式动作调用返回的 `Promise`。

7. **清理**：此循环一直持续到分派 `dispose` 动作。这发生在消费者调用 `engine.dispose()` 或（重要的是）进行新的 `goto()` 调用时。`dispose` 动作会终止循环，允许 `requestHandler` 最终完成，并清理所有资源。

### 管理状态转换和并发

虽然动作循环创建了一个“实时”页面，但管理从一个页面到另一个页面的转换（即处理多个 `goto` 调用）需要仔细协调以防止竞争条件。根据引擎的不同，处理方式也有所不同。

- **`PlaywrightFetchEngine`**：因为它控制一个持久化的浏览器，如果 `goto` 在页面已激活时被调用，它只是向现有的动作循环分派一个 `navigate` 动作，告诉浏览器导航到新的 URL。

- **`CheerioFetchEngine`**：由于每次“导航”都是一个新的、独立的 HTTP 请求，引擎不能简单地重用上下文。它使用一个 `navigationLock` 来强制每次只有一个 `goto` 进程可以处于活动状态。
    1. 一个 `goto` 调用首先等待当前的 `navigationLock` 被释放（表示前一个请求处理器已完成）。
    2. 然后它立即为自己创建一个*新的、未解析的*锁，阻止任何后续的 `goto` 调用开始。
    3. 它将其请求添加到队列中。
    4. 当其对应的 `requestHandler` 最终完成时，它会释放它创建的锁，允许队列中的下一个 `goto` 调用继续进行。

这种事件驱动的动作循环和导航锁的组合成功地创建了持久的、有状态页面的假象，可以通过简单的顺序 API 进行控制，同时尊重 Crawlee 框架的底层约束。

## 4. 实现

主要有两种引擎实现：

### `CheerioFetchEngine` (cheerio.ts)

- **ID**：`cheerio`
- **模式**：`http`
- **机制**：使用 `CheerioCrawler`。它通过原始 HTTP 请求抓取网页，并使用 Cheerio 库（jQuery 的服务器端子集）解析静态 HTML 内容。
- **行为**：
  - **快速轻量**：非常适合速度和低资源消耗。
  - **无 JavaScript 执行**：无法与客户端渲染的内容或动态应用程序交互。
  - **模拟交互**：通过发起新的 HTTP 请求来模拟动作。
    - `click`：模拟点击。如果选择器是链接（`<a>`），它会导航到 `href`。如果是提交按钮，它会触发表单提交。如果未找到选择器，则将其视为原始 URL 进行导航。
    - `fill`：在解析的 HTML 中更新表单输入的值。此状态会暂时保持，直到调用 `submit` 动作。
    - `submit`：序列化表单输入的当前状态，并发送一个新的 `GET` 或 `POST` 请求。
- **用例**：抓取静态网站、服务器渲染页面或不需要浏览器功能的 API。

### `PlaywrightFetchEngine` (playwright.ts)

- **ID**：`playwright`
- **模式**：`browser`
- **机制**：使用 `PlaywrightCrawler` 在无头或有头模式下控制真实的浏览器实例（例如，Chromium、Firefox、WebKit）。
- **行为**：
  - **完整的浏览器环境**：执行 JavaScript，原生处理 cookie、会话和复杂的 UI 交互。
  - **强大的交互**：动作由 Playwright 执行，准确模拟真实用户行为。
    - `click`：执行点击并等待网络活动稳定下来，正确处理由点击触发的导航。
    - `submit`：可以触发表单的标准提交，或者对于 `application/json` 类型的表单，它可以拦截提交并使用浏览器的 `fetch` API 发送数据，从而能够捕获基于 XHR 的提交结果。
  - **资源密集型**：比 Cheerio 引擎慢，需要更多的内存/CPU。
- **用例**：与现代动态 Web 应用程序（例如，使用 React、Vue、Angular 构建的 SPA）或任何严重依赖 JavaScript 的网站进行交互。

## 5. 如何扩展引擎

添加新的抓取引擎非常简单：

1. **创建类**：创建一个新文件（例如，`my-engine.ts`）并定义一个扩展 `FetchEngine` 的类。

    ```typescript
    import { FetchEngine, FetchEngineAction, ... } from './base';

    export class MyEngine extends FetchEngine {
      // ...
    }
    ```

2. **定义静态属性**：为引擎设置唯一的 `id` 和 `mode`。

    ```typescript
    static readonly id = 'my-engine';
    static readonly mode = 'browser'; // 或 'http'
    ```

3. **实现抽象方法**：为 `FetchEngine` 中定义的所有抽象方法提供具体实现：
    - `_initialize()`：设置您的底层爬虫实例。
    - `_cleanup()`：拆除爬虫并释放资源。
    - `buildResponse()`：将爬虫的上下文转换为标准的 `FetchResponse`。
    - `executeAction()`：实现 `click`、`fill`、`submit` 等的逻辑。
    - `goto()`、`click()`、`fill()` 等：实现面向公众的动作方法，这些方法通常分派到内部动作循环。

4. **注册引擎**：在文件末尾，在引擎注册表中注册新类。

    ```typescript
    FetchEngine.register(MyEngine);
    ```

## 6. 测试

`engine.spec.ts` 文件包含抓取引擎的全面测试套件。

- **本地测试服务器**：它使用 `fastify` 创建一个本地 Web 服务器，其中包含各种端点以测试不同的场景（导航、表单提交、标头等）。
- **可重用测试套件**：`engineTestSuite` 函数定义了一组标准测试。此套件针对 `CheerioFetchEngine` 和 `PlaywrightFetchEngine` 运行，以确保它们在功能上等效并符合 `FetchEngine` API 契约。
- **为新引擎添加测试**：添加新引擎时，只需使用您的新引擎类添加另一个对 `engineTestSuite` 的调用以验证其实现。

    ```typescript
    // 在 engine.spec.ts 中
    engineTestSuite('my-engine', MyEngine);
    ```
