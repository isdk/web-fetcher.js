# Contributing to @isdk/web-fetcher

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to `@isdk/web-fetcher`. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🛠️ Development Setup

1.  **Package Manager**: We use `pnpm`.
    ```bash
    npm install -g pnpm
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Build**:
    ```bash
    pnpm run build      # Build with type definitions
    pnpm run build-fast # Fast build (JS only)
    ```
4.  **Test**:
    ```bash
    pnpm run test
    ```
5.  **Lint & Format**:
    ```bash
    pnpm run style      # Check style
    pnpm run style:fix  # Fix style issues
    ```

## 🧪 Testing

The project employs a two-tier testing strategy:

### 1. Low-level Unit Tests
*   **Location**: Co-located with source files (e.g., `src/core/session.spec.ts`).
*   **Purpose**: Traditional unit tests using Vitest for testing specific internal logic of classes and functions in isolation.

### 2. Universal Fixture Tests
*   **Location**: `test/fixtures/`
*   **Runner**: `test/engine.fixtures.spec.ts`
*   **Purpose**: Primary data-driven testing system that tests both `cheerio` and `playwright` engines against the same behaviors.

#### Adding a New Fixture Test Case

1.  Create a new directory in `test/fixtures/` (e.g., `test/fixtures/99-my-new-feature/`).
2.  Create a `fixture.html` file with the HTML content to be served.
3.  Create a `fixture.json` file defining the actions and expectations.

**`fixture.json` Structure:**

```json
{
  "title": "Should do something amazing",
  "actions": [
    {
      "id": "goto",
      "params": { "url": "/" }
    },
    {
      "id": "extract",
      "params": { "selector": "h1" },
      "storeAs": "title"
    }
  ],
  "expected": {
    "statusCode": 200,
    "data": { "title": "Hello" } // Checks against the result or outputs
  }
}
```

#### Dynamic Server Logic (`server.mjs`)

For complex tests requiring dynamic server behavior (e.g., custom routes, cookie manipulation, headers inspection), you can add a `server.mjs` (or `server.js`) file in the fixture directory.

**Example `server.mjs`:**
```javascript
import cookie from '@fastify/cookie';

/**
 * @param {import('fastify').FastifyInstance} server
 */
export default async function(server) {
  // Register plugins if needed
  await server.register(cookie);

  // Define custom routes
  server.get('/echo/cookies', async (req, reply) => {
    return { cookies: req.cookies };
  });

  server.get('/custom-auth', async (req, reply) => {
    if (req.headers.authorization === 'Bearer secret') {
      return { status: 'authorized' };
    }
    reply.code(401).send({ status: 'unauthorized' });
  });
}
```
The test runner will automatically load this module and pass the Fastify server instance to the default exported function before running the test case.

### Debugging Tests

You can enable debug mode in your test fixture to inspect detailed execution metadata, including:
- **Mode**: The active engine mode (`http` vs `browser`).
- **Engine**: The specific engine implementation used (e.g., `cheerio`, `playwright`).
- **Timings**: Detailed request timing metrics (DNS, TCP, TTFB, Total) where available.
- **Proxy**: The proxy URL used for the request.

To enable it, add `"debug": true` to the `options` object in `fixture.json`:

```json
{
  "title": "Debug test",
  "options": {
    "debug": true
  },
  "actions": [ ... ]
}
```

The debug metadata will be available in `result.metadata`.

*   **`params` vs `args`**: We prioritize using the named `params` object for action arguments to match the `FetchActionOptions` interface and improve readability.
*   **Engine**: By default, tests run on both `cheerio` (http) and `playwright` (browser) engines. You can restrict a test to a specific engine by adding `"engine": "playwright"` to the root of the JSON.

## 📐 Architecture & Design Decisions

### Engine Selection

The library uses a specific priority to determine which engine (`http` or `browser`) to use for a session. See the "Engine Selection Priority" section in [README.engine.md](./README.engine.md) for details.

### Action Execution & Error Handling

*   **`failOnError`**:
    *   Defaults to `true`. If an action fails, it throws an error. `FetchSession.executeAll` catches this error, attaches the `actionIndex`, and re-throws it, stopping the execution flow.
    *   If set to `false`, the action catches its own error, logs it internally (in the result object), and returns a "success" status. `FetchSession.executeAll` sees this as a successful step and **continues to the next action**.
*   **Known Limitation**: Currently, if `failOnError: false` is used, the error details are returned in that specific action's result, but `executeAll` returns the final result of the *last* action (usually `getContent`). The intermediate errors are not currently aggregated into a history log in the session output. This is a known trade-off; we may introduce a Session History feature in the future if needed.

### Fixture Params

We recently migrated `fixture.json` files from using an `args` array to a `params` object. This unifies the data structure with the actual `FetchActionOptions` used in the code, reducing cognitive load and the need for translation layers in tests.

## 📝 Commit Messages

We follow the **Conventional Commits** specification.

*   `feat`: A new feature
*   `fix`: A bug fix
*   `docs`: Documentation only changes
*   `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
*   `refactor`: A code change that neither fixes a bug nor adds a feature
*   `perf`: A code change that improves performance
*   `test`: Adding missing tests or correcting existing tests
*   `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

Example:
```
feat(engine): add support for custom headers in playwright
fix(session): ensure cookies are persisted across redirects
```

## 🧩 Implementation Details & Gotchas

### Session Isolation & Storage

To support concurrent executions without side effects, the library implements flexible session isolation via the `storage` configuration:

- **Independent Configuration**: Each engine instance creates its own Crawlee `Configuration`. By default, `persistStorage` is `false` (data kept in memory).
- **Unique Store IDs**: Every session uses a `storeId`.
    - **Isolation (Default)**: If `storage.id` is not provided, it uses the unique `context.id`.
    - **Sharing**: Providing a fixed `storage.id` allows multiple sessions to share the same `RequestQueue` and `KeyValueStore` (e.g., for shared login states).
- **Persistence Control**:
    - `storage.persist`: (boolean) Controls whether data is written to disk.
    - **Note**: When using disk persistence, Crawlee's default storage client (MemoryStorage) uses `localDataDirectory` to specify the root directory (defaults to `./storage`). Pass this through `storage.config`.

### Cleanup & Resource Management

The `cleanup()` (aliased as `dispose()`) method manages the lifecycle of storage:

1.  **Action Termination**: Terminates the internal action loop and rejects pending requests.
2.  **Crawler Teardown**: Gracefully shuts down the Crawlee instance.
3.  **Conditional Purging**:
    - `storage.purge`: (boolean, defaults to `true`).
    - If `true`, it calls `.drop()` on the `RequestQueue` and `KeyValueStore`, physically deleting the data from memory/disk.
    - If `false`, the data is preserved, allowing future sessions with the same `storage.id` to reuse it.
4.  **Event Cleanup**: Removes all listeners to prevent memory leaks.

### Crawlee Session Persistence

*   **State Restoration Timing**: Attempting to restore `SessionPool` state (like cookies) inside `preNavigationHooks` is too late because the session is already assigned.
*   **Persistence Workaround**: Even with `persistStorage` set to `false`, `SessionPool` persistence requires the data to exist in the `KeyValueStore`.
    - **Solution**: We manually inject the session state into the `KeyValueStore` (using `PERSIST_STATE_KEY`) *immediately after* creating the crawler instance but *before* running it. This ensures `SessionPool` initializes with the correct state.
    - **ID Priority**: SessionPool persistence always follows the `storeId` (either user-provided or auto-generated), ensuring correct isolation or sharing of authentication states.

### Engine Implementation: _buildResponse

When implementing a new engine, the `_buildResponse(context)` method is responsible for constructing the `FetchResponse` object.

*   **Contract**: It must return a valid `FetchResponse` object containing the current page state (url, html, etc.).
*   **Output Control**: While `base.ts` handles the final filtering of `cookies` and `sessionState` based on `this.opts.output` (by explicitly deleting them if disabled), it is highly recommended that the engine implementation also respects `this.opts.output`.
    *   **Performance**: If `this.opts.output.cookies` is `false`, the engine should avoid expensive operations (like IPC calls in browser automation) to retrieve cookies, unless they are needed for internal session synchronization.

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
