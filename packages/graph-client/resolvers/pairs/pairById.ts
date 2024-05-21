// @ts-nocheck

import {
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_V2_SUBGRAPH_URL,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_URL,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_URL,
} from '@sushiswap/graph-config'
import { chainName, chainShortNameToChainId } from 'sushi/chain'
import { isPromiseFulfilled } from 'sushi/validate'

import {
  BucketData,
  Pair,
  QueryResolvers,
  getBuiltGraphSDK,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { SushiSwapV3Types } from '../../.graphclient/sources/SushiSwapV3/types.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwapV2/types.js'
import { transformPair } from '../../transformers/index.js'
import { tr } from 'date-fns/locale'

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
  volumeToken0: pool.volumeToken0,
  volumeToken1: pool.volumeToken1,
  feesUSD: pool.feesUSD,
  txCount: pool.txCount,
  apr: 0,
  aprUpdatedAtTimestamp: 0,
  createdAtTimestamp: pool.createdAtTimestamp,
  createdAtBlockNumber: pool.createdAtBlockNumber,

  // TODO: fix this, they should be fetched separately to avoid getting result in each time travel query.

  // hourSnapshots: pool.poolHourData.map((hourData) => ({
  //   id: hourData.id,
  //   date: hourData.periodStartUnix,
  //   volumeUSD: hourData.volumeUSD,
  //   liquidityNative: 0,
  //   liquidityUSD: hourData.tvlUSD,
  //   transactionCount: hourData.txCount,
  // })),
  // daySnapshots: pool.poolDayData.map((dayData) => ({
  //   id: dayData.id,
  //   date: dayData.date,
  //   volumeUSD: dayData.volumeUSD,
  //   liquidityNative: 0,
  //   liquidityUSD: dayData.tvlUSD,
  //   transactionCount: dayData.txCount,
  // })),
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
    context.SushiSwapV2.Query.pair({
      root,
      args: { ...args, id: address.toLowerCase(), block },
      context: {
        ...context,
        now,
        chainId,
        chainName: chainName[chainId],
        chainShortName: chainShortName[chainId],
        url: SUSHISWAP_V2_SUBGRAPH_URL[
          chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]
        ],
      },
      info,
    }).then((pair: SushiSwapV2Types.Pair | null) => {
      if (!pair) return pair
      return {
        ...pair,
        chainId,
        address,
        type: 'ALL',
        swapFee: 30,
        twapEnabled: true,
        reserve0: (Number(pair.reserve0) * 10 ** pair.token0.decimals)
          .toString()
          .split('.')[0],
        reserve1: (Number(pair.reserve1) * 10 ** pair.token1.decimals)
          .toString()
          .split('.')[0],
        name: pair.token0.symbol + '-' + pair.token1.symbol,
        source: 'SUSHISWAP_V2',
        liquidity: (Number(pair.totalSupply) * 10 ** 18)
          .toString()
          .split('.')[0],
        liquidityUSD: pair.reserveUSD,
        liquidityNative: pair.reserveETH,
        apr: 0,
        aprUpdatedAtTimestamp: 0,
        feesUSD: pair.volumeUSD * 0.003,
      }
    })

  // const fetchV2DayBuckets = async () =>
  //   context.SushiSwapV2.Query.SushiSwapV2PoolDayDataQuery({
  //     root,
  //     args: {
  //       ...args,
  //       id: address.toLowerCase(),
  //       where: {
  //         pairAddress: address.toLowerCase(),
  //       },
  //       orderBy: 'date',
  //       orderDirection: 'desc',
  //     },
  //     context: {
  //       ...context,
  //       now,
  //       chainId,
  //       chainName: chainName[chainId],
  //       chainShortName: chainShortName[chainId],
  //       url: SUSHISWAP_V2_SUBGRAPH_URL[
  //         chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]
  //       ],
  //     },
  //     info,
  //   }).then((bucket: SushiSwapTypes.SushiSwapV2PoolDayData | null) => {
  //     if (!bucket) return bucket
  //     return {
  //       id: bucket.id,
  //       date: bucket.date,
  //       volumeUSD: bucket.volumeUSD,
  //       liquidityUSD: bucket.liquidityUSD,
  //       liquidityNative: 0,
  //       transactionCount: bucket.hourlyTxns,
  //     }
  //   })

  // const fetchV2DayHourBuckets = async () =>
  //   context.SushiSwapV2.Query.SushiSwapV2PoolHourDataQuery({
  //     root,
  //     args: {
  //       ...args,
  //       id: address.toLowerCase(),
  //       where: {
  //         pairAddress: address.toLowerCase(),
  //       },
  //       orderBy: 'date',
  //       orderDirection: 'desc',
  //     },
  //     context: {
  //       ...context,
  //       now,
  //       chainId,
  //       chainName: chainName[chainId],
  //       chainShortName: chainShortName[chainId],
  //       url: SUSHISWAP_V2_SUBGRAPH_URL[
  //         chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]
  //       ],
  //     },
  //     info,
  //   }).then((bucket: SushiSwapTypes.SushiSwapV2PoolHourDataQuery | null) => {
  //     if (!bucket) return bucket
  //     return {
  //       id: bucket.id,
  //       date: bucket.date,
  //       volumeUSD: bucket.volumeUSD,
  //       liquidityUSD: bucket.liquidityUSD,
  //       liquidityNative: 0,
  //       transactionCount: bucket.hourlyTxns,
  //     }
  //   })

  const fetchSushiSwapV3Pair = async (block?: { number: number }) => {
    const sdk = getBuiltGraphSDK({
      url: SUSHISWAP_V3_SUBGRAPH_URL[
        chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]
      ],
    })

    const { pool } = await sdk.SushiSwapV3Pool({
      id: address.toLowerCase(),
      block: block ? { number: Number(block.number) } : null,
    })

    return transformV3PoolToPair(pool, chainId)
  }

  // const fetchIsV2Pool = async() =>
  //   context.SushiSwap.Query.PairOnlyId({
  //     root,
  //     args: { ...args, id: address.toLowerCase() },
  //     context: {
  //       ...context,
  //       now,
  //       chainId,
  //       chainName: chainName[chainId],
  //       chainShortName: chainShortName[chainId],
  //       url: SUSHISWAP_V2_SUBGRAPH_URL[
  //         chainId as (typeof SUSHISWAP_ENABLED_NETWORKS)[number]
  //       ],
  //     },
  //     info,
  //   }).then((pair: SushiSwapV2Types.Pair | null) => {
  //     return (pair?.id !== null)
  //   })

  const poolFetcher = async (isV2: boolean, block?: { number: number }) => {
    const fetches: ReturnType<typeof fetchSushiSwapPair>[] = []

    if (isV2 && SUSHISWAP_ENABLED_NETWORKS.includes(chainId)) {
      fetches.push(fetchSushiSwapPair(block))
    }

    if (!isV2 && SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId)) {
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

  // const bucketFetcher = async (isV2: boolean) => {
  //   const fetches: ReturnType<typeof fetchSushiSwapPair>[] = []

  //   if (isV2 && SUSHISWAP_ENABLED_NETWORKS.includes(chainId)) {
  //     fetches.push(fetchV2DayHourBuckets())
  //     fetches.push(fetchV2DayBuckets())
  //   }

  //   // if (!isV2 && SUSHISWAP_V3_ENABLED_NETWORKS.includes(chainId)) {
  //   //   fetches.push(fetchV3DayHourBuckets())
  //   //   fetches.push(fetchV3DayBuckets())
  //   // }

  //   const [hourSnapshots, daySnapshots] = await Promise.all(
  //     fetches,
  //   )
  //   // .then((results) => {
  //   //   return results.map((result) => result?.status === 'fulfilled')
  //   //     ? result.value
  //   //     : []
  //   // })

  //   return { hourSnapshots, daySnapshots }
  // }

  // ping and check if the pair exists in V2, if not assume it's v3

  // const isPoolV2 = await fetchIsV2Pool()
  // console.log({ isPoolV2 })
  const [pair, pair1d, pair2d, pair1w] = await Promise.all([
    poolFetcher(true),
    poolFetcher(true, oneDayBlock),
    poolFetcher(true, twoDayBlock),
    poolFetcher(true, oneWeekBlock),
    // bucketFetcher(isPoolV2),
  ])
  console.log({ pair })
  if (!pair) return null

  return transformPair({
    pair,
    pair1d,
    pair2d,
    pair1w,
    // hourlyBuckets: buckets.hourSnapshots,
    // dailyBuckets: buckets.daySnapshots,
  })
}
