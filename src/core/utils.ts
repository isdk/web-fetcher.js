import { customAlphabet } from 'nanoid'

// ============ ID 生成 ============
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

export function generateId(): string {
  return nanoid()
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

/**
 * 通用的调试日志打印函数
 *
 * @param debugConfig 调试配置 (boolean | string | string[])
 * @param meta 包含前缀、ID 和类别的元数据
 * @param args 要打印的参数
 */
export function logDebug(
  debugConfig: boolean | string | string[] | undefined,
  meta: { prefix: string; id?: string; category: string },
  ...args: any[]
) {
  if (!debugConfig) return

  const { prefix, id, category } = meta
  const shouldLog =
    debugConfig === true ||
    debugConfig === category ||
    (Array.isArray(debugConfig) && debugConfig.includes(category))

  if (shouldLog) {
    const idPart = id ? `:${id}` : ''
    console.log(`[${prefix}${idPart}:${category}]`, ...args)
  }
}
