# 📜 Action Script Architecture

English | [简体中文](./README.action.cn.md)

> This document details the architecture, design philosophy, and usage of the Action Script system within `@isdk/web-fetcher`. It is intended to help developers maintain and extend the system, and to help users efficiently build automation tasks.

## 🎯 1. Overview

The core goal of the Action Script system is to provide a **declarative, engine-agnostic** way to define and execute a series of web interactions.

The system is built on two fundamental concepts:

* **⚛️ Atomic Actions:** Built into the library, these represent a single, indivisible operation and are the basic "atoms" that make up all complex processes. Examples: `goto`, `click`, `fill`.
* **🧩 Composite Actions:** Created by the library user, these represent a complex operation with business semantics, composed of multiple atomic actions. This is the essence of the architecture, encouraging users to encapsulate low-level operations into higher-level "molecules" that are easier to understand and reuse. Examples: `login`, `search`, `addToCart`.

This approach allows users to describe a complete business process with intuitive semantics, while hiding the specific, engine-related implementation details in the underlying layers.

---

## 🛠️ 2. Core Concepts

### `FetchAction` (Base Class)

`FetchAction` is the abstract base class for all Actions. It defines the core elements of an Action:

* `static id`: The unique identifier for the Action, e.g., `'click'`. In Action Script, you can use `id`, `name`, or `action` to specify this identifier.
* `static returnType`: The type of the result returned after the Action executes, e.g., `'none'`, `'response'`.
* `static capabilities`: Declares the capability level of this Action in different engines (`http`, `browser`), such as `native`, `simulate`, or `noop`.
* `static register()`: A static method to register the Action class in a global registry, allowing it to be dynamically created by its `id`.

### `onExecute` (Core Logic)

Every `FetchAction` subclass must implement the `onExecute` method. This is where an Action defines its behavior.

### `delegateToEngine` (Delegation Helper)

To simplify the creation of **atomic actions**, the `FetchAction` base class provides a protected helper method, `delegateToEngine`. It forwards the call to the corresponding method on the active engine, passing along any arguments. This allows actions to be a thin wrapper around engine capabilities.

**Example: The `fill` Action using `delegateToEngine`**

```typescript
// src/action/definitions/fill.ts
export class FillAction extends FetchAction {
  // ...
  async onExecute(context: FetchContext, options?: BaseFetchActionProperties): Promise<void> {
    const { selector, value, ...restOptions } = options?.params || {};
    if (!selector) throw new Error('Selector is required for fill action');
    if (value === undefined) throw new Error('Value is required for fill action');
    // selector, value, and restOptions are passed as arguments to engine.fill()
    await this.delegateToEngine(context, 'fill', selector, value, restOptions);
  }
}
```

---

## 🚀 3. How to Use (For Users)

Users define a complete automation workflow via a JSON-formatted `actions` array.

### Using Atomic Actions

For simple, linear workflows, you can use a list of the library's built-in atomic actions directly.

> **💡 Tip**: You can use `action` or `name` as an alias for `id`, and `args` as an alias for `params`.

**Example: Searching for "gemini" on Google**

```json
{
  "actions": [
    { "action": "goto", "args": { "url": "https://www.google.com" } },
    { "action": "fill", "args": { "selector": "textarea[name=q]", "value": "gemini" } },
    { "action": "submit", "args": { "selector": "form" } }
  ]
}
```

### Built-in Atomic Actions

The library provides a set of essential atomic actions to perform common web interactions.

#### `goto`

Navigates the browser to a new URL.

* **`id`**: `goto`
* **`params`**:
  * `url` (string): The URL to navigate to.
  * ...other navigation options like `waitUntil`, `timeout` which are passed to the engine.
* **`returns`**: `response`

#### `click`

Clicks on an element specified by a selector.

* **`id`**: `click`
* **`params`**:
  * `selector` (string): A CSS selector to identify the element to click.
* **`returns`**: `none`

#### `fill`

Fills an input field with a specified value.

* **`id`**: `fill`
* **`params`**:
  * `selector` (string): A selector for the input element.
  * `value` (string): The text to fill into the element.
* **`returns`**: `response`

> **Note**: The behavior of the returned content differs between engines.
>
> * **`cheerio`**: This engine directly manipulates its internal HTML representation, so the returned content will include the filled value.
> * **`playwright`**: This engine returns the rendered HTML of the page (similar to `document.documentElement.outerHTML`). However, when `page.fill()` updates an input, it changes the input's internal `value` property. This property is not always serialized back to the `value` attribute in the HTML source. As a result, the filled value will **not** be visible in the HTML returned by `page.content()`.

#### `submit`

Submits a form.

* **`id`**: `submit`
* **`params`**:
  * `selector` (string, optional): A selector for the form element.
* **`returns`**: `none`

#### `waitFor`

Pauses execution to wait for one or more conditions to be met.

In `browser` mode, if multiple conditions are provided, they are awaited sequentially. For example, it will first wait for the selector to appear, then wait for the network to be idle, and **finally** wait for the specified duration (`ms`).

* **`id`**: `waitFor`
* **`params`**: An object specifying the wait condition, which can contain one or more of the following keys:
  * **`selector`** (string): Waits for an element matching the selector to appear on the page. Supported only in `browser` mode.
  * **`networkIdle`** (boolean): Waits until the network is idle (i.e., no new network requests for a period of time). Supported only in `browser` mode.
  * **`ms`** (number): Waits for the specified number of milliseconds **after** other conditions are met. Supported by both engines.
* **`returns`**: `none`

> **⚠️ Critical Distinction: `ms` vs Timeout**
>
> Do not confuse the **`ms`** parameter with a timeout setting.
>
> * **`ms` (Duration)**: This forces the script to sleep/pause for a fixed amount of time. If used with `selector`, it adds an **extra delay** after the element is found.
> * **Timeout (Deadline)**: The maximum time the script will wait for a condition (like `selector` or `networkIdle`) to be met before failing is controlled by the session-level **`timeoutMs`** option (default is usually 30s), not this `ms` parameter.

#### `pause`

Pauses the execution of the Action Script to allow for manual user intervention (e.g., solving a CAPTCHA).

This action **requires** an `onPause` callback handler to be provided in the `fetchWeb` options. When triggered, this action calls the `onPause` handler and waits for it to complete.

* **`id`**: `pause`
* **`params`**:
  * `selector` (string, optional): If provided, the action will only pause if an element matching this selector exists.
  * `attribute` (string, optional): Used in conjunction with `selector`. If provided, the action will only pause if the element exists AND has the specified attribute.
  * `message` (string, optional): A message that will be passed to the `onPause` handler, which can be used to display prompts to the user.
* **`returns`**: `none`

**Example: Handling a CAPTCHA in Google Search**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://www.google.com/search?q=gemini" } },
    {
      "id": "pause",
      "params": {
        "selector": "#recaptcha",
        "message": "Google CAPTCHA detected. Please solve it in the browser and press Enter to continue."
      }
    },
    { "id": "waitFor", "params": { "selector": "#search" } }
  ]
}
```

**`onPause` Handler Example:**

```typescript
// In your code that calls fetchWeb
import { fetchWeb } from '@isdk/web-fetcher';
import readline from 'readline';

const handlePause = async ({ message }) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => {
    rl.question(message || 'Execution paused. Press Enter to continue...', () => {
      rl.close();
      resolve();
    });
  });
};

await fetchWeb({
  // ...,
  engine: 'browser',
  engineOptions: { headless: false },
  onPause: handlePause,
  actions: [
    // ... your actions
  ]
});
```

#### `getContent`

Retrieves the full content of the current page state.

* **`id`**: `getContent`
* **`params`**: (none)
* **`returns`**: `response`

#### `extract`

Extracts structured data from the page using a powerful and declarative Schema. This is the core Action for data collection.

* **`id`**: `extract`
* **`params`**: An `ExtractSchema` object that defines the extraction rules.
* **`returns`**: `any` (the extracted data)

##### Detailed Explanation of Extraction Schema

The `params` object itself is a Schema that describes the data structure you want to extract.

###### 1. Extracting a Single Value

The most basic extraction. You can specify a `selector` (CSS selector), an `attribute` (the name of the attribute to extract), a `type` (string, number, boolean, html), and a `mode` (text, innerText).

```json
{
  "id": "extract",
  "params": {
    "selector": "h1.main-title",
    "type": "string",
    "mode": "innerText"
  }
}
```

> **Extraction Modes:**
> * **`text`** (default): Extracts the `textContent` of the element, which includes all text within the element and its descendants, but preserves the whitespace and newlines as they appear in the HTML source (unrendered).
> * **`innerText`**: Extracts the rendered text of the element, which respects CSS styling and collapses multiple spaces, while preserving meaningful line breaks (e.g., from `<br>` or block-level elements). This mode is better for getting what a user actually sees on the page.

> The example above will extract the text content of the `<h1>` tag with the class `main-title` using the `innerText` mode.

###### 2. Extracting an Object

Define a structured object using `type: 'object'` and the `properties` field.

```json
{
  "id": "extract",
  "params": {
    "type": "object",
    "selector": ".author-bio",
    "properties": {
      "name": { "selector": ".author-name" },
      "email": { "selector": "a.email", "attribute": "href" }
    }
  }
}
```

###### 3. Extracting an Array (Convenient Usage)

Extract a list using `type: 'array'`. To make the most common operations simpler, we provide some convenient usages.

* **Extracting an Array of Texts (Default Behavior)**: When you want to extract a list of text, just provide the selector and omit `items`. This is the most common usage.

    ```json
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": ".tags li"
      }
    }
    ```

    > The example above will return an array of the text from all `<li>` tags, e.g., `["tech", "news"]`.

* **Extracting an Array of Attributes (Shortcut)**: When you only want to extract a list of attributes (e.g., all `href`s from links), there's no need to nest `items` either. Just declare `attribute` directly in the `array` definition.

    ```json
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": ".gallery img",
        "attribute": "src"
      }
    }
    ```

    > The example above will return an array of the `src` attributes from all `<img>` tags.

*   **Zip Strategy (Container Extraction)**: When the `selector` points to a **container** (like a search results div) rather than individual items, and the `items` schema defines selectors for multiple fields, the engine can automatically "zip" these fields into objects.

    ```json
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": "#search-results",
        "items": {
          "title": { "selector": ".item-title" },
          "link": { "selector": "a.item-link", "attribute": "href" }
        }
      }
    }
    ```

    > In this mode, the engine finds all `.item-title` and all `a.item-link` within the `#search-results` container and pairs them up by index.

###### 4. Zip Strategy Configuration

The Zip strategy can be fine-tuned using the `zip` property:

*   **`zip`** (boolean | object):
    *   `true` (default if Container Pattern detected): Enables Zip strategy with strict alignment.
    *   `false`: Disables Zip strategy, falling back to standard item-by-item extraction.
    *   **`strict`** (boolean, default: `true`): If `true`, throws an error if fields have different match counts (to prevent data misalignment).
    *   **`inference`** (boolean, default: `false`): If `true`, when field counts don't match, the engine tries to automatically identify the most likely "item wrapper" element (e.g., a `.result-card` div) by traversing up the DOM from the matched fields.

**Example: Robust extraction with inference**

```json
{
  "id": "extract",
  "params": {
    "type": "array",
    "selector": "#results-container",
    "zip": { "inference": true },
    "items": {
      "title": { "selector": "h3" },
      "price": { "selector": ".price-tag" }
    }
  }
}
```

> If some items are missing a price tag, the `inference` mode will try to find the item boundaries to ensure titles and prices remain correctly paired, returning `null` for missing prices instead of misaligning the list.

###### 5. Implicit Object Extraction (Simplest Syntax)

For simpler object extraction, you can omit `type: 'object'` and `properties`. If the schema object contains keys that are not reserved keywords (like `selector`, `attribute`, `type`, etc.), it is treated as an object schema where keys are property names.

```json
{
  "id": "extract",
  "params": {
    "selector": ".author-bio",
    "name": { "selector": ".author-name" },
    "email": { "selector": "a.email", "attribute": "href" }
  }
}
```

> This is equivalent to Example 2 but more concise.

###### 6. Precise Filtering: `has` and `exclude`

You can use the `has` and `exclude` fields in any schema that includes a `selector` to precisely control element selection.

* `has`: A CSS selector to ensure the selected element **must contain** a descendant matching this selector.
* `exclude`: A CSS selector to **exclude** elements matching this selector from the results.

**Complete Example: Extracting links of articles that have an image and are not marked as "draft"**

```json
{
  "actions": [
    { "id": "goto", "params": { "url": "https://example.com/articles" } },
    {
      "id": "extract",
      "params": {
        "type": "array",
        "selector": "div.article-card",
        "has": "img.cover-image",
        "exclude": ".draft",
        "items": {
          "selector": "a.title-link",
          "attribute": "href"
        }
      }
    }
  ]
}
```

> The `extract` action above will:
>
> 1. Find all `div.article-card` elements.
> 2. Filter them to only include those that contain an `<img class="cover-image">`.
> 3. Further filter the results to exclude any that also have the `.draft` class.
> 4. For each of the remaining `div.article-card` elements, find its descendant `a.title-link` and extract the `href` attribute.

### Building High-Level Semantic Actions via "Composition"

This is the recommended best practice for **users** to encapsulate and reuse business logic.

**Scenario: Creating a reusable `LoginAction`**

1. **Define `LoginAction.ts` in your project:**

    ```typescript
    import { FetchContext, FetchAction, BaseFetchActionOptions } from '@isdk/web-fetcher';

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

2. **Register this custom Action when your application starts:**

    ```typescript
    import { FetchAction } from '@isdk/web-fetcher';
    import { LoginAction } from './path/to/LoginAction';

    FetchAction.register(LoginAction);
    ```

3. **Use your `LoginAction` in scripts:**

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

---

## 🧲 4. Advanced Feature: Collectors

A Collector is a powerful mechanism that allows a **main Action** to run one or more **child Actions** during its execution to collect data in a parallel, event-driven manner.

### Core Concepts

Collectors are defined in the `collectors` array of a main Action. Their execution is event-driven:

* `activateOn`: Event(s) to activate the collector.
* `collectOn`: Event(s) that trigger the collector's `onExecute` logic.
* `deactivateOn`: Event(s) to deactivate the collector.
* `storeAs`: A key to store the collected results in `context.outputs`.

> **ℹ️ Special Rule**: If a collector has no `On` events configured, it will execute its `onExecute` logic once when the main Action's `end` event is triggered.

### Applicable Scenarios for Collectors

> **⚠️ Important**: While any Action can technically be used as a collector, it is only meaningful for **Actions whose purpose is to return data** (e.g., `getContent`, `extract`). Using an action like `click` or `fill` as a collector is pointless as it doesn't "collect" anything.

### Usage Example

**Scenario**: Visit a blog page and collect all hyperlinks (`href` from `<a>` tags) after the page has loaded.

```json
{
  "actions": [
    {
      "id": "goto",
      "params": { "url": "https://example.com/blog/my-post" },
      "collectors": [
        {
          "id": "extract",
          "name": "linkCollector",
          "params": {
            "type": "array",
            "selector": "a",
            "attribute": "href"
          },
          "storeAs": "allLinks"
        }
      ]
    }
  ]
}
```

**Execution Flow**:

1. The main `goto` Action begins.
2. The `linkCollector` is initialized.
3. Since it has no triggers, it waits for the `goto` action to complete.
4. `goto` loads the page and fires its `action:goto.end` event.
5. `linkCollector` hears this event and executes, extracting the `href` from all `<a>` tags.
6. The results are pushed into the `context.outputs.allLinks` array.

---

## 🧑‍💻 5. How to Extend (For Developers)

As a library developer, your primary responsibility is to enrich the **atomic Action** ecosystem.

### Adding a New Atomic Action

1. **Define the Capability in the Engine:** Add a new abstract method to `FetchEngine` in `src/engine/base.ts` and implement it in the concrete engines (`Cheerio`, `Playwright`).
2. **Create the Action Class:** Create a new file like `src/action/definitions/MyNewAction.ts`.
3. **Implement `onExecute`:** Use the `delegateToEngine` helper for simple cases.
4. **Register the Action:** Call `FetchAction.register(MyNewAction)` in your new file.

---

## 🔄 6. Action Lifecycle

The `FetchAction` base class provides lifecycle hooks that allow injecting custom behavior before and after the core logic of an Action executes.

* `protected onBeforeExec?()`: Called before `onExecute`.
* `protected onAfterExec?()`: Called after `onExecute`.

For Actions that need to manage complex state or resources, you can implement these hooks. Generally, for composite actions, writing the logic directly in `onExecute` is sufficient.
