# 🕸️ @isdk/web-fetcher

[English](./README.md) | 简体中文

> 一个功能强大且灵活的 Web 抓取与浏览器自动化库。
> 它采用双引擎架构（HTTP 和浏览器）和声明式动作系统，是 AI 代理和复杂数据抓取任务的理想选择。

---

## ✨ 核心特性

* **⚙️ 双引擎架构**: 可在 **`http`** 模式（由 Cheerio 驱动，适用于静态站点，速度快）和 **`browser`** 模式（由 Playwright 驱动，适用于动态站点，可执行完整的 JavaScript 交互）之间选择。
* **📜 声明式动作脚本**: 以简单、可读的 JSON 格式定义多步骤工作流（如登录、填写表单、点击按钮等）。
* **📊 强大的数据提取**: 使用声明式范式（schema），通过单个 `extract` 动作即可从网页中提取结构化数据（JSON）。
* **🧠 智能引擎选择**: 可自动检测动态站点，并在需要时将引擎从 `http` 动态升级到 `browser`。
* **🧩 可扩展性**: 轻松创建自定义的、高级别的“组合动作”，以封装可复用的业务逻辑（例如，一个 `login` 动作）。
* **🧲 高级收集器 (Collectors)**: 在主动作执行期间，由事件触发，在后台异步收集数据。

---

## 📦 安装

```bash
npm install @isdk/web-fetcher
```

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
* `actions` (FetchActionOptions[]): 要执行的动作对象数组。
* `headers` (Record<string, string>): 用于所有请求的头信息。
* ...以及许多其他用于代理、Cookie、重试等的选项。

### 内置动作

以下是核心的内置动作：

* `goto`: 导航到一个新的 URL。
* `click`: 点击一个由选择器指定的元素。
* `fill`: 用指定的值填充一个输入字段。
* `submit`: 提交一个表单。
* `waitFor`: 暂停执行以等待特定条件（例如，超时、选择器出现或网络空闲）。
* `getContent`: 获取当前页面状态的完整内容（HTML、文本等）。
* `extract`: 使用声明式范式（schema）从页面中提取结构化数据。

---

## 📜 许可证

[MIT](./LICENSE-MIT)
