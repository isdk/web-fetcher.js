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
      "params": { "schema": { "title": "h1" } }
    }
  ],
  "expected": {
    "statusCode": 200,
    "data": { "title": "Hello" } // Checks the result of the LAST action or 'data' output
  }
}
```

**Note on Results**:
The test runner checks `expected.data` against:

1. The implicit result of the last action (stored as `__test_result__`).
2. An explicit output named `data` (if you used `"storeAs": "data"`).
3. The single output available if `storeAs` was used but with a different name.
4. The raw `result` object.

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

#### Error Assertions

When testing for errors in `expected.error`, you can use strings (for substring matches) or **Regex strings** (e.g., `"/invalid selector/i"`). If the expectation is an object, you can check specific error properties (like `name` or `message`).

Example:

```json
"expected": {
  "error": {
    "message": "/missing required field/i",
    "name": "CommonError"
  }
}
```

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

**Built-in Actions (Reference):**

- `goto`: Navigates to a URL.
- `click`: Clicks on an element.
- `fill`: Fills an input field.
- `submit`: Submits a form.
- `trim`: Removes elements from the DOM to clean up the page (e.g., scripts, ads, hidden content).
- `waitFor`: Waits for conditions to be met.
- `pause`: Pauses the action script execution. In interactive environments, this can trigger a callback.
- `extract`: Extracts structured data from the page.
- `getContent`: Retrieves the page content (Automatically called by `executeAll` to return the final state).

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
3. **Smart Upgrade**: If `enableSmart` is true, the system evaluates the HTTP response. It may automatically switch to `'browser'` if:
    * The status code is 401, 403, or 5xx.
    * The HTML body contains signatures of dynamic frameworks (React, Vue, Next.js, Nuxt) or anti-bot services (Cloudflare, Captchas).
    * The content indicates that JavaScript is required to render.
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
4. **Action Processing Architecture**:
    * **`_processAction` (Base)**: Handles engine-agnostic actions like `extract`, `pause`, and `getContent`. It also includes optimizations like short-circuiting for simple `waitFor` (sleep).
    * **`executeAction` (Subclass)**: Concrete engines only need to implement technology-specific interactions (e.g., actual `click`, `fill`, or complex `waitFor` conditions) in their `executeAction` implementation. This maximizes code reuse in the base class.
5. **Persistent State**: Actions like `trim`, `fill`, or `pause` should ensure the internal engine state remains consistent. Some actions like `fill` update `this.lastResponse` so that subsequent `extract` or `getContent` calls work on the updated state.
6. **Antibot Awareness**: When implementing features that affect browser behavior, consider how they interact with `antibot: true`. This mode uses `camoufox-js` to enhance stealth, which might affect certain browser primitives.

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

```sh
feat(engine): add support for custom headers in playwright
fix(session): ensure cookies are persisted across redirects
```

Note:

* `BREAKING CHANGE`: a commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
* *footers* other than BREAKING CHANGE: `<description>` may be provided and follow a convention similar to git trailer format.

## 🧩 Implementation Details & Gotchas

### 性能优化实现细节与陷阱 (Performance Optimization & Pitfalls)

在处理深层 DOM 树或大规模数据提取时，性能优化至关重要。

#### 1. 最小化 Playwright IPC 开销

**核心挑战**：在 `browser` 模式下，Node.js 进程与浏览器进程之间的每一次通信（如 `locator.evaluate`）都是一次昂贵的跨进程通信 (IPC)。

- **优化原则**：**将逻辑尽可能推向浏览器端执行**。如果一个操作需要多次遍历 DOM 或多次判断元素关系，应该将其封装在一个 `evaluate` 调用中完成，而不是在 Node.js 中使用循环多次调用浏览器 API。

#### 2. Playwright 中的 XPath 陷阱与解决方案

在实现 `_findCommonAncestor` (LCA) 和 `_findContainerChild` 时，我们需要从浏览器端的 `evaluate` 函数中返回一个元素句柄或选择器，以便 Node.js 端能继续操作该元素。

- **为什么不能直接返回 ElementHandle?**：
  从 `evaluate` 返回 `ElementHandle` 会增加额外的句柄管理负担。更重要的是，我们希望返回的是一个 `Locator`，而 `Locator` 通常基于选择器。
- **为什么使用 XPath 而非 CSS Selector?**：
  - **路径唯一性**：对于在内存中动态找到的任意 DOM 节点，生成一个简短且唯一的 CSS 选择器非常困难且不可靠。
  - **XPath 的优势**：我们可以编写一个简单的辅助函数（如 `getXPath(element)`），递归地生成该元素的绝对路径（如 `/html/body/div[2]/span[1]`）。
  - **双向转换**：
    1. 在浏览器端（`evaluate` 内部）找到目标节点。
    2. 使用 `getXPath` 将节点转换为唯一的 XPath 字符串。
    3. 将字符串返回给 Node.js。
    4. 在 Node.js 端，使用 `page.locator('xpath=' + xpath)` 重新获得该元素的 `Locator`。
- **教训**：不要试图在 Node.js 中通过 `parentElement()` 循环来寻找祖先，这会导致 O(N) 次 IPC 调用，在 DOM 树较深时性能会急剧下降。

#### 3. Cheerio 的同步优势

在 `http` 模式下，所有 DOM 操作都在同一个 Node.js 进程中同步完成，因此 `_findCommonAncestor` 等操作可以直接利用循环实现，性能开销极低。尽管如此，我们依然提供了专门的接口，以便未来可以利用 Cheerio 的内部优化。

### 核心提取逻辑实现细节 (`src/core/extract.ts`)

为了处理复杂的 Web 结构（如非嵌套的平铺列表或需要跨字段引用的锚点），核心提取逻辑采用了以下关键设计：

#### 1. 字段追踪与锚点关联 (`fieldElements`)

**设计初衷**：在 `object` 提取过程中，我们维护了一个 `fieldElements` Map，记录每个字段名对应的 DOM 元素。

- **注意点**：无论字段是否具有 `selector`，只要提取成功，就必须记录其 `extractedElement`。这是为了支持后续字段通过 `anchor: "fieldName"` 引用它。
- **逻辑边界**：如果一个字段提取的是数组，`fieldElements` 通常记录该数组的第一个元素作为锚点参考。

#### 2. 递归中的上下文保护 (`_skipSelector`)

**为什么需要**：在 `object` 循环中，父级往往已经通过 `querySelectorAll` 选好了子字段的元素。

- **实现细节**：在递归调用子级的 `_extract` 时，我们会传入 `_skipSelector: true`。
- **目的**：
    1. **性能**：避免在 Playwright 中执行冗余的跨进程 DOM 查询。
    2. **正确性**：防止子级 Schema 的 `selector` 在其自身内部重新搜索。例如字段 Schema 为 `{ "id": { "selector": "span" } }`，如果已经选好了那个 `span`，子级就不应再在其内部寻找另一个 `span`。

#### 3. 冒泡定位策略 (`_bubbleUpToScope`)

**设计初衷**：锚点（Anchor）可能是一个深层嵌套的元素（如 `div > p > span`），但顺序扫描或分段模式通常操作的是一组直系兄弟节点（如 `div` 列表）。

- **实现原理**：该函数从深层元素向上回溯，直到找到一个直接存在于当前 `scope`（作用域数组）中的祖先。
- **重要性**：只有定位到这个“直系项”，我们才能正确执行 `nextSiblingsUntil` 或游标切片，否则扫描位置会发生偏移。

#### 4. 消费游标逻辑 (`_sliceSequentialScope`)

**设计初衷**：处理 `relativeTo: 'previous'`（顺序提取）。

- **工作方式**：提取完一个字段后，通过 `_bubbleUpToScope` 确定该字段对应的顶级兄弟节点位置，然后将当前的搜索范围（`currentWorkingScope`）“切掉”已处理的部分。
- **注意点**：如果字段匹配失败，游标不应移动，以便下一个可选字段从相同位置继续尝试。

#### 5. 性能提醒：Playwright RPC 调用

在 `browser` 模式下，每次 `_querySelectorAll` 或 `_isSameElement` 都是一次昂贵的 RPC 调用。

- **优化建议**：在实现新功能（如推理或去重）时，优先考虑批量操作，或在可能的情况下利用 `_skipSelector` 减少查询频率。

### DOM Traversal Safeguard (MAX_DOM_DEPTH)

To prevent infinite loops during DOM traversal (e.g., in `_bubbleUpToScope` or `_isAncestor`), we implement a `MAX_DOM_DEPTH` limit (default: 1000). Any traversal exceeding this depth will be truncated or return `null` to ensure system stability when encountering corrupted or extremely deep DOM structures.

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

### Antibot Mode & Camoufox

To combat sophisticated anti-bot measures, the `PlaywrightFetchEngine` offers an `antibot` mode.

- **Technology**: It integrates [Camoufox](https://github.com/prescience-data/camoufox), a hardened Firefox browser designed for stealth.
- **Behavior**: When `antibot: true` is set, the engine switches to Firefox (regardless of other settings) and applies Camoufox's launch options.
- **Constraints**: This requires `camoufox-js` as a dependency and a local installation of Firefox. It also disables default fingerprint spoofing to avoid conflicts with Camoufox's own management.

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

#### 3. HTML Extraction (`html` & `outerHTML`)

We support extracting raw HTML:

- **`mode: 'html'`**: Extracts the `innerHTML` of the element.
- **`mode: 'outerHTML'`**: Extracts the `outerHTML` (including the element's own tag).
- **Engine Consistency**: Both engines use their respective underlying libraries (Cheerio's `.html()` and Playwright's `locator.evaluate(el => el.outerHTML)`) to ensure accurate results.

### Feature: Data Extraction Quality Control (`required` & `strict`)

To ensure data quality and handle messy HTML structures, the `extract` action supports field-level validation and global/local strictness.

#### 1. The `required` Property

- **Purpose**: Marks a field as mandatory.
- **Behavior**:
  - If a `required` field extracts to `null`:
    - In an **Object**, the entire object returns `null`.
    - In an **Array**, the current item/row is **skipped** (ignored).
  - **Implicit Objects**: If an object has no `selector` (common in nested shorthands) and ALL of its properties return `null`, the object itself returns `null`. This ensures that a `required` check on the parent object or a skip-logic in an array will correctly trigger even for implicit objects.
  - This is the primary mechanism for filtering "noise" or incomplete data (e.g., ignoring search results that lack a title or price).

#### 2. The `strict` Property

- **Default**: `false` (Fail-soft/Ignore mode).
- **Scope**: Can be applied to a `mode` (e.g., `columnar`) or an `object` schema.
- **Behavior**:
  - **`strict: false` (Default)**: Missing `required` fields result in the item being skipped or the object returning `null`. Extraction continues for other items.
  - **`strict: true`**: Missing `required` fields or alignment mismatches (in `columnar` mode) will throw a `CommonError`.
- **Inheritance**: If `strict` is defined at the `array` schema level, it is automatically propagated to its extraction `mode` and `items`. It is also passed down to nested `_extract` calls to ensure consistent strictness across the entire schema tree.

#### 3. Best Practices for Developers

- **Consistency**: Always use `this._isImplicitObject(schema)` (during extraction) or the normalization layer (during initialization) to handle shorthand structures uniformly.
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

- **The Anchor Logic**: It identifies a delimiter to split segments.
- **Flexible Anchor**: The `anchor` option in `SegmentedOptions` can be either a field name defined in `items` or a direct CSS selector.
- **Segmentation**: For each anchor found, the engine calls `_nextSiblingsUntil(anchor, anchorSelector)` to collect all subsequent sibling nodes until the next anchor.
- **Relative Positioning (`relativeTo: 'previous'`)**:
  - **Purpose**: Solves extraction from "Flat & Featureless" structures where multiple fields share the same selector.
  - **Mechanism**: Implements a "Consuming Cursor". After extracting a field, the engine automatically narrows the search scope for subsequent fields to the siblings *following* the matched element.
  - **Deep Dive: The Consuming Cursor Logic**:
        1. **Initialization**: When `relativeTo: 'previous'` is enabled and the scope is a segment (array of siblings), the engine initializes a `currentWorkingScope`.
        2. **Order Execution**: It iterates through properties based on the `order` array. For each property:
           - It performs a `_querySelectorAll` within the `currentWorkingScope`.
           - If a match is found (say `Element_N`), it extracts the value.
           - **Crucial Step (Recursion Protection)**: When calling `_extract` recursively for the matched element, the engine passes a temporary schema with the `selector` removed. This prevents the recursive call from searching *inside* `Element_N` for itself.
           - **Scope Slicing**: After a successful extraction, the engine identifies the index of the matched element (or its top-level container within the segment using `_bubbleUpToScope`) and slices the `currentWorkingScope` to start *after* that index.
        3. **Fallback**: If an optional field matches nothing, the `currentWorkingScope` remains unchanged, allowing the next field to scan from the same relative origin.
  - **Order Sensitivity**: Requires an explicit `order` array (or relies on object key insertion order) to ensure fields are "consumed" in the correct sequence.
- **Anchor Jumping (Arbitrary Object Anchors)**:
  - **Concept**: We extended the `anchor` concept from array segmentation to individual object properties, enabling "random access" scanning within a sequential process.
  - **Mechanism**: Any field in an `ExtractObjectSchema` can define an `anchor` (referencing a prior field name or a CSS selector) to reset its search scope.
  - **Deep Dive: The Jump & Bubble Up Logic**:
        1. **Element Tracking**: The engine maintains a `fieldElements` Map (key -> DOM Element) during object extraction to track every successfully extracted field.
        2. **Anchor Resolution**: When a field defines an `anchor`, the engine resolves it either from `fieldElements` (if it's a known field name) or by querying the object's root scope (if it's a selector).
        3. **Bubble Up Strategy**: The resolved anchor might be deeply nested (e.g., a `span` inside a `div`). To find the effective "starting line" in the current scope (which might be a list of sibling `div`s), the engine calls `_bubbleUpToScope(anchor, currentScope)`. This function walks up the DOM tree from the anchor until it finds the ancestor that is a direct member of the current scope.
        4. **Cursor Reset**: Once the effective anchor is found, the engine resets the scanning cursor (`currentWorkingScope`) to the siblings immediately **following** that anchor. This allows the extraction flow to "jump" to a new section of the content, bypassing intermediate nodes.
- **Strict Mode**: When `strict: true` is set in the mode options, it ensures that:
  - At least one anchor element must be found.
  - Each segment must satisfy all `required` fields in `items`.
- **Context Injection**: These nodes (Anchor + Siblings) are passed as an array-based `context` to the recursive `_extract` call.
- **The `_nextSiblingsUntil` Internal**: This abstract method is the engine-specific core of segmentation. It is responsible for scanning the DOM from a given anchor point.
  - **Responsibility**: Returns an array of sibling elements starting *after* the current anchor and stopping *before* the next element that matches the `untilSelector`.
  - **Cheerio Implementation**: Leverages Cheerio's efficient `.nextUntil(selector)` or `.nextAll()`.
  - **Playwright Implementation**: Since Playwright Locators don't have a native `nextUntil`, it uses the XPath `following-sibling::*` to fetch all subsequent siblings and then iterates through them, performing a browser-side `el.matches(selector)` check to find the segment boundary.
- **Abstraction**: Base class `FetchEngine` manages the segmentation flow and strictness propagation, while concrete engines implement the low-level scanning.

#### 3. Heuristic Mode Selection

When `mode` is omitted, the engine follows these rules:

1. If the array `selector` matches **multiple** elements -> **Nested Mode**.
2. If it matches **exactly one** element AND `items` has child selectors -> **Columnar Mode**.
3. If Columnar extraction yields no results -> Fallback to **Nested Mode**.

### The Three-Layer Extraction Architecture

To ensure consistency across different engines and maintain high testability, the data extraction logic is split into three distinct layers:

1. **Normalization Layer (`src/core/normalize-extract-schema.ts`)**:
    * **Responsibility**: Converts flexible, shorthand user schemas (like strings or implicit objects) into a strict, canonical `ExtractSchema` format.
    * **Key Logic**: Handles CSS filter merging (`selector` + `has`/`exclude` -> `:has()`/`:not()`), defaults assignment, and recursive normalization of nested structures.
2. **Core Extraction Engine (`src/core/extract.ts`)**:
    * **Responsibility**: The engine-agnostic business logic of extraction. It handles the "how" of the process.
    * **Key Logic**: Manages recursion, array mode dispatching (Nested vs. Columnar vs. Segmented), strict mode inheritance, and `required` field validation/skipping logic.
    * **Abstraction**: Uses the `IExtractEngine` interface to perform low-level DOM operations without knowing if it's running in Cheerio or Playwright.
3. **Engine Shim Layer (`src/engine/base.ts` & implementations)**:
    * **Responsibility**: Provides the "primitive" operations required by the Core Engine and the unified action processor.
    * **Key Logic**: Implements low-level DOM operations using `FetchElementScope` (an abstraction for engine-specific element handles like Cheerio objects or Playwright Locators).
    * **IExtractEngine Contract**:
        * `_querySelectorAll`: MUST return results in **document order**. When `scope` is an array, it MUST check both the elements themselves and their descendants.
        * `_extractValue`: Handles primitive extraction according to `mode` and `attribute`.
        * `_parentElement`, `_isSameElement`, and `_nextSiblingsUntil`.
        * **Integration**: `FetchEngine` delegates its `extract` call to the core `_extract` function, passing itself (`this`) as the engine provider.

   ### Engine Limitations & Quirks

   #### Cheerio: The `:scope` Selector

    Cheerio does not naturally support the `:scope` pseudo-class in `find()` or `filter()` operations in the same way modern browsers do.

    * **Impact**: Standard CSS queries using `:scope` to reference the current element (e.g., in `columnar` extraction where the selector is the container itself) will fail if passed directly to Cheerio.
    * **Solution**: The `CheerioFetchEngine._querySelectorAll` method explicitly checks for `selector === ':scope'` and returns the element itself to align behavior with the Playwright engine. Developers modifying this engine must preserve this manual check.

   ### Extraction Schema Normalization & Implicit Objects

To provide an "AI-friendly" and developer-friendly experience, the `extract` action supports highly flexible shorthand syntaxes. These are handled by a dedicated normalization layer in `src/core/normalize-extract-schema.ts`.

#### 1. Shorthand Types

- **String Shorthand**: `'h1'` is automatically converted to `{ selector: 'h1' }`.
- **Implicit Object Shorthand**: If a schema object lacks a `type` property (or `type` is not one of the reserved schema types like `string`, `object`, `array`, etc.) but contains other keys, it is treated as an `object` type where those keys are the properties to extract.
  - *Example*: `{ "title": "h1" }` -> `{ "type": "object", "properties": { "title": { "selector": "h1" } } }`.
  - *Example (Collision handling)*: `{ "type": { "selector": ".tag" } }` is correctly identified as an implicit object extracting a field named `type`.

#### 2. The Keyword Collision Fix (Context vs. Data)

A critical challenge in implicit objects is distinguishing between **extraction configuration** (like `selector`, `has`) and **data properties** (like `items`, `mode`).

- **The Logic**: In the context of an implicit object, we divide keys into two categories:
  1. **Context Keys**: `selector`, `has`, `exclude`, `required`, `strict`, `relativeTo`, `order`, `anchor`. These define *how* and *where* to look.
  2. **Data Keys**: Everything else (including `items`, `attribute`, `mode`). These define *what* to extract.
- **Why?**: This allows users to extract a field named `items` (e.g., in a JSON-like HTML structure) without it being misidentified as the `items` configuration for an array. Similarly, `required` or `strict` can be property names if they are not explicitly part of the schema definition.
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
