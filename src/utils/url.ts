/**
 * Returns the URL string if the scheme is http or https.
 * Falls back to '#' for any other scheme (e.g. javascript:, data:, vbscript:)
 * to prevent href injection from question bank data.
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url
    }
  } catch {
    // Invalid URL — fall through to safe fallback
  }
  return '#'
}
