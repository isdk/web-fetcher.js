import { ErrorCode } from '@isdk/common-error'
import { mapErrorCodeToStatus } from './error-mapping'

describe('mapErrorCodeToStatus', () => {
  it('should map ETIMEDOUT to RequestTimeout', () => {
    expect(mapErrorCodeToStatus({ code: 'ETIMEDOUT' })).toBe(ErrorCode.RequestTimeout)
  })

  it('should map ESOCKETTIMEDOUT to RequestTimeout', () => {
    expect(mapErrorCodeToStatus({ code: 'ESOCKETTIMEDOUT' })).toBe(ErrorCode.RequestTimeout)
  })

  it('should map message containing "timed out" to RequestTimeout', () => {
    expect(mapErrorCodeToStatus({ message: 'connection timed out' })).toBe(ErrorCode.RequestTimeout)
  })

  it('should map ECONNREFUSED to 503', () => {
    expect(mapErrorCodeToStatus({ code: 'ECONNREFUSED' })).toBe(503)
  })

  it('should map ECONNRESET to 503', () => {
    expect(mapErrorCodeToStatus({ code: 'ECONNRESET' })).toBe(503)
  })

  it('should map EAI_AGAIN to 503', () => {
    expect(mapErrorCodeToStatus({ code: 'EAI_AGAIN' })).toBe(503)
  })

  it('should map ENETUNREACH to 503', () => {
    expect(mapErrorCodeToStatus({ code: 'ENETUNREACH' })).toBe(503)
  })

  it('should map EHOSTUNREACH to 503', () => {
    expect(mapErrorCodeToStatus({ code: 'EHOSTUNREACH' })).toBe(503)
  })

  it('should map ENOTFOUND to 502', () => {
    expect(mapErrorCodeToStatus({ code: 'ENOTFOUND' })).toBe(502)
  })

  it('should map unknown error to undefined', () => {
    expect(mapErrorCodeToStatus({ code: 'UNKNOWN' })).toBeUndefined()
  })

  it('should respect existing numeric error codes >= 400', () => {
    expect(mapErrorCodeToStatus({ code: 512 })).toBe(512)
    expect(mapErrorCodeToStatus({ code: 404 })).toBe(404)
  })
})
