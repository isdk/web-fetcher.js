import { ErrorCode } from '@isdk/common-error'

/**
 * Maps Node.js error codes (like ETIMEDOUT, ECONNREFUSED) to HTTP status codes.
 *
 * @param error - The error object to map
 * @returns An HTTP status code (number) or undefined if no mapping found
 */
 export function mapErrorCodeToStatus(error: any): number | undefined {
  const rawCode = error.code ?? error.status ?? error.statusCode
  if (typeof rawCode === 'number' && rawCode >= 400) {
    return rawCode
  }
  if (typeof rawCode === 'string') {
    const num = parseInt(rawCode, 10)
    if (!isNaN(num) && num >= 400) {
      return num
    }
  }

  const code = error.code
  const message = error.message || ''

  // 1. Connection timeouts
  if (
    code === 'ETIMEDOUT' ||
    code === 'ESOCKETTIMEDOUT' ||
    message.includes('timed out')
  ) {
    return ErrorCode.RequestTimeout
  }

  // 2. Connection-related errors (mapped to 503 to trigger retry)
  const retryableCodes = [
    'ECONNREFUSED',
    'ECONNRESET',
    'EAI_AGAIN',
    'ENETUNREACH',
    'EHOSTUNREACH',
  ]
  if (retryableCodes.includes(code)) {
    return 503 // Service Unavailable
  }

  // 3. Configuration/Addressing errors
  if (code === 'ENOTFOUND') {
    return 400 // 400 - Bad Request - 域名无法解析是客户端请求错误
  }

  // 4. Default fallback
  return undefined
 }

