import { chainShortNameToChainId } from '@sushiswap/chain'
import { NextResponse, type NextRequest } from 'next/server'

const shortNameIdRegexp = new RegExp(/(\w+):0x.*?(?=(?:\/|$))/)

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (pathname === '/add' && search === '') {
    const url = req.nextUrl.clone()
    url.search = '?fromCurrency=NATIVE'
    return NextResponse.redirect(url)
  }

  if (pathname === '/add/v2') {
    const url = req.nextUrl.clone()
    url.pathname = '/add/v2/1'
    return NextResponse.redirect(url)
  }

  // Index handling
  // if (pathname === '/' && search !== '') {
  //   const url = req.nextUrl.clone()
  //   url.pathname = '/csr'
  //   return NextResponse.rewrite(url)
  // }

  // Matches paths that include /arb1:0x1234abcd/, starts and ends after '/'
  if (pathname.match(shortNameIdRegexp)) {
    // eslint-disable-next-line
    const pairId = pathname.match(shortNameIdRegexp)![0]
    const [chainShortName, address] = pairId.split(':')
    const chainId = String(chainShortNameToChainId[chainShortName])

    // Already rewritten / invalid chainShortName
    if (chainId === 'undefined') return NextResponse.next()

    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(pairId, `${chainId}:${address}`)

    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/')) return NextResponse.next()
}
