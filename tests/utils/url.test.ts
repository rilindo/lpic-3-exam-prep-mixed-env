import { describe, it, expect } from 'vitest'
import { sanitizeUrl } from '../../src/utils/url'

describe('sanitizeUrl', () => {
  it('allows https URLs', () => {
    expect(sanitizeUrl('https://www.samba.org/samba/docs/')).toBe(
      'https://www.samba.org/samba/docs/',
    )
  })

  it('allows http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
  })

  it('blocks javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#')
  })

  it('blocks data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#')
  })

  it('blocks vbscript: URLs', () => {
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#')
  })

  it('returns # for invalid URLs', () => {
    expect(sanitizeUrl('not a url')).toBe('#')
  })

  it('returns # for empty string', () => {
    expect(sanitizeUrl('')).toBe('#')
  })
})
