非常好！这个补充说明是项目的核心亮点之一，必须在帖子里清晰地强调出来。这正是区分你的库和简单封装的关键所在：**提供一个跨引擎的、统一的抽象层**。

我会将这一点融入到 V2EX 帖子中，让技术用户一眼就能看出这个设计的精妙之处。

---

这是更新后的 V2EX 帖子最终版：

#### **标题 (推荐):**

`[自荐] 做了一个为 AI 代理设计的 Web 自动化库：统一 API 驱动双引擎，让 AI 像人一样浏览网页。`

*(这个标题直接点出了“统一 API”和“双引擎”两个核心技术点)*

---

#### **正文:**

大家好，

最近一直在折腾 AI Agent，发现让 Agent 可靠地与 Web 交互是个大难题，现有工具要么太底层，要么不够灵活。所以动手撸了一个轮子： **`@isdk/web-fetcher`**，想和大家分享一下，也希望能得到一些反馈。

* **GitHub:** `https://github.com/isdk/web-fetcher.js`
* **NPM:** `npm install @isdk/web-fetcher`


#### 解决了什么痛点？

你可能会问，为啥不用 `fetch` 或 Playwright/Crawlee？

* `fetch` 拿不到 JS 动态渲染的内容，对现代网页基本没用。
* Playwright 虽然强大，但需要写大量命令式的过程代码 (`await page.click(...)` 等)，不仅繁琐，而且 AI (比如 LLM) 很难直接生成这种复杂的逻辑。

我不想重复造轮子，所以**底层用了`Crawlee` 库**来处理。

我的目标是在 `Crawlee` 之上构建一个跨引擎一致性：抽象/模拟 HTTP 与 Browser 的共有行为，**声明式的“意图层”**，让 AI 可以通过生成简单的 JSON 来“指挥”浏览器完成任务，而不是去写具体的执行代码。

#### 核心功能

* **⚙️ 双引擎架构**: 你可以选择 `http` 模式（基于 Cheerio）来极速抓取静态内容，也可以用 `browser` 模式（基于 Playwright）来处理复杂的动态网页。
* **✨ 统一的操作模型 (核心设计)**: 这是最关键的一点。**我抽象了 `http` 和 `browser` 模式下的共性行为**。无论底层用哪个引擎，你都使用同一套 `actions` API。比如 `extract` (提取数据) 这个操作，在 `http` 模式下它会通过 Cheerio 解析静态 HTML，在 `browser` 模式下它会操作浏览器渲染后的 DOM。**你只需要学习一套 API，库在内部完成了适配和翻译**。
* **📜 声明式操作脚本**: 基于统一的模型，你可以用 JSON 定义一个多步骤任务流（登录、填表、点击），AI 生成这个 JSON 的成本远低于生成 JS 代码。
* **📊 强大的数据提取**: 同样是声明式的 Schema，轻松从页面提取结构化数据。
* **🛡️ 内置反爬**: `browser` 模式下开启 `antibot: true`，能处理一些常见的 Cloudflare 挑战。
* **🧩 易于扩展**: 可以自己封装常用的操作，比如把“登录知乎”封装成一个 `loginToZhihu` 的自定义动作。

---

#### 快速上手：提取个标题

注意，下面的代码不关心目标 URL 是静态还是动态的，`extract` 操作在两种模式下都有效。

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function getTitle(url: string) {
  const { outputs } = await fetchWeb({
    url,
    actions: [
      {
        id: 'extract',
        params: {
          selector: 'title', // 提取 <title> 标签内容
        },
        storeAs: 'pageTitle', // 结果存到 outputs.pageTitle
      },
    ],
  });

  console.log('页面标题:', outputs.pageTitle);
}

getTitle('https://www.v2ex.com');
```

#### 进阶玩法：多步表单提交 (Google 搜索)

这个例子展示了如何用 JSON 指挥浏览器执行一系列动作。

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function searchGoogle(query: string) {
  const { result } = await fetchWeb({
    url: 'https://www.google.com',
    engine: 'browser', // 显式指定需要浏览器环境
    actions: [
      // 步骤 1: 找到输入框并填入内容
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      // 步骤 2: 提交表单
      { id: 'submit', params: { selector: 'form' } },
      // 步骤 3: 等待搜索结果容器加载出来
      { id: 'waitFor', params: { selector: '#search' } },
    ]
  });

  console.log('搜索结果页 URL:', result?.finalUrl);
}

searchGoogle('V2EX');
```

---

#### 项目状态

项目刚起步，核心架构已经搭好。下一步计划是实现更智能的抓取策略（比如发现 http 模式拿不到内容时，自动升级到 browser 模式）。

项目是开源的，欢迎大家试用、Star、提 Issue，或者狠狠地拍砖！感谢。
