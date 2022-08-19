import { OrderDirection, Pair_orderBy } from '../.graphclient'
import { ENABLED_NETWORKS } from '../config'

type GetPoolsQuery = Partial<{
  where: string
  first: number
  skip: number
  orderBy: Pair_orderBy
  orderDirection: OrderDirection
  networks?: string
}>

export const getPairs = async (query?: GetPoolsQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const where = JSON.parse(query?.where || '{}')
  const networks = JSON.parse(query?.networks || JSON.stringify(ENABLED_NETWORKS))
  const orderBy = query?.orderBy || 'liquidityUSD'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: networks,
    first: Math.ceil(60 / networks.length),
    skip: 0,
    ...(query && { where, orderBy, orderDirection }),
    now: Math.round(new Date().getTime() / 1000),
  })

  return pairs
}

export const getStats = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const { crossChainStats: stats } = await sdk.CrossChainStats({
    chainIds: ENABLED_NETWORKS,
    first: 1000,
    now: Math.round(new Date().getTime() / 1000),
  })

  return stats
}
