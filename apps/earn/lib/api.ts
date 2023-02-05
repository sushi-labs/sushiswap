import { chainShortName } from '@sushiswap/chain'
import { Bundle, getBuiltGraphSDK } from '@sushiswap/graph-client'
import { getUnixTime, startOfHour, startOfMinute, subYears } from 'date-fns'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { GetUserArgs } from './hooks/api/useUserPositions'

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

export const getPool = async (id: string) => {
  if (!id.includes(':')) throw Error('Invalid pair id')
  // Migrating to new format, graph-client uses the deprecated one
  const split = id.split(':')
  const { pair } = await sdk.PairById({
    id: `${chainShortName[split[0]]}:${split[1]}`,
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
