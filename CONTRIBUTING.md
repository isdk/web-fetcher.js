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

We use a **data-driven testing** approach for the fetch engine, located in `test/engine.fixtures.spec.ts`.

### Adding a New Test Case

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

### Crawlee Session Persistence

*   **State Restoration Timing**: Attempting to restore `SessionPool` state (like cookies) inside `preNavigationHooks` is too late because the session is already assigned.
*   **Persistence Workaround**: Even with `persistStorage` set to `false` (default in our config), `SessionPool` persistence requires the data to exist in the `KeyValueStore`.
    *   **Solution**: We manually inject the session state into the `KeyValueStore` (using `PERSIST_STATE_KEY`) *immediately after* creating the crawler instance but *before* running it. This ensures `SessionPool` initializes with the correct state.

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
