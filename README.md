# 🕸️ @isdk/web-fetcher

[![npm version](https://img.shields.io/npm/v/%40isdk%2Fweb-fetcher)](https://www.npmjs.com/package/@isdk/web-fetcher)
[![npm downloads](https://img.shields.io/npm/dw/%40isdk%2Fweb-fetcher)](https://www.npmjs.com/package/@isdk/web-fetcher)
[![License](https://img.shields.io/github/license/isdk/web-fetcher.js)](https://github.com/isdk/web-fetcher.js/blob/main/LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Types%20included-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/isdk/web-fetcher.js?logo=github)](https://github.com/isdk/web-fetcher.js)
![antibot](https://img.shields.io/badge/antibot-optional-orange)

English | [简体中文](./README.cn.md)

> An AI-friendly web automation library that simplifies complex web interactions into a declarative JSON action script. Write your script once and run it in either a fast **`http`** mode for static content or a full **`browser`** mode for dynamic sites. An optional **`antibot`** flag helps bypass detection mechanisms. The library is designed for targeted, task-oriented data extraction (e.g., get X from page Y), not for building whole-site crawlers.

---

## ✨ Core Features

* **⚙️ Dual-Engine Architecture**: Choose between **`http`** mode (powered by Cheerio) for speed on static sites, or **`browser`** mode (powered by Playwright) for full JavaScript execution on dynamic sites.
* **📜 Declarative Action Scripts**: Define multi-step workflows (like logging in, filling forms, and clicking buttons) in a simple, readable JSON format.
* **📊 Powerful and Flexible Data Extraction**: Easily extract all kinds of structured data, from simple text to complex nested objects, through an intuitive and powerful declarative Schema.
* **🧠 Smart Engine Selection**: Automatically detects dynamic sites and can upgrade the engine from `http` to `browser` on the fly.
* **🧩 Extensible**: Easily create custom, high-level "composite" actions to encapsulate reusable business logic (e.g., a `login` action).
* **🧲 Advanced Collectors**: Asynchronously collect data in the background, triggered by events during the execution of a main action.
* **🛡️ Anti-Bot Evasion**: In `browser` mode, an optional `antibot` flag helps to bypass common anti-bot measures like Cloudflare challenges.

---

## 📦 Installation

1. **Install the Package:**

    ```bash
    npm install @isdk/web-fetcher
    ```

2. **Install Browsers (For `browser` mode):**

    The `browser` engine is powered by Playwright, which requires separate browser binaries to be downloaded. If you plan to use the `browser` engine for interacting with dynamic websites, run the following command:

    ```bash
    npx playwright install
    ```

    > ℹ️ **Note:** This step is only required for `browser` mode. The lightweight `http` mode works out of the box without this installation.

---

## 🚀 Quick Start

The following example fetches a web page and extracts its title.

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function getTitle(url: string) {
  const { outputs } = await fetchWeb({
    url,
    actions: [
      {
        id: 'extract',
        params: {
          // Extracts the text content of the <title> tag
          selector: 'title',
        },
        // Stores the result in the `outputs` object under the key 'pageTitle'
        storeAs: 'pageTitle',
      },
    ],
  });

  console.log('Page Title:', outputs.pageTitle);
}

getTitle('https://www.google.com');
```

---

## 🤖 Advanced Usage: Multi-Step Form Submission

This example demonstrates how to use the `browser` engine to perform a search on Google.

```typescript
import { fetchWeb } from '@isdk/web-fetcher';

async function searchGoogle(query: string) {
  // Search for the query on Google
  const { result, outputs } = await fetchWeb({
    url: 'https://www.google.com',
    engine: 'browser', // Use the full browser engine for interaction
    actions: [
      // The initial navigation to google.com is handled by the `url` option
      { id: 'fill', params: { selector: 'textarea[name=q]', value: query } },
      { id: 'submit', params: { selector: 'form' } },
      { id: 'waitFor', params: { selector: '#search' } }, // Wait for the search results container to appear
      { id: 'getContent', storeAs: 'searchResultsPage' },
    ]
  });

  console.log('Search Results URL:', result?.finalUrl);
  console.log('Outputs contains the full page content:', outputs.searchResultsPage.html.substring(0, 100));
}

searchGoogle('gemini');
```

---

## 🏗️ Architecture

This library is built on two core concepts: **Engines** and **Actions**.

* ### Engine Architecture

    The library's core is its dual-engine design. It abstracts away the complexities of web interaction behind a unified API. For detailed information on the `http` (Cheerio) and `browser` (Playwright) engines, how they manage state, and how to extend them, please see the [**Fetch Engine Architecture**](./README.engine.md) document.

* ### Action Architecture

    All workflows are defined as a series of "Actions". The library provides a set of built-in atomic actions and a powerful composition model for creating your own semantic actions. For a deep dive into creating and using actions, see the [**Action Script Architecture**](./README.action.md) document.

---

## 📚 API Reference

### `fetchWeb(options)` or `fetchWeb(url, options)`

This is the main entry point for the library.

**Key `FetcherOptions`**:

* `url` (string): The initial URL to navigate to.
* `engine` ('http' | 'browser' | 'auto'): The engine to use. Defaults to `auto`.
* `proxy` (string | string[]): Proxy URL(s) to use for requests.
* `debug` (boolean): Enable detailed execution metadata (timings, engine used, etc.) in response.
* `actions` (FetchActionOptions[]): An array of action objects to execute. (Supports `action`/`name` as alias for `id`, and `args` as alias for `params`)
* `headers` (Record<string, string>): Headers to use for all requests.
* `cookies` (Cookie[]): Array of cookies to use.
* `sessionState` (any): Crawlee session state to restore.
* `storage` (StorageOptions): Controls session isolation, persistence, and cleanup.
  * `id` (string): Shared storage ID for cross-session data reuse.
  * `persist` (boolean): Whether to save data to disk.
  * `purge` (boolean): Whether to delete data on cleanup (defaults to `true`).
  * `config` (object): Raw Crawlee configuration (e.g., `{ localDataDirectory: './data' }`).
* `output` (object): Controls the output fields in `FetchResponse`.
  * `cookies` (boolean): Whether to include cookies in the response (default: `true`).
  * `sessionState` (boolean): Whether to include session state in the response (default: `true`).
* `sessionPoolOptions` (SessionPoolOptions): Advanced configuration for the underlying Crawlee SessionPool.
* ...and many other options for proxy, retries, etc.

### Built-in Actions

Here are the essential built-in actions:

* `goto`: Navigates to a new URL.
* `click`: Clicks on an element specified by a selector.
* `fill`: Fills an input field with a specified value.
* `submit`: Submits a form.
* `trim`: Removes elements from the DOM to clean up the page (e.g., scripts, ads, hidden content).
* `waitFor`: Pauses execution to wait for a specific condition (e.g., a timeout, a selector to appear, or network to be idle).
* `pause`: Pauses execution for manual intervention (e.g., solving a CAPTCHA).
* `getContent`: Retrieves the full content (HTML, text, etc.) of the current page state.
* `extract`: Extracts any structured data from the page with ease using an expressive, declarative schema. Supports `required` fields and `strict` validation for high-quality data collection.

### Response Structure

The `fetchWeb` function returns an object containing:

* `result` (FetchResponse):
  * `url`: The final URL.
  * `statusCode`: HTTP status code.
  * `headers`: HTTP headers.
  * `cookies`: Array of cookies.
  * `sessionState`: Crawlee session state.
  * `text`, `html`: Page content.
* `outputs` (Record<string, any>): Data extracted and stored via `storeAs`.

---

## 📜 License

[MIT](./LICENSE-MIT)
