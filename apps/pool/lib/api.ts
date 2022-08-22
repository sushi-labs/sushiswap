import { chainShortNameToChainId } from '@sushiswap/chain'
import { getUnixTime, subMonths } from 'date-fns'

import { CrossChainFarmsQuery, QuerypairsArgs } from '../.graphclient'
import { AMM_ENABLED_NETWORKS, STAKING_ENABLED_NETWORKS } from '../config'

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

export type GetPoolsQuery = QuerypairsArgs & { networks: string }

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const { getBuiltGraphSDK } = await import('../.graphclient')
    const sdk = getBuiltGraphSDK()

    const first = query?.first && !isNaN(Number(query.first)) ? Number(query.first) : 20
    const skip = query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    const where = query?.where ? query.where : { liquidityUSD_gt: 5000 }
    const orderBy = query?.orderBy || 'apr'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : AMM_ENABLED_NETWORKS
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

export const getSushiBar = async (blockNumber?: number) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()
  return blockNumber ? (await sdk.Bar({ block: { number: blockNumber } })).bar : (await sdk.Bar()).bar
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

  const networks = JSON.parse(query?.networks || JSON.stringify(AMM_ENABLED_NETWORKS))

  const { crossChainUser: user } = await sdk.CrossChainUser({
    chainIds: networks,
    id: query?.id?.toLowerCase(),
  })

  return user
}
