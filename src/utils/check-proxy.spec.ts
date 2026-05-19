import { describe, expect, it, vi, beforeEach } from 'vitest'
import { parseProxyUrl, ProxyConfig } from './check-proxy'

describe('parseProxyUrl', () => {
  it('should parse http proxy URL', () => {
    const result = parseProxyUrl('http://127.0.0.1:7890')
    expect(result).toEqual({
      host: '127.0.0.1',
      port: 7890,
      type: 'http',
    })
  })

  it('should parse https proxy URL', () => {
    const result = parseProxyUrl('https://192.168.1.1:8080')
    expect(result).toEqual({
      host: '192.168.1.1',
      port: 8080,
      type: 'https',
    })
  })

  it('should parse socks4 proxy URL', () => {
    const result = parseProxyUrl('socks4://127.0.0.1:1080')
    expect(result).toEqual({
      host: '127.0.0.1',
      port: 1080,
      type: 'socks4',
    })
  })

  it('should parse socks5 proxy URL', () => {
    const result = parseProxyUrl('socks5://127.0.0.1:1080')
    expect(result).toEqual({
      host: '127.0.0.1',
      port: 1080,
      type: 'socks5',
    })
  })

  it('should parse socks5h proxy URL', () => {
    const result = parseProxyUrl('socks5h://127.0.0.1:1080')
    expect(result).toEqual({
      host: '127.0.0.1',
      port: 1080,
      type: 'socks5h',
    })
  })

  it('should parse http proxy URL with authentication', () => {
    const result = parseProxyUrl('http://user:pass@127.0.0.1:7890')
    expect(result).toEqual({
      host: '127.0.0.1',
      port: 7890,
      type: 'http',
      auth: {
        username: 'user',
        password: 'pass',
      },
    })
  })

  it('should parse socks5 proxy URL with authentication', () => {
    const result = parseProxyUrl('socks5://admin:secret@192.168.1.1:1080')
    expect(result).toEqual({
      host: '192.168.1.1',
      port: 1080,
      type: 'socks5',
      auth: {
        username: 'admin',
        password: 'secret',
      },
    })
  })

  it('should decode URL-encoded username and password', () => {
    const result = parseProxyUrl('http://user%40domain:pass%2Fword@127.0.0.1:7890')
    expect(result.auth).toEqual({
      username: 'user@domain',
      password: 'pass/word',
    })
  })

  it('should use default port 80 for http when port is not specified', () => {
    const result = parseProxyUrl('http://127.0.0.1')
    expect(result.port).toBe(80)
  })

  it('should use default port 443 for https when port is not specified', () => {
    const result = parseProxyUrl('https://127.0.0.1')
    expect(result.port).toBe(443)
  })

  it('should use default port 1080 for socks5 when port is not specified', () => {
    const result = parseProxyUrl('socks5://127.0.0.1')
    expect(result.port).toBe(1080)
  })

  it('should use default port 1080 for socks5h when port is not specified', () => {
    const result = parseProxyUrl('socks5h://127.0.0.1')
    expect(result.port).toBe(1080)
  })

  it('should use default port 1080 for socks4 when port is not specified', () => {
    const result = parseProxyUrl('socks4://127.0.0.1')
    expect(result.port).toBe(1080)
  })

  it('should parse hostname with domain name', () => {
    const result = parseProxyUrl('http://proxy.example.com:8080')
    expect(result).toEqual({
      host: 'proxy.example.com',
      port: 8080,
      type: 'http',
    })
  })

  it('should parse IPv6 localhost', () => {
    const result = parseProxyUrl('http://[::1]:7890')
    expect(result.host).toBeDefined()
    expect(result.port).toBe(7890)
    expect(result.type).toBe('http')
  })

  it('should handle username without password', () => {
    const result = parseProxyUrl('http://user@127.0.0.1:7890')
    expect(result.auth).toBeUndefined()
    expect(result.host).toBe('127.0.0.1')
  })

  it('should handle password without username', () => {
    const result = parseProxyUrl('http://:pass@127.0.0.1:7890')
    expect(result.auth).toBeUndefined()
    expect(result.host).toBe('127.0.0.1')
  })

  it('should return ProxyConfig type', () => {
    const result = parseProxyUrl('http://user:pass@127.0.0.1:7890')
    const config: ProxyConfig = result
    expect(config.host).toBe('127.0.0.1')
    expect(config.port).toBe(7890)
    expect(config.type).toBe('http')
    expect(config.auth?.username).toBe('user')
    expect(config.auth?.password).toBe('pass')
  })

  it('should handle special characters in password', () => {
    const result = parseProxyUrl('http://user:p%40ss%3Dword%21@127.0.0.1:7890')
    expect(result.auth).toEqual({
      username: 'user',
      password: 'p@ss=word!',
    })
  })

  it('should parse URL with non-default port', () => {
    const result = parseProxyUrl('https://proxy.example.com:8443')
    expect(result.port).toBe(8443)
  })

  it('should parse URL with port 443 (https default port)', () => {
    const result = parseProxyUrl('https://proxy.example.com:443')
    expect(result.port).toBe(443)
  })

  it('should parse URL with port 80 (http default port)', () => {
    const result = parseProxyUrl('http://proxy.example.com:80')
    expect(result.port).toBe(80)
  })

  it('should preserve protocol in type', () => {
    const protocols = ['http', 'https', 'socks4', 'socks5', 'socks5h']
    protocols.forEach((protocol) => {
      const result = parseProxyUrl(`${protocol}://127.0.0.1:8080`)
      expect(result.type).toBe(protocol)
    })
  })
})
