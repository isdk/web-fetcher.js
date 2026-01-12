# Contributing to @isdk/web-fetcher

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to `@isdk/web-fetcher`. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🛠️ Development Setup

1. **Package Manager**: We use `pnpm`.

    ```bash
    npm install -g pnpm
    ```

2. **Install Dependencies**:

    ```bash
    pnpm install
    ```

3. **Build**:

    ```bash
    pnpm run build      # Build with type definitions
    pnpm run build-fast # Fast build (JS only)
    ```

4. **Test**:

    ```bash
    pnpm run test
    ```

5. **Lint & Format**:

    ```bash
    pnpm run style      # Check style
    pnpm run style:fix  # Fix style issues
    ```

## 🧪 Testing

The project employs a two-tier testing strategy:

### 1. Low-level Unit Tests

* **Location**: Co-located with source files (e.g., `src/core/session.spec.ts`).
* **Purpose**: Traditional unit tests using Vitest for testing specific internal logic of classes and functions in isolation.

### 2. Universal Fixture Tests

* **Location**: `test/fixtures/`
* **Runner**: `test/engine.fixtures.spec.ts`
* **Purpose**: Primary data-driven testing system that tests both `cheerio` and `playwright` engines against the same behaviors.

#### Adding a New Fixture Test Case

1. Create a new directory in `test/fixtures/` (e.g., `test/fixtures/99-my-new-feature/`).
2. Create a `fixture.html` file with the HTML content to be served.
3. Create a `fixture.json` file defining the actions and expectations.

**`fixture.json` Structure:**

```json
{
  "name": "Should do something amazing",
  "engine": "playwright", // Optional: restrict to a specific engine
  "options": {
    "debug": true
  },
  "actions": [
    {
      "action": "goto",
      "params": { "url": "/" }
    },
    {
      "action": "trim",
      "params": { "presets": "scripts", "selectors": "#ads" }
    },
    {
      "action": "extract",
      "params": { "schema": { "title": "h1" } },
      "storeAs": "main_data"
    }
  ],
  "expected": {
    "statusCode": 200,
    "data": { "title": "Hello" }, // Checks the result of the LAST action
    "outputs": {
      "main_data": {
        "title": "Hello",
        "ad": null // Verify #ads was removed by trim
      }
    }
  }
}
```

### Advanced Assertions (Condition Objects)

The test runner supports powerful recursive assertions using "Condition Objects". You can use these anywhere in `expected.data` or `expected.outputs`.

- **`contains`**: Checks if a string contains a substring.
  - `{ "contains": "text", "caseInsensitive": true }`
- **`not`**: Negates a condition.
  - `{ "not": "secret comment" }`
  - `{ "not": { "contains": "ads" } }`
- **`and` / `or`**: Combines multiple conditions.
  - `{ "and": [{ "contains": "A" }, { "contains": "B" }] }`
- **`equals`**: Strict equality check.
  - `{ "equals": 123 }`

Example of checking that a comment was removed:
```json
"expected": {
  "outputs": {
    "full_page": { "html": { "not": "<!-- secret -->" } }
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

You can enable debug mode in your test fixture to inspect detailed execution metadata and trace logs.

#### 1. Metadata Verification

Debug metadata includes:
- **Mode**: The active engine mode (`http` vs `browser`).
- **Engine**: The specific engine implementation used (e.g., `cheerio`, `playwright`).
- **Timings**: Detailed request timing metrics (DNS, TCP, TTFB, Total) where available.
- **Proxy**: The proxy URL used for the request.

#### 2. Log Verification (`expected.logs`)

When `options.debug` is enabled, the engine outputs detailed tracing information to the console. You can verify these logs using the `expected.logs` field.

The `logs` field supports the same flexible condition objects as other expectation fields:
- **String**: Simple substring match.
- **Condition Object**: `{ "contains": "...", "caseInsensitive": true }`.
- **Logic Operators**: `{ "and": [...], "or": [...], "not": [...] }`.

The test runner automatically captures all `console.log` calls during the test and joins them into a single string for verification.

To enable debug mode, add `"debug": true` to the `options` object in `fixture.json`.

* **`params` vs `args`**: We prioritize using the named `params` object for action arguments to match the `FetchActionOptions` interface and improve readability.
* **Engine**: By default, tests run on both `cheerio` (http) and `playwright` (browser) engines. You can restrict a test to a specific engine by adding `"engine": "playwright"` to the root of the JSON.

## 📐 Architecture & Design Decisions

### Session Architecture

#### Immutable Session

Once a `FetchSession` is initialized and its Engine is created, its core configuration (especially those affecting the Engine lifecycle like `engine` type, `proxy`, `storage`) is considered **immutable**. Modifying these properties on an active session is unsafe and not supported. If you need a different engine or proxy, you should create a new `FetchSession`.

#### Mutable Action Context & Overrides

While the Session configuration is fixed, the context for *action execution* is flexible.

- **Temporary Overrides**: The `executeAll` method accepts an optional `options` object. This creates a **temporary context** for that specific batch of actions.
- **Use Case**: This allows you to override parameters like `timeoutMs`, `headers`, or `waitUntil` for a specific sequence of actions without polluting the global Session state or affecting subsequent executions.

**Developer Note**: When implementing new Actions or modifying core logic, **ALWAYS** use the `context` argument passed to the method (e.g., `execute(context, options)`) instead of accessing `this.context` directly. This ensures that any temporary overrides provided by the caller are correctly respected.

### Engine Selection

The library follows a strict priority to determine which engine (`http` or `browser`) to use. The engine is initialized on the first action and remains fixed for the session.

1. **Explicit Option**: Prioritizes `engine` from constructor or `executeAll` options.
    * **Fail-Fast**: If an explicit engine (not `'auto'`) is requested but unavailable, an error is thrown immediately.
2. **Site Registry**: If in `'auto'` mode, it matches the URL against the `sites` registry.
3. **Smart Upgrade**: If enabled, it may upgrade from `http` to `browser` based on the response.
4. **Default**: Falls back to `'http'`.

For more details, see [README.engine.md](./README.engine.md).

### Action Execution & Error Handling

* **`failOnError`**:
  * Defaults to `true`. If an action fails, it throws an error. `FetchSession.executeAll` catches this error, attaches the `actionIndex`, and re-throws it, stopping the execution flow.
  * If set to `false`, the action catches its own error, logs it internally (in the result object), and returns a "success" status. `FetchSession.executeAll` sees this as a successful step and **continues to the next action**.

### Implementing New Actions

When adding a new action (e.g., `src/action/definitions/my-action.ts`):

1. **Normalize in Base**: Use `_normalizeSchema` or similar methods in `FetchEngine` (base.ts) to handle shorthands (like converting a string to a `{ selector: '...' }` object) and single-string-to-array conversions. This ensures consistent behavior across engines.
2. **Abstract Business Logic**: If an action has complex logic for presets or parameter resolution (like `trim`), implement a protected helper method in `FetchEngine` (e.g., `_getTrimInfo`) so that both `CheerioFetchEngine` and `PlaywrightFetchEngine` can share the same logic.
3. **Engine Delegation**: Keep the `onExecute` method in the `FetchAction` class thin. Its main job is to extract parameters and call `this.delegateToEngine(context, 'methodName', params)`.
4. **Persistent State**: Actions like `trim` or `fill` should update `this.lastResponse` in the engine after modifying the DOM, so that subsequent `extract` or `getContent` calls work on the updated state.

### Fixture Params

We recently migrated `fixture.json` files from using an `args` array to a `params` object. This unifies the data structure with the actual `FetchActionOptions` used in the code, reducing cognitive load and the need for translation layers in tests.

## 📝 Commit Messages

We follow the **Conventional Commits** specification.

* `feat`: A new feature
* `fix`: A bug fix
* `docs`: Documentation only changes
* `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor`: A code change that neither fixes a bug nor adds a feature
* `perf`: A code change that improves performance
* `test`: Adding missing tests or correcting existing tests
* `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

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

1. **Action Termination**: Terminates the internal action loop and rejects pending requests.
2. **Crawler Teardown**: Gracefully shuts down the Crawlee instance.
3. **Conditional Purging**:
    - `storage.purge`: (boolean, defaults to `true`).
    - If `true`, it calls `.drop()` on the `RequestQueue` and `KeyValueStore`, physically deleting the data from memory/disk.
    - If `false`, the data is preserved, allowing future sessions with the same `storage.id` to reuse it.
4. **Event Cleanup**: Removes all listeners to prevent memory leaks.

### Crawlee Session Persistence

* **State Restoration Timing**: Attempting to restore `SessionPool` state (like cookies) inside `preNavigationHooks` is too late because the session is already assigned.
* **Persistence Workaround**: Even with `persistStorage` set to `false`, `SessionPool` persistence requires the data to exist in the `KeyValueStore`.
  - **Solution**: We manually inject the session state into the `KeyValueStore` (using `PERSIST_STATE_KEY`) *immediately after* creating the crawler instance but *before* running it. This ensures `SessionPool` initializes with the correct state.
  - **ID Priority**: SessionPool persistence always follows the `storeId` (either user-provided or auto-generated), ensuring correct isolation or sharing of authentication states.

### Engine Implementation: innerText Simulation

When implementing `mode: 'innerText'` in extraction actions, we aim to match the behavior of a real browser (Playwright's `innerText`).

#### 1. Playwright Implementation

In `PlaywrightFetchEngine`, we use the native `locator.innerText()` method. It is the gold standard as it respects CSS layout and visibility.

#### 2. Cheerio Implementation (The Simulation)

Since Cheerio is a static parser, we simulate `innerText` in `src/utils/cheerio-helpers.ts`.

**The Algorithm**:

1. **Clone**: Clone the element to avoid side effects.
2. **Tag Marking**: Replace `<br>` with a `\n` placeholder, and wrap block elements (e.g., `<div>`, `<h1>`) and paragraphs (`<p>`) with their own respective placeholders (`BLOCK` and `P`).
3. **Whitespace Normalization**: Collapse all original HTML source whitespace (newlines, tabs, spaces) into a single space. This mimics how browsers treat non-rendered whitespace.
4. **Placeholder Collapsing**:
    - Remove any spaces that ended up around our placeholders.
    - Merge adjacent block/p placeholders. If a sequence contains a `<p>` placeholder, it results in a double newline (`\n\n`); otherwise, it results in a single newline (`\n`).
5. **Restoration**: Convert placeholders back to actual newlines.

**Why this approach?**
A naive `.text()` in Cheerio just concatenates all text nodes, losing all structural line breaks (e.g., `<div>A</div><div>B</div>` becomes `"AB"`). Our simulation ensures that structural breaks are preserved, making the output from the `http` engine consistent with the `browser` engine.

### Feature: Data Extraction Quality Control (`required` & `strict`)

To ensure data quality and handle messy HTML structures, the `extract` action supports field-level validation and global/local strictness.

#### 1. The `required` Property
- **Purpose**: Marks a field as mandatory.
- **Behavior**:
  - If a `required` field extracts to `null`:
    - In an **Object**, the entire object returns `null`.
    - In an **Array**, the current item/row is **skipped** (ignored).
  - This is the primary mechanism for filtering "noise" or incomplete data (e.g., ignoring search results that lack a title or price).

#### 2. The `strict` Property
- **Default**: `false` (Fail-soft/Ignore mode).
- **Scope**: Can be applied to a `mode` (e.g., `columnar`) or an `object` schema.
- **Behavior**:
  - **`strict: false` (Default)**: Missing `required` fields result in the item being skipped or the object returning `null`. Extraction continues for other items.
  - **`strict: true`**: Missing `required` fields or alignment mismatches (in `columnar` mode) will throw a `CommonError`.
- **Inheritance**: If `strict` is defined at the `array` schema level, it is automatically propagated to its extraction `mode` and `items`.

#### 3. Best Practices for Developers
- **Consistency**: Always use `this._isImplicitObject(schema)` to identify implicit objects and treat their properties with the same `required`/`strict` logic as explicit objects.
- **Filtering**: When implementing new array modes, ensure they call `_extract` recursively for items and handle the `null` return by skipping the entry if it's considered an "extraction failure".
- **Error Messages**: When `strict: true` is enabled, provide descriptive error messages indicating which field is missing and at what index (if applicable).

### Feature: Array Extraction Modes (Columnar & Segmented)

To handle complex and non-standard HTML structures, we implemented multiple extraction strategies in the `extract` action. This allows users to scrape data based on how it is visually organized rather than just how it is DOM-nested.

#### 1. Columnar Mode (formerly Zip Strategy)

This mode is used for "Container + Columns" structures where item fields are separate lists under a common parent.

- **Implementation**: The engine extracts each field in `items` as a full list (column) within the container.
- **Alignment**: It then "zips" these columns together by index.
- **Smart Inference**: If `inference: true` is enabled and counts mismatch, the engine identifies the field with the most matches, finds its parent node that is a direct child of the container, and treats those nodes as inferred "item wrappers" to restart extraction in `nested` mode.

#### 2. Segmented Mode (Anchor-based Scanning)

Ideal for "Flat" structures where items are simply a sequence of siblings without any wrapping element.

- **The Anchor Logic**: It identifies the first field (or a specified `anchor`) as the project delimiter.
- **Segmentation**: For each anchor found, the engine calls `_nextSiblingsUntil(anchor, anchorSelector)` to collect all subsequent sibling nodes until the next anchor.
- **Context Injection**: These nodes (Anchor + Siblings) are passed as an array-based `context` to the recursive `_extract` call.
- **Abstraction**: Base class `FetchEngine` manages the segmentation flow, while concrete engines implement `_nextSiblingsUntil`:
    - **Cheerio**: Uses `el.nextUntil(selector).addBack()`.
    - **Playwright**: Uses XPath `following-sibling::*` combined with browser-side `el.matches(selector)` checks.

#### 3. Heuristic Mode Selection

When `mode` is omitted, the engine follows these rules:
1. If the array `selector` matches **multiple** elements -> **Nested Mode**.
2. If it matches **exactly one** element AND `items` has child selectors -> **Columnar Mode**.
3. If Columnar extraction yields no results -> Fallback to **Nested Mode**.

### Extraction Schema Normalization & Implicit Objects

To provide an "AI-friendly" and developer-friendly experience, the `extract` action supports highly flexible shorthand syntaxes. These are handled by a dedicated normalization layer in the base `FetchEngine`.

#### 1. Shorthand Types

- **String Shorthand**: `'h1'` is automatically converted to `{ selector: 'h1' }`.
- **Implicit Object Shorthand**: If a schema object lacks a `type` property but contains other keys, it is treated as an `object` type where those keys are the properties to extract.
  - *Example*: `{ "title": "h1" }` -> `{ "type": "object", "properties": { "title": { "selector": "h1" } } }`.

#### 2. The Keyword Collision Fix (Context vs. Data)

A critical challenge in implicit objects is distinguishing between **extraction configuration** (like `selector`, `has`) and **data properties** (like `items`, `mode`).

- **The Logic**: In the context of an implicit object, we divide keys into two categories:
  1. **Context Keys**: `selector`, `has`, `exclude`. These define *where* to look.
  2. **Data Keys**: Everything else (including `items`, `attribute`, `mode`). These define *what* to extract.
- **Why?**: This allows users to extract a field named `items` (e.g., in a JSON-like HTML structure) without it being misidentified as the `items` configuration for an array.
- **Implementation**: The `_normalizeSchema` method recursively peels off context keys and moves all other keys into a generated `properties` object, ensuring the core engine always receives a standardized, unambiguous `ExtractObjectSchema`.

#### 3. Cross-Engine Consistency

Both `CheerioFetchEngine` and `PlaywrightFetchEngine` must call `this._normalizeSchema(action.schema)` at the entry point of their `extract` action implementation. This ensures that regardless of the engine used, the complex shorthand logic behaves identically.

### Current Limitations & Future Directions

- **Nested Segmentation**: Currently, `segmented` mode only supports one level of flat structures. Future versions could support recursive segmentation for complex document structures.
- **Performance**: Scanning thousands of siblings in `segmented` mode (especially in Playwright) can be expensive. We may need to implement a more efficient "one-pass" scanner that categorizes all nodes in a single traversal.
- **Visual Inference**: In `browser` mode, we could potentially use element coordinates (bounding boxes) to infer item boundaries when DOM structure is completely chaotic.
- **HTML Extraction**: We added `mode: 'html' | 'outerHTML'`. The current default is `innerHTML`. Future extension could include sanitization options for HTML extraction.

### Encoding Detection Challenges (Post-Mortem)

We attempted to implement automatic encoding detection (specifically for GBK/legacy encodings) in `CheerioFetchEngine` to match `PlaywrightFetchEngine`'s capability.

#### 1. Why Playwright "Succeeds"

`PlaywrightFetchEngine` (browser mode) correctly handles legacy encodings (like GBK) without manual intervention. This is not due to any special logic in our wrapper, but because:

* **Native Browser Heuristics**: It leverages the Chromium engine's sophisticated, built-in encoding detector (ced).
* **Robustness**: The browser uses complex frequency analysis and language models to correctly identify legacy encodings even when headers are missing or incorrect, and when the content is mixed (mostly ASCII HTML with sparse Chinese characters).
* **Transparency**: Playwright handles the decoding internally and presents the final DOM as UTF-8.

**Note on Manual Interception**:
We also explored a manual interception strategy in Playwright, which successfully retrieved the raw buffer but still suffered from the same detection library limitations in Node.js. The code for this reference is as follows:

```typescript
// Inside preNavigationHooks:
await page.route('**/*', async (route) => {
  const req = route.request();
  const resourceType = req.resourceType();

  if (resourceType === 'document' && req.method() === 'GET') {
    try {
      // Fetch with maxRedirects: 0 to let the browser handle redirects naturally
      const response = await page.request.fetch(req, { maxRedirects: 0 });
      const headers = response.headers();
      const body = await response.body();
      const contentType = headers['content-type'] || '';

      if (response.status() === 200) {
        // Detect encoding from raw bytes + content-type header
        const encoding = detectEncoding(body, contentType);
        // Always decode to UTF-8 for the browser to display correctly
        const decoded = decodeBuffer(body, encoding);

        headers['content-type'] = contentType.replace(/;\s*charset=[^;]*/i, '') + '; charset=utf-8';
        delete headers['content-encoding'];
        delete headers['content-length'];

        return route.fulfill({
          status: response.status(),
          headers: headers,
          body: decoded,
          contentType: headers['content-type'],
        });
      }
      return route.fulfill({ status: response.status(), headers, body });
    } catch (e) {
      return route.continue();
    }
  }
  return route.continue();
});
```

`src/utils/encoding.ts`:

```ts
import iconv from 'iconv-lite'
import jschardet from 'jschardet'

function isStrictUTF8(buffer: Buffer): boolean {
  if (buffer.length === 0) return true
  if (typeof (Buffer as any).isUtf8 === 'function') {
    return (Buffer as any).isUtf8(buffer)
  }
  try {
    const str = buffer.toString('utf8')
    const buf2 = Buffer.from(str, 'utf8')
    return buffer.equals(buf2)
  } catch {
    return false
  }
}

export function detectEncoding(buffer: Buffer, contentType?: string): string {
  if (!buffer || buffer.length === 0) return 'utf-8'

  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    return 'utf-8'
  }

  if (contentType) {
    const match = contentType.match(/charset=([\w-]+)/i)
    if (match) return match[1].toLowerCase()
  }

  const sample = buffer.subarray(0, 4096).toString('ascii')
  const metaMatch =
    sample.match(/<meta[^>]+charset=["']?([\w-]+)["']?/i) ||
    sample.match(/<meta[^>]+content=["'][^"']+charset=([\w-]+)["']/i)
  if (metaMatch) return metaMatch[1].toLowerCase()

  const detected = jschardet.detect(buffer)
  let encoding = (detected?.encoding || 'utf-8').toLowerCase()
  // const confidence = detected?.confidence || 0

  if (buffer.some((b) => b > 127)) {
    const isValidUTF8 = isStrictUTF8(buffer)

    if (!isValidUTF8) {
      // Common misidentifications by jschardet for Chinese content
      if (['utf-8', 'ascii', 'iso-8859-1', 'windows-1252', 'iso-8859-2'].includes(encoding)) {
        return 'gbk'
      }
    }
  }

  return encoding
}

export function decodeBuffer(buffer: Buffer, encoding: string): string {
  if (!iconv.encodingExists(encoding)) {
    encoding = 'utf-8'
  }
  let result = iconv.decode(buffer, encoding)

  if (encoding === 'utf-8' && result.includes('\ufffd')) {
    if (!isStrictUTF8(buffer)) {
      return iconv.decode(buffer, 'gbk')
    }
  }

  return result
}
```

#### 2. The Failed Attempt in Node.js (Cheerio)

To replicate this in `http` mode, we implemented several pipelines, but all failed fundamentally at the data retrieval stage:

1. **Buffer Interception Attempt**: We tried forcing `got` (via `crawlee`) to use `responseType: 'buffer'` or `encoding: null`.
2. **Safe-String Attempt**: We tried using `encoding: 'latin1'` or `encoding: 'base64'` to prevent UTF-8 corruption.

**The Failure Mode**:

* **Buffer Corruption**: Unlike Playwright's network interception, `got`/`crawlee` consistently failed to return a pristine buffer for GBK content. The resulting bytes were already altered or corrupted by the time they reached our hooks, even with `responseType: 'buffer'`.
* **Detection Failure**: Because the input buffer was already incorrect (showing mismatched hex values compared to the browser's raw capture), `detectEncoding` and `jschardet` were working on corrupted data.
* **Mixed Content Issue**: Even if the buffer had been correct, `jschardet` consistently misidentified mixed-content pages (e.g., a GBK page with 95% ASCII HTML tags) as `ISO-8859-2` or `windows-1252`.
* **Conclusion**: Replicating the robust, complex encoding detection and raw stream handling found in modern browsers is extremely difficult in Node.js when using high-level HTTP clients like `got` that have deep-seated UTF-8 assumptions. We decided to revert this feature to avoid shipping a broken and misleading implementation.

**Recommendation**:
The most reliable solution is for the HTTP server to provide the correct encoding in the `Content-Type` header (e.g., `Content-Type: text/html; charset=gbk`). For legacy sites where this is not possible and encoding headers are ambiguous, users are advised to use `engine: 'playwright'` or explicitly specify the encoding in the request options if known.

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.
