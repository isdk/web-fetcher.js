[**@isdk/web-fetcher**](../README.md)

***

[@isdk/web-fetcher](../globals.md) / EvaluateActionOptions

# Interface: EvaluateActionOptions

Defined in: [packages/web-fetcher/src/engine/base.ts:178](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L178)

Options for the [FetchEngine.evaluate](../classes/FetchEngine.md#evaluate) action, specifying the function to execute and its arguments.

## Remarks

This action allows executing custom JavaScript logic within the page context.

**Execution Environments:**
- **`browser` mode (Playwright)**: Executes directly in the real browser's execution context.
- **`http` mode (Cheerio)**: Executes in a Node.js sandbox using `newFunction`. It provides a mocked browser environment
  including `window`, `document` (with `querySelector`, `querySelectorAll`, etc.), and `console`.

**Navigation Handling:**
If the executed code modifies `window.location.href` (or calls `assign()`/`replace()`), the engine will
automatically detect the change, trigger a navigation, and wait for the new page to load before resolving the action.

## Examples

```json
{
  "action": "evaluate",
  "params": {
    "fn": "([a, b]) => a + b",
    "args": [1, 2]
  }
}
```

```json
{
  "action": "evaluate",
  "params": {
    "fn": "({ x, y }) => x * y",
    "args": { "x": 6, "y": 7 }
  }
}
```

## Properties

### args?

> `optional` **args**: `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:199](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L199)

Data to pass to the function.

#### Remarks

This value is passed as the first and only argument to the function defined in [fn](#fn).
Recommended to use an array or object for multiple values.

***

### fn

> **fn**: `string` \| (...`args`) => `any`

Defined in: [packages/web-fetcher/src/engine/base.ts:191](https://github.com/isdk/web-fetcher.js/blob/1f80c3c783d0455bd4ff73248c57c2c39ab9f7c9/src/engine/base.ts#L191)

The function or expression to execute.

#### Remarks

Can be:
1. A function object (only available when using the API directly).
2. A string containing a function definition, e.g., `"async (args) => { ... }"`
3. A string containing a direct expression, e.g., `"document.title"`

**Note:** When using a function, it receives exactly ONE argument: the value provided in [args](#args).
Use destructuring to handle multiple parameters.
