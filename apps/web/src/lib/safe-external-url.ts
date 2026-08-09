/**
 * Validates a URL that comes from untrusted data (token metadata, CMS fields)
 * before it is rendered as a link or navigation target. Only `http:`/`https:`
 * URLs are allowed; anything else (`javascript:`, `data:`, `vbscript:`, or
 * unparseable input) returns `undefined` so callers can omit the link.
 */
export function getSafeExternalUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) return undefined

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return undefined
  }

  return parsed.toString()
}
