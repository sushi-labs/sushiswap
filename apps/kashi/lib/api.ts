import { chainShortNameToChainId } from '@sushiswap/chain'

import { KashiPair_orderBy, OrderDirection, QuerycrossChainKashiPairsArgs } from '../.graphclient'
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
  symbol: string
  asset: boolean
  first: number
  skip: number
  orderBy: KashiPair_orderBy
  orderDirection: OrderDirection
}>

export const getPairsForSymbol = async (query: GetPoolsForSymbolQuery) => {
  const orderBy = query?.orderBy || 'supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 10,
    ...(query && { where: { symbol_contains_nocase: query.symbol }, orderBy, orderDirection }),
  })

  return pairs.filter((el) => {
    if (query.asset) {
      return el.asset.symbol.toLowerCase() === query.symbol
    } else {
      return el.collateral.symbol.toLowerCase() === query.symbol
    }
  })
}

export const getPair = async (id: string) => {
  const { crossChainKashiPair: pair } = await sdk.CrossChainKashiPair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })
  return pair
}
