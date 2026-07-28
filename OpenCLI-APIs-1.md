# OpenCLI 浏览器扩展 & Daemon API 规范

OpenCLI 采用 **三层架构** 实现浏览器自动化：
`CLI (或其他客户端) --[HTTP]--> Daemon (守护进程) --[WebSocket]--> Extension (浏览器扩展)`

## 1. 通信协议架构

### 1.1 内部链路
- **控制层 (HTTP)**: 暴露在 `127.0.0.1:19825`。用于接收外部指令。
- **执行层 (WebSocket)**: 运行在 `ws://127.0.0.1:19825/ext`。用于连接浏览器扩展。

### 1.2 安全验证 (X-OpenCLI)
除 `/ping` 外，所有 HTTP 请求**必须**包含以下 Header，否则将被 Daemon 拒绝：
```http
X-OpenCLI: 1
```
*注：此机制用于防止恶意网页通过 CSRF 攻击控制你的本地浏览器。*

---

## 2. Daemon HTTP API 参考

### 2.1 执行指令 `POST /command`
这是最核心的接口，用于向浏览器发送自动化动作。

- **Body (JSON)**: 遵循 `DaemonCommand` 结构（见下文）。
- **示例请求**:
  ```bash
  curl -X POST http://127.0.0.1:19825/command \
       -H "X-OpenCLI: 1" \
       -H "Content-Type: application/json" \
       -d '{"id": "c1", "action": "navigate", "url": "https://example.com"}'
  ```

### 2.2 系统状态 `GET /status`
返回 Daemon 运行信息及扩展程序连接状态。
- **返回**: `{ "ok": true, "extensionConnected": boolean, "daemonVersion": string, ... }`

### 2.3 日志查询 `GET /logs`
获取扩展程序从浏览器端转发回来的 `console` 日志。
- **参数**: `?level=error` (可选)

### 2.4 健康检查 `GET /ping`
无需 `X-OpenCLI` Header，用于探测 Daemon 是否存活。

---

## 3. 核心 API 指令 (Command 结构)

所有发送至 `/command` 的请求需包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `id` | `string` | **必填**。请求 ID。 |
| `action` | `string` | **必填**。执行动作（`exec`, `navigate`, `screenshot`, `tabs`, `network-capture-read` 等）。 |
| `workspace` | `string` | 逻辑工作区，用于窗口隔离。 |
| `page` | `string` | 目标页面的 `targetId`。 |
| `timeout` | `number` | 指令超时时间（秒）。 |

### 关键 Action 列表：
- **`navigate`**: 导航至 URL。
- **`exec`**: 执行 JS 代码（支持异步返回）。
- **`screenshot`**: 截图（支持 `fullPage: true`）。
- **`set-file-input`**: 注入本地文件路径。
- **`network-capture-start`**: 开启网络抓包。
- **`cdp`**: 直接透传底层 CDP 指令（需在白名单内）。

---

## 4. 妙用：将 OpenCLI 作为“高级 Fetch 引擎”

开发者可以将 OpenCLI 视为一个运行在真实浏览器环境中的 **高级 HTTP 代理/Fetch 引擎**。

### 4.1 如何实现？
通过 `exec` 指令在页面内执行 `window.fetch`：
```json
{
  "id": "fetch-api",
  "action": "exec",
  "code": "fetch('/api/user/profile').then(r => r.json())"
}
```

### 4.2 为什么比普通的 `node-fetch` 更好用？

1.  **完美绕过 CORS 限制**：
    由于请求是在目标网站的同源环境下（或由浏览器扩展发起）执行的，浏览器不会触发 CORS 拦截。你可以直接访问该域名的所有私有接口。

2.  **自动携带会话与 Cookie**：
    无需手动维护 Cookie 池。只要你在浏览器中登录了该网站，通过 OpenCLI 发起的 Fetch 请求会自动带上所有身份凭证（Cookies, IndexedDB, SessionStorage）。

3.  **规避机器人检测 (Anti-Bot)**：
    普通的爬虫库（如 axios）容易因为 TLS 指纹、HTTP/2 特征或缺少特定的浏览器 Header 被拦截。OpenCLI 使用的是**真实的 Chrome 网络栈**，其指纹与正常用户完全一致。

4.  **“先交互，后请求”模式**：
    你可以先指令浏览器执行复杂的 UI 操作（如点击“显示更多”、处理滑动验证码），等页面状态就绪后，再发送 `exec` 获取数据。

5.  **拦截并读取加密响应**：
    配合 `network-capture-start` 和 `network-capture-read`，你可以捕获那些由网页加密逻辑处理前的原始网络包。

### 4.3 适用场景
- **复杂登录态爬虫**：处理需要扫码、短信验证的网站。
- **内网系统集成**：在不暴露内网 API 的情况下，通过本地浏览器作为跳板提取数据。
- **前端性能审计**：在真实渲染环境下监控网络资源的加载耗时。

---

## 5. 错误处理与重试
CLI 端在调用 HTTP API 时应实现以下逻辑：
- **408 Timeout**: 说明 Daemon 还在，但浏览器响应太慢。
- **503 Service Unavailable**: 说明扩展程序未连接。
- **403 Forbidden**: Header 缺失或 Origin 校验失败。
