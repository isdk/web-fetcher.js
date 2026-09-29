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
* **🛡️ Anti-Bot Evasion**: In `browser` mode, an optional `antibot` flag helps to bypass common anti-bot measures like Cloudflare challenges.
* **🕹️ High-Fidelity Interaction Simulation**: Supports Bézier curve-based mouse trajectory movement, realistic typing delay simulation, and complex keyboard interactions to significantly improve anti-bot evasion.
* **🧩 Extensible**: Easily create custom, high-level "composite" actions to encapsulate reusable business logic (e.g., a `login` action).
* **🧲 Advanced Collectors**: Asynchronously collect data in the background, triggered by events during the execution of a main action.

---

### Smart Upgrade and Retry Strategy

When `enableSmart` is enabled, the system automatically determines whether an engine upgrade is needed based on response characteristics:

- Triggers for upgrade include:
  - HTTP status codes: `401 / 403 / 429 / 5xx` (including network-level errors like timeouts or connection failures mapped to `408 / 503 / 504`)
  - Page appears to be dynamically rendered (detected typical JS framework signatures in HTML, controlled by `upgradeOnJsContent`)
  - `Retry-After` exceeds `upgradeThresholdMs`
- During upgrade, you can choose whether to sync Cookies / Session state (`syncStateOnUpgrade`)
- For `429` responses, if `Retry-After` is less than the `upgradeThresholdMs` threshold, the system will prioritize retry over upgrade

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableSmart` | boolean | `true` | Enable smart detection and automatic engine upgrade |
| `upgradeOnJsContent` | boolean | `false` | Upgrade to browser engine when JS rendering signatures are detected (e.g., `window.__NEXT_DATA__`, `window.__NUXT__`) |
| `upgradeThresholdMs` | number | `5000` | Response time threshold (ms) to trigger upgrade; also used for 429 `Retry-After` comparison |
| `syncStateOnUpgrade` | boolean | `false` | Sync cookies/session state during engine upgrade |

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
* `timeoutMs` (number): Request/navigation timeout in milliseconds. Applies to the `http` engine's request timeout and the `browser` engine's navigation and default page timeouts (default: `30000`).
* `firstByteMs` (number): Time-to-first-byte timeout in milliseconds (default: `10000`). Under the `http` engine this is got's `timeout.response`: a request whose server accepts the connection but sends no data within this window fails immediately, instead of waiting until `timeoutMs` (or Crawlee's much longer handler timeout). This is what makes a stuck-connecting search engine surface quickly. Response bodies already streaming are bounded only by `timeoutMs`. Under the `browser` (playwright) engine the same semantics are implemented by wrapping the navigation: if no response header of the main-frame navigation chain (including redirects) arrives within `firstByteMs`, the navigation is cancelled immediately (Crawlee stops the stuck page via `window.stop()`); once the first byte arrives, the remaining load is bounded only by `timeoutMs`. `0` / `Infinity` disables it.
* `requestHandlerTimeoutSecs` (number): Timeout in seconds for the underlying Crawlee request handler. Increase it if long-running actions (e.g. `pause`) need more than the default (~60s).
* `retries` (number): Maximum network-level retry attempts per request (mapped to Crawlee's `maxRequestRetries`; engine fallbacks: `browser` `3`, `http` `1` when unset).
* `throwHttpErrors` (boolean): Whether HTTP error statuses (4xx/5xx) throw an error. In `browser` mode it is forced to `false`.
* `antibot` (boolean): In `browser` mode, run a stealthed Firefox (camoufox) with automatic Cloudflare challenge handling to bypass anti-bot measures (default: `false`).
* `signal` (AbortSignal): External abort signal for the session. When the signal aborts, the session is cancelled: pending actions fail immediately with an `AbortError`, in-flight navigation/requests are interrupted, and the session cannot be reused. Alternatively, call `session.abort(reason)` directly without a signal. See [Aborting a Session](./README.engine.md#aborting-a-session).
* `blockResources` (ResourceType[]): Resource types to block from loading in `browser` mode, e.g. `['image', 'stylesheet', 'font']` (default: `[]`).
* `sites` (FetchSite[]): Site registry used in `auto` mode. Each entry has a `domain`, optional `pathScope` and engine options; the first matching entry decides the engine (see `useSiteRegistry`).
* `useSiteRegistry` (boolean): Whether to match the target URL against the `sites` registry when `engine` is `auto` (default: `true`).
* `debug` (boolean | string | string[]): Enable detailed execution metadata (timings, engine used, etc.) in response, or enable debug logs for specific categories (e.g., 'extract', 'submit', 'request').
* `actions` (FetchActionOptions[]): An array of action objects to execute. (Supports `action`/`name` as alias for `id`, and `args` as alias for `params`)
* `onPause` (OnFetchPauseCallback): Async callback required by the `pause` action for manual intervention (e.g. solving a captcha).
* `headers` (Record<string, string>): Headers to use for all requests.
* `useHeaderGenerator` (boolean): Set to `false` to fully disable `got-scraping`'s automatic browser header generation in the `http` (cheerio) engine and send only the explicitly declared `headers` (default: `true`).
* `headerGeneratorOptions` (object | false): Options for `got-scraping`'s browser header generator in the `http` (cheerio) engine. By default the generator randomly injects a full set of browser fingerprint headers (`sec-ch-ua` client hints, `sec-fetch-*`, etc.). If you set a custom `User-Agent`, the generated headers may contradict it (e.g. Chromium client hints with a Firefox UA) — a self-contradictory fingerprint that some WAFs / anti-bot services reject outright. Pin the generator to match your UA (e.g. `{ browsers: [{ name: 'firefox' }] }`) or set it to `false` to disable generation entirely. Supports `browsers`, `operatingSystems`, `devices`, `locales`, `httpVersion`, `http1Headers` and `http2Headers`.
* `cookies` (Cookie[]): Array of cookies to use.
* `sessionState` (any): Crawlee session state to restore.
* `overrideSessionState` (boolean): Force the engine to overwrite any persisted session state with the provided `sessionState` (default: `false`). See the [engine docs](./README.engine.md).
* `storage` (StorageOptions): Controls session isolation, persistence, and cleanup.
  * `id` (string): Shared storage ID for cross-session data reuse.
  * `persist` (boolean): Whether to save data to disk.
  * `purge` (boolean): Whether to delete data on cleanup (defaults to `true`).
  * `poolStartTimeoutMs` (number): Maximum time (ms) to wait for the crawler's autoscaled pool to start before tearing it down during disposal. Defaults to `10000`. Raise it for slow-starting browser crawlers.
  * `taskSettleTimeoutMs` (number): Maximum time (ms) to wait for in-flight crawler tasks to settle before the request queue and key-value store are dropped during disposal. Defaults to `120000`. On abort, in-flight I/O is cancelled first (see below), so the settle wait usually collapses to milliseconds.
  * `fastFailOnAbort` (boolean): Backstop fast-fail option for race scenarios. Aborting the session already cancels in-flight I/O immediately (the `http` engine aborts the underlying got request via an `AbortSignal`; the `browser` engine closes the active page), so the settle wait normally collapses to milliseconds even without this option. When enabled, `session.abort()` additionally skips the (residual) settle wait and drops the request queue / key-value store at once — useful as a safety net if cancellation is unavailable. Defaults to `false`. Trade-off: tasks still finishing up may log `"Request queue ... does not exist"`-style messages (Crawlee retries then gives up; no functional impact). Storage is per-session, so nothing else touches it.
  * `config` (object): Raw Crawlee configuration (e.g., `{ localDataDirectory: './data' }`).
* `cache` (FetchCacheOptions): Controls persistent HTTP caching with smart self-healing mechanisms.
  * `enabled` (boolean): Whether to enable caching.
  * `offline` (boolean): Enable offline mode (prohibit network requests, throw error on MISS).
  * `storagePath` (string): Custom path for cache storage. Shared pools are managed automatically.
  * `backgroundUpdate` (boolean): Whether to enable SWR (Stale-While-Revalidate) background updates. Default: `true`.
  * `staleIfError` (boolean): Force return of stale cache if network request fails.
  * `forceCache` (boolean): Ignore server directives and force caching.
  * `refresh` (boolean): **Force Refresh**: Ignore existing cache to re-validate and "heal" the cache entry. Useful for bypassing blocks via manual verification.
  * `methods`, `cacheRules`, `query`, `headers`, `cookies`, `body`: Fine-grained cache policy configuration. Supports `STALE_RESCUE` and `WAF_CHALLENGE` detection for automatic engine upgrade and cache healing when used with `enableSmart`.
* `additionalMimeTypes` (string[]): Additional MIME types allowed to be downloaded as a raw response body, e.g. `['application/pdf', 'text/csv']`. In the `http` (cheerio) engine it is passed to Crawlee's `CheerioCrawler.additionalMimeTypes`: Crawlee only keeps the body of HTML/XML/JSON responses by default, so responses outside that whitelist are aborted unless listed here. In the `browser` (playwright) engine it enables capturing downloads triggered by navigation, clicks, or form submissions (via Playwright's `download` event). When listed, the raw body is preserved in `FetchResponse.body` (as a `Buffer` for binary content) and `contentType` is set accordingly. Values are normalized (lowercased, deduplicated) and merged with engine-built-in types (`text/plain`); the `*/*` wildcard is supported. Default: none (must be set explicitly to download non-HTML content). See `TODO.additional-mime-types.md` for design details.
* `output` (object): Controls the output fields in `FetchResponse`.
  * `cookies` (boolean): Whether to include cookies in the response (default: `true`).
  * `sessionState` (boolean): Whether to include session state in the response (default: `true`).
* `maxConcurrency` (number): Maximum concurrent requests handled by the underlying Crawlee crawler (default: `1`).
* `maxRequestsPerMinute` (number): Rate limit for the underlying Crawlee crawler (default: `1000`).
* `delayBetweenRequestsMs` (number): Reserved for future use — not yet implemented by the underlying Crawlee version; setting it currently has no effect.
* `ignoreSslErrors` (boolean): Whether to ignore TLS certificate errors. In the `http` (cheerio) engine it maps to Crawlee's `ignoreSslErrors`; in the `browser` (playwright) engine it maps to Playwright's `ignoreHTTPSErrors` context option (default: `true`). A custom `browser.launchOptions.ignoreHTTPSErrors` takes precedence in browser mode.
* `http` (object): Global HTTP request defaults applied to `goto`/navigate when the action itself does not override them.
  * `method` ('GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'): HTTP method used for navigation (default: `'GET'`).
  * `body` (any): Default request body for non-GET navigation. Objects are serialized as JSON with an automatic `content-type: application/json` header (unless overridden via `headers`).
* `browser` (object): Browser engine configuration.
  * `engine` ('playwright' | 'puppeteer'): Browser engine to use. Only `playwright` is implemented; explicitly setting `puppeteer` throws a clear "not supported" error instead of silently falling back (default: `'playwright'`).
  * `headless` (boolean): Run in headless mode (default: `true`).
  * `waitUntil` ('load' | 'domcontentloaded' | 'networkidle' | 'commit'): Default browser navigation lifecycle event. Per-action `waitUntil` takes precedence (default: `'domcontentloaded'`).
  * `launchOptions` (object): Playwright launch options (e.g., `{ slowMo: 50, args: [...] }`).
* `sessionPoolOptions` (SessionPoolOptions): Advanced configuration for the underlying Crawlee SessionPool.
* `enableSmart` (boolean): Enable smart detection and automatic engine upgrade (default: `true`).
* `syncStateOnUpgrade` (boolean): Whether to sync Cookies / Session state when upgrading from http to browser engine (default: `false`).
* `upgradeThresholdMs` (number): Wait time threshold in milliseconds to trigger engine upgrade; upgrades if exceeded or no explicit retry info (default: `5000`).
* `maxRetries` (number): Maximum retry attempts for a single Action (default: `0`).
* `failOnError` (boolean): Whether to throw an exception when an Action fails (default: `true` for main flow, `false` for collector).
* `failOnTimeout` (boolean): Whether to treat timeout as failure (default: `false`).
* ...and many other options for proxy, retries, etc.

### Built-in Actions

The library provides a set of powerful built-in actions, many of which are engine-agnostic and handled centrally for consistency:

* `goto`: Navigates to a new URL.
* `click`: Clicks on an element (Engine-specific).
* `fill`: Fills an input field (Engine-specific).
* `submit`: Submits a form (Engine-specific).
* `mouseMove`: Moves the mouse cursor to a specific coordinate or element (Bézier curve supported).
* `mouseClick`: Triggers a mouse click at the current position or specified coordinates.
* `mouseWheel`: Simulates a mouse wheel scroll event with horizontal and vertical deltas. Supports splitting into multiple steps and automatic scrolling to make the target element visible.
* `scrollIntoView`: Scrolls the page or a container to make a specific element visible in the viewport.
* `keyboardType`: Simulates human-like typing into the currently focused element.
* `keyboardPress`: Simulates pressing a single key or a key combination.
* `trim`: Removes elements from the DOM to clean up the page.
* `waitFor`: Pauses execution to wait for a specific condition (Supports fixed timeouts centrally).
* `pause`: Pauses execution for manual intervention (Handled centrally).
* `getContent`: Retrieves the full content of the current page (Handled centrally).
* `evaluate`: Executes custom JavaScript within the page context.
* `extract`: Extracts structured data using an engine-agnostic core logic and engine-specific DOM primitives. Supports `required` fields and `strict` validation.

### Response Structure

The `fetchWeb` function returns an object containing:

* `result` (FetchResponse):
  * `url`: The final URL.
  * `statusCode`: HTTP status code.
  * `headers`: HTTP headers.
  * `contentType`: The normalized `Content-Type` of the response (e.g., `application/pdf`).
  * `cookies`: Array of cookies.
  * `sessionState`: Crawlee session state.
  * `body`: Raw response body (string or `Buffer`). For non-HTML downloads (via `additionalMimeTypes`), this holds the raw binary content as a `Buffer`.
  * `text`, `html`: Page content (for binary responses, the raw decoded text — not wrapped in a synthetic `<pre>` document).
* `outputs` (Record<string, any>): Data extracted and stored via `storeAs`. Note: When multiple actions store objects into the same key, they are merged instead of overwritten.

---

## 📜 License

[MIT](./LICENSE-MIT)
