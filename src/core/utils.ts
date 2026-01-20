import { customAlphabet } from 'nanoid'

// ============ ID 生成 ============
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

export function generateId(): string {
  return nanoid()
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