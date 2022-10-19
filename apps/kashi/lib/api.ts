import { chainShortNameToChainId } from '@sushiswap/chain'

import { getBuiltGraphSDK, QuerypairsArgs } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

const sdk = getBuiltGraphSDK()

export const getPairs = async (query: Partial<QuerypairsArgs>) => {
  const where = query?.where
  const first = query?.first ? Number(query?.first) : 20
  const skip = query?.skip ? Number(query?.skip) : 0
  const chainIds =
    Array.isArray(query.chainIds) && query.chainIds.every((chainId) => SUPPORTED_CHAIN_IDS.includes(chainId))
      ? query.chainIds.map(Number)
      : SUPPORTED_CHAIN_IDS
  const orderBy = query?.orderBy || 'utilization'
  const orderDirection = query?.orderDirection || 'desc'
  const { pairs } = await sdk.pairs({
    first,
    skip,
    where,
    orderBy,
    orderDirection,
    chainIds,
  })
  return pairs
}

export const getPairsForSymbol = async (query: Partial<QuerypairsArgs & { symbol: string }>) => {
  const where = query?.where
  const chainIds =
    Array.isArray(query.chainIds) && query.chainIds.every((chainId) => SUPPORTED_CHAIN_IDS.includes(chainId))
      ? query.chainIds.map(Number)
      : SUPPORTED_CHAIN_IDS
  const first = query?.first ? Number(query?.first) : 20
  const skip = query?.skip ? Number(query?.skip) : 0
  const orderBy = query?.orderBy || 'utilization'
  const orderDirection = query?.orderDirection || 'desc'

  const { pairs } = await sdk.pairs({
    chainIds,
    first,
    skip,
    where,
    orderBy,
    orderDirection,
  })

  return pairs
}

export const getPair = async (id: string) => {
  const { pair } = await sdk.pair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })
  return pair
}
