import { type NextRequest, NextResponse } from 'next/server'
import { getChainById, getChainByKey, isChainId, isChainKey } from 'sushi'
import { getEvmChainById, isSushiSwapChainId } from 'sushi/evm'

export const config = {
  matcher: [
    '/swap/:path*',
    '/limit/:path*',
    '/dca/:path*',
    '/cross-chain-swap/:path*',
    '/pool',
    '/pools',
    '/explore',
    '/:chainId/swap/:path*',
    '/:chainId/limit/:path*',
    '/:chainId/dca/:path*',
    '/:chainId/cross-chain-swap/:path*',
    '/:chainId/explore/:path*',
    '/:chainId/pool/:path*',
    '/:chainId/token/:path*',
    '/:chainId/positions/:path*',
    '/:chainId/migrate',
    '/:chainId/rewards',
    '/portal/:path*',
  ],
}

export async function middleware(req: NextRequest) {
  const { pathname, searchParams, search } = req.nextUrl

  if (pathname === 'portal' || pathname.startsWith('/portal/')) {
    const portalMiddleware = (await import('./app/portal/middleware'))
      .portalMiddleware
    return portalMiddleware(req)
  }

  if (
    pathname === '/explore' ||
    pathname === '/pools' ||
    pathname === '/pool' ||
    pathname === '/token' ||
    pathname === '/swap' ||
    pathname === '/limit' ||
    pathname === '/dca' ||
    pathname === '/cross-chain-swap'
  ) {
    const path = ['/explore', '/pools'].includes(pathname)
      ? 'explore/pools'
      : pathname.slice(1)

    const cookie = req.cookies.get('wagmi.store')
    if (cookie) {
      const wagmiState = JSON.parse(cookie.value)
      const chainId = wagmiState?.state?.chainId
      if (isSushiSwapChainId(chainId)) {
        return NextResponse.redirect(
          new URL(`/${getEvmChainById(chainId).key}/${path}`, req.url),
        )
      }
    }

    return NextResponse.redirect(new URL(`/ethereum/${path}`, req.url))
  }

  const networkNameMatch = pathname.match(
    /([\w-]+)(?=\/swap|\/limit|\/dca|\/cross-chain-swap|\/explore|\/pool|\/token|\/positions|\/rewards|\/migrate)/,
  )
  if (networkNameMatch?.length) {
    let chain

    const _chainId = Number.parseInt(networkNameMatch[0])
    if (isChainId(_chainId)) {
      chain = getChainById(_chainId)
    } else if (isChainKey(networkNameMatch[0])) {
      chain = getChainByKey(networkNameMatch[0])
    }

    if (!chain) return NextResponse.next()

    const url = req.nextUrl.clone()

    const page = pathname.split('/')[2]

    if (page === 'swap') {
      if (
        search !== '' &&
        searchParams.has('token0') &&
        searchParams.has('token1')
      ) {
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

    if (page === 'cross-chain-swap') {
      if (search !== '' && searchParams.has('chainId1')) {
        const chainId1 = searchParams.get('chainId1')?.toLowerCase()

        // ChainIds cant be the same
        if (chain.chainId.toString() === chainId1) {
          searchParams.delete('chainId1')
          searchParams.delete('token0')
          searchParams.delete('token1')
          url.search = `?${searchParams.toString()}`
          return NextResponse.redirect(url)
        }
      }
    }

    url.pathname = pathname.replace(chain.key, chain.chainId.toString())

    return NextResponse.rewrite(url)
  }
}
