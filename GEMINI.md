## Project Overview

This project, `@isdk/web-fetcher`, is a powerful and flexible web automation and data extraction library written in TypeScript. It is designed to simplify complex web interactions by using a declarative JSON action script.

The library features a dual-engine architecture:
- **`http` mode**: Powered by Cheerio, this mode is optimized for speed and is suitable for static websites.
- **`browser` mode**: Powered by Playwright, this mode provides full browser automation capabilities for dynamic and JavaScript-heavy websites.

An `auto` mode can intelligently switch between engines based on the website's characteristics. The library also includes an optional `antibot` feature to bypass common bot detection mechanisms.

## Key Technologies

- **TypeScript**: The project is written in TypeScript.
- **Node.js**: The runtime environment.
- **Playwright**: Used for the `browser` engine to control a full browser.
- **Cheerio**: Used for the `http` engine for fast server-side DOM manipulation.
- **crawlee**: The underlying crawling framework that integrates with Playwright and Cheerio.
- **tsup**: Used for bundling the TypeScript source code into distributable JavaScript files.
- **Vitest**: The testing framework used for unit and integration tests.
- **ESLint**: For code linting.
- **Prettier**: For code formatting.

## Project Structure

- `src/`: Contains the source code of the library.
  - `core/`: Core logic, including the main `WebFetcher` class and session management.
  - `engine/`: The implementation of the `http` (Cheerio) and `browser` (Playwright) engines.
  - `action/`: Defines the declarative actions that can be executed (e.g., `click`, `fill`, `extract`).
  - `index.ts`: The main entry point of the library.
- `test/`: Contains integration and fixture-based tests.
- `dist/`: The output directory for the compiled JavaScript files.
- `docs/`: Markdown documentation generated from the source code comments.
- `package.json`: Defines project metadata, dependencies, and scripts.
- `tsup.config.ts`: Configuration for the `tsup` bundler.
- `vite.config.mjs`: Configuration for the `vitest` testing framework.

## Testing Architecture

The project employs a two-tier testing strategy:

### 1. Low-level Unit Tests
*   **Location**: Co-located with source files (e.g., `src/core/session.spec.ts`).
*   **Purpose**: These are traditional unit tests using Vitest. They are used for testing specific internal logic of classes and functions in isolation.

### 2. Universal Fixture Tests
*   **Location**: `test/fixtures/` directory.
*   **Runner**: `test/engine.fixtures.spec.ts`.
*   **Purpose**: This is the primary, high-level testing system. It uses a data-driven approach to test both `http` (Cheerio) and `browser` (Playwright) engines against the same set of behaviors to ensure consistency.

#### Fixture Structure
Each test case is a directory in `test/fixtures/` containing:
- `fixture.json`: Defines the actions and expected outcomes.
- `fixture.html`: The static HTML served by the test server.
- `server.mjs` (Optional): A JavaScript module to define dynamic server logic (routes, cookies, headers) using Fastify.

#### Important Conventions
- **Action Parameters**: In `fixture.json`, actions **MUST** use named object parameters (`params`) instead of positional array arguments (`args`).
  - ✅ Correct: `{ "action": "goto", "params": { "url": "/" } }`
  - ❌ Incorrect: `{ "action": "goto", "args": ["/"] }`
- **Dynamic Server**: If a test requires specific server behavior (like setting cookies or checking headers), create a `server.mjs` that exports a default function accepting the Fastify `server` instance.

## Development

### Building the project

To build the project, run the following command:

```bash
pnpm run build
```

This will compile the TypeScript code and generate the type definitions. For a faster build without generating type definitions, you can use:

```bash
pnpm run build-fast
```

### Running tests

To run the test suite, use the following command:

```bash
pnpm run test
```

### Linting and formatting

To check the code style, run:

```bash
pnpm run style
```

To automatically fix linting and formatting issues, use:

```bash
pnpm run style:fix
```

## Core Concepts

### Engines

The library's core is its dual-engine design. You can explicitly choose an engine (`http` or `browser`) or use `auto` to let the library decide.

- The **`CheerioFetchEngine`** (`http` mode) is fast and efficient for static sites. It parses the HTML and allows for simulated interactions like clicking links and submitting forms.
- The **`PlaywrightFetchEngine`** (`browser` mode) launches a real browser, enabling complex interactions with dynamic websites, including JavaScript execution, waiting for elements, and handling anti-bot challenges.

### Three-Layer Extraction Architecture

To ensure cross-engine consistency and high data quality, the extraction system follows a decoupled three-layer design:
- **Normalization**: Pre-processes schemas into a canonical format in `src/core/normalize-extract-schema.ts`.
- **Core Logic**: The engine-agnostic extraction workflow (recursion, array modes, validation) in `src/core/extract.ts`. It operates on an engine-specific `FetchElementScope`.
- **Engine Implementation**: Low-level DOM primitives implemented by each engine provider (`CheerioFetchEngine`, `PlaywrightFetchEngine`) via the `IExtractEngine` interface.

### Action Dispatch Loop

The library uses a centralized **Action Loop** in `FetchEngine` (base class) to manage interactions:
- **Centralized Handling**: Standard actions like `extract`, `pause`, and `getContent` are handled entirely in the base class.
- **Engine Delegation**: Actions requiring low-level interaction (like `click`, `fill`) are delegated to sub-engines.
- **Context Validity**: All actions are executed within the synchronous path of Crawlee's `requestHandler` to ensure DOM context (Cheerio `$` or Playwright `page`) remains valid.

### Session Isolation

To support concurrent executions without side effects, the library implements strict session isolation:
- **Private Configuration**: Each engine instance uses its own Crawlee `Configuration` instance.
- **Independent Storage**: Every session creates its own `RequestQueue` and `KeyValueStore` identified by the session ID, ensuring no data collisions between parallel fetch operations.
- **Robust Lifecycle**: The engine carefully manages the lifecycle of background crawlers, ensuring that resources are fully released and storage is dropped only after the crawler has completely stopped.

### Error Handling and Status Mapping

The library implements a robust error handling system that ensures network and simulation-layer failures are consistently represented:
- **Consistent Mapping**: Network-level errors (e.g., `ETIMEDOUT`, `ECONNREFUSED`) and custom errors (e.g., `OfflineCacheMissError`) are mapped to standard HTTP status codes using `mapErrorCodeToStatus`.
- **Precedence Logic**: In a `FetchResponse`, the status code derived from an error takes precedence over any partial response status code to ensure accurate failure reporting.
- **Diagnostic Transparency**: The `statusText` of a `FetchResponse` during a failure path includes the raw error code (like `'ETIMEDOUT'`) for easier debugging.
- **Guaranteed Results**: The Action Loop ensures that `action:end` events always carry a valid `result` object with error details, even when an engine upgrade is triggered.

### Actions

Workflows are defined as a series of "Actions" in a JSON format. The library provides a set of built-in actions, and you can create custom composite actions.

**Action Script Aliases:**
- `action` or `name` can be used as an alias for `id`.
- `args` can be used as an alias for `params`.

**Built-in Actions:**
- `goto`: Navigates to a URL.
- `click`: Clicks on an element.
- `fill`: Fills an input field.
- `submit`: Submits a form.
* `trim`: Removes elements from the DOM to clean up the page (e.g., scripts, ads, hidden content).
- `waitFor`: Waits for conditions to be met. **Note:** Parameters are processed sequentially (e.g., `selector` then `ms`). The `ms` parameter is a fixed delay/sleep, while the maximum waiting time for conditions is governed by the session-level `timeoutMs`.
- `extract`: Extracts structured data from the page.
- `getContent`: Retrieves the page content.
