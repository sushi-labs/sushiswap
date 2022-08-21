import { QuerypairsArgs } from '../.graphclient'
import { ENABLED_NETWORKS } from '../config'

export type GetPairsQuery = QuerypairsArgs & { networks: string }

export const getPairs = async (query: GetPairsQuery) => {
  try {
    const { getBuiltGraphSDK } = await import('../.graphclient')
    const { CrossChainPairs } = getBuiltGraphSDK()
    const first = query?.first && !isNaN(Number(query.first)) ? Number(query.first) : 20
    const skip = query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    const where = query?.where ? query.where : undefined
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : ENABLED_NETWORKS
    const { crossChainPairs } = await CrossChainPairs({
      first,
      skip,
      where,
      orderBy,
      orderDirection,
      chainIds,
      now: Math.round(new Date().getTime() / 1000),
    })
    return crossChainPairs
  } catch (error) {
    throw new Error(error)
  }
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

export const getCharts = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const { crossChainFactoryDaySnapshots } = await sdk.CrossChainFactoryDaySnapshots({
    chainIds: ENABLED_NETWORKS,
    first: 1000,
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
