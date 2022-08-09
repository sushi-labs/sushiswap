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
  first: number
  skip: number
  orderBy: KashiPair_orderBy
  orderDirection: OrderDirection
}>

export const getPairsForSymbol = async (query?: GetPoolsForSymbolQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const orderBy = query?.orderBy || 'supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 20,
    ...(query && { where: { symbol_contains_nocase: query.symbol }, orderBy, orderDirection }),
  })

  return pairs.filter((el) => el.asset.symbol.toLowerCase() === query.symbol)
}
