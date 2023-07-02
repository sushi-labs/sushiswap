import { chainShortNameToChainId } from '@sushiswap/chain'
import { type NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: ['/swap/:path*', '/pool/:path*', '/pools/:path*'],
}

const shortNameIdRegexp = new RegExp(/(\w+):0x.*?(?=(?:\/|$))/)

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

  if (pathname.startsWith('/earn') || pathname.startsWith('/pools') || pathname.startsWith('/pool')) {
    if ((pathname === '/earn/add' || pathname === '/pools/add' || pathname === '/pool/add') && search === '') {
      const url = req.nextUrl.clone()
      url.search = '?fromCurrency=NATIVE'
      return NextResponse.redirect(url)
    }

    if ((pathname === '/earn/add/v2' || pathname === '/pools/add/v2' || pathname === '/pool/add/v2') && search === '') {
      const url = req.nextUrl.clone()
      url.pathname = '/add/v2/1'
      return NextResponse.redirect(url)
    }

    // Matches paths that include /arb1:0x1234abcd/, starts and ends after '/'
    const match = pathname.match(shortNameIdRegexp)
    if (match?.length) {
      const pairId = pathname.match(shortNameIdRegexp)?.[0] as string
      const [chainShortName, address] = pairId.split(':')
      const chainId = String(chainShortNameToChainId[chainShortName])

      // Already rewritten / invalid chainShortName
      if (chainId === 'undefined') return NextResponse.next()

      const url = req.nextUrl.clone()
      url.pathname = pathname.replace(pairId, `${chainId}:${address}`)

      return NextResponse.redirect(url)
    }
  }
}
