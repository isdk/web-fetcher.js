# 🕸️ @isdk/web-fetcher

[![npm version](https://img.shields.io/npm/v/%40isdk%2Fweb-fetcher)](https://www.npmjs.com/package/@isdk/web-fetcher)
[![npm downloads](https://img.shields.io/npm/dw/%40isdk%2Fweb-fetcher)](https://www.npmjs.com/package/@isdk/web-fetcher)
[![License](https://img.shields.io/github/license/isdk/web-fetcher.js)](https://github.com/isdk/web-fetcher.js/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Types%20included-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/isdk/web-fetcher.js?logo=github)](https://github.com/isdk/web-fetcher.js)
![antibot](https://img.shields.io/badge/antibot-optional-orange)

[English](./README.md) | 简体中文

> 一个面向AI的网页自动化库，它将复杂的网页交互简化为声明式JSON动作脚本。一次编写，你的脚本即可在快速的 **`http`** 模式（用于静态内容）或完整的 **`browser`** 模式（用于动态站点）下运行。可选的 **`antibot`** 标志有助于绕过检测机制。该库专为有针对性的、面向任务的数据提取而设计（例如，从页面Y获取数据X），而非用于构建全站爬虫。

---

## ✨ 核心特性

* **⚙️ 双引擎架构**: 可在 **`http`** 模式（由 Cheerio 驱动，适用于静态站点，速度快）和 **`browser`** 模式（由 Playwright 驱动，适用于动态站点，可执行完整的 JavaScript 交互）之间选择。
* **📜 声明式动作脚本**: 以简单、可读的 JSON 格式定义多步骤工作流（如登录、填写表单、点击按钮等）。
* **📊 强大而灵活的数据提取**: 通过直观、强大的声明式 Schema,轻松提取从简单文本到复杂嵌套的各类结构化数据。
* **🧠 智能引擎选择**: 可自动检测动态站点，并在需要时将引擎从 `http` 动态升级到 `browser`。
* **🧩 可扩展性**: 轻松创建自定义的、高级别的“组合动作”，以封装可复用的业务逻辑（例如，一个 `login` 动作）。
* **🧲 高级收集器 (Collectors)**: 在主动作执行期间，由事件触发，在后台异步收集数据。
* **🛡️ 反爬虫/反屏蔽**: 在 `browser` 模式下，一个可选的 `antibot` 标志有助于绕过常见的反机器人措施，如 Cloudflare 挑战。

---

## 📦 安装

1. **安装依赖包:**

    ```bash
    npm install @isdk/web-fetcher
    ```

2. **安装浏览器 (用于 `browser` 模式):**

    `browser` 引擎由 Playwright 驱动，它需要下载独立的浏览器二进制文件。如果您计划使用 `browser` 引擎与动态网站进行交互，请运行以下命令：

    ```bash
    npx playwright install
    ```

    > ℹ️ **提示:** 仅当您需要使用 `browser` 模式时，此步骤才是必需的。轻量级的 `http` 模式无需安装浏览器即可工作。

---

## 🚀 快速入门

以下示例抓取一个网页并提取其标题。

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function getTitle(url: string) {
  const { outputs } = await fetchWeb({
    url,
    actions: [
      {
        id: 'extract',
        params: {
          // 提取 <title> 标签的文本内容
          selector: 'title',
        },
        // 将结果存储在 `outputs` 对象的 'pageTitle' 键下
        storeAs: 'pageTitle',
      },
    ],
  });

  console.log('页面标题:', outputs.pageTitle);
}

getTitle('https://www.google.com');
```

---

## 🤖 高级用法：多步表单提交

此示例演示如何使用 `browser` 引擎在 Google 上执行搜索。

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function searchGoogle(query: string) {
  // 在 Google 上搜索指定查询
  const { result, outputs } = await fetchWeb({
    url: 'https://www.google.com',
    engine: 'browser', // 使用完整的浏览器引擎进行交互
    actions: [
      // 对 google.com 的初始导航由 `url` 选项处理
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      { id: 'submit', params: { selector: 'form' } },
      { id: 'waitFor', params: { selector: '#search' } }, // 等待搜索结果容器出现
      { id: 'getContent', storeAs: 'searchResultsPage' },
    ]
  });

  console.log('搜索结果 URL:', result?.finalUrl);
  console.log('Outputs 中包含了完整的页面内容:', outputs.searchResultsPage.html.substring(0, 100));
}

searchGoogle('gemini');
```

---

## 🏗️ 架构

该库构建于两个核心概念之上：**引擎 (Engines)** 和 **动作 (Actions)**。

* ### 引擎架构

    该库的核心是其双引擎设计。它将 Web 交互的复杂性抽象在一个统一的 API 之后。有关 `http` (Cheerio) 和 `browser` (Playwright) 引擎的详细信息、它们如何管理状态以及如何扩展它们，请参阅 [**抓取引擎架构**](./README.engine.cn.md) 文档。

* ### 动作架构

    所有工作流都定义为一系列“动作”。该库提供了一套内置的原子动作和一个强大的组合模型，用于创建您自己的语义动作。有关创建和使用动作的深入探讨，请参阅 [**动作脚本架构**](./README.action.cn.md) 文档。

---

## 📚 API 参考

### `fetchWeb(options)` 或 `fetchWeb(url, options)`

这是库的主入口点。

**关键 `FetcherOptions`**:

* `url` (string): 要导航的初始 URL。
* `engine` ('http' | 'browser' | 'auto'): 要使用的引擎。默认为 `auto`。
* `proxy` (string | string[]): 用于请求的代理 URL。
* `debug` (boolean): 在响应中启用详细的执行元数据（耗时、使用的引擎等）。
* `actions` (FetchActionOptions[]): 要执行的动作对象数组。（支持 `action`/`name` 作为 `id` 的别名，`args` 作为 `params` 的别名）
* `headers` (Record<string, string>): 用于所有请求的头信息。
* `cookies` (Cookie[]): 要使用的 Cookie 数组。
* `sessionState` (any): 要恢复的 Crawlee 会话状态。
* `storage` (StorageOptions): 控制会话隔离、持久化和清理。
  * `id` (string): 共享存储 ID，用于跨会话重用数据。
  * `persist` (boolean): 是否将数据保存到磁盘。
  * `purge` (boolean): 是否在清理时删除数据（默认为 `true`）。
  * `config` (object): 原生 Crawlee 配置（例如 `{ localDataDirectory: './data' }`）。
* `output` (object): 控制 `FetchResponse` 中的输出字段。
  * `cookies` (boolean): 是否在响应中包含 Cookie（默认：`true`）。
  * `sessionState` (boolean): 是否在响应中包含会话状态（默认：`true`）。
* `sessionPoolOptions` (SessionPoolOptions): 底层 Crawlee SessionPool 的高级配置。
* ...以及许多其他用于代理、重试等的选项。

### 内置动作

以下是核心的内置动作：

* `goto`: 导航到一个新的 URL。
* `click`: 点击一个由选择器指定的元素。
* `fill`: 用指定的值填充一个输入字段。
* `submit`: 提交一个表单。
* `waitFor`: 暂停执行以等待特定条件（例如，超时、选择器出现或网络空闲）。
* `pause`: 暂停执行以进行手动干预（例如，解决验证码）。
* `getContent`: 获取当前页面状态的完整内容（HTML、文本等）。
* `extract`: 使用富有表现力的声明式 Schema,可轻松提取页面中的任意结构化数据。

### 响应结构

`fetchWeb` 函数返回一个对象，包含：

* `result` (FetchResponse):
  * `url`: 最终 URL。
  * `statusCode`: HTTP 状态码。
  * `headers`: HTTP 头信息。
  * `cookies`: Cookie 数组。
  * `sessionState`: Crawlee 会话状态。
  * `text`, `html`: 页面内容。
* `outputs` (Record<string, any>): 通过 `storeAs` 提取并存储的数据。

---

## 📜 许可证

[MIT](./LICENSE-MIT)
