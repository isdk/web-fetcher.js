# Action Script Architecture

This document details the architecture, design philosophy, and usage of the Action Script system within `web-fetcher`. It is intended to help developers maintain and extend the system, and to help users efficiently build automation tasks.

## 1. Overview

The core goal of the Action Script system is to provide a **declarative, engine-agnostic** way to define and execute a series of web interactions.

The system is built on two fundamental concepts:

* **Atomic Actions:** Built into the library, these represent a single, indivisible operation and are the basic "atoms" that make up all complex processes. Examples: `goto`, `click`, `fill`.
* **Composite Actions:** Created by the library user, these represent a complex operation with business semantics, composed of multiple atomic actions. This is the essence of the architecture, encouraging users to encapsulate low-level operations into higher-level "molecules" that are easier to understand and reuse. Examples: `login`, `search`, `addToCart`.

This approach allows users to describe a complete business process with intuitive semantics, while hiding the specific, engine-related implementation details in the underlying layers.

## 2. Core Concepts

### `FetchAction` (Base Class)

`FetchAction` is the abstract base class for all Actions. It defines the core elements of an Action:

* `static id`: The unique identifier for the Action, e.g., `'click'`.
* `static returnType`: The type of the result returned after the Action executes, e.g., `'none'`, `'response'`.
* `static capabilities`: Declares the capability level of this Action in different engines (`http`, `browser`), such as `native`, `simulate`, or `noop`.
* `static register()`: A static method to register the Action class in a global registry, allowing it to be dynamically created by its `id`.

### `onExecute` (Core Logic)

Every `FetchAction` subclass must implement the `onExecute` method. This is where an Action defines its behavior.

### `delegateToEngine` (Delegation Helper)

To simplify the creation of **atomic actions**, the `FetchAction` base class provides a protected helper method, `delegateToEngine`. Based on your latest simplification, its interface has become more intuitive.

It passes the Action's parameters (`params`) as a whole object directly to the corresponding method on the engine.

**Example: The `fill` Action using `delegateToEngine`**

```typescript
// The new, more concise implementation
async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
  // Directly passes the options.params object to engine.fill(params)
  await this.delegateToEngine(context, 'fill', options?.params);
}
```

This implementation clearly expresses the intent: "delegate the `fill` action to the engine, passing the entire `params` object defined in the script."

## 3. How to Use (For Users)

Users define a complete automation workflow via a JSON-formatted `actions` array.

### Using Atomic Actions

For simple, linear workflows, you can use a list of the library's built-in atomic actions directly.

**Example: Searching for "gemini" on Google**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://www.google.com" } },
    { "id": "fill", "params": { "selector": "textarea[name=q]", "value": "gemini" } },
    { "id": "submit", "params": { "selector": "form" } }
  ]
}
```

### Building High-Level Semantic Actions via "Composition"

This is the recommended best practice for **users** to encapsulate and reuse business logic.

**Scenario: Creating a reusable `LoginAction`**

Suppose you need to perform a login operation in multiple scripts. You can create a custom `LoginAction` to encapsulate this process.

**Step 1: Define `LoginAction.ts` in your project**

```typescript
import { FetchContext, FetchAction, BaseFetchActionOptions } from '@isdk/ai-tools'; // Import from the library

export class LoginAction extends FetchAction {
  static override id = 'login';
  static override capabilities = { http: 'simulate' as const, browser: 'native' as const };

  async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
    const { username, password, userSelector, passSelector, submitSelector } = options?.params || {};
    if (!username || !password || !userSelector || !passSelector || !submitSelector) {
      throw new Error('Username, password, and all selectors are required for login action');
    }

    const engine = context.internal.engine;
    if (!engine) throw new Error('No engine available');

    // Orchestrate atomic capabilities to form a complete business process
    await engine.fill({ selector: userSelector, value: username });
    await engine.fill({ selector: passSelector, value: password });
    await engine.click({ selector: submitSelector });

    await engine.waitFor({ networkIdle: true });
  }
}
```

**Step 2: Register this custom Action when your application starts**

```typescript
import { FetchAction } from '@isdk/ai-tools';
import { LoginAction } from './path/to/LoginAction';

FetchAction.register(LoginAction);
```

**Step 3: Use your `LoginAction` in scripts**

Now, your action script becomes much cleaner and more semantic:

```json
{
  "actions": [
    {
      "id": "login",
      "params": {
        "username": "testuser",
        "password": "password123",
        "userSelector": "#username",
        "passSelector": "#password",
        "submitSelector": "button[type=submit]"
      }
    }
  ]
}
```

## 4. Advanced Feature: Collectors

A Collector is a powerful mechanism that allows a **main Action** to run one or more **child Actions** during its execution to collect data in a parallel, event-driven manner.

### Core Concepts

Collectors are defined in the `collectors` array of a main Action. Their execution is event-driven:

* `activateOn`: One or more event names. When any of these events is triggered for the first time, the collector becomes "active" and its `onBeforeExec` hook is called.
* `collectOn`: One or more event names. Whenever these events are triggered, the collector executes its `onExecute` core logic.
* `deactivateOn`: One or more event names. When any of these events is triggered for the first time, the collector becomes "deactivated," its `onAfterExec` hook is called, and it stops all listening.
* `storeAs`: A string key used to store the collected results in `context.outputs`. All results are collected into an array.

**Special Rule**: If a collector is not configured with any `On` events, it will execute its `onExecute` logic once when the main Action's `end` event is triggered.

### Applicable Scenarios for Collectors

It is worth noting that while any Action can technically be used as a collector, it is only meaningful for **Actions whose purpose is to return data**. For example, Actions like `getContent`, `extract` (to extract content), or `queryData` are ideal choices for collectors.

Conversely, using an Action that performs a page interaction but has no return value (like `click` or `fill`) as a collector is pointless, as it cannot "collect" any useful information. Therefore, when designing or choosing an Action to be a collector, ensure its core responsibility is to **query and return data**.

### Usage Example

**Scenario**: Visit a blog page and, after the page has loaded, collect all the hyperlinks (`href` from `<a>` tags).

For this, we need an atomic action that can extract an element's attribute, which we'll call `extract` (a data-returning action).

```json
{
  "actions": [
    {
      "id": "goto",
      "params": { "url": "https://example.com/blog/my-post" },
      "collectors": [
        {
          "id": "extract", // The collector itself is an Action
          "name": "linkCollector", // An alias
          "params": {
            "selector": "a",
            "attribute": "href" // Assuming the extract Action can get a specific attribute
          },
          "storeAs": "allLinks" // Store all collected hrefs into context.outputs.allLinks
          // No `On` events are defined here
        }
      ]
    }
  ]
}
```

**Execution Flow**:

1. The main `goto` Action begins execution.
2. The `installCollectors` method is called, and `linkCollector` is initialized.
3. Since `linkCollector` has no triggers like `collectOn`, it defaults to waiting for the main `goto` action to complete.
4. `goto` successfully loads the page and fires its internal `action:goto.end` event.
5. `linkCollector` listens for this event and executes its `onExecute` logic (extracting the `href` from all `<a>` tags).
6. The results from the `extract` Action are automatically pushed into the `context.outputs.allLinks` array.
7. The process finishes, and `allLinks` now contains all the links from the page.

## 5. How to Extend (For Developers)

As a library developer, your primary responsibility is to enrich the **atomic Action** ecosystem.

### a. Adding a New Atomic Action

1. **Define the Capability in the Engine:** Add a new abstract method to `FetchEngine` in `src/engine/base.ts` (e.g., `abstract focus(params: { selector: string }): Promise<void>`), and implement it in the concrete engines (`Cheerio`, `Playwright`).
2. **Create the Action Class:** Create a new Action class file, e.g., `FocusAction.ts`.
3. **Implement `onExecute`:**
    * If it's a simple delegation, use the `delegateToEngine` helper.

    ```typescript
    async onExecute(context: FetchContext, options?: BaseFetchActionOptions): Promise<void> {
      await this.delegateToEngine(context, 'focus', options?.params);
    }
    ```

    * If it has more complex logic (like `goto`), write the implementation manually.
4. **Register the Action:** Call `FetchAction.register(FocusAction)` at the end of the file.

## 6. Action Lifecycle

The `FetchAction` base class provides lifecycle hooks that allow injecting custom behavior before and after the core logic of an Action executes.

* `protected onBeforeExec?()`: Called before `onExecute`.
* `protected onAfterExec?()`: Called after `onExecute`.

For Actions that need to manage complex state or resources, you can implement these hooks. Generally, for composite actions, writing the logic directly in `onExecute` is sufficient.
