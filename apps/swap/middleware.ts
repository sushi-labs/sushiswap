import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, search } = req.nextUrl

  if (pathname === '/') {
    const url = req.nextUrl.clone()

    if (search === '') {
      url.pathname = '/1:NATIVE/1:SUSHI'
    } else {
      if (searchParams.has('chainId') && searchParams.has('token0') && searchParams.has('token1')) {
        const chainId = searchParams.get('chainId')
        const token0 = searchParams.get('token0')
        const token1 = searchParams.get('token1')
        url.search = ''
        url.pathname = `/${chainId}:${token0}/${chainId}:${token1}`
      } else if (
        searchParams.has('srcChainId') &&
        searchParams.has('srcToken') &&
        searchParams.has('dstChainId') &&
        searchParams.has('dstToken')
      ) {
        const srcChainId = searchParams.get('srcChainId')
        const srcToken = searchParams.get('srcToken')
        const dstChainId = searchParams.get('dstChainId')
        const dstToken = searchParams.get('dstToken')
        // ?srcToken=ETH&dstToken=ETH&srcChainId=1&dstChainId=42161
        url.search = ''
        url.pathname = `/${srcChainId}:${srcToken}/${dstChainId}:${dstToken}`
      }
    }

    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/')) return NextResponse.next()
}
