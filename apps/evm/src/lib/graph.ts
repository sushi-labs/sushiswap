import {
  Bundle,
  Pagination,
  QuerytokensByChainIdsArgs,
  getBuiltGraphSDK,
} from '@sushiswap/graph-client'

import { SUPPORTED_CHAIN_IDS } from 'src/config'

import { ChainId, chainShortName } from 'sushi/chain'

import { bentoBoxTokensSchema, furoTokensSchema } from './schema'

const sdk = getBuiltGraphSDK()

export async function getUser(args: { id?: string; chainIds?: ChainId[] }) {
  if (!args.id) return []
  const { crossChainUserPositions: user } = await sdk.CrossChainUserPositions({
    chainIds: args.chainIds || SUPPORTED_CHAIN_IDS,
    id: args.id.toLowerCase(),
  })
  return user
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

export const getPoolsByTokenPair = async (
  tokenId0: string,
  tokenId1: string,
) => {
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

export const getBundles = async () => {
  const { bundles } = await sdk.Bundles({
    chainIds: SUPPORTED_CHAIN_IDS,
  })

  return bundles.reduce<
    Record<number, Pick<Bundle, 'id' | 'chainId' | 'nativePrice'>>
  >((acc, cur) => {
    acc[cur.chainId] = cur
    return acc
  }, {})
}

export type GetTokensQuery = Omit<
  QuerytokensByChainIdsArgs,
  'where' | 'pagination'
> & {
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
    const first =
      pagination?.pageIndex && pagination?.pageSize
        ? pagination.pageIndex * pagination.pageSize
        : 20
    const skip = 0
    const where = { ...(query?.where && { ...JSON.parse(query.where) }) }
    const orderBy = query?.orderBy || 'liquidityUSD'
    const orderDirection = query?.orderDirection || 'desc'
    const chainIds = query?.networks
      ? JSON.parse(query.networks)
      : SUPPORTED_CHAIN_IDS
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
    console.error(error)
    throw new Error(error)
  }
}

export const getBentoBoxTokens = async (
  query: (typeof bentoBoxTokensSchema)['_output'],
) => {
  try {
    const { rebases } = await sdk.RebasesByChainIds({
      where: {
        token_: {
          or: query.tokenSymbols?.map((symbol) => ({
            symbol_contains_nocase: symbol,
          })),
        },
      },
      chainIds: query.chainIds,
    })

    return rebases
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getFuroTokens = async (
  query: (typeof furoTokensSchema)['_output'],
) => {
  try {
    const { tokens } = await sdk.furoTokensByChainIds({
      where: {
        or: query.tokenSymbols?.map((symbol) => ({
          symbol_contains_nocase: symbol,
        })),
      },
      // orderBy,
      // orderDirection,
      chainIds: query.chainIds,
    })

    return tokens
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getToken = async (id: string) => {
  const { crossChainToken: token } = await sdk.CrossChainToken({
    id: id.includes(':') ? id.split(':')[1] : id,
    chainId: id.split(':')[0],
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

  const chainIds = query?.networks
    ? JSON.parse(query.networks)
    : SUPPORTED_CHAIN_IDS

  return factories.reduce((sum, cur) => {
    if (chainIds.includes(cur.chainId)) {
      sum = sum + Number(cur.tokenCount)
    }

    return sum
  }, 0)
}

export const getCharts = async (query?: { networks: string }) => {
  const chainIds = query?.networks
    ? JSON.parse(query.networks)
    : SUPPORTED_CHAIN_IDS
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
        ? [
            value[0] + Number(snapshot.liquidityUSD),
            value[1] + Number(snapshot.volumeUSD),
          ]
        : [Number(snapshot.liquidityUSD), Number(snapshot.volumeUSD)],
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
