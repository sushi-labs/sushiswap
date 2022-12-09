import { getBuiltGraphSDK, Pagination, QuerypairsWithFarmsArgs, QueryswapsArgs, QuerymintsArgs, QueryburnsArgs } from '@sushiswap/graph-client'
import { getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays, subYears } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

import { SUPPORTED_CHAIN_IDS } from '../config'

const sdk = getBuiltGraphSDK()

export type GetPoolCountQuery = Partial<{
  networks: string
}>

export const getPoolCount = async (query?: GetPoolCountQuery) => {
  try {
    const { factories } = await sdk.Factories({
      chainIds: SUPPORTED_CHAIN_IDS,
    })
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    return factories.reduce((previousValue, currentValue) => {
      if (chainIds.includes(currentValue.chainId)) {
        previousValue = previousValue + Number(currentValue.pairCount)
      }
      return previousValue
    }, 0)
  } catch (error) {
    throw new Error(error)
  }
}

export const getBundles = async () => {
  try {
    const { bundles } = await sdk.Bundles({
      chainIds: SUPPORTED_CHAIN_IDS,
    })
    return bundles.reduce((acc, cur) => {
      acc[cur.chainId] = cur
      return acc
    }, {})
  } catch (error) {
    throw new Error(error)
  }
}

export type GetPoolsQuery = Omit<QuerypairsWithFarmsArgs, 'where' | 'pagination'> & {
  networks: string
  where?: string
  pagination: string
  farmsOnly?: string
}

export const getPools = async (query?: GetPoolsQuery) => {
  try {
    const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
    const start = getUnixTime(date)

    const pagination: Pagination = query?.pagination
      ? JSON.parse(query.pagination)
      : {
          pageIndex: 0,
          pageSize: 20,
        }
    const first = pagination?.pageIndex && pagination?.pageSize ? (pagination.pageIndex + 1) * pagination.pageSize : 20
    const skip = 0 // query?.skip && !isNaN(Number(query.skip)) ? Number(query.skip) : 0
    // const first = 1000
    // const skip = 0
    const where = query?.where ? { ...JSON.parse(query.where) } : {}
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks ? JSON.parse(query.networks) : SUPPORTED_CHAIN_IDS
    const farmsOnly = query?.farmsOnly === 'true'

    const { pairs } = await sdk.PairsWithFarms({
      first,
      skip,
      pagination,
      where,
      orderBy,
      orderDirection,
      chainIds,
      farmsOnly,
    })
    return pairs
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getPool = async (id: string) => {
  if (!id.includes(':')) throw Error('Invalid pair id')
  const { pair } = await sdk.PairById({
    id,
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
  } catch (error) {
    throw new Error(error)
  }
}

export type GetUserQuery = {
  id: string
  networks: string
}

export const getUser = async (query: GetUserQuery) => {
  const networks = JSON.parse(query?.networks || stringify(SUPPORTED_CHAIN_IDS))
  const { crossChainUserWithFarms: user } = await sdk.CrossChainUserWithFarms({
    chainIds: networks,
    id: query.id.toLowerCase(),
  })
  return user
}

export type GetSwapsQuery = Omit<QueryswapsArgs, 'where' | 'pagination'> & {
	pagination: string
}

export const getSwaps = async (chainId: number, pairId: string, query?: GetSwapsQuery) => {
  try {
    if (!chainId || !pairId) {
      throw Error('Invalid pair id or chain id')
    }
    const pagination: Pagination = query?.pagination ? JSON.parse(query.pagination) : { pageIndex: 0, pageSize: 20 }
    const first = 20
    const skip = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 0;
    const orderBy = query?.orderBy || 'timestamp'
    const orderDirection = query?.orderDirection || 'desc'
    const where = {
      pair_: {
        id: pairId,
      }
    }
    const { swaps } = await sdk.SwapsByChainId({ first, skip, where, orderBy, orderDirection, chainId})
    return swaps === undefined ? [] : swaps;
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getSwapsCount = async (chainId: number, pairId: string) => {
	if (!chainId || !pairId) {
		throw Error('Invalid pair id or chain id')
	}
	const where = {
		pair_ : {
			id: pairId,
		}
	}
	const result = ((await sdk.SwapsByChainId({where, chainId})).swaps ?? []).length
	return result === undefined ? 0 : result;
}

export type GetMintsQuery = Omit<QuerymintsArgs, 'where' | 'pagination'> & {
  pagination: string
}

export const getMints = async (chainId: number, pairId: string, query?: GetMintsQuery) => {
  try {
    if (!chainId || !pairId) {
      throw Error('Invalid pair id or chain id')
    }
    const pagination: Pagination = query?.pagination ? JSON.parse(query.pagination) : { pageIndex: 0, pageSize: 20 }
    const first = 20
    const skip = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 0;
    const orderBy = query?.orderBy || 'timestamp'
    const orderDirection = query?.orderDirection || 'desc'
     const where = {
      pair_: {
        id: pairId,
      }
    }
    const { mints } = await sdk.MintsByChainId({ first, skip, where, orderBy, orderDirection, chainId})
    return mints === undefined ? [] : mints;
    return mints === undefined ? [] : mints; 
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getMintsCount = async (chainId: number, pairId: string) => {
	if (!chainId || !pairId) {
    throw Error('Invalid pair id or chain id')
  }
	const where = {
		pair_ : {
			id: pairId,
		}
	}
	const result = ((await sdk.MintsByChainId({where, chainId})).mints ?? []).length
	return result === undefined ? 0 : result;
}

export type GetBurnsQuery = Omit<QueryburnsArgs, 'where' | 'pagination'> & {
  pagination: string
}

export const getBurns = async (chainId: number, pairId: string, query?: GetBurnsQuery) => {
  try {
    if (!chainId || !pairId) {
      throw Error('Invalid pair id or chain id')
    }
    const pagination: Pagination = query?.pagination ? JSON.parse(query.pagination) : { pageIndex: 0, pageSize: 20 }
    const first = 20
    const skip = pagination?.pageIndex && pagination?.pageSize ? pagination.pageIndex * pagination.pageSize : 0;
    const orderBy = query?.orderBy || 'timestamp'
    const orderDirection = query?.orderDirection || 'desc'
    const where = {
      pair_: {
        id: pairId,
      }
    }
    const { burns } = await sdk.BurnsByChainId({ first, skip, where, orderBy, orderDirection, chainId})
    return burns === undefined ? [] : burns;
    return burns === undefined ? [] : burns; 
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const getBurnsCount = async (chainId: number, pairId: string) => {
	if (!chainId || !pairId) {
    throw Error('Invalid pair id or chain id')
  }
	const where = {
		pair_ : {
			id: pairId,
		}
	}
	const result = ((await sdk.BurnsByChainId({where, chainId})).burns ?? []).length
	return result === undefined ? 0 : result;
}
