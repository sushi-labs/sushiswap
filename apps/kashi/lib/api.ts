import { chainShortNameToChainId } from '@sushiswap/chain'

import { KashiPair_filter, KashiPair_orderBy, OrderDirection } from '../.graphclient'
import { getBuiltGraphSDK } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

type GetPoolsQuery = Partial<{
  first: number
  skip: number
  where: KashiPair_filter
  orderBy: KashiPair_orderBy
  orderDirection: OrderDirection
}>

const sdk = getBuiltGraphSDK()

export const getPairs = async (query?: GetPoolsQuery) => {
  const where = query?.where || {}
  const first = query?.first || 20
  const skip = query?.skip || 0
  const orderBy = query?.orderBy || 'supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    first,
    where,
    orderBy,
    orderDirection,
    chainIds: SUPPORTED_CHAIN_IDS,
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
