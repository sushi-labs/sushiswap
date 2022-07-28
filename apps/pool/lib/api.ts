import { OrderDirection, Pair_filter, Pair_orderBy, PairHourDatasQueryVariables } from '../.graphclient'
import { ENABLED_NETWORKS } from '../config'

export const getBundles = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainBundles: bundles } = await sdk.CrossChainBundles({
    chainIds: ENABLED_NETWORKS,
  })

  return bundles.reduce((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

type GetPoolsQuery = Partial<{
  where: Pair_filter
  first: number
  skip: number
  orderBy: Pair_orderBy
  orderDirection: OrderDirection
}>

export const getPools = async (query?: GetPoolsQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const where = query?.where || {}
  const first = query?.first || 20
  const skip = query?.skip || 0
  const orderBy = query?.orderBy || 'reserveETH'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: ENABLED_NETWORKS,
    first: 20,
    skip: 0,
    ...(query && { where, orderBy, orderDirection }),
  })

  return pairs
}

export const getPool = async (id: string) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { pair } = await sdk.Pair({ id, now: Math.round(new Date().getTime() / 1000) })
  return pair
}

export const getPairHourDatas = async (query?: PairHourDatasQueryVariables) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { pairHourDatas } = await sdk.PairHourDatas(query)
  return pairHourDatas
}
