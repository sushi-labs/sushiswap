import { Bundle, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { getUnixTime, startOfHour, startOfMinute, subYears } from 'date-fns'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { GetUserArgs } from './hooks'
import { chainShortName } from '@sushiswap/chain'

const sdk = getBuiltGraphSDK()

export const getBundles = async () => {
  try {
    const { bundles } = await sdk.Bundles({
      chainIds: SUPPORTED_CHAIN_IDS,
    })
    return bundles.reduce<Record<number, Pick<Bundle, 'id' | 'chainId' | 'nativePrice'>>>((acc, cur) => {
      acc[cur.chainId] = cur
      return acc
    }, {})
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getGraphPool = async (id: string) => {
  if (!id.includes(':')) throw Error('Invalid pair id')
  // Migrating to new format, graph-client uses the deprecated one
  const split = id.split(':')
  const { pair } = await sdk.PairById({
    id: `${chainShortName[split[0]]}:${split[1]}`,
  })
  return pair
}

export const getGraphPools = async (ids: string[]) => {
  if (!ids.every((id) => id.includes(':'))) throw Error('Invalid pair ids')

  // Migrating to new format, graph-client uses the deprecated one
  const addresses = ids.map((id) => id.split(':')[1])

  // PairsByIds would be better, not implemented though...
  // Need to hack around
  const { pairs } = await sdk.PairsByChainIds({
    chainIds: Array.from(new Set(ids.map((id) => Number(id.split(':')[0])))),
    where: {
      id_in: addresses,
    },
  })

  return (
    pairs
      .map((pair) => ({ ...pair, id: `${pair.chainId}:${pair.address}` }))
      // To prevent possible (although unlikely) collisions
      .filter((pair) => ids.includes(pair.id))
  )
}

export const getOneYearBlock = async () => {
  const oneYearAgo = getUnixTime(startOfMinute(startOfHour(subYears(new Date(), 1))))

  const { blocks } = await sdk.Blocks({
    where: { timestamp_gt: oneYearAgo, timestamp_lt: oneYearAgo + 30000 },
  })

  return blocks
}

export const getSushiBar = async () => {
  try {
    const { xsushi } = await sdk.Bar()
    return xsushi
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getUser = async (args: GetUserArgs) => {
  if (!args.id) return []

  const { crossChainUserPositions: user } = await sdk.CrossChainUserPositions({
    chainIds: args.chainIds || SUPPORTED_CHAIN_IDS,
    id: args.id.toLowerCase(),
  })
  return user
}

export const getAllV3Ticks = async (id: string) => {
  const [chainId, poolAddress] = id.split(':')
  if (!chainId || !poolAddress) throw Error('Invalid pool id')

  const { ticks } = await sdk.TicksById({
    id,
  })

  return ticks
}

export const getPoolsByTokenPair = async (tokenId0: string, tokenId1: string) => {
  const [chainId0, tokenAddress0] = tokenId0.split(':')
  if (!chainId0 || !tokenAddress0) throw Error('Invalid token0 id')

  const [chainId1, tokenAddress1] = tokenId1.split(':')
  if (!chainId1 || !tokenAddress1) throw Error('Invalid token1 id')

  if (chainId0 !== chainId1) throw Error('Tokens must be on the same chain')

  const { pools } = await sdk.PoolsByTokenPair({
    tokenId0,
    tokenId1,
  })

  return pools
}
