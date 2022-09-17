import { NextRequest, NextResponse } from 'next/server'

const allowedParams = ['srcToken', 'dstToken', 'srcChainId', 'dstChainId', 'srcTypedAmount']

export const config = {
  matcher: '/xswap',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  let changed = false

  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  })

  // Avoid infinite loop by only redirecting if the query
  // params were changed
  if (changed) {
    return NextResponse.rewrite(url)
  }
}
