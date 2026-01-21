# 🔍 Extract 操作深度指南 (The Data Surgeon's Manual)

[English](./README.action.extract.md) | 简体中文

`extract` 是 `@isdk/web-fetcher` 的灵魂。它不只是一个“抓取器”，更像是一个**智能转换器**，能把杂乱无章的 HTML 变成你想要的精美 JSON。

---

## ⚡ 1. 快速开始：简写魔法 (Shorthand Magic)

**场景**：结构简单的标准网页。当你只想快点看到结果，不想写长长的 JSON 配置时。

```json
{
  "action": "extract",
  "params": {
    "title": "h1",               // 把 h1 里的文字抓出来存为 'title'
    "link": { "selector": "a.main", "attribute": "href" }, // 精确提取链接属性
    "tags": { "type": "array", "selector": ".tag-item" }   // 一口气抓下一组标签
  }
}
```

---

## 📄 2. 提取基本值：手术镊子 (The Tweezers)

**场景**：处理网页上具体的某一个数据点，如价格、标题或 ID。

### 镊子参数解析 (Value Properties)

* **`selector`**: CSS 选择器，告诉镊子要去哪里夹东西。
* **`type`**: 自动类型转换。支持 `string`, `number` (自动剔除货币符号、单位，只留数字), `boolean`, `html`。
* **`mode`**: 提取的模式。
  * `innerText`: **(强烈推荐使用)** 就像人眼观察一样，它只取网页上可见的文字，并自动处理换行，过滤掉隐藏的 HTML 噪音。
  * `text`: 原始文本内容，对应源码里的 `textContent`，包含隐藏字符。
  * `outerHTML`: 抓取包含标签自身的完整 HTML 代码。
* **`attribute`**: 如果你要抓的不是文字，而是属性（如 `href`, `src`），就在这里指定属性名。
* **`depth`**: 向上回溯。匹配到元素后，先向上跳 N 层父节点再提取（比如你想抓一个按钮的父容器上的 ID）。

**示例**：

```json
{
  "selector": ".price-tag",
  "type": "number",       // 自动把 "￥99.00" 转换成数字 99
  "mode": "innerText",    // 确保拿到的是干净的文字
  "attribute": "data-v",  // 提取 data-v 属性
  "depth": 1              // 抓取该元素父节点的属性
}
```

---

## 📦 3. 提取对象：便当盒 (The Bento Box)

**场景**：当你需要把多个相关的字段（如用户的“姓名”、“头像”、“简介”）打包在一起，形成一个完整的结构时。

### 便当盒参数解析 (Object Properties)

* **`type: "object"`**: 明确告诉引擎，这是一个需要打包的对象。
* **`selector`**: **对象的根容器**。这非常重要！内部所有属性的 `selector` 都会相对于这个容器查找。如果你把容器定在 `.user-card`，内部写 `img` 就会只抓这张卡片里的图。
* **`properties`**: **核心配置**。在这里定义你想要的 JSON 键名（Key）和对应的提取规则。
* **`required`**: 如果你认为某个字段是“灵魂”，抓不到它这个对象就没意义，请设为 `true`。此时若提取失败，整个对象会返回 `null`。
* **`depth`**: 用于触发“向上探索”逻辑的深度（详见进阶章节）。

**示例：打包用户信息**

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

> **💡 透明盒子 (隐式对象)**：如果你省略 `type: "object"` 且不写 `selector`，这个盒子就成了“透明的”。如果内部所有字段都抓不到结果，整个盒子会自动消失。在过滤列表中的广告或空项时非常神奇。

---

## 📑 4. 提取数组：分拣模式 (The Sorting Machines)

**场景**：处理成排出现的数据，如搜索结果列表、新闻瀑布流、或一组分类标签。

### 分拣机参数解析 (Array Properties)

* **`type: "array"`**: 明确声明你要提取的是一个列表。
* **`selector`**: **扫描范围**。在默认模式下，它匹配每一个项目的“外壳”；在平铺模式下，它匹配整个大的列表容器。
* **`items`**: **每一项的图纸**。注意，数组里用的是 `items` 而不是 `properties`。它定义了每一行数据长什么样。
* **`mode`**: 决定分拣机的工作模式。
  * `"nested"`: (默认) 每一个项目都有自己的“格子”（容器）。
  * `"columnar"`: 数据按列排布，没有行容器（像 Excel 表格）。
  * `"segmented"`: 数据完全平铺，通过“锚点”来切分段落。
* **`limit`**: 限制抓取的最大条数，防止数据量过大。
* **`inference`**: 启发式推断。当列表结构不规范时，开启它可以让引擎自动尝试修正错位。

### 4.1 Nested (蛋托模式)：最稳定、首选

**场景**：每个项目都被包裹在 `<li>` 或 `.item` 这种容器里。这是最稳、性能最好的选择。

```json
{
  "type": "array",
  "selector": ".product-list .item", // 匹配每一个产品的外壳
  "items": {
    "name": "h3",
    "price": ".price"
  }
}
```

### 4.2 Columnar (列对齐模式)：处理表格类平铺

**场景**：数据像表格一样。左边一列是标题，右边一列是价格，但它们没有共同的父节点包裹。
**广播功能 (Broadcasting)**：如果某个字段在每一项里都一样（如列表的分类），你只需在总容器提取一次，它会自动“广播”给每一行。

```json
{
  "type": "array",
  "selector": "#table-container",
  "mode": "columnar",
  "items": {
    "name": ".title-cols",
    "date": "" // selector 为空，自动广播总容器里的日期信息
  }
}
```

### 4.3 Segmented (切割模式)：处理无序平铺

**场景**：页面结构极其糟糕，所有内容都是兄弟节点并排，只能靠某个标志（如 `h2` 标题）来区分段落。

```json
{
  "type": "array",
  "selector": ".content-body",
  "mode": { "type": "segmented", "anchor": "h2" }, // 看到 h2 就切一刀
  "items": {
    "section_title": "h2",
    "text": "p"
  }
}
```

---

## 🛡️ 5. 质量控制：过滤器与筛子 (Filters & Sieves)

**场景**：抓取时混入了广告、缺货提示或者不需要的垃圾项。

* **`has`**：**精华过滤器**。只有包含特定子元素时才抓取。例如：`"has": ".promo-tag"` 表示只有带优惠标签的商品我才要。
* **`exclude`**：**垃圾剔除器**。排除匹配的元素。例如：`"exclude": ".is-advertisement"`。
* **`strict`**：**强迫症模式**。一旦发现必填项缺失，直接报错停机，而不是默默返回 `null`。

---

## 🧠 6. 核心进阶：边界与作用域控制 (Boundary Mastery)

这是处理那些没有 ID、没有类名、结构平铺的烂网页的“手术刀”。

### 6.1 顺序切片：解决“双胞胎标签”定位难题

* **痛点**：网页上一排 `<span>` 或 `p`，长得一模一样。你用同一个选择器去抓，每次都只能抓到第一个。
* **解决方案**：`relativeTo: "previous"` (相对于上一个)。
* **原理解析**：引擎会像“读书”一样记住上次读到了哪。当第一个字段提取完后，引擎会夹个“书签”。提取下一个字段时，引擎会**从书签之后**开始找。
* **关键点**：由于这是按顺序寻找，建议显式设置 `order: ["name", "job"]` 来确保引擎不会因为 JSON 键名的乱序而导致书签位置错乱，虽然大多数js引擎是按照对象keys的声明顺序来排序的。
* **示例场景**：

    ```html
    <p>姓名</p> <span>张三</span>
    <p>职位</p> <span>经理</span>
    ```

* **配置示例**：

    ```json
    {
      "relativeTo": "previous",
      "order": ["k1", "v1", "k2", "v2"], // 强制顺序，防止书签错位
      "properties": {
        "k1": "p",    // 抓到第一个 p (姓名)
        "v1": "span", // 从 k1 之后找，抓到张三
        "k2": "p",    // 从 v1 之后找，抓到第二个 p (职位)
        "v2": "span"  // 从 k2 之后找，抓到经理
      }
    }
    ```

### 6.2 分段隔离与 LCA：筑起“逻辑围墙”

* **痛点**：平铺结构中提取列表，如果没有墙，Item 1 的搜索可能会越界抓到 Item 2 的内容。
* **解决方案**：使用 `mode: "segmented"` 配合 `anchor`。
* **原理解析**：引擎计算两个锚点之间的“最小公共祖先 (LCA)”，并逻辑上筑起围墙，确保搜索范围死死锁在 Item 内部。
* **示例场景**：

    ```html
    <h2 class="title">文章1</h2>
    <p class="summary">摘要1</p>
    <h2 class="title">文章2</h2>
    <p class="summary">摘要2</p>
    ```

* **配置示例**：

    ```json
    {
      "type": "array",
      "mode": { "type": "segmented", "anchor": "h2.title" }, // 以 h2 为墙
      "items": {
        "title": "h2",
        "desc": "p"
      }
    }
    ```

### 6.3 向上探索 (Bubble-up)：给提取一次“后悔药”

* **痛点**：作用域定在卡片内部，但关键数据（如卡片 ID）在卡片外面的父容器上。
* **解决方案**：设置 `depth` (向上回退层数) 并配合 `required`。
* **原理解析**：
    1. 引擎在当前范围内找必填项，没找到。
    2. 它会根据 `depth: 1` 自动把视野“向后退一步”，退到父节点。
    3. 在更大的视野里重新扫描，从而找齐那些“由于视野太窄而漏掉”的数据。
* **示例场景**：

    ```html
    <div class="wrapper" data-id="ID_001">
      <div class="content-box">
        <h3 class="title">产品名称</h3>
      </div>
    </div>
    ```

* **配置示例**：

    ```json
    {
      "selector": ".content-box", // 初始视角太窄
      "depth": 1,                 // 允许退后一级
      "properties": {
        "product_id": {
          "selector": "..",        // ".." 代表向上找父节点
          "attribute": "data-id",
          "required": true         // 没找到 ID 就触发向上回溯
        },
        "name": "h3"
      }
    }
    ```

---

## 💡 7. 最佳实践提示

1. **容器优先**：只要 HTML 里有 `.item` 这种包裹容器，永远优先选择默认的 `Nested` 模式，这是性能和稳定性最好的选择。
2. **innerText 推荐作为首选**：在 90% 的场景下，它都比 `text` 好用，因为它拿到的数据最干净，且能自动处理换行。
3. **遇到平铺找锚点**：当你看到一堆兄弟节点并排且没有外壳包裹时，第一时间就该想到 `segmented` + `anchor` 的组合。
4. **善用 required 过滤空数据**：如果你抓到一个列表，有些项是空的（比如预留位），给核心字段加上 `required: true`，那些空项就会自动变成 `null`，方便你在代码里过滤。
5. **调试必备：先看 Scope**：如果抓不到数据，先检查是不是 `selector` 写得太死，或者尝试把 `depth` 调大一点。
