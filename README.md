# 🕸️ @isdk/web-fetcher

English | [简体中文](./README.cn.md)

> A powerful and flexible web fetching and browser automation library.
> It features a dual-engine architecture (HTTP and Browser) and a declarative action system, making it perfect for AI agents and complex data scraping tasks.

---

## ✨ Core Features

* **⚙️ Dual-Engine Architecture**: Choose between **`http`** mode (powered by Cheerio) for speed on static sites, or **`browser`** mode (powered by Playwright) for full JavaScript execution on dynamic sites.
* **📜 Declarative Action Scripts**: Define multi-step workflows (like logging in, filling forms, and clicking buttons) in a simple, readable JSON format.
* **📊 Powerful Data Extraction**: Use a declarative schema to extract structured data (JSON) from web pages with a single `extract` action.
* **🧠 Smart Engine Selection**: Automatically detects dynamic sites and can upgrade the engine from `http` to `browser` on the fly.
* **🧩 Extensible**: Easily create custom, high-level "composite" actions to encapsulate reusable business logic (e.g., a `login` action).
* **🧲 Advanced Collectors**: Asynchronously collect data in the background, triggered by events during the execution of a main action.

---

## 📦 Installation

1.  **Install the Package:**

    ```bash
    npm install @isdk/web-fetcher
    ```

2.  **Install Browsers (For `browser` mode):**

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
* `actions` (FetchActionOptions[]): An array of action objects to execute.
* `headers` (Record<string, string>): Headers to use for all requests.
* ...and many other options for proxy, cookies, retries, etc.

### Built-in Actions

Here are the essential built-in actions:

* `goto`: Navigates to a new URL.
* `click`: Clicks on an element specified by a selector.
* `fill`: Fills an input field with a specified value.
* `submit`: Submits a form.
* `waitFor`: Pauses execution to wait for a specific condition (e.g., a timeout, a selector to appear, or network to be idle).
* `getContent`: Retrieves the full content (HTML, text, etc.) of the current page state.
* `extract`: Extracts structured data from the page using a declarative schema.

---

## 📜 License

[MIT](./LICENSE-MIT)
