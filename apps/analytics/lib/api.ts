import { QuerycrossChainPairsArgs } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export const getPoolCount = async (query?: GetPoolCountQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainFactories: factories } = await sdk.CrossChainFactories({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

  return factories.reduce((sum, cur) => {
    if (chainIds.includes(cur.chainId)) {
      sum = sum + +cur.pairCount
    }

    return sum
  }, 0)
}

export type GetPoolsQuery = Omit<QuerycrossChainPairsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
}

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const { getBuiltGraphSDK } = await import('../.graphclient')
    const sdk = getBuiltGraphSDK()

    const pagination: QuerycrossChainPairsArgs['pagination'] = query?.pagination
      ? JSON.parse(query?.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const first = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 20
    const skip = 0 // query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    // const first = 1000
    // const skip = 0
    const where = { ...(query?.where && { ...JSON.parse(query.where) }) }
    const orderBy = query?.orderBy || 'apr'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

    const { crossChainPairs } = await sdk.CrossChainPairs({
      first,
      skip,
      pagination,
      where,
      orderBy,
      orderDirection,
      chainIds,
      now: Math.round(new Date().getTime() / 1000),
    })

    return crossChainPairs
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getStats = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const { crossChainStats: stats } = await sdk.CrossChainStats({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 1000,
    now: Math.round(new Date().getTime() / 1000),
  })

  return stats
}

export const getCharts = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const { crossChainFactoryDaySnapshots } = await sdk.CrossChainFactoryDaySnapshots({
    chainIds: SUPPORTED_CHAIN_IDS,
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
