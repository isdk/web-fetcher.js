import net from 'node:net';
import http from 'node:http';

/**
 * 代理类型
 */
export type ProxyType = 'http' | 'https' | 'socks4' | 'socks5' | 'socks5h';

/**
 * 代理配置
 */
export interface ProxyConfig {
  host: string;
  port: number;
  type?: ProxyType;
  auth?: {
    username: string;
    password: string;
  };
}

/**
 * 解析代理 URL 为配置
 * 支持格式:
 * - http://127.0.0.1:7890
 * - http://user:pass@127.0.0.1:7890
 * - socks5://127.0.0.1:1080
 * - socks5://user:pass@127.0.0.1:1080
 */
export function parseProxyUrl(url: string): ProxyConfig {
  const parsed = new URL(url);
  const type = parsed.protocol.replace(':', '') as ProxyType;
  const config: ProxyConfig = {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port) : getDefaultPort(type),
    type,
  };

  if (parsed.username && parsed.password) {
    config.auth = {
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
    };
  }

  return config;
}

/**
 * 获取默认端口
 */
function getDefaultPort(type: ProxyType): number {
  switch (type) {
    case 'http':
      return 80;
    case 'https':
      return 443;
    case 'socks4':
    case 'socks5':
    case 'socks5h':
      return 1080;
    default:
      return 80;
  }
}

/**
 * 代理检测结果
 */
export interface ProxyCheckResult {
  online: boolean;
  portOpen: boolean;
  proxyWorking: boolean;
  latency?: number;
  error?: string;
}

/**
 * 检测 TCP 端口是否开放
 */
export async function checkPort(host: string, port: number, timeout = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);

    // 在所有 socket 事件处理器之前声明状态变量
    let expectAuthResponse = false;
    let expectConnectResponse = false;

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

/**
 * 通过 HTTP CONNECT 方法检测代理
 */
export async function checkHttpProxy(
  config: ProxyConfig,
  targetHost = 'www.google.com',
  targetPort = 443,
  timeout = 500
): Promise<{ working: boolean; latency?: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();

    const options: http.RequestOptions = {
      host: config.host,
      port: config.port,
      method: 'CONNECT',
      path: `${targetHost}:${targetPort}`,
      timeout,
    };

    if (config.auth) {
      const auth = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
      options.headers = { 'Proxy-Authorization': `Basic ${auth}` };
    }

    const req = http.request(options);

    req.on('connect', (res, socket) => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve({ working: res.statusCode === 200, latency });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ working: false, error: '连接超时' });
    });

    req.on('error', (err) => {
      resolve({ working: false, error: err.message });
    });

    req.end();
  });
}

/**
 * 通过代理发送 HTTP 请求检测
 */
export async function checkProxyRequest(
  config: ProxyConfig,
  testUrl = 'http://httpbin.org/ip',
  timeout = 10000
): Promise<{ working: boolean; latency?: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();

    const options: http.RequestOptions = {
      host: config.host,
      port: config.port,
      method: 'GET',
      path: testUrl,
      timeout,
      headers: {
        'User-Agent': 'checkProxy/1.0',
        Host: new URL(testUrl).host,
      },
    };

    if (config.auth) {
      const auth = Buffer.from(`${config.auth.username}:${config.auth.password}`).toString('base64');
      (options.headers as Record<string, string>)['Proxy-Authorization'] = `Basic ${auth}`;
    }

    const req = http.request(options);

    req.on('response', (res) => {
      const latency = Date.now() - start;
      res.resume();
      const ok = res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 400;
      resolve({ working: ok, latency });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ working: false, error: '请求超时' });
    });

    req.on('error', (err) => {
      resolve({ working: false, error: err.message });
    });

    req.end();
  });
}

/**
 * 检测 SOCKS4 代理
 */
async function checkSocks4(
  host: string,
  port: number,
  targetHost: string,
  targetPort: number,
  timeout = 5000
): Promise<{ working: boolean; latency?: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let resolved = false;

    const done = (result: { working: boolean; latency?: number; error?: string }) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeout);

    // 在所有 socket 事件处理器之前声明状态变量
    let expectAuthResponse = false;
    let expectConnectResponse = false;

    socket.on('connect', () => {
      // SOCKS4 请求格式:
      // VER(1) | CMD(1) | DSTPORT(2) | DSTIP(4) | USERID(变长) | NULL(1)
      const userId = 'checkProxy';
      const request = Buffer.alloc(9 + userId.length + 1);
      request[0] = 0x04; // SOCKS4 版本
      request[1] = 0x01; // CONNECT
      request.writeUInt16BE(targetPort, 2); // DSTPORT
      request.writeUInt32BE(0x08080808, 4); // DSTIP (8.8.8.8 公共 DNS)
      Buffer.from(userId).copy(request, 8); // USERID
      request[8 + userId.length] = 0x00; // NULL 终止符

      socket.write(request);
    });

    socket.on('data', (data) => {
      const latency = Date.now() - start;
      // SOCKS4 响应: VER(1) | CD(1) | DSTPORT(2) | DSTIP(4)
      // CD = 0x5A 表示成功
      if (data.length >= 8 && data[1] === 0x5a) {
        done({ working: true, latency });
      } else {
        done({ working: false, error: `SOCKS4 连接失败: ${data[1]}` });
      }
    });

    socket.on('timeout', () => done({ working: false, error: '连接超时' }));
    socket.on('error', (err) => done({ working: false, error: err.message }));

    socket.connect(port, host);
  });
}

/**
 * 检测 SOCKS5 代理
 */
async function checkSocks5(
  host: string,
  port: number,
  targetHost: string,
  targetPort: number,
  auth: ProxyConfig['auth'],
  timeout = 5000
): Promise<{ working: boolean; latency?: number; error?: string }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    let resolved = false;

    const done = (result: { working: boolean; latency?: number; error?: string }) => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeout);

    // 状态机: greeting -> authenticated -> connected -> done
    type Stage = 'greeting' | 'authenticated' | 'connected' | 'done';
    let stage: Stage = 'greeting';

    const sendConnectRequest = () => {
      // SOCKS5 连接请求: VER(1) | CMD(1) | RSV(1) | ATYP(1) | DST.ADDR(变长) | DST.PORT(2)
      const atyp = 0x03; // 域名
      const domain = Buffer.from(targetHost);
      const request = Buffer.alloc(4 + 1 + domain.length + 2);
      request[0] = 0x05; // 版本
      request[1] = 0x01; // CONNECT
      request[2] = 0x00; // RSV
      request[3] = atyp; // ATYP = 域名
      request[4] = domain.length;
      domain.copy(request, 5);
      request.writeUInt16BE(targetPort, 5 + domain.length);

      socket.write(request);
    };

    socket.on('connect', () => {
      // SOCKS5 握手阶段 1: 客户端发送支持的认证方法
      const methods = auth ? Buffer.from([0x05, 0x02, 0x00]) : Buffer.from([0x05, 0x01, 0x00]);
      socket.write(methods);
    });

    socket.on('data', (data) => {
      if (stage === 'greeting') {
        // 处理服务器方法选择响应
        if (data[0] !== 0x05) {
          done({ working: false, error: '非 SOCKS5 协议' });
          return;
        }

        if (data[1] === 0xff) {
          done({ working: false, error: '无可用认证方法' });
          return;
        }

        if (data[1] === 0x00) {
          // 无需认证，发送连接请求
          stage = 'authenticated';
          sendConnectRequest();
          return;
        }

        if (data[1] === 0x02 && auth) {
          // 需要用户名密码认证
          const userBytes = Buffer.from(auth.username);
          const passBytes = Buffer.from(auth.password);
          const authRequest = Buffer.alloc(3 + userBytes.length + passBytes.length);
          authRequest[0] = 0x01; // 版本
          authRequest[1] = userBytes.length;
          userBytes.copy(authRequest, 2);
          authRequest[2 + userBytes.length] = passBytes.length;
          passBytes.copy(authRequest, 3 + userBytes.length);

          socket.write(authRequest);
          stage = 'authenticated'; // 等待认证响应
          return;
        }

        done({ working: false, error: '不支持的认证方法' });
        return;
      }

      if (stage === 'authenticated') {
        // 处理认证响应或连接响应
        if (data[0] === 0x01 && data[1] === 0x00) {
          // 用户名密码认证成功，发送连接请求
          stage = 'connected';
          sendConnectRequest();
        } else if (data[0] === 0x05) {
          // 无需认证时，服务器直接返回连接响应
          stage = 'done';
          const latency = Date.now() - start;
          if (data[1] === 0x00) {
            done({ working: true, latency });
          } else {
            done({ working: false, error: getSocks5Error(data[1]) });
          }
        } else {
          done({ working: false, error: '认证失败' });
        }
        return;
      }

      if (stage === 'connected') {
        // 处理连接响应
        const latency = Date.now() - start;
        stage = 'done';
        if (data[0] === 0x05 && data[1] === 0x00) {
          done({ working: true, latency });
        } else {
          const errorMsg = data[0] === 0x05 ? getSocks5Error(data[1]) : `SOCKS5 错误: ${data[1]}`;
          done({ working: false, error: errorMsg });
        }
        return;
      }
    });

    socket.on('timeout', () => done({ working: false, error: '连接超时' }));
    socket.on('error', (err) => done({ working: false, error: err.message }));

    socket.connect(port, host);
  });
}

/**
 * SOCKS5 错误码转中文
 */
function getSocks5Error(code: number): string {
  switch (code) {
    case 0x01:
      return 'SOCKS5 服务器错误';
    case 0x02:
      return '规则集不允许连接';
    case 0x03:
      return '网络不可达';
    case 0x04:
      return '主机不可达';
    case 0x05:
      return '连接被拒绝';
    case 0x06:
      return 'TTL 过期';
    case 0x07:
      return '不支持的命令';
    case 0x08:
      return '不支持的地址类型';
    default:
      return `SOCKS5 错误: ${code}`;
  }
}

/**
 * 检测 SOCKS 代理 (统一入口)
 */
async function checkSocksProxy(
  config: ProxyConfig,
  timeout = 5000
): Promise<{ working: boolean; latency?: number; error?: string }> {
  const { host, port, type, auth } = config;
  const targetHost = 'www.google.com';
  const targetPort = 80;

  if (type === 'socks4') {
    return checkSocks4(host, port, targetHost, targetPort, timeout);
  }

  return checkSocks5(host, port, targetHost, targetPort, auth, timeout);
}

/**
 * 检测代理
 * @param config 代理配置或 URL 字符串
 */
export async function checkProxy(config: ProxyConfig | string, timeout = 5000): Promise<ProxyCheckResult> {
  const proxyConfig = typeof config === 'string' ? parseProxyUrl(config) : config;
  const result: ProxyCheckResult = {
    online: false,
    portOpen: false,
    proxyWorking: false,
  };

  // 1. 检测端口
  result.portOpen = await checkPort(proxyConfig.host, proxyConfig.port, timeout);

  // 2. 检测代理可用性
  if (result.portOpen) {
    let checkResult: { working: boolean; latency?: number; error?: string };

    if (proxyConfig.type === 'socks4' || proxyConfig.type === 'socks5' || proxyConfig.type === 'socks5h') {
      checkResult = await checkSocksProxy(proxyConfig, timeout);
    } else {
      checkResult = await checkHttpProxy(proxyConfig, 'www.google.com', 443, timeout);
    }

    result.proxyWorking = checkResult.working;
    result.latency = checkResult.latency;
    result.error = checkResult.error;
  }

  result.online = result.portOpen && result.proxyWorking;

  return result;
}

/**
 * 批量检测代理
 * @param configs 代理配置或 URL 字符串数组
 */
export async function checkProxies(
  configs: (ProxyConfig | string)[],
  timeout = 5000,
  concurrency = 5
): Promise<Map<string, ProxyCheckResult>> {
  const results = new Map<string, ProxyCheckResult>();

  for (let i = 0; i < configs.length; i += concurrency) {
    const batch = configs.slice(i, i + concurrency);
    const promises = batch.map(async (config) => {
      const proxyConfig = typeof config === 'string' ? parseProxyUrl(config) : config;
      const key = `${proxyConfig.type ?? 'http'}://${proxyConfig.host}:${proxyConfig.port}`;
      const result = await checkProxy(proxyConfig, timeout);
      return { key, result };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ key, result }) => {
      results.set(key, result);
    });
  }

  return results;
}
