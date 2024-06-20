import { Prisma, Protocol } from '@sushiswap/database'
import { performance } from 'perf_hooks'
import { ChainId, chainShortName } from 'sushi/chain'

import {
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  SushiSwapV2ChainId,
  SushiSwapV3ChainId,
} from 'sushi/config'

import { getBlockHistoric } from '@sushiswap/graph-client/blocks'
import { fetchMultichain } from '@sushiswap/graph-client/multichain'
import { SushiV2Pools, getSushiV2Pools } from '@sushiswap/graph-client/sushi-v2'
import { SushiV3Pools, getSushiV3Pools } from '@sushiswap/graph-client/sushi-v3'
import { upsertPools } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'

interface Blocks {
  oneHour: number | undefined
  twoHour: number | undefined
  oneDay: number | undefined
  twoDay: number | undefined
  oneWeek: number | undefined
  twoWeek: number | undefined
  oneMonth: number | undefined
  twoMonth: number | undefined
}

type V2Data = {
  currentPools: SushiV2Pools
  pools1h: SushiV2Pools
  pools2h: SushiV2Pools
  pools1d: SushiV2Pools
  pools2d: SushiV2Pools
  pools1w: SushiV2Pools
  pools2w: SushiV2Pools
  pools1m: SushiV2Pools
  pools2m: SushiV2Pools
}
type V3Data = {
  currentPools: SushiV3Pools
  pools1h: SushiV3Pools
  pools2h: SushiV3Pools
  pools1d: SushiV3Pools
  pools2d: SushiV3Pools
  pools1w: SushiV3Pools
  pools2w: SushiV3Pools
  pools1m: SushiV3Pools
  pools2m: SushiV3Pools
}

enum AprTimeRange {
  ONE_HOUR = 'ONE_HOUR',
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  ONE_MONTH = 'ONE_MONTH',
}

const SUBGRAPH_REQUEST_OPTIONS = {
  retries: 10, // can lower to 3 when bad indexer error is fixed by the graph
}

export async function execute(protocol: Protocol) {
  try {
    const startTime = performance.now()
    console.log(`${protocol}: Preparing to load pools/tokens`)
    if (
      protocol !== Protocol.SUSHISWAP_V2 &&
      protocol !== Protocol.SUSHISWAP_V3
    ) {
      throw new Error('Unsupported protocol')
    }
    // EXTRACT
    const exchanges = await extract(protocol)
    console.log(
      `EXTRACT - ${protocol} - Pairs extracted from ${exchanges.length} different subgraphs`,
    )

    // TRANSFORM
    const { tokens, pools } = transform(protocol, exchanges)

    // LOAD
    const batchSize = 250

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize)
      await createTokens(batch)
    }
    const concurrentBatches = 10
    for (let i = 0; i < pools.length; i += batchSize * concurrentBatches) {
      const batches = []
      for (let j = i; j < i + concurrentBatches * batchSize; j += batchSize) {
        if (j > pools.length) {
          break
        }
        batches.push(upsertPools(pools.slice(j, j + batchSize)))
      }
      const batchStartTime = performance.now()
      await Promise.all(batches)
      const batchEndTime = performance.now()
      console.log(
        `LOAD: ${protocol} - Batch completed in ${(
          (batchEndTime - batchStartTime) /
          1000
        ).toFixed(1)} seconds. `,
      )
    }
    const endTime = performance.now()

    console.log(
      `LOAD: ${protocol} - COMPLETE - Script ran for ${(
        (endTime - startTime) /
        1000
      ).toFixed(1)} seconds. `,
    )
  } catch (e) {
    console.error(e)
  }
}

async function extract(protocol: 'SUSHISWAP_V2' | 'SUSHISWAP_V3') {
  const result: { chainId: ChainId; data: V2Data | V3Data }[] = []

  const chainIds =
    protocol === Protocol.SUSHISWAP_V2
      ? SUSHISWAP_V2_SUPPORTED_CHAIN_IDS
      : SUSHISWAP_V3_SUPPORTED_CHAIN_IDS

  console.log(
    `EXTRACT - ${protocol} - Extracting from ${
      chainIds.length
    } different chains, ${chainIds.join(', ')}`,
  )
  const [
    oneHourBlocks,
    twoHourBlocks,
    oneDayBlocks,
    twoDayBlocks,
    oneWeekBlocks,
    twoWeekBlocks,
    oneMonthBlocks,
    twoMonthBlocks,
  ] = await Promise.all([
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        hoursAgo: 1,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),

    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        hoursAgo: 2,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        daysAgo: 1,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        daysAgo: 2,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        weeksAgo: 1,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        weeksAgo: 2,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        monthsAgo: 1,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
    fetchMultichain({
      chainIds,
      fetch: getBlockHistoric,
      variables: {
        monthsAgo: 2,
      },
      options: SUBGRAPH_REQUEST_OPTIONS,
    }),
  ])

  await Promise.allSettled(
    chainIds.map(async (chainId) => {
      const blocks: Blocks = {
        oneHour: oneHourBlocks.data.find((b) => b.chainId === chainId)?.number,
        twoHour: twoHourBlocks.data.find((b) => b.chainId === chainId)?.number,
        oneDay: oneDayBlocks.data.find((b) => b.chainId === chainId)?.number,
        twoDay: twoDayBlocks.data.find((b) => b.chainId === chainId)?.number,
        oneWeek: oneWeekBlocks.data.find((b) => b.chainId === chainId)?.number,
        twoWeek: twoWeekBlocks.data.find((b) => b.chainId === chainId)?.number,
        oneMonth: oneMonthBlocks.data.find((b) => b.chainId === chainId)
          ?.number,
        twoMonth: twoMonthBlocks.data.find((b) => b.chainId === chainId)
          ?.number,
      }
      const pairs = await fetchPairs(chainId, protocol, blocks)

      if (pairs === undefined) {
        console.warn(
          `No pairs found, skipping ${protocol} - ${chainShortName[chainId]}`,
        )
        return
      }
      console.log(
        `EXTRACT: ${protocol} - ${chainShortName[chainId]}, batches: ${pairs.currentPools.length}`,
      )
      result.push({ chainId, data: pairs })
    }),
  )
  return result
}

async function fetchPairs(
  chainId: SushiSwapV2ChainId | SushiSwapV3ChainId,
  protocol: 'SUSHISWAP_V2' | 'SUSHISWAP_V3',
  blocks: Blocks,
) {
  try {
    if (protocol === Protocol.SUSHISWAP_V2) {
      const [
        currentPools,
        pools1h,
        pools2h,
        pools1d,
        pools2d,
        pools1w,
        pools2w,
        pools1m,
        pools2m,
      ] = await Promise.all([
        getSushiV2Pools(
          {
            chainId,
            first: Infinity,
          },
          SUBGRAPH_REQUEST_OPTIONS,
        ),
        blocks.oneHour
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.oneHour,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.twoHour
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.twoHour,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.oneDay
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.oneDay,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.twoDay
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.twoDay,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.oneWeek
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.oneWeek,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.twoWeek
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.twoWeek,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.oneMonth
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.oneMonth,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
        blocks.twoMonth
          ? getSushiV2Pools(
              {
                chainId,
                block: {
                  number: blocks.twoMonth,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV2Pools),
      ])

      console.log(
        `V2-${chainShortName[chainId]} results by timeframe
      * current: ${currentPools.length}
      1h: ${pools1h.length}
      2h: ${pools2h.length}
      1d: ${pools1d.length}
      2d: ${pools2d.length}
      1w: ${pools1w.length}
      2w: ${pools2w.length}
      1m: ${pools1m.length}
      2m: ${pools2m.length}`,
      )
      return {
        currentPools,
        pools1h,
        pools2h,
        pools1d,
        pools2d,
        pools1w,
        pools2w,
        pools1m,
        pools2m,
      }
    } else if (protocol === Protocol.SUSHISWAP_V3) {
      const [
        currentPools,
        pools1h,
        pools2h,
        pools1d,
        pools2d,
        pools1w,
        pools2w,
        pools1m,
        pools2m,
      ] = await Promise.all([
        getSushiV3Pools(
          {
            chainId: chainId as SushiSwapV3ChainId,
            first: Infinity,
          },
          SUBGRAPH_REQUEST_OPTIONS,
        ),
        blocks.oneHour
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.oneHour,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.twoHour
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.twoHour,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.oneDay
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.oneDay,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.twoDay
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.twoDay,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.oneWeek
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.oneWeek,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.twoWeek
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.twoWeek,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.oneMonth
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.oneMonth,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
        blocks.twoMonth
          ? getSushiV3Pools(
              {
                chainId: chainId as SushiSwapV3ChainId,
                block: {
                  number: blocks.twoMonth,
                },
                first: Infinity,
              },
              SUBGRAPH_REQUEST_OPTIONS,
            )
          : ([] as SushiV3Pools),
      ])

      console.log(
        `V3-${chainShortName[chainId]} results by timeframe
      * current: ${currentPools.length}
      1h: ${pools1h.length}
      2h: ${pools2h.length}
      1d: ${pools1d.length}
      2d: ${pools2d.length}
      1w: ${pools1w.length}
      2w: ${pools2w.length}
      1m: ${pools1m.length}
      2m: ${pools2m.length}`,
      )
      return {
        currentPools,
        pools1h,
        pools2h,
        pools1d,
        pools2d,
        pools1w,
        pools2w,
        pools1m,
        pools2m,
      }
    } else {
      throw new Error('EXTRACT: fetchPairs: V2 or V3, skipping')
    }
  } catch (error) {
    console.error(`Error in fetchPairs for chainId ${chainId}:`, error)
    return undefined
  }
}

function transform(
  protocol: 'SUSHISWAP_V2' | 'SUSHISWAP_V3',
  queryResults: { chainId: ChainId; data: V2Data | V3Data }[],
) {
  const tokens: Map<string, Prisma.TokenCreateManyInput> = new Map()
  const pools: Prisma.SushiPoolCreateManyInput[] = []

  for (const result of queryResults) {
    const { chainId, data } = result
    if (protocol === Protocol.SUSHISWAP_V2) {
      const { pools: v2Pools, tokens: v2Tokens } = transformV2({
        chainId,
        data: data as V2Data,
      })
      pools.push(...v2Pools)

      v2Tokens.forEach((token) => {
        const existing = tokens.get(token.id)
        if (!existing) {
          tokens.set(token.id, token)
        }
      })
    } else if (protocol === Protocol.SUSHISWAP_V3) {
      const { pools: v3Pools, tokens: v3Tokens } = transformV3({
        chainId,
        data: data as V3Data,
      })
      pools.push(...v3Pools)

      v3Tokens.forEach((token) => {
        const existing = tokens.get(token.id)
        if (!existing) {
          tokens.set(token.id, token)
        }
      })
    } else {
      console.warn('Unknown protocol')
    }
  }

  const dedupedTokens = [...new Set(Array.from(tokens.values()))]
  console.log(
    `${protocol}: ${pools.length} pools, ${dedupedTokens.length} tokens`,
  )
  return { pools: pools, tokens: dedupedTokens }
}

function transformV2(queryResult: {
  chainId: ChainId
  data: V2Data
}) {
  const oneHourData = new Map(
    queryResult.data.pools1h.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoHourData = new Map(
    queryResult.data.pools2h.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneDayData = new Map(
    queryResult.data.pools1d.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoDayData = new Map(
    queryResult.data.pools2d.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneWeekData = new Map(
    queryResult.data.pools1w.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoWeekData = new Map(
    queryResult.data.pools2w.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneMonthData = new Map(
    queryResult.data.pools1m.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoMonthData = new Map(
    queryResult.data.pools2m.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.volumeUSD * 0.003),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )

  const chainsToSkip = new Set<ChainId>()
  const tokens: Prisma.TokenCreateManyInput[] = []

  return {
    pools: queryResult.data.currentPools.flatMap((pair) => {
      if (chainsToSkip.has(queryResult.chainId)) {
        return []
      }

      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: pair.token0.id.toLowerCase(),
          address: pair.token0.address.toLowerCase(),
          chainId: queryResult.chainId,
          name: pair.token0.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        }),
      )
      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: pair.token1.id.toLowerCase(),
          address: pair.token1.address.toLowerCase(),
          chainId: queryResult.chainId,
          name: pair.token1.name,
          symbol: pair.token1.symbol,
          decimals: Number(pair.token1.decimals),
        }),
      )

      const regex = /([^\w ]|_|-)/g
      const name = pair.token0.symbol
        .replace(regex, '')
        .slice(0, 15)
        .concat('-')
        .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
      const protocol = Protocol.SUSHISWAP_V2

      const currentVolumeUSD = Number(pair.volumeUSD)
      const currentLiquidityUSD = Number(pair.liquidityUSD)
      const currentFeesUSD = Number(pair.volumeUSD * 0.003)

      const anyNotCurrent =
        oneHourData.get(pair.id) ||
        twoHourData.get(pair.id) ||
        oneDayData.get(pair.id) ||
        twoDayData.get(pair.id) ||
        oneWeekData.get(pair.id) ||
        twoWeekData.get(pair.id) ||
        oneMonthData.get(pair.id) ||
        twoMonthData.get(pair.id)

      // A way to prevent old data (thanks TheGraph!) from being added
      if (anyNotCurrent && anyNotCurrent.volumeUSD > currentVolumeUSD) {
        console.warn(
          'Ignoring chain',
          queryResult.chainId,
          'Old Volume:',
          anyNotCurrent.volumeUSD,
          'Current Volume:',
          currentVolumeUSD,
        )
        chainsToSkip.add(queryResult.chainId)
        return []
      }

      const feeApr1h = calculateFeeApr(
        AprTimeRange.ONE_HOUR,
        oneHourData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        currentFeesUSD,
        pair.liquidityUSD,
      )
      const feeApr1d = calculateFeeApr(
        AprTimeRange.ONE_DAY,
        oneDayData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        currentFeesUSD,
        pair.liquidityUSD,
      )
      const feeApr1w = calculateFeeApr(
        AprTimeRange.ONE_WEEK,
        oneWeekData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        currentFeesUSD,
        pair.liquidityUSD,
      )
      const feeApr1m = calculateFeeApr(
        AprTimeRange.ONE_MONTH,
        oneMonthData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        currentFeesUSD,
        pair.liquidityUSD,
      )

      const fees1h = oneHourData.has(pair.id)
        ? currentFeesUSD - oneHourData.get(pair.id)!.feesUSD
        : currentFeesUSD
      const fees1d = oneDayData.has(pair.id)
        ? currentFeesUSD - oneDayData.get(pair.id)!.feesUSD
        : currentFeesUSD
      const fees1w = oneWeekData.has(pair.id)
        ? currentFeesUSD - oneWeekData.get(pair.id)!.feesUSD
        : currentFeesUSD
      const fees1m = oneMonthData.has(pair.id)
        ? currentFeesUSD - oneMonthData.get(pair.id)!.feesUSD
        : currentFeesUSD
      const feesChange1h = calculatePercentageChange(
        currentFeesUSD,
        oneHourData.get(pair.id)?.feesUSD ?? 0,
        twoHourData.get(pair.id)?.feesUSD ?? 0,
      )
      const feesChange1d = calculatePercentageChange(
        currentFeesUSD,
        oneDayData.get(pair.id)?.feesUSD ?? 0,
        twoDayData.get(pair.id)?.feesUSD ?? 0,
      )
      const feesChange1w = calculatePercentageChange(
        currentFeesUSD,
        oneWeekData.get(pair.id)?.feesUSD ?? 0,
        twoWeekData.get(pair.id)?.feesUSD ?? 0,
      )
      const feesChange1m = calculatePercentageChange(
        currentFeesUSD,
        oneMonthData.get(pair.id)?.feesUSD ?? 0,
        twoMonthData.get(pair.id)?.feesUSD ?? 0,
      )
      const volume1h = oneHourData.has(pair.id)
        ? currentVolumeUSD - oneHourData.get(pair.id)!.volumeUSD
        : currentVolumeUSD
      const volume1d = oneDayData.has(pair.id)
        ? currentVolumeUSD - oneDayData.get(pair.id)!.volumeUSD
        : currentVolumeUSD
      const volume1w = oneWeekData.has(pair.id)
        ? currentVolumeUSD - oneWeekData.get(pair.id)!.volumeUSD
        : currentVolumeUSD
      const volume1m = oneMonthData.has(pair.id)
        ? currentVolumeUSD - oneMonthData.get(pair.id)!.volumeUSD
        : currentVolumeUSD
      const volumeChange1h = calculatePercentageChange(
        currentVolumeUSD,
        oneHourData.get(pair.id)?.volumeUSD ?? 0,
        twoHourData.get(pair.id)?.volumeUSD ?? 0,
      )
      const volumeChange1d = calculatePercentageChange(
        currentVolumeUSD,
        oneDayData.get(pair.id)?.volumeUSD ?? 0,
        twoDayData.get(pair.id)?.volumeUSD ?? 0,
      )
      const volumeChange1w = calculatePercentageChange(
        currentVolumeUSD,
        oneWeekData.get(pair.id)?.volumeUSD ?? 0,
        twoWeekData.get(pair.id)?.volumeUSD ?? 0,
      )
      const volumeChange1m = calculatePercentageChange(
        currentVolumeUSD,
        oneMonthData.get(pair.id)?.volumeUSD ?? 0,
        twoMonthData.get(pair.id)?.volumeUSD ?? 0,
      )
      const liquidityUSDChange1h = oneHourData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneHourData.get(pair.id)!.liquidityUSD - 1
        : 0
      const liquidityUSDChange1d = oneDayData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneDayData.get(pair.id)!.liquidityUSD - 1
        : 0

      const liquidityUSDChange1w = oneWeekData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneWeekData.get(pair.id)!.liquidityUSD - 1
        : 0

      const liquidityUSDChange1m = oneMonthData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneMonthData.get(pair.id)!.liquidityUSD - 1
        : 0

      return {
        id: pair.id.toLowerCase(),
        address: pair.address.toLowerCase(),
        name: name,
        protocol,
        chainId: queryResult.chainId,
        swapFee: 0.003,
        twapEnabled: true,
        token0Id: pair.token0.id.toLowerCase(),
        token1Id: pair.token1.id.toLowerCase(),
        reserve0: pair.reserve0.toString(),
        reserve1: pair.reserve1.toString(),
        totalSupply: pair.liquidity.toString(),
        liquidityUSD: currentLiquidityUSD,
        liquidityNative: 0,
        volumeUSD: currentVolumeUSD,
        feesUSD: currentFeesUSD,
        volumeNative: 0, // DOES NOT EXIST IN V2 anymore
        token0Price: pair.token0Price.toString(),
        token1Price: pair.token1Price.toString(),
        ...(oneHourData.get(pair.id)?.feesUSD && { fees1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { fees1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { fees1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { fees1m }),
        ...(oneHourData.get(pair.id)?.feesUSD && { feesChange1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { feesChange1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { feesChange1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { feesChange1m }),
        ...(oneHourData.get(pair.id)?.volumeUSD && { volume1h }),
        ...(oneDayData.get(pair.id)?.volumeUSD && { volume1d }),
        ...(oneWeekData.get(pair.id)?.volumeUSD && { volume1w }),
        ...(oneMonthData.get(pair.id)?.volumeUSD && { volume1m }),
        ...(oneHourData.get(pair.id)?.volumeUSD && { volumeChange1h }),
        ...(oneDayData.get(pair.id)?.volumeUSD && { volumeChange1d }),
        ...(oneWeekData.get(pair.id)?.volumeUSD && { volumeChange1w }),
        ...(oneMonthData.get(pair.id)?.volumeUSD && { volumeChange1m }),
        ...(oneHourData.get(pair.id)?.liquidityUSD && {
          liquidityUSDChange1h,
        }),
        ...(oneDayData.get(pair.id)?.liquidityUSD && {
          liquidityUSDChange1d,
        }),
        ...(oneWeekData.get(pair.id)?.liquidityUSD && {
          liquidityUSDChange1w,
        }),
        ...(oneMonthData.get(pair.id)?.liquidityUSD && {
          liquidityUSDChange1m,
        }),
        ...(oneHourData.get(pair.id)?.feesUSD && { feeApr1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { feeApr1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { feeApr1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { feeApr1m }),
        ...(oneHourData.get(pair.id)?.feesUSD && { totalApr1h: feeApr1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { totalApr1d: feeApr1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { totalApr1w: feeApr1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { totalApr1m: feeApr1m }),
        createdAtBlockNumber: 0,
      } satisfies Prisma.SushiPoolCreateManyInput
    }),
    tokens,
  }
}

function transformV3(queryResult: { chainId: ChainId; data: V3Data }) {
  const oneHourData = new Map(
    queryResult.data.pools1h.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoHourData = new Map(
    queryResult.data.pools2h.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneDayData = new Map(
    queryResult.data.pools1d.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoDayData = new Map(
    queryResult.data.pools2d.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneWeekData = new Map(
    queryResult.data.pools1w.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoWeekData = new Map(
    queryResult.data.pools2w.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const oneMonthData = new Map(
    queryResult.data.pools1m.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )
  const twoMonthData = new Map(
    queryResult.data.pools2m.map((pool) => [
      pool.id,
      {
        feesUSD: Number(pool.feesUSD),
        volumeUSD: Number(pool.volumeUSD),
        liquidityUSD: Number(pool.liquidityUSD),
      },
    ]),
  )

  const chainsToSkip = new Set<ChainId>()
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = queryResult.data.currentPools.flatMap((pair) => {
    if (chainsToSkip.has(queryResult.chainId)) {
      return []
    }

    tokens.push(
      Prisma.validator<Prisma.TokenCreateManyInput>()({
        id: pair.token0.id.toLowerCase(),
        address: pair.token0.address.toLowerCase(),
        chainId: queryResult.chainId,
        name: pair.token0.name,
        symbol: pair.token0.symbol,
        decimals: Number(pair.token0.decimals),
      }),
    )
    tokens.push(
      Prisma.validator<Prisma.TokenCreateManyInput>()({
        id: pair.token1.id.toLowerCase(),
        address: pair.token1.address.toLowerCase(),
        chainId: queryResult.chainId,
        name: pair.token1.name,
        symbol: pair.token1.symbol,
        decimals: Number(pair.token1.decimals),
      }),
    )
    const regex = /([^\w ]|_|-)/g
    const name = pair.token0.symbol
      .replace(regex, '')
      .slice(0, 15)
      .concat('-')
      .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
    const swapFee = pair.swapFee

    const currentVolumeUSD = Number(pair.volumeUSD)
    const currentLiquidityUSD = Number(pair.liquidityUSD)
    const currentFeesUSD = Number(pair.feesUSD)

    const anyNotCurrent =
      oneHourData.get(pair.id) ||
      twoHourData.get(pair.id) ||
      oneDayData.get(pair.id) ||
      twoDayData.get(pair.id) ||
      oneWeekData.get(pair.id) ||
      twoWeekData.get(pair.id) ||
      oneMonthData.get(pair.id) ||
      twoMonthData.get(pair.id)

    // A way to prevent old data (thanks TheGraph!) from being added
    if (anyNotCurrent && anyNotCurrent.volumeUSD > currentVolumeUSD) {
      console.warn(
        'Ignoring chain',
        queryResult.chainId,
        'Old Volume:',
        anyNotCurrent.volumeUSD,
        'Current Volume:',
        currentVolumeUSD,
      )
      chainsToSkip.add(queryResult.chainId)
      return []
    }

    const feeApr1h = calculateFeeApr(
      AprTimeRange.ONE_HOUR,
      oneHourData.get(pair.id)?.feesUSD ?? currentFeesUSD,
      pair.feesUSD,
      pair.liquidityUSD,
    )
    const feeApr1d = calculateFeeApr(
      AprTimeRange.ONE_DAY,
      oneDayData.get(pair.id)?.feesUSD ?? currentFeesUSD,
      pair.feesUSD,
      pair.liquidityUSD,
    )
    const feeApr1w = calculateFeeApr(
      AprTimeRange.ONE_WEEK,
      oneWeekData.get(pair.id)?.feesUSD ?? currentFeesUSD,
      pair.feesUSD,
      pair.liquidityUSD,
    )
    const feeApr1m = calculateFeeApr(
      AprTimeRange.ONE_MONTH,
      oneMonthData.get(pair.id)?.feesUSD ?? currentFeesUSD,
      pair.feesUSD,
      pair.liquidityUSD,
    )

    const fees1h = oneHourData.has(pair.id)
      ? currentFeesUSD - oneHourData.get(pair.id)!.feesUSD
      : currentFeesUSD
    const fees1d = oneDayData.has(pair.id)
      ? currentFeesUSD - oneDayData.get(pair.id)!.feesUSD
      : currentFeesUSD
    const fees1w = oneWeekData.has(pair.id)
      ? currentFeesUSD - oneWeekData.get(pair.id)!.feesUSD
      : currentFeesUSD
    const fees1m = oneMonthData.has(pair.id)
      ? currentFeesUSD - oneMonthData.get(pair.id)!.feesUSD
      : currentFeesUSD
    const feesChange1h = calculatePercentageChange(
      currentFeesUSD,
      oneHourData.get(pair.id)?.feesUSD ?? 0,
      twoHourData.get(pair.id)?.feesUSD ?? 0,
    )
    const feesChange1d = calculatePercentageChange(
      currentFeesUSD,
      oneDayData.get(pair.id)?.feesUSD ?? 0,
      twoDayData.get(pair.id)?.feesUSD ?? 0,
    )
    const feesChange1w = calculatePercentageChange(
      currentFeesUSD,
      oneWeekData.get(pair.id)?.feesUSD ?? 0,
      twoWeekData.get(pair.id)?.feesUSD ?? 0,
    )
    const feesChange1m = calculatePercentageChange(
      currentFeesUSD,
      oneMonthData.get(pair.id)?.feesUSD ?? 0,
      twoMonthData.get(pair.id)?.feesUSD ?? 0,
    )
    const volume1h = oneHourData.has(pair.id)
      ? currentVolumeUSD - oneHourData.get(pair.id)!.volumeUSD
      : currentVolumeUSD
    const volume1d = oneDayData.has(pair.id)
      ? currentVolumeUSD - oneDayData.get(pair.id)!.volumeUSD
      : currentVolumeUSD
    const volume1w = oneWeekData.has(pair.id)
      ? currentVolumeUSD - oneWeekData.get(pair.id)!.volumeUSD
      : currentVolumeUSD
    const volume1m = oneMonthData.has(pair.id)
      ? currentVolumeUSD - oneMonthData.get(pair.id)!.volumeUSD
      : currentVolumeUSD
    const volumeChange1h = calculatePercentageChange(
      currentVolumeUSD,
      oneHourData.get(pair.id)?.volumeUSD ?? 0,
      twoHourData.get(pair.id)?.volumeUSD ?? 0,
    )
    const volumeChange1d = calculatePercentageChange(
      currentVolumeUSD,
      oneDayData.get(pair.id)?.volumeUSD ?? 0,
      twoDayData.get(pair.id)?.volumeUSD ?? 0,
    )
    const volumeChange1w = calculatePercentageChange(
      currentVolumeUSD,
      oneWeekData.get(pair.id)?.volumeUSD ?? 0,
      twoWeekData.get(pair.id)?.volumeUSD ?? 0,
    )
    const volumeChange1m = calculatePercentageChange(
      currentVolumeUSD,
      oneMonthData.get(pair.id)?.volumeUSD ?? 0,
      twoMonthData.get(pair.id)?.volumeUSD ?? 0,
    )
    const liquidityUSDChange1h = oneHourData.get(pair.id)?.liquidityUSD
      ? currentLiquidityUSD / oneHourData.get(pair.id)!.liquidityUSD - 1
      : 0
    const liquidityUSDChange1d = oneDayData.get(pair.id)?.liquidityUSD
      ? currentLiquidityUSD / oneDayData.get(pair.id)!.liquidityUSD - 1
      : 0

    const liquidityUSDChange1w = oneWeekData.get(pair.id)?.liquidityUSD
      ? currentLiquidityUSD / oneWeekData.get(pair.id)!.liquidityUSD - 1
      : 0

    const liquidityUSDChange1m = oneMonthData.get(pair.id)?.liquidityUSD
      ? currentLiquidityUSD / oneMonthData.get(pair.id)!.liquidityUSD - 1
      : 0

    return {
      id: pair.id.toLowerCase(),
      address: pair.address.toLowerCase(),
      name: name,
      protocol: Protocol.SUSHISWAP_V3,
      chainId: queryResult.chainId,
      swapFee,
      twapEnabled: true,
      token0Id: pair.token0.id.toLowerCase(),
      token1Id: pair.token1.id.toLowerCase(),
      reserve0: pair.reserve0.toString(),
      reserve1: pair.reserve1.toString(),
      totalSupply: pair.liquidity.toString(),
      fees1h,
      fees1d,
      fees1w,
      fees1m,
      ...(oneHourData.get(pair.id)?.feesUSD && { feesChange1h }),
      ...(oneDayData.get(pair.id)?.feesUSD && { feesChange1d }),
      ...(oneWeekData.get(pair.id)?.feesUSD && { feesChange1w }),
      ...(oneMonthData.get(pair.id)?.feesUSD && { feesChange1m }),
      volume1h,
      volume1d,
      volume1w,
      volume1m,
      ...(oneHourData.get(pair.id)?.volumeUSD && { volumeChange1h }),
      ...(oneDayData.get(pair.id)?.volumeUSD && { volumeChange1d }),
      ...(oneWeekData.get(pair.id)?.volumeUSD && { volumeChange1w }),
      ...(oneMonthData.get(pair.id)?.volumeUSD && { volumeChange1m }),
      ...(oneHourData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1h }),
      ...(oneDayData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1d }),
      ...(oneWeekData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1w }),
      ...(oneMonthData.get(pair.id)?.liquidityUSD && {
        liquidityUSDChange1m,
      }),
      ...(oneHourData.get(pair.id)?.feesUSD && { feeApr1h }),
      ...(oneDayData.get(pair.id)?.feesUSD && { feeApr1d }),
      ...(oneWeekData.get(pair.id)?.feesUSD && { feeApr1w }),
      ...(oneMonthData.get(pair.id)?.feesUSD && { feeApr1m }),
      ...((oneDayData.get(pair.id)?.feesUSD && { feeApr1d }) ||
        (oneHourData.get(pair.id)?.feesUSD && { feeApr1d: feeApr1h })),
      ...(oneDayData.get(pair.id)?.feesUSD && { totalApr1d: feeApr1d }),
      ...(oneWeekData.get(pair.id)?.feesUSD && { totalApr1w: feeApr1w }),
      ...(oneMonthData.get(pair.id)?.feesUSD && { totalApr1m: feeApr1m }),
      liquidityUSD: currentLiquidityUSD,
      liquidityNative: 0, // TODO: add this back?
      volumeUSD: currentVolumeUSD,
      feesUSD: currentFeesUSD,
      volumeNative: 0, // DOES NOT EXIST IN V3 subgraph
      token0Price: pair.token0Price.toString(),
      token1Price: pair.token1Price.toString(),
      createdAtBlockNumber: 0,
    } satisfies Prisma.SushiPoolCreateManyInput
  })

  return { pools: poolsTransformed, tokens }
}

const calculateFeeApr = (
  timeRange: AprTimeRange,
  historicalFee: number,
  currentFee: number,
  currentLiquidityUSD: number,
) => {
  if (Number(currentLiquidityUSD) === 0) return 0

  if (timeRange === AprTimeRange.ONE_HOUR) {
    return ((currentFee - historicalFee) * 24 * 365) / currentLiquidityUSD
  } else if (timeRange === AprTimeRange.ONE_DAY) {
    return ((currentFee - historicalFee) * 365) / currentLiquidityUSD
  } else if (timeRange === AprTimeRange.ONE_WEEK) {
    return ((currentFee - historicalFee) * 52) / currentLiquidityUSD
  } else if (timeRange === AprTimeRange.ONE_MONTH) {
    return ((currentFee - historicalFee) * 12) / currentLiquidityUSD
  }
  return 0
}

const calculatePercentageChange = (
  current: number,
  previous: number,
  previous2: number,
) => {
  if (current === 0) return 0
  const change1 = previous !== 0 ? current - previous : 0
  const change2 = previous !== 0 && previous2 !== 0 ? previous - previous2 : 0
  if (change2 === 0) return 0 // avoid division by 0
  return previous !== 0 && previous2 !== 0 ? change1 / change2 - 1 : 0
}
