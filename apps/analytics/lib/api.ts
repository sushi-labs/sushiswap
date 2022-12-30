import { chainShortNameToChainId } from '@sushiswap/chain'
import {
  Bundle,
  getBuiltGraphSDK,
  Pagination,
  QuerypairsWithFarmsArgs,
  QuerytokensByChainIdsArgs,
} from '@sushiswap/graph-client'

import { SUPPORTED_CHAIN_IDS } from '../config'

const sdk = getBuiltGraphSDK()

export const getBundles = async () => {
  const { bundles } = await sdk.Bundles({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  return bundles.reduce<Record<number, Pick<Bundle, 'id' | 'chainId' | 'nativePrice'>>>((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export const getPoolCount = async (query?: GetPoolCountQuery) => {
  const { factories } = await sdk.Factories({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

  return factories.reduce((sum, cur) => {
    if (chainIds.includes(cur.chainId)) {
      sum = sum + Number(cur.pairCount)
    }
    return sum
  }, 0)
}

export type GetPoolsQuery = Omit<QuerypairsWithFarmsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
}

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const pagination: Pagination = query?.pagination
      ? JSON.parse(query.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const first = pagination?.pageIndex && pagination?.pageSize ? (pagination.pageIndex + 1) * pagination.pageSize : 20
    const skip = 0
    const where = query?.where ? { ...JSON.parse(query.where) } : {}
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

    const { pairs } = await sdk.PairsWithFarms({
      first,
      skip,
      pagination,
      where,
      orderBy,
      orderDirection,
      chainIds,
    })

    return pairs
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}

export type GetTokensQuery = Omit<QuerytokensByChainIdsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
}

export const getTokens = async (query?: GetTokensQuery) => {
  try {
    const pagination: Pagination = query?.pagination
      ? JSON.parse(query?.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const first = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 20
    const skip = 0
    const where = { ...(query?.where && { ...JSON.parse(query.where) }) }
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    const { tokens } = await sdk.TokensByChainIds({
      first,
      skip,
      pagination,
      where,
      orderBy,
      orderDirection,
      chainIds,
    })
    return tokens
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}

export const getToken = async (id: string) => {
  const { crossChainToken: token } = await sdk.CrossChainToken({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })

  return token
}

export type GetTokenCountQuery = Partial<{
  networks: string
}>

export const getTokenCount = async (query?: GetTokenCountQuery) => {
  const { factories } = await sdk.Factories({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

  return factories.reduce((sum, cur) => {
    if (chainIds.includes(cur.chainId)) {
      sum = sum + Number(cur.tokenCount)
    }

    return sum
  }, 0)
}

export const getStats = async () => {
  const { crossChainStats: stats } = await sdk.CrossChainStats({
    chainIds: SUPPORTED_CHAIN_IDS,
    first: 1000,
    now: Math.round(new Date().getTime() / 1000),
  })

  return stats
}

export const getCharts = async (query?: { networks: string }) => {
  const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
  const { factoryDaySnapshots } = await sdk.FactoryDaySnapshots({
    chainIds: chainIds,
    first: 1000,
  })

  const dateSnapshotMap = new Map()

  for (const snapshot of factoryDaySnapshots) {
    const value = dateSnapshotMap.get(snapshot.date)
    dateSnapshotMap.set(
      snapshot.date,
      value
        ? [value[0] + Number(snapshot.liquidityUSD), value[1] + Number(snapshot.volumeUSD)]
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
