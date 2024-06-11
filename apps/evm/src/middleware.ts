import { type NextRequest, NextResponse } from 'next/server'
import { ChainId, chainShortNameToChainId } from 'sushi/chain'

export const config = {
  matcher: ['/swap/:path*', '/pool/:path*', '/pools/:path*'],
}

const shortNameIdRegexp = new RegExp(/(\w+):0x.*?(?=(?:\/|$))/)

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, search } = req.nextUrl
  if (pathname === '/swap' && search !== '') {
    const url = req.nextUrl.clone()
    if (searchParams.has('token0') && searchParams.has('token1')) {
      const token0 = searchParams.get('token0')?.toLowerCase()
      const token1 = searchParams.get('token1')?.toLowerCase()

      // Tokens cant be the same
      if (token0 === token1) {
        searchParams.delete('token0')
        searchParams.delete('token1')
        url.search = `?${searchParams.toString()}`
        return NextResponse.redirect(url)
      }
    }
  }

  if (pathname.toLowerCase() === '/swap/skale') {
    return NextResponse.redirect(
      new URL(`/swap?chainId=${ChainId.SKALE_EUROPA}`, req.url),
    )
  }

  if (pathname === '/swap/cross-chain' && search !== '') {
    const url = req.nextUrl.clone()
    if (searchParams.has('chainId0') && searchParams.has('chainId1')) {
      const chainId0 = searchParams.get('chainId0')?.toLowerCase()
      const chainId1 = searchParams.get('chainId1')?.toLowerCase()

      // ChainIds cant be the same
      if (chainId0 === chainId1) {
        searchParams.delete('chainId0')
        searchParams.delete('chainId1')
        searchParams.delete('token0')
        searchParams.delete('token1')
        url.search = `?${searchParams.toString()}`
        return NextResponse.redirect(url)
      }
    }
  }

  if (pathname.startsWith('/pool')) {
    if (pathname === '/pool/add' && search === '') {
      const url = req.nextUrl.clone()
      url.search = '?fromCurrency=NATIVE'
      return NextResponse.redirect(url)
    }

    if (pathname === '/pool/add/v2' && search === '') {
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
