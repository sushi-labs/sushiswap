import { ChainId } from '@sushiswap/chain'

import { KashiPair_orderBy, OrderDirection } from '../.graphclient'

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
  const orderBy = query?.orderBy || 'kpi.supplyAPR'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainKashiPairs: pairs } = await sdk.CrossChainKashiPairs({
    chainIds: [ChainId.ARBITRUM, ChainId.POLYGON],
    first: 20,
    ...(query && { where, orderBy, orderDirection }),
  })

  return pairs
}
