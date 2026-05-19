import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import net from 'node:net'
import http from 'node:http'
import { checkPort, checkHttpProxy, checkProxy, ProxyConfig } from './check-proxy'

// 创建简单的 TCP 服务器用于测试 checkPort
function createTcpServer(port: number): { close: () => Promise<void> } {
  const server = net.createServer()
  server.listen(port)
  return {
    close: () =>
      new Promise((res) => {
        server.close(res)
      }),
  }
}

// 创建 HTTP CONNECT 代理服务器
function createHttpProxyServer(port: number, options: { working?: boolean } = {}): { close: () => Promise<void> } {
  const server = http.createServer()

  server.on('connect', (req, clientSocket) => {
    if (options.working !== false) {
      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n')
      clientSocket.destroy()
    } else {
      clientSocket.write('HTTP/1.1 407 Proxy Auth Required\r\n\r\n')
      clientSocket.destroy()
    }
  })

  server.listen(port)

  return {
    close: () =>
      new Promise((res) => {
        server.close(res)
      }),
  }
}

describe('checkPort - integration', () => {
  it('should return true when port has a listening server', async () => {
    const server = createTcpServer(19991)
    try {
      const result = await checkPort('127.0.0.1', 19991, 2000)
      expect(result).toBe(true)
    } finally {
      await server.close()
    }
  }, 10000)

  it('should return false when port is not in use', async () => {
    const result = await checkPort('127.0.0.1', 19992, 1000)
    expect(result).toBe(false)
  }, 5000)

  it('should timeout for unreachable host', async () => {
    const result = await checkPort('192.0.2.1', 80, 500) // TEST-NET-1
    expect(result).toBe(false)
  }, 3000)
})

describe('checkHttpProxy - integration', () => {
  it('should detect working HTTP CONNECT proxy', async () => {
    const server = createHttpProxyServer(19993, { working: true })
    try {
      const result = await checkHttpProxy(
        { host: '127.0.0.1', port: 19993, type: 'http' },
        'example.com',
        443,
        3000
      )
      expect(result.working).toBe(true)
    } finally {
      await server.close()
    }
  }, 15000)

  it('should detect proxy connection refused', async () => {
    const result = await checkHttpProxy(
      { host: '127.0.0.1', port: 19994, type: 'http' },
      'example.com',
      443,
      2000
    )
    expect(result.working).toBe(false)
    expect(result.error).toBeDefined()
  }, 10000)
})

describe('checkProxy - integration', () => {
  it('should return online=false when port is closed', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 19995, type: 'http' }, 2000)
    expect(result.online).toBe(false)
    expect(result.portOpen).toBe(false)
    expect(result.proxyWorking).toBe(false)
  }, 10000)

  it('should parse URL string and check proxy', async () => {
    const result = await checkProxy('http://127.0.0.1:19996', 2000)
    expect(result.portOpen).toBe(false)
  }, 10000)

  it('should return ProxyCheckResult with all required fields', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 19997, type: 'http' }, 2000)
    expect(result).toHaveProperty('online')
    expect(result).toHaveProperty('portOpen')
    expect(result).toHaveProperty('proxyWorking')
  }, 10000)

  it('should handle socks4 type', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 19998, type: 'socks4' }, 2000)
    expect(result.portOpen).toBe(false)
  }, 10000)

  it('should handle socks5 type', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 19999, type: 'socks5' }, 2000)
    expect(result.portOpen).toBe(false)
  }, 10000)

  it('should handle socks5h type', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 20000, type: 'socks5h' }, 2000)
    expect(result.portOpen).toBe(false)
  }, 10000)

  it('should handle https type', async () => {
    const result = await checkProxy({ host: '127.0.0.1', port: 20001, type: 'https' }, 2000)
    expect(result.portOpen).toBe(false)
  }, 10000)
})

// 创建 SOCKS4 代理服务器
function createSocks4Server(port: number, options: { working?: boolean } = {}): { close: () => Promise<void> } {
  const server = net.createServer()

  server.on('connection', (socket) => {
    socket.once('data', (data) => {
      // SOCKS4 请求: VER(1) | CMD(1) | DSTPORT(2) | DSTIP(4) | USERID(变长) | NULL(1)
      if (data[0] === 0x04 && data[1] === 0x01) {
        // CONNECT 命令
        const response = Buffer.alloc(8)
        response[0] = 0x00 // 状态码
        response[1] = options.working !== false ? 0x5a : 0x5b // 5a=成功, 5b=失败
        response.writeUInt16BE(0, 2) // DSTPORT
        response.writeUInt32BE(0, 4) // DSTIP
        socket.write(response)
      }
      socket.destroy()
    })
  })

  server.listen(port)

  return {
    close: () =>
      new Promise((res) => {
        server.close(res)
      }),
  }
}

// 创建 SOCKS5 代理服务器
function createSocks5Server(port: number, options: { working?: boolean; requireAuth?: boolean } = {}): { close: () => Promise<void> } {
  const server = net.createServer()
  const auth = options.requireAuth ? { username: 'user', password: 'pass' } : null
  let stage: 'greeting' | 'auth' | 'request' = 'greeting'

  server.on('connection', (socket) => {
    stage = 'greeting'

    socket.on('data', (data) => {
      console.log(`[MOCK SOCKS5] ${stage} stage, data[0] data[1]:`, data[0], data[1], 'working:', options.working);
      if (stage === 'greeting') {
        // SOCKS5 握手: VER(1) | NMETHODS(1) | METHODS(变长)
        if (data[0] === 0x05 && data[1] > 0) {
          const clientMethods = Array.from(data.slice(2, 2 + data[1]))
          const hasNoAuth = clientMethods.includes(0x00)

          if (options.requireAuth && clientMethods.includes(0x02)) {
            // 服务器要求认证，客户端也支持，选择用户名密码认证
            socket.write(Buffer.from([0x05, 0x02]))
            stage = 'auth'
          } else if (hasNoAuth) {
            // 使用无认证
            socket.write(Buffer.from([0x05, 0x00]))
            stage = 'request'
          } else {
            // 无可用方法
            socket.write(Buffer.from([0x05, 0xff]))
            socket.destroy()
          }
        }
      } else if (stage === 'auth' && auth) {
        // SOCKS5 用户名密码认证: VER(1) | ULEN(1) | UNAME | PLEN(1) | PASSWD
        if (data[0] === 0x01) {
          const userLen = data[1]
          const passLen = data[2 + userLen]
          const username = data.slice(2, 2 + userLen).toString()
          const password = data.slice(3 + userLen, 3 + userLen + passLen).toString()

          if (username === auth.username && password === auth.password) {
            socket.write(Buffer.from([0x01, 0x00])) // 认证成功
            stage = 'request'
          } else {
            socket.write(Buffer.from([0x01, 0x01])) // 认证失败
            socket.destroy()
          }
        }
      } else if (stage === 'request') {
        // SOCKS5 CONNECT 请求: VER(1) | CMD(1) | RSV(1) | ATYP(1) | DST.ADDR(变长) | DST.PORT(2)
        if (data[0] === 0x05 && (data[1] === 0x01 || data[1] === 0x03)) { // CONNECT 命令 (IPv4 或域名)
          const response = Buffer.alloc(10)
          response[0] = 0x05 // VER
          response[1] = options.working !== false ? 0x00 : 0x01 // 0x00=成功, 0x01=服务器失败
          response[2] = 0x00 // RSV
          response[3] = 0x01 // ATYP=IPv4
          response.writeUInt32BE(0, 4) // BND.ADDR
          response.writeUInt16BE(0, 8) // BND.PORT
          socket.write(response)
        }
        socket.destroy()
      } else {
        socket.destroy()
      }
    })

    socket.on('error', () => socket.destroy())
  })

  server.listen(port)

  return {
    close: () =>
      new Promise((res) => {
        server.close(res)
      }),
  }
}

describe('checkProxy with SOCKS4 - integration', () => {
  it('should detect working socks4 proxy', async () => {
    const server = createSocks4Server(20010, { working: true })
    try {
      const result = await checkProxy({ host: '127.0.0.1', port: 20010, type: 'socks4' }, 3000)
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(true)
      expect(result.online).toBe(true)
    } finally {
      await server.close()
    }
  }, 15000)

  it('should detect non-working socks4 proxy', async () => {
    const server = createSocks4Server(20011, { working: false })
    try {
      const result = await checkProxy({ host: '127.0.0.1', port: 20011, type: 'socks4' }, 3000)
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(false)
      expect(result.online).toBe(false)
    } finally {
      await server.close()
    }
  }, 15000)
})

describe('checkProxy with SOCKS5 - integration', () => {
  it('should detect working socks5 proxy without auth', async () => {
    const server = createSocks5Server(20020, { working: true })
    try {
      const result = await checkProxy({ host: '127.0.0.1', port: 20020, type: 'socks5' }, 3000)
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(true)
      expect(result.online).toBe(true)
    } finally {
      await server.close()
    }
  }, 15000)

  it('should detect socks5 proxy with auth when server requires auth', async () => {
    // SOCKS5 服务器要求认证，客户端也提供认证
    const server = createSocks5Server(20021, { working: true, requireAuth: true })
    try {
      const result = await checkProxy(
        { host: '127.0.0.1', port: 20021, type: 'socks5', auth: { username: 'user', password: 'pass' } },
        3000
      )
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(true)
      expect(result.online).toBe(true)
    } finally {
      await server.close()
    }
  }, 15000)

  it('should detect non-working socks5 proxy', async () => {
    const server = createSocks5Server(20022, { working: false })
    await new Promise(res => setTimeout(res, 200)) // 等待服务器启动
    try {
      const result = await checkProxy({ host: '127.0.0.1', port: 20022, type: 'socks5' }, 3000)
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(false)
      expect(result.online).toBe(false)
    } finally {
      await server.close()
    }
  }, 15000)
})

describe('checkProxy with SOCKS5H - integration', () => {
  it('should detect working socks5h proxy', async () => {
    const server = createSocks5Server(20030, { working: true })
    try {
      const result = await checkProxy({ host: '127.0.0.1', port: 20030, type: 'socks5h' }, 3000)
      expect(result.portOpen).toBe(true)
      expect(result.proxyWorking).toBe(true)
      expect(result.online).toBe(true)
    } finally {
      await server.close()
    }
  }, 15000)
})
