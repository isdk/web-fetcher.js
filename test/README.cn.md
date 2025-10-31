# 动态引擎测试

此目录包含一个针对抓取引擎的、基于 fixture 的动态测试套件。它旨在通过在简单的 JSON 和 HTML 文件中定义测试用例,来轻松测试各种引擎行为。

## 工作原理

测试运行器 (`engine.fixtures.spec.ts`) 会自动从 `fixtures/` 目录中发现测试用例。对于 `fixtures/` 内的每个子目录,它都会查找一个 `fixture.json` 文件,该文件定义了测试步骤和预期结果。

它会针对指定的引擎(`cheerio` 和/或 `playwright`)运行每个测试用例,并从测试用例自己的目录中提供本地 HTML 文件。

## 添加新测试用例

1. 在 `test/fixtures/` 下创建一个新的子目录,例如 `08-my-new-test`。
2. 在新目录中,创建一个 `fixture.json` 文件。
3. 创建测试将导航到或使用的任何必要的 HTML 文件(例如 `fixture.html`, `page2.html`)。
4. 运行测试。您的新测试用例将被自动加载并执行。

## 测试环境

对于每个测试用例,都会启动一个本地的 Fastify Web 服务器。它用于提供测试用例目录中的静态 HTML 文件 (例如 `fixture.html`)。`goto` 操作的 URL 会被自动解析为指向此本地服务器的地址,因此您在 `fixture.json` 中只需使用 ` "/" ` 或 ` "/page2.html" ` 即可。

## `fixture.json` 结构

`fixture.json` 文件定义了一个单独的测试用例。其结构如下:

```json
{
  "title": "一个描述性的测试用例标题",
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
      { "contains": "一些文本" },
      { "not": { "contains": "另一些文本", "caseInsensitive": true } }
    ],
    "data": { "equals": "从 extract 返回的预期数据" }
  }
}
```

### 顶层属性

* `title` (string, 必需): 测试的标题。
* `engine` (string, 可选): 指定在其上运行测试的引擎。可以是 `"playwright"` (浏览器引擎) 或 `"cheerio"` (HTTP 引擎)。如果省略,测试将同时在两个引擎上运行。
* `skip` (boolean, 可选): 如果为 `true`,将跳过此测试用例。
* `only` (boolean, 可选): 如果为 `true`,则只会运行带有此标志的测试用例。
* `options` (object, 可选): 传递给 `FetchEngine` 实例的配置选项。

### `actions`

一个操作数组,供引擎按顺序执行。

* `action` (string): `FetchEngine` 类上的方法名称(例如 `goto`, `click`, `extract`)。
* `args` (array): 传递给操作方法的参数。

### `expected`

一个对象,定义了在所有操作执行后要进行的断言。

* `statusCode` (number): 最终页面的预期 HTTP 状态码。
* `finalUrl` (string): 页面的预期最终 URL (仅比较路径)。
* `html` (any): 针对最终页面的完整 HTML 内容运行的断言。
* `data` (any): 针对 `actions` 数组中*最后一个*操作的结果运行的断言。

## 断言语法

`expected` 中的 `html` 和 `data` 字段使用灵活的语法来定义断言。

### 1. 隐式 AND (数组)

您可以提供一个条件数组。数组中的所有条件都必须满足(逻辑 AND)。这是推荐用于多个条件的语法。

**示例:**

```json
"html": [
  { "contains": "欢迎" },
  { "not": { "contains": "错误" } }
]
```

### 2. 逻辑运算符

* **AND**: `{ "and": [condition1, condition2, ...] }`
* **OR**: `{ "or": [condition1, condition2, ...] }`
* **NOT**: `{ "not": { condition } }`

**示例:**

```json
"html": {
  "or": [
    { "contains": "成功" },
    { "contains": "已完成" }
  ]
}
```

### 3. 匹配器

匹配器是断言的基本构建块。

* **contains**: 检查值是否包含子字符串。
  * `{ "contains": "一些字符串" }`
  * `{ "contains": "一些字符串", "caseInsensitive": true }` (不区分大小写)
* **equals**: 检查深度相等性。对于比较从 `extract` 操作返回的结构化数据很有用。
  * `{ "equals": { "key": "value" } }`
* **string**: 普通字符串是 `contains` 检查的简写。
  * `"一些字符串"` 等效于 `{ "contains": "一些字符串" }`
