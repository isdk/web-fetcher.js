import { customAlphabet } from 'nanoid'

// ============ ID 生成 ============
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

export function generateId(): string {
  return nanoid()
}
