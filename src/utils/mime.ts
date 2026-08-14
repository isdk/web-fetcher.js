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
