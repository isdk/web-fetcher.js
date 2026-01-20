# ⚙️ Fetch Engine Architecture

English | [简体中文](./README.engine.cn.md)

> This document provides a comprehensive overview of the Fetch Engine architecture, designed to abstract web content fetching and interaction. It's intended for developers who need to understand, maintain, or extend the fetching capabilities.

---

## 🎯 1. Overview

The `engine` directory contains the core logic for the web fetcher. Its primary responsibility is to provide a unified interface for interacting with web pages, regardless of the underlying technology (e.g., simple HTTP requests or a full-fledged browser). This is achieved through an abstract `FetchEngine` class and concrete implementations that leverage different crawling technologies.

> ℹ️ The system is built on top of the [Crawlee](https://crawlee.dev/) library, using its powerful crawler abstractions.

### Debug Mode & Tracing

When the `debug: true` option is enabled, the engine provides detailed tracing of its internal operations:

1. **Detailed Tracing**: Every major step (request processing, element selection, data extraction) is logged to the console with a `[FetchEngine:id]` prefix.
2. **Extraction Insights**: During `extract()`, the engine logs how many elements were matched for each selector and the specific values being extracted, making it easier to debug complex or misaligned schemas.
3. **Metadata**: The `FetchResponse` will include an enriched `metadata` object containing engine details, timing metrics (where available), and proxy information.

---

## 🧩 2. Core Concepts

### `FetchEngine` (base.ts)

This is the abstract base class that defines the contract for all fetch engines.

* **Role**: To provide a consistent, high-level API for actions like navigation, content retrieval, and user interaction. It acts as the central **Action Dispatcher**, handling engine-agnostic logic (like `extract`, `pause`, `getContent`) and delegating others.
* **Key Abstractions**:
  * **Lifecycle**: `initialize()` and `cleanup()` methods.
  * **Core Actions**: `goto()`, `getContent()`, `click()`, `fill()`, `submit()`, `waitFor()`, `extract()`.
  * **DOM Primitives**: `_querySelectorAll()`, `_extractValue()`, `_parentElement()`, `_nextSiblingsUntil()`.
  * **Configuration & State**: `headers()`, `cookies()`, `blockResources()`, `getState()`, `sessionPoolOptions`.
* **Static Registry**: It maintains a static registry of all available engine implementations (`FetchEngine.register`), allowing for dynamic selection by `id` or `mode`.

### `FetchElementScope`

The **`FetchElementScope`** is the engine-specific "handle" or "context" for a DOM element.

- In **`CheerioFetchEngine`**, it is a combination of the Cheerio API (`$`) and the current selection (`el`).
- In **`PlaywrightFetchEngine`**, it is a `Locator`.

All extraction and interaction primitives operate on this scope, ensuring a unified way to reference elements across different underlying technologies.

### `FetchEngine.create(context, options)`

This static factory method is the designated entry point for creating an engine instance. It automatically selects and initializes the appropriate engine.

### `FetchSession(options)`

The `FetchSession` class manages the lifecycle of a fetch operation. You can specify the `engine` in the `options` to force a specific engine implementation for that session.

```typescript
const session = new FetchSession({ engine: 'browser' });
```

#### Engine Selection Priority

The engine is initialized lazily upon the first action execution and remains fixed for the duration of the session. The selection follows these rules:

1. **Explicit Option**: If `options.engine` (or temporary context override in `executeAll`) is provided and NOT set to `'auto'`.
    * ⚠️ **Fail-Fast**: If the requested engine is unavailable (e.g., missing dependencies), an error is thrown immediately.
2. **Site Registry**: If set to `'auto'` (default), the system attempts to match the target URL against the `sites` registry.
3. **Smart Upgrade**: If enabled, the engine may be dynamically upgraded from `http` to `browser` based on response characteristics (e.g., bot detection or heavy JS).
4. **Default**: Falls back to `'http'` (Cheerio).

#### Batch Execution with Overrides

You can execute a sequence of actions with temporary configuration overrides (e.g., headers, timeout) that apply only to that specific batch, without modifying the session's global state.

```typescript
// Execute actions with a temporary custom header and timeout
await session.executeAll([
  { name: 'goto', params: { url: '...' } },
  { name: 'extract', params: { ... } }
], {
  headers: { 'x-custom-priority': 'high' },
  timeoutMs: 30000
});
```

### Session Management & State Persistence

The engine supports persisting and restoring session state (primarily cookies) between executions.

* **Flexible Session Isolation & Storage**: The library provides fine-grained control over how session data is stored and isolated via the `storage` configuration:
  * **`id`**: A custom string to identify the storage.
    * **Isolation (Default)**: If omitted, each session gets a unique ID, ensuring complete isolation of `RequestQueue`, `KeyValueStore`, and `SessionPool`.
    * **Sharing**: Providing the same `id` across sessions allows them to share the same underlying storage, useful for persistent login sessions.
  * **`persist`**: (boolean) Whether to enable disk persistence (Crawlee's `persistStorage`). Defaults to `false` (in-memory).
  * **`purge`**: (boolean) Whether to delete the storage (drop `RequestQueue` and `KeyValueStore`) when the session is closed. Defaults to `true`.
    * Set `purge: false` and provide a fixed `id` to create a truly persistent session that survives across application restarts.
  * **`config`**: Allows passing raw configuration to the underlying Crawlee instance.
    * **Note**: When `persist` is true, use `localDataDirectory` in the config to specify the storage path (e.g., `storage: { persist: true, config: { localDataDirectory: './my-data' } }`).
* **`sessionState`**: A comprehensive state object (derived from Crawlee's SessionPool) that can be used to fully restore a previous session. This state is **automatically included in every `FetchResponse`**, making it easy to persist and later provide back to the engine during initialization.
* **`sessionPoolOptions`**: Allows advanced configuration of the underlying Crawlee `SessionPool` (e.g., `maxUsageCount`, `maxPoolSize`).
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

1. **Initialization**: A consumer calls `FetchEngine.create()`, which initializes a private `Configuration` and starts a Crawlee crawler (e.g., `PlaywrightCrawler`) that runs in the background.
2. **Navigation (`goto`)**: The consumer calls `await engine.goto(url)`. This adds the URL to the engine's private `RequestQueue` and returns a `Promise` that will resolve when the page is loaded.
3. **Crawlee Processing**: The background crawler picks up the request and invokes the engine's `requestHandler`, passing it the crucial page context.
4. **Page Activation & Action Loop**: Inside the `requestHandler`:
    * The page context is used to resolve the `Promise` from the `goto()` call.
    * The page is marked as "active" (`isPageActive = true`).
    * Crucially, before the `requestHandler` returns, it starts an **action loop** (`_executePendingActions`). This loop effectively **pauses the `requestHandler`** by listening for events on an `EventEmitter`, keeping the page context alive.
    * **Strict Sequential Execution & Re-entrancy**: The loop uses an internal queue to ensure all actions are executed in the exact order they were dispatched. It also includes re-entrancy protection to allow composite actions to call atomic actions without deadlocking.
5. **Interactive Actions (`click`, `fill`, etc.)**: The consumer can now call `await engine.click(...)`. This dispatches an action to the `EventEmitter` and returns a new `Promise`.
6. **Action Execution**: The action loop, still running within the original `requestHandler`'s scope, hears the event.
    * **Centralized Actions**: Actions like `extract`, `pause`, and `getContent` are processed immediately by the `FetchEngine` base class using the unified logic.
    * **Delegated Actions**: Engine-specific interactions (e.g., `click`, `fill`) are delegated to the subclass's `executeAction` implementation.
7. **Robust Cleanup**: When `dispose()` or `cleanup()` is called:
    * An `isEngineDisposed` flag is set to prevent new actions.
    * A `dispose` signal is emitted to wake up and terminate the action loop.
    * All active locks (`navigationLock`) are released.
    * The crawler is torn down (`teardown`), and the private `RequestQueue` and `KeyValueStore` are dropped to ensure a clean state.

---

## 🛠️ 4. Implementations

There are two primary engine implementations:

### `CheerioFetchEngine` (http mode)

* **ID**: `cheerio`
* **Mechanism**: Uses `CheerioCrawler` to fetch pages via raw HTTP and parse static HTML.
* **Behavior**:
  * ✅ **Fast and Lightweight**: Ideal for speed and low resource consumption.
  * ✅ **HTTP-Compliant Redirects**: Correctly handles 301-303 and 307/308 redirects, preserving methods/bodies or converting to GET as per HTTP specifications.
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

### Core Design: The Three-Layer Architecture

To ensure consistency across engines and maintain high quality, the extraction system is divided into three layers:

1. **Normalization Layer (`src/core/normalize-extract-schema.ts`)**: Pre-processes user-provided schemas into a canonical internal format, handling CSS filter merging and implicit object detection.
2. **Core Extraction Logic (`src/core/extract.ts`)**: An engine-agnostic layer responsible for the extraction workflow. It dispatches tasks to `_extractObject`, `_extractArray`, or `_extractValue` via a **Dispatcher (`_extract`)**. It manages recursion, strict mode, required field validation, anchor resolution, performance-optimized tree operations (LCA, bubbling), and sequential consumption cursors.
3. **Engine Interface (`IExtractEngine`)**: Defined at the core layer and implemented by engines to provide low-level DOM primitives.

#### Implementation Rules for `IExtractEngine`

To maintain cross-engine consistency, all implementations MUST follow these behavior contracts:

- **`_querySelectorAll`**:
  - MUST return matching elements in **document order**.
  - MUST check if the scope element(s) **themselves** match the selector and search their **descendants**.
- **`_nextSiblingsUntil`**:
  - MUST return a flat list of siblings starting *after* the anchor and stopping *before* the first element matching the `untilSelector`.
- **`_isSameElement`**:
  - MUST compare elements based on **identity**, not content.
- **`_findClosestAncestor`**:
  - MUST efficiently find the closest ancestor of an element that exists in a given set of candidates.
  - MUST be optimized to avoid multiple IPC calls in browser-based engines.
- **`_contains`**:
  - MUST implement standard DOM `Node.contains()` behavior.
  - MUST be optimized for high-frequency boundary checks.
- **`_findCommonAncestor`**:
  - MUST find the Lowest Common Ancestor (LCA) of two elements.
  - **Performance Critical**: In browser engines, this MUST be executed within a single `evaluate` call to minimize IPC (Inter-Process Communication) overhead.
- **`_findContainerChild`**:
  - MUST find the direct child of a container that contains a specific descendant.
  - **Performance Critical**: This replaces manual "bubble-up" loops in the Node.js context, significantly reducing overhead for deep DOM trees.
- **`_bubbleUpToScope` (Internal Helper)**:
  - Implements the logic to bubble up from a deep element to its direct ancestor in the current scope.
  - Supports an optional `depth` parameter to limit how many parent levels to traverse.
  - MUST include a maximum depth limit (default 1000) to prevent infinite loops.

This architecture ensures that complex features like **Columnar Alignment**, **Segmented Scanning**, and **Anchor Jumping** behave identically across the fast Cheerio engine and the full Playwright browser.

### Schema Normalization

To enhance usability and flexibility, the `extract` method internally implements a **"Normalization"** layer. This allows you to provide semantically clear shorthands, which are automatically converted into a standardized internal format.

#### 1. Shorthand Rules

- **String Shorthand**: A simple string like `'h1'` is automatically expanded to `{ selector: 'h1', type: 'string', mode: 'text' }`.
- **Implicit Object Shorthand**: If you provide an object without an explicit `type: 'object'`, it is automatically treated as an `object` schema where the keys are the property names.
  - *Example*: `{ "title": "h1" }` becomes `{ "type": "object", "properties": { "title": { "selector": "h1" } } }`.
- **Filter Shorthand**: If you provide `has` or `exclude` alongside a `selector`, they are automatically merged into the CSS selector using `:has()` and `:not()` pseudo-classes.
- **Array Shorthand**: Providing `attribute` directly on an `array` schema acts as a shorthand for its `items`.
  - *Example*: `{ "type": "array", "attribute": "href" }` becomes `{ "type": "array", "items": { "type": "string", "attribute": "href" } }`.

#### 2. Context vs. Data (Keyword Separation)

In **Implicit Objects**, the engine must distinguish between *configuration* (where to look) and *data* (what to extract).

- **Context Keys**: The keys `selector`, `has`, `exclude`, `required`, `strict`, and `depth` are reserved for defining the extraction context and validation. They stay at the root of the schema.
- **Data Keys**: All other keys (including `items`, `attribute`, `mode`, or even a field named `type`) are moved into the `properties` object as data fields to be extracted.
- **Collision Handling**: You can safely extract a field named `type` as long as its value is not one of the reserved schema type keywords (`string`, `number`, `boolean`, `html`, `object`, `array`).

#### 3. Cross-Engine Consistency

This normalization layer ensures that regardless of whether you are using the `cheerio` (http) or `playwright` (browser) engine, the complex shorthand logic behaves identically, providing a consistent "AI-friendly" interface.

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
