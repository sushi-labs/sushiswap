import { chainShortNameToChainId } from '@sushiswap/chain'

import { QuerycrossChainKashiPairsArgs } from '../.graphclient'
import { getBuiltGraphSDK } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

type GetPoolsQuery = Partial<{
  chainIds: QuerycrossChainKashiPairsArgs['chainIds']
  first: QuerycrossChainKashiPairsArgs['first']
  skip: number
  where: QuerycrossChainKashiPairsArgs['where']
  orderBy: QuerycrossChainKashiPairsArgs['orderBy']
  orderDirection: QuerycrossChainKashiPairsArgs['orderDirection']
}>

const sdk = getBuiltGraphSDK()

export const getPairs = async (query: GetPoolsQuery) => {
  const where = query?.where
  const first = query?.first ? Number(query?.first) : 20
  const skip = query?.skip ? Number(query?.skip) : 0
  const chainIds = Array.isArray(query?.chainIds) ? query.chainIds.map(Number) : SUPPORTED_CHAIN_IDS
  const orderBy = query?.orderBy || 'utilization'
  const orderDirection = query?.orderDirection || 'desc'
  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    first,
    skip,
    where,
    orderBy,
    orderDirection,
    chainIds,
  })
  return pairs
}

type GetPoolsForSymbolQuery = Partial<{
  first: QuerycrossChainKashiPairsArgs['first']
  skip: QuerycrossChainKashiPairsArgs['skip']
  orderBy: QuerycrossChainKashiPairsArgs['orderBy']
  orderDirection: QuerycrossChainKashiPairsArgs['orderDirection']
  where: QuerycrossChainKashiPairsArgs['where']
  chainIds: QuerycrossChainKashiPairsArgs['chainIds']
  symbol: string
}>

export const getPairsForSymbol = async (query: GetPoolsForSymbolQuery) => {
  const where = query?.where
  const chainIds = Array.isArray(query?.chainIds) ? query.chainIds.map(Number) : SUPPORTED_CHAIN_IDS
  const first = query?.first ? Number(query?.first) : 20
  const skip = query?.skip ? Number(query?.skip) : 0
  const orderBy = query?.orderBy || 'utilization'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
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
  const { crossChainKashiPair: pair } = await sdk.CrossChainKashiPair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })
  return pair
}
