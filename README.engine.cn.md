# ⚙️ Fetch Engine 架构

[English](./README.engine.md) | 简体中文

> 本文档全面概述了 Fetch Engine 的架构，旨在抽象化网页内容抓取和交互。它适用于需要理解、维护或扩展抓取引擎功能的开发人员。

---

## 🎯 1. 概述

`engine` 目录包含 Web Fetcher 的核心逻辑。其主要职责是为与网页交互提供统一的接口，无论底层技术如何（例如，简单的 HTTP 请求或功能齐全的浏览器）。这是通过抽象的 `FetchEngine` 类和利用不同抓取技术的具体实现来实现的。

> ℹ️ 该系统建立在 [Crawlee](https://crawlee.dev/) 库之上，并使用其强大的爬虫抽象。

---

## 🧩 2. 核心概念

### `FetchEngine` (base.ts)

这是定义所有抓取引擎契约的抽象基类。

* **职责**：为导航、内容检索和用户交互等操作提供一致的高级 API。
* **关键抽象**：
  * **生命周期**：`initialize()` 和 `cleanup()` 方法。
  * **核心操作**：`goto()`、`getContent()`、`click()`、`fill()`、`submit()`、`waitFor()`、`extract()`。
  * **配置**：`headers()`、`cookies()`、`blockResources()`。
* **静态注册表**：它维护所有可用引擎实现的静态注册表（`FetchEngine.register`），允许通过 `id` 或 `mode` 动态选择引擎。

### `FetchEngine.create(context, options)`

此静态工厂方法是创建引擎实例的指定入口点。它会自动选择并初始化合适的引擎。

---

## 🏗️ 3. 架构和工作流程

引擎架构旨在解决一个关键挑战：在 Crawlee 根本上**无状态、异步**的请求处理之上，提供一个简单的、**类似有状态的 API**（先 `goto()`，再 `click()`，再 `fill()`）。

### 核心问题：短暂的页面上下文

在 Crawlee 中，页面上下文（Playwright 中的 `page` 对象或 Cheerio 中的 `$` 函数）**仅在 `requestHandler` 函数的同步作用域内可用**。一旦处理程序完成或 `await`，上下文就会丢失。这使得无法直接实现 `await engine.goto(); await engine.click();` 这样的序列。

### 解决方案：使用动作循环桥接作用域

我们的引擎通过在外部 API 调用和内部 `requestHandler` 作用域之间创建桥梁来解决此问题。这是设计中最关键的部分。

**工作流程如下：**

1. **初始化**：消费者调用 `FetchEngine.create()`，初始化一个在后台运行的 Crawlee 爬虫（例如 `PlaywrightCrawler`）。
2. **导航 (`goto`)**：消费者调用 `await engine.goto(url)`。此方法将 URL 添加到 Crawlee 的 `RequestQueue`，并返回一个 `Promise`，该 `Promise` 将在页面加载后被解析。
3. **Crawlee 处理**：后台爬虫接收请求并调用引擎的 `requestHandler`，向其传递关键的页面上下文。
4. **页面激活和动作循环**：在 `requestHandler` 内部：
    * 页面上下文用于解析 `goto()` 调用返回的 `Promise`。
    * 页面被标记为“活动”状态 (`isPageActive = true`)。
    * 至关重要的是，在 `requestHandler` 返回之前，它会启动一个**动作循环** (`_executePendingActions`)。此循环通过监听 `EventEmitter` 上的事件，有效地**暂停 `requestHandler`**，从而保持页面上下文的存活。
5. **交互式动作 (`click`, `fill` 等)**：消费者现在可以调用 `await engine.click(...)`。此方法将一个动作分派到 `EventEmitter` 并返回一个新的 `Promise`。
6. **动作执行**：仍在原始 `requestHandler` 作用域内运行的动作循环，会监听到该事件。因为它能访问页面上下文，所以可以执行*实际的*交互（例如 `page.click(...)`）。
7. **清理**：循环一直持续到分派 `dispose` 动作（例如，由新的 `goto()` 调用触发），该动作会终止循环，并允许 `requestHandler` 最终完成。

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

---

## 📊 5. 使用 `extract()` 进行数据提取

`extract()` 方法提供了一种强大的声明式方式来从网页中提取结构化数据。您只需定义一个与您期望的 JSON 输出相对应的 schema，引擎将自动处理遍历和数据提取。

**示例**:

```typescript
const schema = {
  type: 'object',
  properties: {
    title: { selector: '.title' },
    author: {
      type: 'object',
      selector: '.author',
      properties: {
        name: { selector: '.name' },
        profile: { selector: 'a', attribute: 'href' },
      },
    },
    tags: {
      type: 'array',
      selector: '.tag',
      items: { type: 'string' },
    },
  },
};

const data = await engine.extract(schema);
```

---

## 🧑‍💻 6. 如何扩展引擎

添加新的抓取引擎非常简单：

1. **创建类**：定义一个扩展 `FetchEngine` 的新类。
2. **定义静态属性**：设置唯一的 `id` 和 `mode`。
3. **实现抽象方法**：为 `_initialize`、`buildResponse` 和 `executeAction` 等方法提供具体实现。
4. **注册引擎**：调用 `FetchEngine.register(MyNewEngine)`。

---

## ✅ 7. 测试

`engine.spec.ts` 文件包含一个全面的测试套件。`engineTestSuite` 函数定义了一组标准测试，该套件会针对 `CheerioFetchEngine` 和 `PlaywrightFetchEngine` 运行，以确保它们在功能上等效并符合 `FetchEngine` API 契约。
