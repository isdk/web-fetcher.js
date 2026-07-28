# OpenCLI 浏览器扩展 & Daemon 全量技术协议规范

本规范详细定义了 OpenCLI 系统的所有底层通讯细节。开发者可以依据此文档完整复现 Daemon 的全部功能，或将其逻辑深度嵌入到自定义自动化框架中。

---

## 1. 通讯链路与协议规范

### 1.1 三层架构
- **Client (CLI/脚本)** --[HTTP/JSON]--> **Daemon** --[WebSocket/JSON]--> **Extension**

### 1.2 安全机制 (强制)
为了防止恶意网页劫持本地浏览器，Daemon 必须实现以下安全校验：
1.  **Origin 过滤**: 所有 HTTP 和 WebSocket 请求必须来自 `chrome-extension://` 或者是无 Origin 的本地进程。
2.  **自定义 Header**: 除 `/ping` 外，所有 HTTP 请求必须携带 `X-OpenCLI: 1`。
3.  **拒绝 CORS**: 不应在响应中返回 `Access-Control-Allow-Origin`。
4.  **载荷限制**: HTTP 请求体最大限制为 **1 MB**。

---

## 2. Daemon HTTP API (全量接口)

### 2.1 指令执行 `POST /command`
核心接口。将指令转发至扩展程序并等待结果。
- **超时逻辑**: 默认 120s，可通过 Body 中的 `timeout` 字段自定义。
- **返回**: 直接返回扩展程序回传的 JSON 结果。

### 2.2 系统状态 `GET /status`
返回 Daemon 的实时运行快照：
- `pid`, `uptime`, `daemonVersion`, `port`
- `extensionConnected`: 扩展是否已连接
- `extensionVersion`, `extensionCompatRange`: 扩展版本信息
- `pending`: 当前正在等待响应的指令数量
- `memoryMB`: Daemon 内存占用

### 2.3 日志管理 `GET/DELETE /logs`
- **获取**: `GET /logs?level=error`。返回扩展转发的控制台日志。
- **清空**: `DELETE /logs`。重置日志缓冲区。

### 2.4 控制接口
- **健康检查**: `GET /ping`。
- **强制关闭**: `POST /shutdown`。优雅退出 Daemon。

---

## 3. WebSocket 协议 (Daemon ↔ Extension)

### 3.1 握手与心跳
1.  **Hello (握手)**: 扩展连接后发送：
    `{ "type": "hello", "version": "1.0.0", "compatRange": "^1.0.0" }`
2.  **Log (日志转发)**: 扩展实时发送：
    `{ "type": "log", "level": "info|warn|error", "msg": "...", "ts": number }`
3.  **Heartbeat (心跳)**: Daemon 每 **15s** 发送一次 `ping`，扩展回复 `pong`。若连续两次无回复，Daemon 应强制断开连接。

---

## 4. 全量 Action 指令参考 (Command 结构)

### 4.1 核心操作
- **`exec`**: 执行 JS 脚本。
  - 参数: `code` (string)
- **`navigate`**: 页面跳转。
  - 参数: `url` (string)
  - 特性: 智能等待 `status === 'complete'` 及重定向。

### 4.2 标签页管理 (`tabs`)
- 参数: `op` (list | new | close | select)
- 索引: 可通过 `index` 或 `page` (targetId) 指定目标。

### 4.3 视觉与输入
- **`screenshot`**: 截图。参数：`format` (png|jpeg), `quality` (0-100), `fullPage` (boolean)。
- **`insert-text`**: 模拟物理输入。参数：`text` (string)。
- **`set-file-input`**: 自动上传。参数：`files` (绝对路径数组), `selector` (CSS 选择器)。

### 4.4 高级功能
- **`cookies`**: 获取 Cookie。参数：`domain` 或 `url` 过滤。
- **`network-capture-start`**: 开启抓包。参数：`pattern` (URL 过滤)。
- **`network-capture-read`**: 读取抓包数据（含 Header 和 Body 预览）。
- **`cdp`**: 底层透传。参数：`cdpMethod`, `cdpParams`。
- **`bind-current`**: 将当前活跃标签页收编。参数：`matchDomain`, `matchPathPrefix`。
- **`sessions`**: 列出当前所有工作区的窗口、标签页数及剩余闲置时间。
- **`close-window`**: 关闭当前工作区的浏览器窗口。

---

## 5. 嵌入式 Micro-Daemon 核心参考代码 (全功能版)

```javascript
const { createServer } = require('node:http');
const { WebSocketServer } = require('ws');

class FullDaemon {
  constructor(port = 19825) {
    this.port = port;
    this.extensionWs = null;
    this.pending = new Map();
    this.logBuffer = []; // 环形缓冲区 (max 200)
  }

  start() {
    const server = createServer((req, res) => this.handleHttp(req, res));
    const wss = new WebSocketServer({ server, path: '/ext' });

    wss.on('connection', (ws) => {
      this.extensionWs = ws;
      
      // 心跳维护
      let missed = 0;
      const timer = setInterval(() => {
        if (missed++ > 2) ws.terminate();
        else ws.ping();
      }, 15000);
      ws.on('pong', () => missed = 0);

      ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'log') this.pushLog(msg);
        else if (msg.type === 'hello') this.onHello(msg);
        else this.fulfill(msg); // 处理指令返回
      });

      ws.on('close', () => { clearInterval(timer); this.extensionWs = null; });
    });

    server.listen(this.port, '127.0.0.1');
  }

  pushLog(entry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > 200) this.logBuffer.shift();
  }

  fulfill(msg) {
    const p = this.pending.get(msg.id);
    if (p) { clearTimeout(p.timer); this.pending.delete(msg.id); p.resolve(msg); }
  }

  // HTTP 接口需实现 /command, /status, /logs, /ping, /shutdown 等逻辑
  // ... (省略具体 HTTP 处理代码，详见 API 字典)
}
```

---

## 6. 重要提示：开发者最佳实践

1.  **工作区隔离**: 利用 `workspace` 参数（如 `user_1`）可以实现多用户、多任务并行而窗口互不冲突。
2.  **闲置管理**: 扩展程序默认有闲置退出机制。若你的任务需要长时间挂机，建议在指令中设置 `idleTimeout`。
3.  **错误捕获**: 必须处理 `Extension not connected` 和 `Command timeout` 两种核心异常。
