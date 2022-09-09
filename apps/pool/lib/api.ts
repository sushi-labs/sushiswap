import { chainShortNameToChainId } from '@sushiswap/chain'
import {
  addSeconds,
  getUnixTime,
  startOfHour,
  startOfMinute,
  startOfSecond,
  subDays,
  subMonths,
  subYears,
} from 'date-fns'

import { getBuiltGraphSDK, QuerycrossChainPairsArgs } from '../.graphclient'
import { SUPPORTED_CHAIN_IDS } from '../config'

const sdk = getBuiltGraphSDK()

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export const getPoolCount = async (query?: GetPoolCountQuery) => {
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

export const getFactories = async () => {
  const { crossChainFactories: factories } = await sdk.CrossChainFactories({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  return factories.reduce((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

export const getBundles = async () => {
  const { crossChainBundles: bundles } = await sdk.CrossChainBundles({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  return bundles.reduce((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

export const getOneDayBlocks = async (chainIds: string[]) => {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  console.log('getOneDayBlocks', chainIds)
  return sdk.CrossChainBlocks({
    first: 1,
    skip: 0,
    where: { timestamp_gt: start, timestamp_lt: end },
    orderBy: 'timestamp',
    orderDirection: 'desc',
    chainIds,
  })
}

export type GetPoolsQuery = Omit<QuerycrossChainPairsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
}

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
    const start = getUnixTime(date)

    const pagination: QuerycrossChainPairsArgs['pagination'] = query?.pagination
      ? JSON.parse(query?.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const first = pagination?.pageIndex && pagination?.pageSize ? (pagination.pageIndex + 1) * pagination.pageSize : 20
    const skip = 0 // query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    // const first = 1000
    // const skip = 0
    const where = query?.where
      ? { ...JSON.parse(query.where), aprUpdatedAtTimestamp_gt: start }
      : { aprUpdatedAtTimestamp_gt: start }
    const orderBy = query?.orderBy || 'apr'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

    const { crossChainBlocks: oneDayBlocks } = await getOneDayBlocks(chainIds)

    const { crossChainPairs } = await sdk.CrossChainPairs({
      first,
      skip,
      pagination,
      where,
      orderBy,
      orderDirection,
      chainIds,
      oneDayBlockNumbers: oneDayBlocks.map((block) => block.number),
      now: Math.round(new Date().getTime() / 1000),
    })

    return crossChainPairs
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getPool = async (id: string) => {
  const { crossChainPair: pair } = await sdk.CrossChainPair({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: chainShortNameToChainId[id.split(':')[0]],
    now: Math.round(new Date().getTime() / 1000),
  })

  return pair
}

export const getOneMonthBlock = async () => {
  const oneMonthAgo = getUnixTime(subMonths(new Date(), 1))

  return await (
    await sdk.EthereumBlocks({ where: { timestamp_gt: oneMonthAgo, timestamp_lt: oneMonthAgo + 30000 } })
  ).blocks
}

export const getOneYearBlock = async () => {
  const oneYearAgo = getUnixTime(subYears(new Date(), 1))

  return await (
    await sdk.EthereumBlocks({ where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 } })
  ).blocks
}

export const getSushiBar = async () => {
  const { xsushi } = await sdk.Bar()
  return xsushi
}

export type GetUserQuery = {
  id: string
  networks: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || JSON.stringify(SUPPORTED_CHAIN_IDS))
  const { crossChainUser: user } = await sdk.CrossChainUser({
    chainIds: networks,
    id: query.id.toLowerCase(),
    now: Math.round(new Date().getTime() / 1000),
  })

  return user
}
