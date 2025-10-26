# Fetch Engine Architecture

This document provides a comprehensive overview of the Fetch Engine architecture, designed to abstract web content fetching and interaction. It's intended for developers who need to understand, maintain, or extend the fetching capabilities.

## 1. Overview

The `engine` directory contains the core logic for the web fetcher. Its primary responsibility is to provide a unified interface for interacting with web pages, regardless of the underlying technology (e.g., simple HTTP requests or a full-fledged browser). This is achieved through an abstract `FetchEngine` class and concrete implementations that leverage different crawling technologies.

The system is built on top of the [Crawlee](https://crawlee.dev/) library, using its powerful crawler abstractions.

## 2. Core Concepts

### `FetchEngine` (base.ts)

This is the abstract base class that defines the contract for all fetch engines.

- **Role**: To provide a consistent, high-level API for actions like navigation, content retrieval, and user interaction.
- **Key Abstractions**:
  - **Lifecycle**: `initialize()` and `cleanup()` methods for managing the engine's state.
  - **Core Engine Actions**: `goto()`, `getContent()`, `click()`, `fill()`, `submit()`, `waitFor()`.
  - **Configuration**: `headers()`, `cookies()`, `blockResources()`.
- **Static Registry**: It maintains a static registry of all available engine implementations (`FetchEngine.register`). This allows for easy extension and selection of engines by their `id` or `mode`.
- **Action Dispatching**: It uses an event-driven model (`_executePendingActions` and `actionEmitter`) to process a sequence of actions on an active page after an initial `goto()` call.

### `FetchEngine.create(context, options)`

This static factory method is the designated entry point for creating an engine instance. It automatically selects the appropriate engine based on the provided `engine` option (e.g., 'http', 'browser', 'cheerio', 'playwright') and initializes it.

## 3. Architecture and Workflow

The engine's architecture is designed to solve a key challenge: providing a simple, stateful-like API (`goto()`, then `click()`, then `fill()`) on top of Crawlee's fundamentally stateless, asynchronous request handling.

### The Core Problem: Ephemeral Page Context

In Crawlee, the page context (the `page` object in Playwright or the `$` function in Cheerio) is **only available within the scope of the `requestHandler` function**. Once the handler finishes, the context is gone. This makes it impossible to directly implement a sequence like `await engine.goto(); await engine.click();`.

### The Solution: Bridging Scopes with an Action Loop

Our engine solves this by creating a bridge between the external API calls and the internal `requestHandler` scope. This is the most critical and complex part of the design.

The workflow is as follows:

1. **Instantiation & Initialization**: A consumer calls `FetchEngine.create()`, which initializes the appropriate Crawlee crawler (e.g., `PlaywrightCrawler`). The crawler starts running in the background, waiting for requests.

2. **Navigation (`goto`)**: The consumer calls `await engine.goto(url)`. This method adds the URL to Crawlee's `RequestQueue` and returns a `Promise` (stored in a `pendingRequests` map) that will be resolved when the page is loaded.

3. **Crawlee Processing**: The background crawler picks up the request and invokes the engine's `requestHandler` (`_sharedRequestHandler`), passing it the crucial page context. If the request fails, a `_sharedFailedRequestHandler` is invoked, which rejects the pending promise.

4. **Page Activation & Action Loop**: This is the key step. Inside the `requestHandler`:
    * The page context is used to build a response, which resolves the `Promise` returned by the original `goto()` call. The consumer's `await` is now complete.
    * The page is marked as "active" (`isPageActive = true`).
    * Crucially, before the `requestHandler` returns, it starts an **action loop** (`_executePendingActions`). This loop is an async function that effectively **pauses the `requestHandler`**, keeping the page context alive. It does this by listening for events on an `EventEmitter` (`actionEmitter`).

5. **Interactive Actions (`click`, `fill`, etc.)**: The consumer can now call `await engine.click(...)`. This method **does not** perform the click directly. Instead, it:
    * Checks if a page is active.
    * Dispatches a `click` action object to the `actionEmitter`.
    * Returns a new `Promise` that waits for the action to be resolved.

6. **Action Execution**:
    * The `_executePendingActions` loop, still running within the original `requestHandler`'s scope, hears the `click` event.
    * Because it has access to the page context, it can now correctly call the engine's `executeAction` method, which performs the *actual* interaction (e.g., `page.click(...)` or simulating an HTTP request).
    * Once the action is complete, the result is used to resolve the `Promise` returned by the interactive action call.

7. **Cleanup**: This loop continues until a `dispose` action is dispatched. This happens when the consumer calls `engine.dispose()` or, importantly, when a new `goto()` call is made. The `dispose` action terminates the loop, allows the `requestHandler` to finally complete, and cleans up all resources.

### Managing State Transitions and Concurrency

While the action loop creates a "live" page, managing the transition from one page to another (i.e., handling multiple `goto` calls) requires careful coordination to prevent race conditions. This is handled differently depending on the engine.

- **`PlaywrightFetchEngine`**: Because it controls a persistent browser, if `goto` is called while a page is already active, it simply dispatches a `navigate` action to the existing action loop, telling the browser to navigate to the new URL.

- **`CheerioFetchEngine`**: Since each "navigation" is a new, independent HTTP request, the engine cannot simply reuse the context. It uses a `navigationLock` to enforce that only one `goto` process can be active at a time.
    1. A `goto` call first waits for the current `navigationLock` to be released (signaling the previous request handler has finished).
    2. It then immediately creates a *new, unresolved* lock for itself, preventing any subsequent `goto` calls from starting.
    3. It adds its request to the queue.
    4. When its corresponding `requestHandler` eventually finishes, it releases the lock it created, allowing the next `goto` call in line to proceed.

This combination of an event-driven action loop and a navigation lock successfully creates the illusion of a persistent, stateful page that can be controlled via a simple, sequential API, while respecting the underlying constraints of the Crawlee framework.

## 4. Implementations

There are two primary engine implementations:

### `CheerioFetchEngine` (cheerio.ts)

- **ID**: `cheerio`
- **Mode**: `http`
- **Mechanism**: Uses `CheerioCrawler`. It fetches web pages via raw HTTP requests and parses the static HTML content with the Cheerio library (a server-side subset of jQuery).
- **Behavior**:
  - **Fast and Lightweight**: Ideal for speed and low resource consumption.
  - **No JavaScript Execution**: Cannot interact with client-side rendered content or dynamic applications.
  - **Simulated Interaction**: Actions are simulated by making new HTTP requests.
    - `click`: Simulates a click. If the selector is a link (`<a>`), it navigates to the `href`. If it's a submit button, it triggers a form submission. If the selector is not found, it is treated as a raw URL to navigate to.
    - `fill`: Updates the value of form inputs in the parsed HTML. This state is held temporarily until a `submit` action is called.
    - `submit`: Serializes the current state of a form's inputs and sends a new `GET` or `POST` request.
- **Use Case**: Scraping static websites, server-rendered pages, or APIs where browser capabilities are unnecessary.

### `PlaywrightFetchEngine` (playwright.ts)

- **ID**: `playwright`
- **Mode**: `browser`
- **Mechanism**: Uses `PlaywrightCrawler` to control a real browser instance (e.g., Chromium, Firefox, WebKit) in headless or headed mode.
- **Behavior**:
  - **Full Browser Environment**: Executes JavaScript, handles cookies, sessions, and complex user interactions natively.
  - **Robust Interaction**: Actions are performed by Playwright, accurately mimicking real user behavior.
    - `click`: Executes a click and waits for network activity to settle, correctly handling navigations triggered by the click.
    - `submit`: Can trigger a standard form submission or, for `application/json` forms, it can intercept the submission and use the browser's `fetch` API to send the data, allowing it to capture the result of XHR-based submissions.
  - **Resource Intensive**: Slower and requires more memory/CPU than the Cheerio engine.
- **Use Case**: Interacting with modern, dynamic web applications (e.g., SPAs built with React, Vue, Angular) or any site that relies heavily on JavaScript.

## 5. How to Extend the Engine

Adding a new fetch engine is straightforward:

1. **Create the Class**: Create a new file (e.g., `my-engine.ts`) and define a class that extends `FetchEngine`.

    ```typescript
    import { FetchEngine, FetchEngineAction, ... } from './base';

    export class MyEngine extends FetchEngine {
      // ...
    }
    ```

2. **Define Static Properties**: Set the unique `id` and `mode` for the engine.

    ```typescript
    static readonly id = 'my-engine';
    static readonly mode = 'browser'; // or 'http'
    ```

3. **Implement Abstract Methods**: Provide concrete implementations for all abstract methods defined in `FetchEngine`:
    - `_initialize()`: Set up your underlying crawler instance.
    - `_cleanup()`: Tear down the crawler and free resources.
    - `buildResponse()`: Convert the crawler's context into a standard `FetchResponse`.
    - `executeAction()`: Implement the logic for `click`, `fill`, `submit`, etc.
    - `goto()`, `click()`, `fill()`, etc.: Implement the public-facing action methods, which typically dispatch to the internal action loop.

4. **Register the Engine**: At the end of your file, register the new class in the engine registry.

    ```typescript
    FetchEngine.register(MyEngine);
    ```

## 6. Testing

The file `engine.spec.ts` contains a comprehensive test suite for the fetch engines.

- **Local Test Server**: It uses `fastify` to create a local web server with various endpoints to test different scenarios (navigation, form submission, headers, etc.).
- **Reusable Test Suite**: The `engineTestSuite` function defines a standard set of tests. This suite is run against both `CheerioFetchEngine` and `PlaywrightFetchEngine` to ensure they are functionally equivalent and conform to the `FetchEngine` API contract.
- **Adding Tests for New Engines**: When adding a new engine, simply add another call to `engineTestSuite` with your new engine class to validate its implementation.

    ```typescript
    // In engine.spec.ts
    engineTestSuite('my-engine', MyEngine);
    ```
