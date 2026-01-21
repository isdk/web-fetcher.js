# 🔍 Extract Action Deep Dive (The Data Surgeon's Manual)

[简体中文](./README.action.extract.cn.md) | English

`extract` is the heart of `@isdk/web-fetcher`. It's not just a "scraper"; it's an **intelligent converter** that transforms chaotic HTML into polished, ready-to-use JSON.

---

## ⚡ 1. Quick Start: Shorthand Magic

**Scenario**: Standard webpages with simple structures. Get results fast without long JSON configurations.

```json
{
  "action": "extract",
  "params": {
    "title": "h1",               // Grab h1 text into 'title'
    "link": { "selector": "a.main", "attribute": "href" }, // Precision attribute extraction
    "tags": { "type": "array", "selector": ".tag-item" }   // Grab a group of tags at once
  }
}
```

---

## 📄 2. Basic Value Extraction: The Tweezers

**Scenario**: Processing single data points like prices, titles, or IDs.

### Value Properties Analysis

* **`selector`**: CSS selector—tells the tweezers where to grab.
* **`type`**: Automatic casting. Supports `string`, `number` (auto-removes currency/units), `boolean`, `html`.
* **`mode`**: Extraction mode.
  * `innerText`: **(Highly Recommended)** Sees like a human, capturing only visible text and handling line breaks/noise.
  * `text`: Raw `textContent` from the source, including hidden characters.
  * `outerHTML`: Captures the full HTML, including the element's tags.
* **`attribute`**: If you need an attribute (e.g., `href`, `src`) instead of text, specify it here.
* **`depth`**: Bubble up. Once matched, move up N parent levels before extracting (useful for grabbing IDs from parent containers).

**Example**:

```json
{
  "selector": ".price-tag",
  "type": "number",       // Transforms "￥99.00" to 99
  "mode": "innerText",    // Ensures clean text
  "attribute": "data-v",  // Grabs the data-v attribute
  "depth": 1              // Grabs from the parent element
}
```

---

## 📦 3. Object Extraction: The Bento Box

**Scenario**: Pack related fields (e.g., name, avatar, bio) into a structured JSON object.

### Object Properties Analysis

* **`type: "object"`**: Declares the object structure.
* **`selector`**: **The root container**. This is crucial! All internal property selectors are searched relative to this container.
* **`properties`**: **Core Config**. Define your JSON keys and their respective extraction rules.
* **`required`**: If a field is essential, set this to `true`. If extraction fails, the entire object returns `null`.
* **`depth`**: Depth used to trigger "bubble-up" logic (see advanced chapter).

**Example: Packing User Info**

```json
{
  "type": "object",
  "selector": ".user-card",
  "properties": {
    "name": { "selector": ".username", "required": true },
    "bio": ".user-description",
    "avatar": { "selector": "img.avatar", "attribute": "src" }
  }
}
```

> **💡 Transparent Box (Implicit Object)**: If you omit `type: "object"` and don't provide a `selector`, the box becomes "transparent." If all internal fields fail to extract, the entire box disappears. This is magical for filtering ads or empty items in a list.

---

## 📑 4. Array Extraction: The Sorting Machines

**Scenario**: Handle repeating data like search results, news feeds, or tag clouds.

### Array Properties Analysis

* **`type: "array"`**: Declares a list extraction.
* **`selector`**: **Scanning scope**. In default mode, it matches the "wrapper" of each item; in flat modes, it matches the entire list container.
* **`items`**: **The Blueprint**. Defines what each row looks like. (Note: arrays use `items`, not `properties`).
* **`mode`**: Choose the sorting strategy:
  * `"nested"`: (Default) Every item has its own "slot" (container).
  * `"columnar"`: Data is laid out in columns without row containers (like Excel).
  * `"segmented"`: Data is completely flat, sliced into segments using "anchors."
* **`limit`**: Restricts the maximum number of items to prevent data bloat.
* **`inference`**: Heuristic inference. Enable this to let the engine automatically correct misalignments in messy lists.

### 4.1 Nested (The Egg Carton): The Stable Standard

**Scenario**: Items are wrapped in `<li>` or `.item` containers. This is the most stable and performant choice.

```json
{
  "type": "array",
  "selector": ".product-list .item", // Matches the shell of each product
  "items": {
    "name": "h3",
    "price": ".price"
  }
}
```

### 4.2 Columnar: Flat Alignment

**Scenario**: Data laid out like a spreadsheet. One column for titles, one for prices, but no shared parent for the row.
**Broadcasting**: If a field is constant across all items (e.g., category), extract it once from the main container, and it will "broadcast" to every row.

```json
{
  "type": "array",
  "selector": "#table-container",
  "mode": "columnar",
  "items": {
    "name": ".title-cols",
    "date": "" // Empty selector broadcasts date info from the main container
  }
}
```

### 4.3 Segmented: Slicing the Unordered

**Scenario**: Terrible page structure where everything is siblings. You must rely on a marker (like an `h2` header) to define segments.

```json
{
  "type": "array",
  "selector": ".content-body",
  "mode": { "type": "segmented", "anchor": "h2" }, // Slice whenever an h2 is found
  "items": {
    "section_title": "h2",
    "text": "p"
  }
}
```

---

## 🛡️ 5. Quality Control: Filters & Sieves

**Scenario**: Filtering out ads, out-of-stock notices, or unwanted junk items.

* **`has`**: **The Essence Filter**. Only extract if it contains specific sub-elements. Example: `"has": ".promo-tag"` only keeps items with discount tags.
* **`exclude`**: **The Junk Remover**. Exclude matching elements. Example: `"exclude": ".is-advertisement"`.
* **`strict`**: **OCD Mode**. If a required field is missing, throw an error immediately instead of silently returning `null`.

---

## 🧠 6. Advanced Mastery: Scope & Boundary Control

Surgical solutions for messy, class-less, and flat-structured HTML.

### 6.1 Sequential Slicing: Solving "The Twin Tag" Problem

* **Pain Point**: A row of identical `<span>` or `p` tags. A simple selector only grabs the first one repeatedly.
* **Solution**: `relativeTo: "previous"`.
* **Mechanism**: The engine remembers where it left off. After extracting the first field, it leaves a "Bookmark." The next search starts **after that Bookmark**.
* **Key Point**: Since this is sequential, we recommend explicitly setting `order: ["name", "job"]` to ensure the bookmarks don't get mixed up due to JSON key ordering.
* **Example Scenario**:

    ```html
    <p>Name</p> <span>Alice</span>
    <p>Job</p> <span>Manager</span>
    ```

* **Example Config**:

    ```json
    {
      "relativeTo": "previous",
      "order": ["k1", "v1", "k2", "v2"], // Force order to prevent bookmark displacement
      "properties": {
        "k1": "p",    // Grabs 1st p (Name)
        "v1": "span", // Grabs Alice after k1
        "k2": "p",    // Grabs 2nd p (Job) after v1
        "v2": "span"  // Grabs Manager after k2
      }
    }
    ```

### 6.2 Segmented Isolation & LCA: Building "Fences" for Neighbors

* **Pain Point**: In flat structures, Item 1's search might bleed into Item 2's content without a boundary.
* **Solution**: Use `mode: "segmented"` with `anchor`.
* **Mechanism**: The engine calculates the "Lowest Common Ancestor (LCA)" between anchors and builds a logical fence, locking searches strictly within the item's territory.
* **Example Scenario**:

    ```html
    <h2 class="title">Article 1</h2>
    <p class="summary">Summary 1</p>
    <h2 class="title">Article 2</h2>
    <p class="summary">Summary 2</p>
    ```

* **Example Config**:

    ```json
    {
      "type": "array",
      "mode": { "type": "segmented", "anchor": "h2.title" }, // h2 as the fence
      "items": {
        "title": "h2",
        "desc": "p"
      }
    }
    ```

### 6.3 Bubble-up: The "Retry" Safety Net

* **Pain Point**: Data is just outside the locked scope (e.g., an ID on a parent container).
* **Solution**: Set `depth` and use `required`.
* **Mechanism**:
    1. The engine looks for a mandatory field in the current scope—fails.
    2. It automatically steps back (`depth: 1`) to the parent node.
    3. It rescans in the wider view to find missing data that was "just out of sight."
* **Example Scenario**:

    ```html
    <div class="wrapper" data-id="ID_001">
      <div class="content-box">
        <h3 class="title">Product Name</h3>
      </div>
    </div>
    ```

* **Example Config**:

    ```json
    {
      "selector": ".content-box",
      "depth": 1,
      "properties": {
        "product_id": {
          "selector": "..",        // ".." means look at parent
          "attribute": "data-id",
          "required": true         // Fails to trigger bubble-up
        },
        "name": "h3"
      }
    }
    ```

---

## 💡 7. Best Practice Tips

1. **Containers First**: If the HTML has `.item` wrappers, always prefer `Nested` mode—it's the stablest and fastest.
2. **innerText as Default**: In 90% of cases, it's better than `text` because it yields cleaner results and handles line breaks automatically.
3. **Flat Siblings? Use Anchors**: When you see siblings without a container shell, immediately think `segmented` + `anchor`.
4. **Leverage required for Filtering**: If some items in a list are empty (placeholders), mark core fields as `required: true`. They will automatically become `null`, making them easy to filter in your code.
5. **Debug Tip: Check the Scope**: If data is missing, check if your `selector` is too restrictive or try increasing the `depth`.
