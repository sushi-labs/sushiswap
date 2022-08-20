import { OrderDirection, Pair_orderBy } from '../.graphclient'
import { getBuiltGraphSDK } from '../.graphclient'
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
  const sdk = getBuiltGraphSDK()

  const where = JSON.parse(query?.where || '{}')
  const networks = JSON.parse(query?.networks || JSON.stringify(ENABLED_NETWORKS))
  const orderBy = query?.orderBy || 'liquidityUSD'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: networks,
    first: 20,
    skip: 0,
    ...(query && { where, orderBy, orderDirection }),
    now: Math.round(new Date().getTime() / 1000),
  })

  return pairs
}

export const getStats = async () => {
  const sdk = getBuiltGraphSDK()
  const { crossChainStats: stats } = await sdk.CrossChainStats({
    chainIds: ENABLED_NETWORKS,
    first: 1000,
    now: Math.round(new Date().getTime() / 1000),
  })

  return stats
}

export const getCharts = async () => {
  const sdk = getBuiltGraphSDK()
  const { crossChainFactoryDaySnapshots } = await sdk.CrossChainFactoryDaySnapshots({
    chainIds: ENABLED_NETWORKS,
    first: 365,
  })

  const dateSnapshotMap = new Map()

  for (const snapshot of crossChainFactoryDaySnapshots) {
    const value = dateSnapshotMap.get(snapshot.date)
    dateSnapshotMap.set(
      snapshot.date,
      value
        ? [value[0] + Number(snapshot.liquidityUSD), value[0] + Number(snapshot.volumeUSD)]
        : [Number(snapshot.liquidityUSD), Number(snapshot.volumeUSD)]
    )
  }

  // tvl x,y arrays
  const tvl: [number[], number[]] = [[], []]

  // vol x,y arrays
  const vol: [number[], number[]] = [[], []]

  dateSnapshotMap.forEach(([liquidity, volume], date) => {
    tvl[0].push(date)
    tvl[1].push(liquidity)

    vol[0].push(date)
    vol[1].push(volume)
  })

  return [tvl, vol]
}
