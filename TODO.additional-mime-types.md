# `additionalMimeTypes` 选项：设计与实现说明

## 目标与语义

`additionalMimeTypes?: string[]` 是顶层 fetcher 选项，含义为：**允许引擎下载并返回非 HTML 响应体**。

- `http`（cheerio）引擎：透传给 Crawlee 的 `CheerioCrawler.additionalMimeTypes`。
- `browser`（playwright）引擎：通过 Playwright 的 `download` 事件捕获触发下载的响应（导航/点击/表单提交），读取原始二进制返回 `FetchResponse.body`；同样受该白名单约束（文本类 MIME 始终允许）。
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
| `src/engine/base.ts` | `buildResponse` 抽取 `_enrichResponse`，供非页面响应（下载）复用统一字段补充 |
| `src/utils/mime.ts` | 新增 `isTextLikeMimeType` / `isDownloadAllowed`（cheerio 与 playwright 共用） |
| `src/engine/playwright.ts` | 实现 download 捕获：goto 失败路径拦截、navigate/click/submit 下载检测、`page.on('response')` 跟踪下载 Content-Type |
| `test/fixtures/113-pdf-download-browser/`（新增） | browser 引擎 goto PDF 下载集成测试 |
| `test/fixtures/114-pdf-download-browser-click/`（新增） | browser 引擎 click 触发下载集成测试 |
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

## browser 引擎（已实现）

### 机制

- Crawlee 3.17 的 `PlaywrightCrawler` 内置收集：`page.on('download')` + `context.listDownloads()`（按请求隔离）。
- 导航到触发下载的 URL（`Content-Disposition: attachment`）时 `page.goto()` 抛 `net::ERR_ABORTED`，
  由 `_sharedFailedRequestHandler` 拦截：若捕获到允许的 download，读取原始内容构造 `FetchResponse`
  并 resolve gotoPromise（而非报导航错误）；随后仍走共享 handler 完成清理。
- `navigate` / `click` / `submit` action 同样在导航后检测 download 并返回下载内容。
- **Content-Type 来源**：Playwright 的 `Download` 对象没有 `contentType()`，通过 `page.on('response')`
  跟踪各 URL 的 Content-Type（`_instrumentPage`，WeakSet 保证每页只挂一次），供 `isDownloadAllowed` 白名单判断
  与 `FetchResponse.contentType` 使用；未捕获到时视为允许。
- 下载是否捕获受 `additionalMimeTypes` 约束（文本类 MIME 始终允许），与 http 引擎语义一致。

### 已知限制（browser）

- Chromium 内联渲染 PDF（无 `Content-Disposition: attachment`）时不会触发 download 事件，
  `page.content()` 返回 PDF viewer 的 HTML 而非文件本体——该场景留待后续（可用 `page.route` 拦截 body）。
- 大文件下载通过 `download.createReadStream()` 全量读入内存 Buffer（与 cheerio 一致），
  流式落盘（O(1) 内存）留待后续增强。

### 测试（已完成）

- `test/fixtures/113-pdf-download-browser/`：browser 引擎 `goto(pdfUrl)` 返回下载内容
  （`body` 为 Buffer、`contentType === 'application/pdf'`、`statusCode 200`）。
- `test/fixtures/114-pdf-download-browser-click/`：browser 引擎点击链接触发下载并返回。
- 负向验证：未配置 `additionalMimeTypes` 时下载不被捕获（行为不变）。
- cheerio 侧：`test/fixtures/112-pdf-download/`（见上文）。

## 相关文档

- `README.arch.download-act.md`：更广泛的 download action（直链/交互、落盘、路径消毒）设计提案，与本文档互补。
- `README.engine.cn.md`：引擎架构文档（Cheerio/Playwright 双引擎）。
