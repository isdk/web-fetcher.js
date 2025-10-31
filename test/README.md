# Dynamic Engine Tests

This directory contains a dynamic, fixture-based test suite for the fetch engine. It's designed to easily test various engine behaviors by defining test cases in simple JSON and HTML files.

## How it Works

The test runner (`engine.fixtures.spec.ts`) automatically discovers test cases from the `fixtures/` directory. For each subdirectory inside `fixtures/`, it looks for a `fixture.json` file, which defines the test steps and expected outcomes.

It runs each test case against the specified engine(s) (`cheerio` and/or `playwright`), serving local HTML files from the test case's own directory.

## Adding a New Test Case

1. Create a new subdirectory under `test/fixtures/`, for example, `08-my-new-test`.
2. Inside the new directory, create a `fixture.json` file.
3. Create any necessary HTML files (e.g., `fixture.html`, `page2.html`) that your test will navigate to or use.
4. Run the tests. Your new test case will be automatically picked up.

## Test Environment

For each test case, a local Fastify web server is started. It serves the static HTML files from the test case's directory (e.g., `fixture.html`). The `goto` action's URL is automatically resolved to point to this local server, so you can simply use ` "/" ` or ` "/page2.html" ` in your `fixture.json`.

## `fixture.json` Structure

The `fixture.json` file defines a single test case. Here is its structure:

```json
{
  "title": "A descriptive title for the test case",
  "engine": "playwright",
  "skip": false,
  "only": false,
  "options": {
    "antibot": false
  },
  "actions": [
    { "action": "goto", "args": ["/"] },
    { "action": "extract", "args": [{ "type": "string", "selector": "#data" }] }
  ],
  "expected": {
    "statusCode": 200,
    "html": [
      { "contains": "some text" },
      { "not": { "contains": "another text", "caseInsensitive": true } }
    ],
    "data": { "equals": "expected data from extract" }
  }
}
```

### Top-level Properties

* `title` (string, required): The title of the test.
* `engine` (string, optional): Specify which engine to run the test on. Can be `"playwright"` (browser engine) or `"cheerio"` (HTTP engine). If omitted, the test runs on both engines.
* `skip` (boolean, optional): If `true`, this test case will be skipped.
* `only` (boolean, optional): If `true`, only test cases with this flag will be run.
* `options` (object, optional): Configuration options to pass to the `FetchEngine` instance.

### `actions`

An array of operations for the engine to perform in sequence.

* `action` (string): The name of a method on the `FetchEngine` class (e.g., `goto`, `click`, `extract`).
* `args` (array): The arguments to pass to the action method.

### `expected`

An object defining the assertions to make after all actions have been executed.

* `statusCode` (number): The expected HTTP status code of the final page.
* `finalUrl` (string): The expected final URL of the page (only the path is compared).
* `html` (any): Assertions to run against the full HTML content of the final page.
* `data` (any): Assertions to run against the result of the *last* action in the `actions` array.

## Assertion Syntax

The `html` and `data` fields in `expected` use a flexible syntax for defining assertions.

### 1. Implicit AND (Array)

You can provide an array of conditions. All conditions in the array must be met (logical AND). This is the recommended syntax for multiple conditions.

**Example:**

```json
"html": [
  { "contains": "Welcome" },
  { "not": { "contains": "Error" } }
]
```

### 2. Logical Operators

* **AND**: `{ "and": [condition1, condition2, ...] }`
* **OR**: `{ "or": [condition1, condition2, ...] }`
* **NOT**: `{ "not": { condition } }`

**Example:**

```json
"html": {
  "or": [
    { "contains": "Success" },
    { "contains": "Completed" }
  ]
}
```

### 3. Matchers

Matchers are the basic building blocks of assertions.

* **contains**: Checks if the value contains a substring.
  * `{ "contains": "some string" }`
  * `{ "contains": "some string", "caseInsensitive": true }`
* **equals**: Checks for deep equality. Useful for comparing the structured data returned from an `extract` action.
  * `{ "equals": { "key": "value" } }`
* **string**: A plain string is a shorthand for a `contains` check.
  * `"some string"` is equivalent to `{ "contains": "some string" }`
