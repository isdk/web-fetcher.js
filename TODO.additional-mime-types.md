# `additionalMimeTypes` 选项：设计与实现说明

## 目标与语义

`additionalMimeTypes?: string[]` 是顶层 fetcher 选项，含义为：**允许引擎下载并返回非 HTML 响应体**。

- `http`（cheerio）引擎：透传给 Crawlee 的 `CheerioCrawler.additionalMimeTypes`。
- `browser`（playwright）引擎：**预留**，用于捕获触发浏览器下载的响应（见下文"下一步：browser 引擎"）。
- 值统一规范化为小写并去重（`normalizeMimeTypes`），且始终与引擎自身允许的类型合并（cheerio 为 `text/plain`）。
- 支持通配符 `*/*`。
- **默认不启用任何额外类型**，需要下载非 HTML 内容时须显式配置。

## 本次已完成（cheerio 侧）

### 变更清单

| 文件 | 变更 |
|---|---|
| `src/utils/mime.ts`（新增） | `normalizeMimeTypes()`：小写 + trim + 去空 + 保序去重 |
| `src/utils/mime.spec.ts`（新增） | 上述工具的单元测试 |
| `src/core/types.ts` | 更新文档注释；从 `DefaultFetcherProperties` **移除** `['application/pdf']` 默认值；`FetcherOptionKeys` 显式保留该键 |
| `src/engine/cheerio.ts` | 硬编码的 `'text/plain'` 提取为 `ALWAYS_ALLOWED_MIME_TYPES` 常量，并用 `normalizeMimeTypes` 合并用户配置；`_ensureCheerioContext` 增加二进制识别（`_isBinaryBody` / `_isTextLikeMimeType`） |
| `test/engine.fixtures.spec.ts` | 断言引擎新增 `isBuffer` 匹配器；`contains` 对 Buffer 值按 utf-8 解码匹配 |
| `test/fixtures/112-pdf-download/`（新增） | PDF 下载集成测试（`body` 为 Buffer、`contentType` 正确、`html` 不包裹 `<pre>`） |
| `README.md` / `README.cn.md` | 补充 `additionalMimeTypes` 选项与响应 `body`/`contentType` 字段说明 |
| `test/README.md` / `test/README.cn.md` | 补充 `isBuffer` 匹配器与 Buffer `contains` 行为说明 |

### 修复的问题

1. **用户无法关闭默认 PDF**：lodash `defaultsDeep` / `merge` 对数组按索引合并，`additionalMimeTypes: []` 会被默认值 `['application/pdf']` 填充。移除默认值后该坑消失。
2. **magic string 硬编码**：`'text/plain'` 提取为命名常量，注释与实现一致。
3. **大小写/重复未处理**：现在统一小写、去重，交给 Crawlee 的值与用户预期一致。
4. **二进制 body 被包成 `<pre>` 垃圾 HTML**：`_ensureCheerioContext` 会对非 HTML body 兜底包装，把二进制解码文本（如 PDF）包成 `<pre>`。现通过 `_isBinaryBody` 识别（Content-Type 非文本类 + 空字节启发式兜底）跳过包装，`html`/`text` 保持原始解码内容。

## Crawlee 底层机制（cheerio 引擎依赖）

来自 `@crawlee/http` / `@crawlee/cheerio` 源码（v3.17）：

- `HttpCrawler` 默认 `supportedMimeTypes = HTML_AND_XML_MIME_TYPES + application/json`。
- `additionalMimeTypes` 经 `content-type` 库 parse 后加入该 Set，支持 `*/*` 通配。
- **白名单之外的 Content-Type**：postNavigationHook `_abortDownloadOfBody` 抛错
  `Resource ... served Content-Type ..., but only ... are allowed. Skipping resource.` → 请求失败。
- 命中白名单的非 HTML 类型：body 以 **Buffer** 保存（`context.body`），`context.$` 不解析，`contentType` 提供解析结果。

## 已知边界（cheerio）

- **二进制识别**（已实现）：`_isBinaryBody` 先按 Content-Type 判断（非文本类 MIME 视为二进制），
  无 Content-Type 或声明为文本但实际含空字节时，退化为扫描 Buffer 前 4KB 的空字节启发式。
  二进制响应不做 cheerio 包装，`body`（原始 Buffer）与 `contentType` 字段是正确的，消费方应优先使用 `body`。
- **文本类包装保留**：`text/*`、`application/json`、XML/HTML/JS 等文本类 MIME 仍保留 `<pre>` 包装
  （允许对 JSON/纯文本做基础选择），白名单见 `_isTextLikeMimeType`。
- 对 JSON 响应：Crawlee 已默认放行（`application/json`），`context.json` 可用，本选项无需配置。

## 下一步：browser 引擎（未实现）

### 问题

- `page.goto()` 到触发下载的 URL（如 `Content-Disposition: attachment`）会抛 `net::ERR_ABORTED`，
  目前会走"导航失败"路径（gotoPromise reject）。
- Chromium 内联渲染 PDF 时，`page.content()` 返回的是 PDF viewer 的 HTML，而非文件本体。

### 方案：download 事件捕获

Crawlee 3.17 的 `PlaywrightCrawler` 已内置收集机制：
`page.on('download', d => downloads.push(d))` + `context.listDownloads()`。

在 `PlaywrightFetchEngine` 中：

1. `goto()` / `navigate` action 导航前，在当前 `page` 上挂 `download` 监听（或复用
   `context.listDownloads()`）。
2. 导航抛 `ERR_ABORTED`（或 `page.goto` 返回 null 且捕获到 download）时：
   - 读取 `download.createReadStream()` 为 Buffer（注意大文件 OOM，可考虑限流/流式落盘）。
   - 用 `download.suggestedFilename()`、`download.url()`、`download.contentType()` 构造 `FetchResponse`
     （`body`、`headers['content-type']`、`finalUrl`）。
   - 成功路径与现有 goto 解析逻辑统一（`gotoPromise.resolve(fetchResponse)`）。
3. `click` 等 action 触发的下载同理：click 前先挂监听，click 后若捕获到 download 则等待其完成并返回。
4. 若 `page.goto` 返回了正常响应但 Content-Type 命中用户配置的 `additionalMimeTypes`（内联渲染场景），
   需要决定策略：截获网络响应（`page.route` 拦截 body）或接受 viewer HTML。建议先支持"下载事件"路径，
   内联渲染留待后续。

### 测试计划（browser）

- ✅ **cheerio 侧集成测试已完成**：`test/fixtures/112-pdf-download/` 覆盖"配置 `additionalMimeTypes` 后
  `goto(pdfUrl)` 返回 `FetchResponse`，`body` 为 Buffer、`contentType === 'application/pdf'`、`html` 不含 `<pre>` 包装"；
  未配置时请求按 Crawlee 白名单机制报错（已负向验证）。
- 用例 B（browser）：`click('#download-btn')` 捕获下载并返回。
- 用例 C（browser）：未配置 `additionalMimeTypes` 时行为不变（现有导航失败路径）。

## 相关文档

- `README.arch.download-act.md`：更广泛的 download action（直链/交互、落盘、路径消毒）设计提案，与本文档互补。
