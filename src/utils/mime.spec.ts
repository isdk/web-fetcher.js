import { describe, it, expect } from 'vitest'
import { normalizeMimeTypes } from './mime'

describe('normalizeMimeTypes', () => {
  it('should lowercase and trim each type', () => {
    expect(normalizeMimeTypes(['Application/PDF', '  text/csv '])).toEqual([
      'application/pdf',
      'text/csv',
    ])
  })

  it('should drop empty strings', () => {
    expect(normalizeMimeTypes(['', '  ', 'application/pdf'])).toEqual([
      'application/pdf',
    ])
  })

  it('should deduplicate while preserving order', () => {
    expect(
      normalizeMimeTypes(['application/pdf', 'text/plain', 'application/pdf'])
    ).toEqual(['application/pdf', 'text/plain'])
  })

  it('should keep the */* wildcard as-is', () => {
    expect(normalizeMimeTypes(['*/*', 'text/plain'])).toEqual([
      '*/*',
      'text/plain',
    ])
  })

  it('should return empty array for empty input', () => {
    expect(normalizeMimeTypes([])).toEqual([])
  })
})
