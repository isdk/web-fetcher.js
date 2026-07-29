import { CommonError } from '@isdk/common-error'
import { FetchResponse } from '../core/types'

/**
 * Extracts only the first line of an error message (the real error).
 * Some errors (e.g. Playwright's `page.goto()` failures) include verbose debug
 * info like "Call log" after a newline. This function strips that debug info
 * and returns the full message separately for storage in error.data.
 *
 * @param msg - The raw error message
 * @returns An object with `clean` (first line only) and `full` (original or undefined if no newline)
 */
export function getCleanErrorMessage(msg: string | undefined | null): { clean: string; full: string | undefined } {
  if (!msg) return { clean: msg || '', full: undefined }
  const newlineIdx = msg.indexOf('\n')
  if (newlineIdx === -1) return { clean: msg, full: undefined }
  return {
    clean: msg.substring(0, newlineIdx).trimEnd(),
    full: msg.trim(),
  }
}

/**
 * Creates a minimal error response object for when navigation fails.
 * Used as the `.response` property on rejected CommonError instances.
 */
export function createErrorResponse(
  url: string,
  loadedUrl: string | undefined,
  statusCode: number,
  statusText: string
): FetchResponse {
  return {
    url,
    finalUrl: loadedUrl || url,
    headers: {},
    statusCode,
    statusText: statusText || 'BUILD_RESPONSE_FAILURE',
    body: '',
    html: '',
    text: '',
  }
}

/**
 * Creates a CommonError with standardized 'request' code and optional
 * originalMessage in data for multi-line debug info (e.g. Playwright "Call log").
 */
export function createNavigationError(
  message: string,
  statusCode: number,
  originalMessage?: string
): CommonError & { response?: FetchResponse; data?: { originalMessage?: string } } {
  const error = new CommonError(message, 'request', statusCode) as any
  if (originalMessage) error.data = { originalMessage }
  return error
}
