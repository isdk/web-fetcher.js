/**
 * 规范化 MIME 类型列表：转为小写、去除首尾空白、丢弃空字符串并去重（保持原顺序）。
 *
 * @remarks
 * 用于统一处理 `additionalMimeTypes` 之类的配置项，保证交给 Crawlee 的值
 * （其内部通过 Set 匹配）与用户预期一致，避免 `['Application/PDF', 'text/plain', 'text/plain']`
 * 这类大小写不一或重复的输入。
 * 支持通配符（`*` 斜杠 `*`，保持原样，Crawlee 内部会特殊处理）。
 *
 * @param types - 待规范化的 MIME 类型列表。
 * @returns 规范化、去重后的 MIME 类型列表。
 */
export function normalizeMimeTypes(types: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const type of types) {
    const normalized = type.trim().toLowerCase()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }
  return result
}

/**
 * 判断 MIME 类型是否为文本类（可安全按文本解析/包装的类型）。
 *
 * @param type - 已去除参数、小写化的 MIME 类型（如 `application/json`）。
 */
export function isTextLikeMimeType(type: string): boolean {
  return (
    type.startsWith('text/') ||
    type.includes('xml') ||
    type.includes('json') ||
    type.includes('javascript') ||
    type.includes('html')
  )
}

/**
 * 判断某个响应的 Content-Type 是否允许被下载并返回原始 body。
 *
 * @remarks
 * - 文本类 MIME 始终允许（与 http 引擎始终放行 `text/plain` 等保持一致）；
 * - `additionalMimeTypes` 中的 `*` 斜杠 `*` 通配允许所有类型；
 * - 命中 `additionalMimeTypes`（已归一化小写）允许；
 * - Content-Type 缺失或无法解析时视为允许，避免误阻塞下载。
 *
 * @param contentType - 响应的 Content-Type 头（可含 `; charset=...` 等参数）。
 * @param additionalMimeTypes - 用户配置的额外 MIME 类型列表（可选）。
 */
export function isDownloadAllowed(
  contentType: string | undefined,
  additionalMimeTypes?: string[]
): boolean {
  if (!contentType) return true
  const type = contentType.split(';')[0].trim().toLowerCase()
  if (!type) return true
  if (isTextLikeMimeType(type)) return true
  const allowed = normalizeMimeTypes(additionalMimeTypes ?? [])
  return allowed.includes('*/*') || allowed.includes(type)
}
