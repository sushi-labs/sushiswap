// @ts-nocheck

import { chainName, chainShortNameToChainId } from 'sushi/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from 'sushi'

import {
  getBuiltGraphSDK,
  Pair,
  QueryResolvers,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { SushiSwapV3Types } from '../../.graphclient/sources/SushiSwapV3/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'
import { transformPair } from '../../transformers/index.js'

const sdk = getBuiltGraphSDK()

const transformV3PoolToPair = (
  pool: SushiSwapV3Types.Pool,
  chainId: number,
): Pair => ({
  id: `${chainId}:${pool.id}`,
  chainId,
  address: pool.id,
  chainId: chainId,
  type: 'ALL',
  swapFee: pool.feeTier / 100,
  twapEnabled: true,
  name: pool.token0.symbol + '-' + pool.token1.symbol,
  token0: pool.token0,
  token1: pool.token1,
  source: 'SUSHISWAP_V3',
  reserve0: (Number(pool.totalValueLockedToken0) * 10 ** pool.token0.decimals)
    .toString()
    .split('.')[0],
  reserve1: (Number(pool.totalValueLockedToken1) * 10 ** pool.token1.decimals)
    .toString()
    .split('.')[0],
  liquidity: pool.liquidity,
  liquidityUSD: pool.totalValueLockedUSD,
  liquidityNative: pool.totalValueLockedETH,
  volumeUSD: pool.volumeUSD,
  volumeNative: 0,
  volumeToken0: pool.volumeToken0,
  volumeToken1: pool.volumeToken1,
  feesNative: 0,
  feesUSD: pool.feesUSD,
  txCount: pool.txCount,
  apr: 0,
  aprUpdatedAtTimestamp: 0,
  createdAtTimestamp: pool.createdAtTimestamp,
  createdAtBlock: pool.createdAtBlockNumber,
  hourSnapshots: pool.poolHourData.map((hourData) => ({
    id: hourData.id,
    date: hourData.periodStartUnix,
    volumeUSD: hourData.volumeUSD,
    liquidityNative: 0,
    liquidityUSD: hourData.tvlUSD,
    transactionCount: hourData.txCount,
    apr: 0,
  })),
  daySnapshots: pool.poolDayData.map((dayData) => ({
    id: dayData.id,
    date: dayData.date,
    volumeUSD: dayData.volumeUSD,
    liquidityNative: 0,
    liquidityUSD: dayData.tvlUSD,
    transactionCount: dayData.txCount,
    apr: 0,
  })),
})

export const pairById: QueryResolvers['pairById'] = async (
  root,
  args,
  context,
  info,
): Promise<Pair | null> => {
  const now = Date.now()

  const [chainShortName, address] = args.id.split(':') as [string, string]

  const chainId = chainShortNameToChainId[chainShortName]

  const [
    {
      oneDayBlocks: [oneDayBlock],
    },
    {
      twoDayBlocks: [twoDayBlock],
    },
    {
      oneWeekBlocks: [oneWeekBlock],
    },
  ] = await Promise.all([
    sdk.OneDayBlocks({ chainIds: [chainId] }),
    sdk.TwoDayBlocks({ chainIds: [chainId] }),
    sdk.OneWeekBlocks({ chainIds: [chainId] }),
  ])

  const fetchSushiSwapPair = async (block?: { number: number }) =>
    context.SushiSwap.Query.pair({
      root,
      args: { ...args, id: address.toLowerCase(), block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName:
          SUSHISWAP_SUBGRAPH_NAME[
            chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]
          ],
        subgraphHost:
          SUBGRAPH_HOST[chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
      },
      info,
    }).then((pair: SushiSwapTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetchTridentPair = async (block?: { number: number }) =>
    context.Trident.Query.pair({
      root,
      args: { ...args, id: address.toLowerCase(), block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        subgraphName:
          TRIDENT_SUBGRAPH_NAME[
            chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
          ],
        subgraphHost:
          SUBGRAPH_HOST[chainId as typeof TRIDENT_ENABLED_NETWORKS[number]],
      },
      info,
    }).then((pair: TridentTypes.Pair | null) => {
      if (!pair) return pair
      return { ...pair, chainId, address }
    })

  const fetchSushiSwapV3Pair = async (block?: { number: number }) => {
    const sdk = getBuiltGraphSDK({
      subgraphHost:
        SUBGRAPH_HOST[chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]],
      subgraphName:
        SUSHISWAP_V3_SUBGRAPH_NAME[
          chainId as typeof SUSHISWAP_ENABLED_NETWORKS[number]
        ],
    })

    const { pool } = await sdk.SushiSwapV3Pool({
      id: address.toLowerCase(),
      block: block ? { number: Number(block.number) } : null,
    })

    return transformV3PoolToPair(pool, chainId)
  }

  const fetcher = async (block?: { number: number }) => {
    const fetches: ReturnType<
      typeof fetchSushiSwapPair | typeof fetchTridentPair
    >[] = []

    if (SUSHISWAP_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchSushiSwapPair(block))
    }

    if (TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchTridentPair(block))
    }

    if (SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchSushiSwapV3Pair(block))
    }

    return Promise.allSettled<Pair[]>(fetches).then((results) => {
      return results
        .filter(isPromiseFulfilled)
        .map((promiseFulfilled) => promiseFulfilled.value)
        .filter(Boolean)
        .shift()
    })
  }

  const [pair, pair1d, pair2d, pair1w] = await Promise.all([
    fetcher(),
    fetcher(oneDayBlock),
    fetcher(twoDayBlock),
    fetcher(oneWeekBlock),
  ])

  if (!pair) return null

  return transformPair({
    pair,
    pair1d,
    pair2d,
    pair1w,
  })
}
