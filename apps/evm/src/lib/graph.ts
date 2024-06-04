import { getCombinedUserPositions } from '@sushiswap/graph-client-new/composite/combined-user-positions'
import { getSushiDayDatas } from '@sushiswap/graph-client-new/composite/sushi-day-datas'
import { getFuroTokens as _getFuroTokens } from '@sushiswap/graph-client-new/furo'
import { getRebases as _getRebases } from '@sushiswap/graph-client-new/bentobox'
import { fetchMultichain } from '@sushiswap/graph-client-new/multichain'
import {
  getSushiV2Pool,
  getSushiV2Pools,
} from '@sushiswap/graph-client-new/sushi-v2'
import { getSushiV3PoolsByTokenPair } from '@sushiswap/graph-client-new/sushi-v3'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { getChainIdAddressFromId } from 'sushi'
import {
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  SushiSwapV2ChainId,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
} from 'sushi/config'
import { Address } from 'viem'
import { bentoBoxTokensSchema, furoTokensSchema } from './schema'
import { Pool, Protocol } from '@prisma/client'

export async function getUser(args: {
  id?: Address
  chainIds?: SushiSwapV2ChainId[]
}) {
  if (!args.id) return []

  const { data } = await getCombinedUserPositions({
    chainIds: args.chainIds || [...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS],
    user: args.id.toLowerCase() as Address,
  })

  return data
}

export const getV2GraphPool = async (id: string) => {
  const split = getChainIdAddressFromId(id)

  if (!isSushiSwapV2ChainId(split.chainId)) throw Error('Invalid chain id')

  const pool = await getSushiV2Pool({
    chainId: split.chainId,
    id: split.address,
  })

  return pool
}

export const getV2GraphPools = async (ids: string[]) => {
  if (!ids.every((id) => id.includes(':'))) throw Error('Invalid pair ids')

  // Migrating to new format, graph-client uses the deprecated one
  const addresses = ids.map((id) => id.split(':')[1]) as Address[]

  // PairsByIds would be better, not implemented though...
  // Need to hack around

  const chainIds = Array.from(
    new Set(ids.map((id) => Number(id.split(':')[0]))),
  ) as SushiSwapV2ChainId[]

  const { data: pools } = await fetchMultichain({
    chainIds,
    fetch: getSushiV2Pools,
    variables: {
      where: {
        id_in: addresses,
      },
    },
  })

  return (
    pools
      .map((pool) => ({ ...pool, id: `${pool.chainId}:${pool.address}` }))
      // To prevent possible (although unlikely) collisions
      .filter((pool) => ids.includes(pool.id))
  )
}

export const getV3PoolsByTokenPair = async (
  tokenId0: string,
  tokenId1: string,
) => {
  const { chainId: chainId0, address: address0 } =
    getChainIdAddressFromId(tokenId0)
  const { chainId: chainId1, address: address1 } =
    getChainIdAddressFromId(tokenId1)

  if (chainId0 !== chainId1) throw Error('Tokens must be on the same chain')

  if (!isSushiSwapV3ChainId(chainId0)) {
    throw Error('Invalid chain id')
  }

  const pools = await getSushiV3PoolsByTokenPair({
    chainId: chainId0,
    token0: address0,
    token1: address1,
  })

  return pools
}

export const getFuroTokens = async (
  query: (typeof furoTokensSchema)['_output'],
) => {
  try {
    const variables =
      query?.tokenSymbols && query.tokenSymbols?.length > 0
        ? {
            where: {
              or: query.tokenSymbols.map((symbol) => ({
                symbol_contains_nocase: symbol,
              })),
              liquidityShares_gt: '0',
            },
          }
        : {
            where: {
              liquidityShares_gt: '0',
            },
          }
    const { data: tokens } = await fetchMultichain({
      chainIds: query.chainIds,
      fetch: _getFuroTokens,
      variables,
    })

    return tokens
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getBentoBoxTokens = async (
  query: (typeof bentoBoxTokensSchema)['_output'],
) => {
  try {
    const variables =
      query?.tokenSymbols && query.tokenSymbols?.length > 0
        ? {
            where: {
              or: query.tokenSymbols.map((symbol) => ({
                symbol_contains_nocase: symbol,
              })),
              base_gt: '0',
            },
          }
        : {
            where: {
              base_gt: '0',
            },
          }
    const { data: rebases } = await fetchMultichain({
      chainIds: query.chainIds,
      fetch: _getRebases,
      variables,
    })

    return rebases
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCharts = async (query?: { networks: string }) => {
  const chainIds = query?.networks
    ? JSON.parse(query.networks)
    : SUPPORTED_CHAIN_IDS

  const { data: daySnapshots } = await getSushiDayDatas({
    chainIds,
  })

  const dateSnapshotMap = new Map()

  for (const snapshot of daySnapshots) {
    const value = dateSnapshotMap.get(snapshot.date)
    dateSnapshotMap.set(
      snapshot.date,
      value
        ? [
            value[0] + Number(snapshot.tvlUSD),
            value[1] + Number(snapshot.volumeUSD),
          ]
        : [Number(snapshot.tvlUSD), Number(snapshot.volumeUSD)],
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


export function transformGraphPool(
  graphPool: Awaited<ReturnType<typeof getV2GraphPools>>[0],
): Pool {
  return {
    id: graphPool.id,
    address: graphPool.address,
    name: `${graphPool.token0.symbol}-${graphPool.token1.symbol}`,
    chainId: graphPool.chainId,
    protocol: Protocol.SUSHISWAP_V2,
    swapFee: 30 / 10000,
    twapEnabled: false,
    totalSupply: String(graphPool.totalSupply),
    liquidityUSD: String(graphPool.liquidityUSD),
    volumeUSD: String(graphPool.volumeUSD),
    feeApr1h: 0,
    feeApr1d: 0,
    feeApr1w: 0,
    feeApr1m: 0,
    totalApr1h: 0,
    totalApr1d: 0,
    totalApr1w: 0,
    totalApr1m: 0,
    incentiveApr: 0,
    isIncentivized: false,
    wasIncentivized: false,
    fees1h: '0',
    fees1d: '0',
    fees1w: '0',
    fees1m: '0',
    feesChange1h: 0,
    feesChange1d: 0,
    feesChange1w: 0,
    feesChange1m: 0,
    volume1h: '0',
    volume1d: '0',
    volume1w: '0',
    volume1m: '0',
    volumeChange1h: 0,
    volumeChange1d: 0,
    volumeChange1w: 0,
    volumeChange1m: 0,
    liquidityUSDChange1h: 0,
    liquidityUSDChange1d: 0,
    liquidityUSDChange1w: 0,
    liquidityUSDChange1m: 0,
    isBlacklisted: false,
    token0: {
      id: `${graphPool.chainId}:${graphPool.token0.id}`,
      address: graphPool.token0.id,
      name: graphPool.token0.name,
      symbol: graphPool.token0.symbol,
      decimals: Number(graphPool.token0.decimals),
    },
    token1: {
      id: `${graphPool.chainId}:${graphPool.token1.id}`,
      address: graphPool.token1.id,
      name: graphPool.token1.name,
      symbol: graphPool.token1.symbol,
      decimals: Number(graphPool.token1.decimals),
    },
    incentives: [],
    hasEnabledSteerVault: false,
    hadEnabledSteerVault: false,
    steerVaults: [],
  } satisfies Pool
}