import type { ChainId } from '@sushiswap/chain'
import type {} from '@sushiswap/database'
import type { getPool as getPoolOriginal } from '@sushiswap/pools-api/lib/api'
import { PoolApiSchema } from '@sushiswap/pools-api/lib/schemas'
import { fetch } from '@whatwg-node/fetch'
import type { GetApiInputFromOutput } from 'src/types'
import useSWR from 'swr'

import { POOL_API } from '.'

export { PoolApiSchema }
export type Pool = Awaited<ReturnType<typeof getPoolOriginal>>
export type GetPoolArgs = GetApiInputFromOutput<(typeof PoolApiSchema)['_input'], (typeof PoolApiSchema)['_output']>

export const getPoolUrl = (args: GetPoolArgs | string) => {
  let chainId, address
  if (typeof args === 'string') {
    ;[chainId, address] = args.split(':') as [ChainId, string]
  } else {
    ;[chainId, address] = [args.chainId, args.address]
  }

  return `${POOL_API}/api/v0/${chainId}/${address}`
}

export const getPool = async (args: GetPoolArgs | string): Promise<Pool> => {
  return fetch(getPoolUrl(args)).then((data) => data.json())
}

export const usePool = (args: GetPoolArgs | string, shouldFetch = true) => {
  return useSWR<Pool>(shouldFetch ? getPoolUrl(args) : null, async (url) => fetch(url).then((data) => data.json()))
}
