import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ChainId } from 'chain'
import { subdomainToChainIdMap } from 'app/lib/constants/subdomainChainMap'
import { DEFAULT_CHAIN_ID } from 'app/lib/constants/defaults'

const parseChainIdFromSubdomain = (host: ReturnType<Headers['get']>): ChainId => {
  const subdomain = host?.split('.')[0]
  const matchedChainId = subdomain ? subdomainToChainIdMap[subdomain] : undefined
  return matchedChainId ? matchedChainId : DEFAULT_CHAIN_ID
}

export function middleware(req: NextRequest) {
  const cookieSetChainId = req.cookies['chain-id']
  const subdomainSetChainId = parseChainIdFromSubdomain(req.headers.get('host'))

  const response = NextResponse.next()

  const subdomainMatchesCookie = cookieSetChainId && parseInt(cookieSetChainId) === subdomainSetChainId
  if (subdomainMatchesCookie) {
    return response
  } else {
    response.cookie('chain-id', subdomainSetChainId.toString())
    return response
  }
}
