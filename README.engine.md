# ⚙️ Fetch Engine Architecture

English | [简体中文](./README.engine.cn.md)

> This document provides a comprehensive overview of the Fetch Engine architecture, designed to abstract web content fetching and interaction. It's intended for developers who need to understand, maintain, or extend the fetching capabilities.

---

## 🎯 1. Overview

The `engine` directory contains the core logic for the web fetcher. Its primary responsibility is to provide a unified interface for interacting with web pages, regardless of the underlying technology (e.g., simple HTTP requests or a full-fledged browser). This is achieved through an abstract `FetchEngine` class and concrete implementations that leverage different crawling technologies.

> ℹ️ The system is built on top of the [Crawlee](https://crawlee.dev/) library, using its powerful crawler abstractions.

---

## 🧩 2. Core Concepts

### `FetchEngine` (base.ts)

This is the abstract base class that defines the contract for all fetch engines.

* **Role**: To provide a consistent, high-level API for actions like navigation, content retrieval, and user interaction.
* **Key Abstractions**:
  * **Lifecycle**: `initialize()` and `cleanup()` methods.
  * **Core Actions**: `goto()`, `getContent()`, `click()`, `fill()`, `submit()`, `waitFor()`, `extract()`.
  * **Configuration**: `headers()`, `cookies()`, `blockResources()`.
* **Static Registry**: It maintains a static registry of all available engine implementations (`FetchEngine.register`), allowing for dynamic selection by `id` or `mode`.

### `FetchEngine.create(context, options)`

This static factory method is the designated entry point for creating an engine instance. It automatically selects and initializes the appropriate engine.

---

## 🏗️ 3. Architecture and Workflow

The engine's architecture is designed to solve a key challenge: providing a simple, **stateful-like API** (`goto()`, then `click()`, then `fill()`) on top of Crawlee's fundamentally **stateless, asynchronous** request handling.

### The Core Problem: Ephemeral Page Context

In Crawlee, the page context (the `page` object in Playwright or the `$` function in Cheerio) is **only available within the synchronous scope of the `requestHandler` function**. Once the handler finishes or `await`s, the context is lost. This makes it impossible to directly implement a sequence like `await engine.goto(); await engine.click();`.

### The Solution: Bridging Scopes with an Action Loop

Our engine solves this by creating a bridge between the external API calls and the internal `requestHandler` scope. This is the most critical part of the design.

**The workflow is as follows:**

1. **Initialization**: A consumer calls `FetchEngine.create()`, which initializes a Crawlee crawler (e.g., `PlaywrightCrawler`) that runs in the background.
2. **Navigation (`goto`)**: The consumer calls `await engine.goto(url)`. This adds the URL to Crawlee's `RequestQueue` and returns a `Promise` that will resolve when the page is loaded.
3. **Crawlee Processing**: The background crawler picks up the request and invokes the engine's `requestHandler`, passing it the crucial page context.
4. **Page Activation & Action Loop**: Inside the `requestHandler`:
    * The page context is used to resolve the `Promise` from the `goto()` call.
    * The page is marked as "active" (`isPageActive = true`).
    * Crucially, before the `requestHandler` returns, it starts an **action loop** (`_executePendingActions`). This loop effectively **pauses the `requestHandler`** by listening for events on an `EventEmitter`, keeping the page context alive.
5. **Interactive Actions (`click`, `fill`, etc.)**: The consumer can now call `await engine.click(...)`. This dispatches an action to the `EventEmitter` and returns a new `Promise`.
6. **Action Execution**: The action loop, still running within the original `requestHandler`'s scope, hears the event. Because it has access to the page context, it can perform the *actual* interaction (e.g., `page.click(...)`).
7. **Cleanup**: The loop continues until a `dispose` action is dispatched (e.g., by a new `goto()` call), which terminates the loop and allows the `requestHandler` to finally complete.

---

## 🛠️ 4. Implementations

There are two primary engine implementations:

### `CheerioFetchEngine` (http mode)

* **ID**: `cheerio`
* **Mechanism**: Uses `CheerioCrawler` to fetch pages via raw HTTP and parse static HTML.
* **Behavior**:
  * ✅ **Fast and Lightweight**: Ideal for speed and low resource consumption.
  * ❌ **No JavaScript Execution**: Cannot interact with client-side rendered content.
  * ⚙️ **Simulated Interaction**: Actions like `click` and `submit` are simulated by making new HTTP requests.
* **Use Case**: Scraping static websites, server-rendered pages, or APIs.

### `PlaywrightFetchEngine` (browser mode)

* **ID**: `playwright`
* **Mechanism**: Uses `PlaywrightCrawler` to control a real headless browser.
* **Behavior**:
  * ✅ **Full Browser Environment**: Executes JavaScript, handles cookies, sessions, and complex user interactions natively.
  * ✅ **Robust Interaction**: Actions accurately mimic real user behavior.
  * ⚠️ **Resource Intensive**: Slower and requires more memory/CPU.
* **Use Case**: Interacting with modern, dynamic web applications (SPAs) or any site that relies heavily on JavaScript.

---

## 📊 5. Data Extraction with `extract()`

The `extract()` method provides a powerful, declarative way to pull structured data from a web page. You define a schema that mirrors your desired JSON output, and the engine handles the traversal and data extraction.

**Example**:

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

## 🧑‍💻 6. How to Extend the Engine

Adding a new fetch engine is straightforward:

1. **Create the Class**: Define a new class that extends `FetchEngine`.
2. **Define Static Properties**: Set the unique `id` and `mode`.
3. **Implement Abstract Methods**: Provide concrete implementations for methods like `_initialize`, `buildResponse`, and `executeAction`.
4. **Register the Engine**: Call `FetchEngine.register(MyNewEngine)`.

---

## ✅ 7. Testing

The file `engine.spec.ts` contains a comprehensive test suite. The `engineTestSuite` function defines a standard set of tests that is run against both `CheerioFetchEngine` and `PlaywrightFetchEngine` to ensure they are functionally equivalent and conform to the `FetchEngine` API contract.
