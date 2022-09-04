import { chainShortNameToChainId } from '@sushiswap/chain'
import { getUnixTime, subMonths, subYears } from 'date-fns'

import { CrossChainFarmsQuery, QuerypairsArgs } from '../.graphclient'
import { AMM_ENABLED_NETWORKS, STAKING_ENABLED_NETWORKS, SUPPORTED_CHAIN_IDS } from '../config'

export const getBundles = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainBundles: bundles } = await sdk.CrossChainBundles({
    chainIds: AMM_ENABLED_NETWORKS,
  })

  return bundles.reduce((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

export type GetPoolsQuery = Omit<QuerypairsArgs, 'where'> & { networks: string; where?: string }

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const { getBuiltGraphSDK } = await import('../.graphclient')
    const sdk = getBuiltGraphSDK()

    const first = query?.first && !isNaN(Number(query.first)) ? Number(query.first) : 20
    const skip = query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    const where = { liquidityUSD_gt: 5000, ...(query?.where && { ...JSON.parse(query.where) }) }
    const orderBy = query?.orderBy || 'apr'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

    const { crossChainPairs } = await sdk.CrossChainPairs({
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
    console.log(error)
    throw new Error(error)
  }
}

export const getPool = async (id: string) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainPair: pair } = await sdk.CrossChainPair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })

  return pair
}

export const getOneMonthBlock = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))

  return await (
    await sdk.EthereumBlocks({ where: { timestamp_gt: oneMonthAgo, timestamp_lt: oneMonthAgo + 30000 } })
  ).blocks
}

export const getOneYearBlock = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  const oneYearAgo = getUnixTime(subYears(new Date(), 1))

  return await (
    await sdk.EthereumBlocks({ where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 } })
  ).blocks
}

export const getSushiBar = async () => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { xsushi } = await sdk.Bar()
  return xsushi
}

export const getFarms = async (query?: CrossChainFarmsQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { farms } = await sdk.CrossChainFarms({
    chainIds: STAKING_ENABLED_NETWORKS,
    first: 20,
    skip: 0,
    ...query,
  })

  return farms
}

type GetUserQuery = Partial<{
  id: string
  networks: string
}>

export const getUser = async (query?: GetUserQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const networks = JSON.parse(query?.networks || JSON.stringify(SUPPORTED_CHAIN_IDS))
  const { crossChainUser: user } = await sdk.CrossChainUser({
    chainIds: networks,
    id: query?.id?.toLowerCase(),
    now: Math.round(new Date().getTime() / 1000),
  })

  return user
}
