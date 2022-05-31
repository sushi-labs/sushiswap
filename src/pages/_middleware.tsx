import { ChainSubdomain } from 'app/enums'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const SUBDOMAIN_CHAIN_ID: { [subdomain: string]: string } = {
  [ChainSubdomain.ETHEREUM]: '1',
  [ChainSubdomain.ROPSTEN]: '3',
  [ChainSubdomain.RINKEBY]: '4',
  [ChainSubdomain.GÖRLI]: '5',
  [ChainSubdomain.KOVAN]: '42',
  [ChainSubdomain.POLYGON]: '137',
  [ChainSubdomain.BSC]: '56',
  [ChainSubdomain.FANTOM]: '250',
  [ChainSubdomain.GNOSIS]: '100',
  [ChainSubdomain.ARBITRUM]: '42161',
  [ChainSubdomain.AVALANCHE]: '43114',
  [ChainSubdomain.HECO]: '128',
  [ChainSubdomain.HARMONY]: '1666600000',
  [ChainSubdomain.OKEX]: '66',
  [ChainSubdomain.CELO]: '42220',
  [ChainSubdomain.PALM]: '11297108109',
  [ChainSubdomain.MOONRIVER]: '1285',
  [ChainSubdomain.FUSE]: '122',
  [ChainSubdomain.TELOS]: '40',
  [ChainSubdomain.MOONBEAM]: '1284',
}

const DEFAULT_CHAIN_ID = '1'

export function middleware(req: NextRequest) {
  // const response = NextResponse.next()

  const chainId = req.cookies['chain-id']

  const subdomain = req.headers.get('host')?.split('.')[0]

  const res = NextResponse.next()

  // If chainId already set and no subdomain, just return...
  if (chainId && !subdomain) {
    return res
  }

  if (subdomain && subdomain in SUBDOMAIN_CHAIN_ID) {
    // set the `cookie`
    res.cookie('chain-id', SUBDOMAIN_CHAIN_ID[subdomain], { sameSite: 'none', secure: true })
  } else {
    res.clearCookie('chain-id')
  }

  // return the res
  return res
}
