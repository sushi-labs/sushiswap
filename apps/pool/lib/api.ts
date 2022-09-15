import { chainShortNameToChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK, QuerycrossChainPairsArgs } from '@sushiswap/graph-client/.graphclient'
import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays, subYears } from 'date-fns'

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
  return factories.reduce((previousValue, currentValue) => {
    if (chainIds.includes(currentValue.chainId)) {
      previousValue = previousValue + Number(currentValue.pairCount)
    }
    return previousValue
  }, 0)
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

export const getOneDayBlocks = async (chainIds: number[]) => {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return sdk.CrossChainBlocks({
    first: 1,
    skip: 0,
    // @ts-ignore
    where: { timestamp_gt: start, timestamp_lt: end },
    orderBy: 'timestamp',
    orderDirection: 'desc',
    chainIds,
  })
}

export const getOneWeekBlocks = async (chainIds: number[]) => {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 7))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return sdk.CrossChainBlocks({
    first: 1,
    skip: 0,
    // @ts-ignore
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
    const where =
      query && query.where
        ? { ...JSON.parse(query.where), aprUpdatedAtTimestamp_gt: start }
        : { aprUpdatedAtTimestamp_gt: start }
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS

    const [{ crossChainBlocks: oneDayBlocks }, { crossChainBlocks: oneWeekBlocks }] = await Promise.all([
      getOneDayBlocks(chainIds),
      getOneWeekBlocks(chainIds),
    ])

    const { crossChainPairs } = await sdk.CrossChainPairs({
      first,
      skip,
      where,
      orderBy,
      orderDirection,
      pagination,
      chainIds,
      oneDayBlockNumbers: oneDayBlocks.map((block) => Number(block.number)),
      oneWeekBlockNumbers: oneWeekBlocks.map((block) => Number(block.number)),
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

export const getOneYearBlock = async () => {
  const oneYearAgo = getUnixTime(startOfMinute(startOfHour(subYears(new Date(), 1))))

  const { blocks } = await sdk.Blocks({
    where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 },
  })

  return blocks
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
