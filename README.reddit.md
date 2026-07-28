### 推荐的 Reddit 频道 (Subreddits)

根据项目特点,最适合发布此帖子的社区是:

1.  **r/webscraping**: 这是最直接相关的社区。这里的用户会非常欣赏其双引擎架构和反机器人侦测功能。
2.  **r/javascript**: 这是一个庞大的 JavaScript 开发者社区。由于这是一个 npm 库,在这里发布可以获得广泛的关注。
3.  **r/ArtificialIntelligence**: 鉴于该库明确为 AI 代理设计,这个社区的成员会对“声明式 JSON 工作流”等特性特别感兴趣,因为这使得 AI 可以轻松生成和执行自己的自动化脚本。
4.  **r/programming**: 一个更广泛的编程社区,适合分享技术含量高的新项目。

---

### Reddit 帖子草稿

**标题:** 我为 AI 代理构建了一个 Web 自动化库,它拥有双引擎(快速 HTTP + 完整浏览器)和声明式操作!

**正文:**

大家好,

我非常激动地想和大家分享我最近一直在开发的一个项目: **`@isdk/web-fetcher`**。

在构建需要与 web 交互的 AI 代理或复杂的 web scraper 时,我们常常需要编写脆弱、命令式的代码来处理导航、点击和数据提取。这个过程不仅繁琐,而且难以维护。

`@isdk/web-fetcher` 就是为了解决这个问题而生的。它是一个功能强大且灵活的 web 抓取和浏览器自动化库,其核心是为 AI 应用和高级数据抓取任务而设计的。

---

#### 🤔 为什么要造这个轮子?

你可能会想:“为什么不直接用 `fetch` 或者 Playwright 呢?”

*   **`fetch` 的局限**: `fetch` API 非常适合请求 API 或获取静态 HTML,但对于现代的、由 JavaScript 动态渲染内容的网站(比如单页应用 SPA)就无能为力了。你拿到手的只是一堆不含实际内容的模板代码。
*   **Playwright 不够“开箱即用”**: 虽然 Playwright 很强大,但直接使用它意味着你需要自己处理很多额外的工作。比如:
    *   **反爬虫措施**: 很多网站有 Cloudflare 等反机器人机制,需要复杂的策略来绕过。
    *   **登录与会话**: 获取某些内容前必须登录,你需要手动管理登录流程和会话状态。
    *   **代码冗余**: 大量的配置和重复的交互逻辑代码会迅速膨胀。

`@isdk/web-fetcher` 在这些工具之上构建了一个更高层次的抽象,旨在提供一个既强大又易于使用的统一接口,让你可以专注于业务逻辑,而不是底层的实现细节。

---

#### ✨ 核心功能:

*   **⚙️ 双引擎架构**: 你可以根据任务需求选择合适的引擎。使用 **`http` 模式** (基于 Cheerio) 在静态网站上实现闪电般的速度,或者切换到 **`browser` 模式** (基于 Playwright) 来处理需要完整 JavaScript 执行的动态网站。
*   **📜 声明式操作脚本**: 你可以用简单、可读的 JSON 格式定义复杂的多步骤工作流(如登录、填写表单、点击按钮)。这使得 AI 代理可以动态生成自己的自动化脚本。
*   **📊 强大的数据提取**: 通过一个直观且富有表现力的声明式 Schema,可以轻松提取从简单文本到复杂嵌套对象的各种结构化数据。
*   **🛡️ 反机器人侦测**: 在 `browser` 模式下,一个可选的 `antibot` 标志可以帮助你绕过像 Cloudflare 这样的常见反机器人措施。
*   **🧩 可扩展**: 你可以轻松创建自定义的、高级别的“复合”操作来封装可复用的业务逻辑(例如,一个 `login` 动作)。

---

#### 🚀 快速上手

下面是一个简单的例子,展示了如何抓取一个网页并提取其标题:

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
        // 将结果存储在 outputs 对象的 'pageTitle' 键下
        storeAs: 'pageTitle',
      },
    ],
  });

  console.log('Page Title:', outputs.pageTitle);
}

getTitle('https://www.google.com');
```

---

#### 🤖 高级用法: 多步骤表单提交

这个例子演示了如何使用 `browser` 引擎在 Google 上执行搜索。

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function searchGoogle(query: string) {
  const { result } = await fetchWeb({
    url: 'https://www.google.com',
    engine: 'browser', // 使用完整的浏览器引擎进行交互
    actions: [
      // 初始导航由 url 选项处理
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      { id: 'submit', params: { selector: 'form' } },
      { id: 'waitFor', params: { selector: '#search' } }, // 等待搜索结果容器出现
    ]
  });

  console.log('搜索结果 URL:', result?.finalUrl);
}

searchGoogle('gemini');
```

---

#### 🌱 项目状态与未来展望

这个项目刚刚出炉,我们已经搭建好了一个坚实且高度可扩展的核心架构,并提供了上述所有基本功能。

当然,它还有一些待完善的地方。我们接下来的一个重要目标是实现更智能的抓取策略,比如 **能够根据目标网站的特点自动选择最佳的抓取方式** (例如,自动从 `http` 模式升级到 `browser` 模式)。

---

这个项目是开源的,你可以在 NPM 和 GitHub 上找到它。

*   **NPM:** `npm install @isdk/web-fetcher`
*   **GitHub:** [链接到你的 GitHub 仓库]

欢迎大家试用并提出宝贵的反馈!我很想听听你们的想法。


------------------------------


好的，这是一个非常重要的信息！透露你使用了像 `crawlee` 这样成熟的库作为底层，可以极大地增强你项目的可信度。这表明你没有“重复造轮子”，而是在一个坚实的基础上构建了一个更高层次的抽象。这在技术社区里是一个非常积极的信号。

我会将这一点巧妙地融入帖子中，让它成为一个加分项。

---

这是更新后的版本，它强调了你的库是如何站在巨人肩膀上的：

### **Title: I built a web automation library for AI agents so they can browse the web like a human, not a bot.**

Hey everyone,

Ever tried to make an AI agent *actually use* a website? You quickly run into a wall of pain.

You're not trying to crawl an entire domain like a traditional scraper. You want your agent to perform a specific task: log in, find a price, fill out a form, and get the result. But this means writing brittle, imperative code (`page.waitForSelector()`, `page.click()`, `page.evaluate()`, repeat) that breaks the moment a UI element changes.

I've been building AI agents and got deeply frustrated by this. So, I created a solution: **`@isdk/web-fetcher`**.

It’s a library designed to give agents a "browser on a leash"—a way to perform targeted, human-like actions on the web without the messy implementation details.

---

### 🤔 "Why not just use Playwright or Crawlee?"

Great question, and the answer gets to the heart of this project. I'm a huge fan of not reinventing the wheel, which is why **this library uses the incredible `crawlee` library under the hood.**

*   **The Low-Level Tools (`fetch`, Playwright):** `fetch` is for static content, and Playwright is a fantastic browser control tool. But using it directly is like being given a box of engine parts and told to build a car.
*   **The Powerful Framework (`crawlee`):** `crawlee` is a massive step up. It solves huge problems like request queuing, proxy management, and browser pooling. It's the robust engine and chassis for our car.
*   **The Missing Piece (My Library):** Even with `crawlee`, you often still need to write *imperative, procedural code* to define *what* happens on the page. Your agent's logic gets mixed up with `page.click()` and `page.fill()`.

`@isdk/web-fetcher` is the final layer: **the simple, declarative dashboard for the car.** It sits on top of `crawlee`'s power and provides a JSON-based instruction set. This allows an AI to easily generate a "plan" of what to do, without worrying about the implementation.

So, it's not a replacement; it's an abstraction layer specifically for **agent-driven automation**.

---

### ✨ Core Features: What Makes It Different?

*   **⚙️ Dual-Engine Architecture (via Crawlee):** Choose your weapon. Use the blazing-fast **`http` mode** for simple sites, or the full-featured **`browser` mode** for complex, interactive web apps.
*   **📜 Declarative Action Scripts:** This is the key for AI. Instead of code, you define multi-step tasks (log in, search, extract) in simple JSON. **This means an AI agent can dynamically generate its own automation plans.**
*   **📊 Clean, Declarative Data Extraction:** Define the data you want with a simple schema. No more wrestling with DOM traversal in your application code.
*   **🛡️ Built-in Anti-Bot Evasion:** By leveraging `crawlee`'s capabilities, a simple `antibot: true` flag helps navigate common bot detection hurdles like Cloudflare.
*   **🧩 Extensible by Design:** Bundle complex sequences into your own high-level actions. For example, create a single, reusable `loginToGitHub` action that encapsulates the entire login flow.

---

### 🚀 Quick Start: Grab a Page Title

Here’s how simple it is. The library handles the engine choice and execution.

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function getTitle(url: string) {
  const { outputs } = await fetchWeb({
    url,
    actions: [
      {
        id: 'extract',
        params: {
          // Tell it to grab the text from the <title> tag
          selector: 'title',
        },
        // Store the result under the 'pageTitle' key
        storeAs: 'pageTitle',
      },
    ],
  });

  console.log('Page Title:', outputs.pageTitle);
}

getTitle('https://news.ycombinator.com');
```

---

### 🤖 Advanced Example: A Human-like Task (Google Search)

This shows how an agent could perform a search. Notice we're just *describing* the steps.

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function searchGoogle(query: string) {
  const { result } = await fetchWeb({
    url: 'https://www.google.com',
    engine: 'browser', // We need a real browser for this
    actions: [
      // Step 1: Fill the search bar
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      // Step 2: Submit the form (like pressing Enter)
      { id: 'submit', params: { selector: 'form' } },
      // Step 3: Wait for search results to appear
      { id: 'waitFor', params: { selector: '#search' } },
    ]
  });

  console.log('Search Results URL:', result?.finalUrl);
}

searchGoogle('Gemini vs. GPT-4');
```

---

### 🌱 Project Status & The Road Ahead

This project is fresh out of the oven. The core architecture is solid, and the features above are ready to use.

My next big goal is to make it even smarter. I want to implement a strategy where it can **automatically upgrade from `http` to `browser` mode** if it detects that a simple request isn't enough to get the job done.

---

The project is open source and I'd be thrilled for you to check it out, give it a spin, and share your feedback.

*   **NPM:** `npm install @isdk/web-fetcher`
*   **GitHub:** [https://github.com/isdk/web-fetcher.js](https://github.com/isdk/web-fetcher.js)

I’m really excited to hear what you think and what you might build with it. Thanks for reading