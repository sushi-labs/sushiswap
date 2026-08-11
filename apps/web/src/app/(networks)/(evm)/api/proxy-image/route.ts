const HYPERLIQUID_ICON_ORIGIN = 'https://app.hyperliquid.xyz'
const HYPERLIQUID_ICON_PATH = /^\/coins\/[^/?#%]+\.svg$/

function getAllowedImageUrl(value: string): URL | undefined {
  try {
    const url = new URL(value)

    if (
      url.origin !== HYPERLIQUID_ICON_ORIGIN ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !HYPERLIQUID_ICON_PATH.test(url.pathname)
    ) {
      return undefined
    }

    return url
  } catch {
    return undefined
  }
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const value = searchParams.get('url')
  if (!value) return new Response('Missing url', { status: 400 })

  const url = getAllowedImageUrl(value)
  if (!url) return new Response('Invalid image url', { status: 400 })

  let response: Response
  try {
    response = await fetch(url, { redirect: 'error' })
  } catch {
    return new Response('Failed to fetch image', { status: 502 })
  }

  const contentType = response.headers.get('Content-Type')
  if (!response.ok || !contentType?.toLowerCase().startsWith('image/')) {
    return new Response('Upstream response is not an image', { status: 502 })
  }

  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
