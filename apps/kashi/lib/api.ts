import { chainShortNameToChainId } from '@sushiswap/chain'

import { KashiPair_orderBy, OrderDirection } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

type GetPoolsQuery = Partial<{
  where: string
  first: number
  skip: number
  orderBy: KashiPair_orderBy
  orderDirection: OrderDirection
}>

export const getPairs = async (query?: GetPoolsQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const where = JSON.parse(query?.where || '{}')
  const first = query?.first || 20
  const skip = query?.skip || 0
  const orderBy = query?.orderBy || 'supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 20,
    ...(query && { where, orderBy, orderDirection }),
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
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const orderBy = query?.orderBy || 'supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 20,
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
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainKashiPair: pair } = await sdk.CrossChainKashiPair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })

  return pair
}
