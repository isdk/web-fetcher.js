import type { Cookie } from '../core/types'

export type HeaderValue = string | string[] | undefined

export function normalizeHeaders(h?: Record<string, string>) {
  const ret: Record<string, string> = {}
  if (h && typeof h === 'object')
    for (const [k, v] of Object.entries(h)) {
      ret[k.toLowerCase()] = v
    }
  return ret
}

/**
 * 从响应头中获取重试等待时间（毫秒）
 *
 * @param headers 响应头对象
 * @returns 等待时间（ms），如果未找到或格式错误则返回 null
 */
export function getRetryAfter(headers: Record<string, string>): number | null {
  const retryAfter =
    headers['retry-after'] || headers['Retry-After'] || headers['RETRY-AFTER']
  if (!retryAfter) return null

  // 1. 尝试解析为秒数
  const seconds = parseInt(retryAfter, 10)
  if (!isNaN(seconds)) {
    return seconds * 1000
  }

  // 2. 尝试解析为日期
  const date = Date.parse(retryAfter)
  if (!isNaN(date)) {
    const delay = date - Date.now()
    return delay > 0 ? delay : 0
  }

  return null
}

export function flattenHeaders(h: Record<string, HeaderValue> | undefined) {
  const out: Record<string, string> = {}
  if (!h) return out
  for (const [k, v] of Object.entries(h)) {
    if (typeof v === 'undefined') continue
    out[k.toLowerCase()] = Array.isArray(v) ? v.join('; ') : String(v)
  }
  return out
}

export function parseSetCookie(
  setCookie: string | string[] | undefined
): Cookie[] {
  if (!setCookie) return []
  const arr = Array.isArray(setCookie) ? setCookie : [setCookie]
  const cookies: Cookie[] = []
  for (const raw of arr) {
    const [pair, ...attrs] = raw.split(';').map((s) => s.trim())
    const [name, value] = pair.split('=')
    const cookie: Cookie = { name, value }
    for (const a of attrs) {
      const [ak, av] = a.split('=')
      const key = ak.toLowerCase()
      if (key === 'path') cookie.path = av || '/'
      else if (key === 'domain') cookie.domain = av
      else if (key === 'secure') cookie.secure = true
      else if (key === 'httponly') cookie.httpOnly = true
      else if (key === 'samesite') cookie.sameSite = (av as any) || 'Lax'
      else if (key === 'expires') {
        const t = Date.parse(av || '')
        if (!Number.isNaN(t)) cookie.expires = t
      }
    }
    cookies.push(cookie)
  }
  return cookies
}
