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
  * **Configuration & State**: `headers()`, `cookies()`, `blockResources()`, `getState()`, `sessionPoolOptions`.
* **Static Registry**: It maintains a static registry of all available engine implementations (`FetchEngine.register`), allowing for dynamic selection by `id` or `mode`.

### `FetchEngine.create(context, options)`

This static factory method is the designated entry point for creating an engine instance. It automatically selects and initializes the appropriate engine.

### `FetchSession(options, engine)`

The `FetchSession` class manages the lifecycle of a fetch operation. It now supports an optional `engine` parameter in its constructor to force a specific engine implementation for that session, bypassing any auto-detection or registry-based selection.

### Engine Selection Priority

When the library determines which engine to use (via internal `maybeCreateEngine`), it follows this priority:

1. **Explicit Forced Engine**: If an engine ID is explicitly passed during session or engine creation (e.g., the new `engine` parameter in `FetchSession`).
2. **Configuration Engine**: The `engine` property defined in `FetcherOptions`.
3. **Site Registry**: If the target URL matches a domain in the configured `sites` registry, it uses the engine preferred for that site.
4. **Default**: Defaults to `auto`, which intelligently switches between `http` and `browser` if `enableSmart` is enabled, or defaults to `http` otherwise.

### Session Management & State Persistence

The engine supports persisting and restoring session state (primarily cookies) between executions.

* **`sessionState`**: A comprehensive state object (derived from Crawlee's SessionPool) that can be used to fully restore a previous session. This is set during engine initialization.
* **`sessionPoolOptions`**: Allows advanced configuration of the underlying Crawlee `SessionPool` (e.g., `maxUsageCount`, `maxPoolSize`).
  > **Note**: `persistenceOptions.enable` is forced to `true` to ensure proper session state management.
* **`overrideSessionState`**: If set to `true`, it forces the engine to overwrite any existing persistent state in the storage with the provided `sessionState`. This is useful when you want to ensure the session starts with the exact state provided, ignoring any stale data in the persistence layer.
* **`cookies`**: An array of explicit cookies to use for the session.

> **Consistency Note**: The engine uses Crawlee's `Session` as the single source of truth for cookies. In `browser` mode, cookies are synchronized in real-time from the browser to the session during interactions (like clicks), ensuring that `getContent()` or `extract()` always reflect the latest state.

**Precedence Rule:**
If both `sessionState` and `cookies` are provided, the engine adopts a **"Merge and Override"** strategy:
1. The session is first restored from the `sessionState`.
2. The explicit `cookies` are then applied on top.
   * **Result:** Any conflicting cookies in `sessionState` will be **overwritten** by the explicit `cookies`.
   * A warning will be logged if both are present to alert the user of this override behavior.

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

#### Anti-Bot Evasion (`antibot` option)

To combat sophisticated anti-bot measures, the `PlaywrightFetchEngine` offers an `antibot` mode. When enabled, it integrates [Camoufox](https://github.com/prescience-data/camoufox) to enhance its stealth capabilities.

* **Mechanism**:
  * Uses a hardened Firefox browser via `camoufox-js`.
  * Disables default fingerprint spoofing to let Camoufox manage the browser's fingerprint.
  * Automatically attempts to solve Cloudflare challenges encountered during navigation.
* **How to enable**: Set the `antibot: true` option when creating the fetcher properties.
* **Use Case**: Scraping websites protected by services like Cloudflare or other advanced bot-detection systems.
* **Note**: This feature requires additional dependencies (`camoufox-js`, `firefox`) and may have a performance overhead.

---

## 📊 5. Data Extraction with `extract()`

The `extract()` method provides a powerful, declarative way to pull structured data from a web page. It uses a **Schema** to define the structure of your desired JSON output, and the engine automatically handles DOM traversal and data extraction.

### Core Design: Schema Normalization

To enhance usability and flexibility, the `extract` method internally implements a **"Normalization"** layer. This means you can provide semantically clear shorthands, and the engine will automatically convert them into a standard, more verbose internal format before execution. This makes writing complex extraction rules simple and intuitive.

### Schema Structure

A schema can be one of three types:

* **Value Extraction (`ExtractValueSchema`)**: Extracts a single value.
  * `selector`: (Optional) A CSS selector to locate the element.
  * `type`: (Optional) The type of the extracted value, such as `'string'` (default), `'number'`, `'boolean'`, or `'html'` (extracts inner HTML).
  * `attribute`: (Optional) If provided, extracts the value of the specified attribute (e.g., `href`) instead of its text content.
* **Object Extraction (`ExtractObjectSchema`)**: Extracts a JSON object.
  * `selector`: (Optional) The root element for the object's data.
  * `properties`: Defines sub-extraction rules for each field of the object.
* **Array Extraction (`ExtractArraySchema`)**: Extracts an array.
  * `selector`: A CSS selector to match each item element in the list.
  * `items`: (Optional) The extraction rule to apply to each item element. **If omitted, it defaults to extracting the element's text content**.

### Advanced Features (via Normalization)

#### 1. Shorthand Syntax

To simplify common scenarios, the following shorthands are supported:

* **Extracting an Array of Attributes**: You can use the `attribute` property directly on an `array` type schema as a shorthand for `items: { attribute: '...' }`.

    **Shorthand:**

    ```json
    {
      "type": "array",
      "selector": ".post a",
      "attribute": "href"
    }
    ```

    **Equivalent to:**

    ```json
    {
      "type": "array",
      "selector": ".post a",
      "items": { "attribute": "href" }
    }
    ```

* **Extracting an Array of Texts**: Simply provide the selector and omit `items`.

    **Shorthand:**

    ```json
    {
      "type": "array",
      "selector": ".tags li"
    }
    ```

    **Equivalent to:**

    ```json
    {
      "type": "array",
      "selector": ".tags li",
      "items": { "type": "string" }
    }
    ```

#### 2. Precise Filtering: `has` and `exclude`

You can use the `has` and `exclude` fields in any schema that includes a `selector` to precisely control element selection.

* `has`: A CSS selector to ensure the selected element **must contain** a descendant matching this selector (similar to `:has()`).
* `exclude`: A CSS selector to **exclude** elements matching this selector from the results (similar to `:not()`).

### Complete Example

Suppose we have the following HTML and we want to extract the titles and links of all "important" articles, while excluding "archived" ones.

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

We can use the following schema:

```typescript
const schema = {
  type: 'array',
  selector: '.post',      // 1. Select all posts
  has: 'h3',              // 2. Only keep posts that contain an <h3> (important)
  exclude: '.archived',   // 3. Exclude posts with the .archived class
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
 Expected output:
 [
   {
     "title": "Post 1",
     "link": "/post/1"
   }
 ]
*/
```

---

## 🧑‍💻 6. How to Extend the Engine

Adding a new fetch engine is straightforward:

1. **Create the Class**: Define a new class that extends the generic `FetchEngine`, providing the specific `Context`, `Crawler`, and `Options` types from Crawlee.

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

2. **Define Static Properties**: Set the unique `id` and `mode`.
3. **Implement Abstract Methods**: Provide concrete implementations for the abstract methods from the base class:
    * `_getSpecificCrawlerOptions()`: Return an object with crawler-specific options (e.g., `headless` mode, `preNavigationHooks`).
    * `_createCrawler()`: Return a new instance of your crawler (e.g., `new PlaywrightCrawler(options)`).
    * `buildResponse()`: Convert the crawling context to a standard `FetchResponse`.
    * `executeAction()`: Handle engine-specific implementations for actions like `click`, `fill`, etc.
4. **Register the Engine**: Call `FetchEngine.register(MyNewEngine)`.

---

## ✅ 7. Testing

The file `engine.spec.ts` contains a comprehensive test suite. The `engineTestSuite` function defines a standard set of tests that is run against both `CheerioFetchEngine` and `PlaywrightFetchEngine` to ensure they are functionally equivalent and conform to the `FetchEngine` API contract.
