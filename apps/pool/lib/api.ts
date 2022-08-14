import { chainShortNameToChainId } from '@sushiswap/chain'
import { getUnixTime, subMonths } from 'date-fns'

import { CrossChainFarmsQuery, OrderDirection, Pair_orderBy } from '../.graphclient'
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

type GetPoolsQuery = Partial<{
  where: string
  first: number
  skip: number
  orderBy: Pair_orderBy
  orderDirection: OrderDirection
}>

export const getPools = async (query?: GetPoolsQuery) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const where = JSON.parse(query?.where || '{}')
  const first = query?.first || 20
  const skip = query?.skip || 0
  const orderBy = query?.orderBy || 'liquidityUSD'
  const orderDirection = query?.orderDirection || 'desc'

  const { crossChainPairs: pairs } = await sdk.CrossChainPairs({
    chainIds: AMM_ENABLED_NETWORKS,
    first: 1000,
    skip: 0,
    ...(query && { where, orderBy, orderDirection }),
  })

  return pairs
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

export const getUser = async (id: string) => {
  const { getBuiltGraphSDK } = await import('../.graphclient')
  const sdk = getBuiltGraphSDK()

  const { crossChainUser: user } = await sdk.CrossChainUser({
    chainIds: AMM_ENABLED_NETWORKS,
    id: id.toLowerCase(),
  })

  return user
}
