import { getCombinedUserPositions } from '@sushiswap/graph-client-new/composite/combined-user-positions'
import { getSushiDayDatas } from '@sushiswap/graph-client-new/composite/sushi-day-datas'
import { getFuroTokens as _getFuroTokens } from '@sushiswap/graph-client-new/furo'
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
import { furoTokensSchema } from './schema'

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
    const { data: tokens } = await fetchMultichain({
      chainIds: query.chainIds,
      fetch: _getFuroTokens,
      variables: {
        where: {
          or:
            query?.tokenSymbols?.map((symbol) => ({
              symbol_contains_nocase: symbol,
            })) || [],
        },
      },
    })

    return tokens
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
