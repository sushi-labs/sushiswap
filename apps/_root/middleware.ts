import { NextResponse, type NextRequest } from 'next/server'

export const config = {
  matcher: ['/swap/:path*'],
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, search } = req.nextUrl
  if (pathname === '/swap' && search !== '') {
    const url = req.nextUrl.clone()
    if (searchParams.has('chainId') && searchParams.has('token0') && searchParams.has('token1')) {
      const chainId = searchParams.get('chainId')
      const token0 = searchParams.get('token0')
      const token1 = searchParams.get('token1')
      url.search = `?fromChainId=${chainId}&fromCurrency=${token0}&toChainId=${chainId}&toCurrency=${token1}`
      return NextResponse.redirect(url)
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
      url.search = `?fromChainId=${srcChainId}&fromCurrency=${srcToken}&toChainId=${dstChainId}&toCurrency=${dstToken}`
      return NextResponse.redirect(url)
    }
  }
}
