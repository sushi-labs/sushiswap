import { ChainId } from 'sushi/chain'
import { createClient, Prisma, Protocol } from '@sushiswap/database'
import {
  SECONDS_BETWEEN_BLOCKS,
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  SWAP_ENABLED_NETWORKS,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, PairsQuery, Sdk, V3PoolsQuery } from '../.graphclient/index.js'
import { upsertPools } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'

interface SubgraphConfig {
  chainId: ChainId
  host: string
  name: string
  protocol: Protocol
}

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
  currentPools: PairsQuery[]
  pools1h: PairsQuery[]
  pools2h: PairsQuery[]
  pools1d: PairsQuery[]
  pools2d: PairsQuery[]
  pools1w: PairsQuery[]
  pools2w: PairsQuery[]
  pools1m: PairsQuery[]
  pools2m: PairsQuery[]
}
type V3Data = {
  currentPools: V3PoolsQuery[]
  pools1h: V3PoolsQuery[]
  pools2h: V3PoolsQuery[]
  pools1d: V3PoolsQuery[]
  pools2d: V3PoolsQuery[]
  pools1w: V3PoolsQuery[]
  pools2w: V3PoolsQuery[]
  pools1m: V3PoolsQuery[]
  pools2m: V3PoolsQuery[]
}

enum AprTimeRange {
  ONE_HOUR = 'ONE_HOUR',
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  ONE_MONTH = 'ONE_MONTH',
}

export async function execute(protocol: Protocol) {
  try {
    const startTime = performance.now()
    console.log('Preparing to load pools/tokens')

    // EXTRACT
    const exchanges = await extract(protocol)
    console.log(`EXTRACT - Pairs extracted from ${exchanges.length} different subgraphs`)

    // TRANSFORM
    const { tokens, pools } = transform(exchanges)

    // LOAD
    const batchSize = 300

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
      console.log(`Batch completed in ${((batchEndTime - batchStartTime) / 1000).toFixed(1)} seconds. `)
    }
    const endTime = performance.now()

    console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
  } catch (e) {
    console.error(e)
    await (await createClient()).$disconnect()
  } finally {
    await (await createClient()).$disconnect()
  }
}

function createSubgraphConfig(protocol: Protocol) {
  if (protocol === Protocol.SUSHISWAP_V2) {
    return SUSHISWAP_ENABLED_NETWORKS.map((chainId) => {
      return {
        chainId,
        host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
        name: SUSHISWAP_SUBGRAPH_NAME[chainId],
        protocol: Protocol.SUSHISWAP_V2,
      }
    })
  } else if (protocol === Protocol.SUSHISWAP_V3) {
    return SUSHISWAP_V3_ENABLED_NETWORKS.map((chainId) => ({
      chainId,
      host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
      name: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
      protocol: Protocol.SUSHISWAP_V3,
    }))
  } else if (protocol === Protocol.BENTOBOX_CLASSIC || protocol === Protocol.BENTOBOX_STABLE) {
    return TRIDENT_ENABLED_NETWORKS.map((chainId) => {
      const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
      return {
        chainId,
        host: SUBGRAPH_HOST[_chainId],
        name: TRIDENT_SUBGRAPH_NAME[_chainId],
        protocol: Protocol.BENTOBOX_CLASSIC,
      }
    })
  }

  throw new Error('Protocol not supported')
}

async function extract(protocol: Protocol) {
  const result: { chainId: ChainId; data: V2Data | V3Data }[] = []
  const subgraphs = createSubgraphConfig(protocol)
  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)
  const sdk = getBuiltGraphSDK()
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
    sdk.OneHourBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.TwoHourBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneDayBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.TwoDayBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneWeekBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.TwoWeekBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneMonthBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.TwoMonthBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
  ])

  for (const subgraph of subgraphs) {
    const sdk = getBuiltGraphSDK({ chainId: subgraph.chainId, host: subgraph.host, name: subgraph.name })
    const blocks: Blocks = {
      oneHour:
        Number(oneHourBlocks.oneHourBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      twoHour:
        Number(twoHourBlocks.twoHourBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneDay:
        Number(oneDayBlocks.oneDayBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      twoDay:
        Number(twoDayBlocks.twoDayBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneWeek:
        Number(oneWeekBlocks.oneWeekBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      twoWeek:
        Number(twoWeekBlocks.twoWeekBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneMonth:
        Number(oneMonthBlocks.oneMonthBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      twoMonth:
        Number(twoMonthBlocks.twoMonthBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
    }

    const pairs = await fetchPairs(sdk, subgraph, blocks)
    console.log(`${subgraph.name}, batches: ${pairs.currentPools.length}`)
    result.push({ chainId: subgraph.chainId, data: pairs })
  }
  return result
}

async function fetchPairs(sdk: Sdk, config: SubgraphConfig, blocks: Blocks) {
  if (config.protocol === Protocol.SUSHISWAP_V2 || config.protocol === Protocol.BENTOBOX_CLASSIC) {
    const [currentPools, pools1h, pools2h, pools1d, pools2d, pools1w, pools2w, pools1m, pools2m] = await Promise.all([
      fetchLegacyOrTridentPairs(sdk, config),
      blocks.oneHour ? fetchLegacyOrTridentPairs(sdk, config, blocks.oneHour) : ([] as PairsQuery[]),
      blocks.twoHour ? fetchLegacyOrTridentPairs(sdk, config, blocks.twoHour) : ([] as PairsQuery[]),
      blocks.oneDay ? fetchLegacyOrTridentPairs(sdk, config, blocks.oneDay) : ([] as PairsQuery[]),
      blocks.twoDay ? fetchLegacyOrTridentPairs(sdk, config, blocks.twoDay) : ([] as PairsQuery[]),
      blocks.oneWeek ? fetchLegacyOrTridentPairs(sdk, config, blocks.oneWeek) : ([] as PairsQuery[]),
      blocks.twoWeek ? fetchLegacyOrTridentPairs(sdk, config, blocks.twoWeek) : ([] as PairsQuery[]),
      blocks.oneMonth ? fetchLegacyOrTridentPairs(sdk, config, blocks.oneMonth) : ([] as PairsQuery[]),
      blocks.twoMonth ? fetchLegacyOrTridentPairs(sdk, config, blocks.twoMonth) : ([] as PairsQuery[]),
    ])
    console.log(
      `${config.name} results by timeframe\n  * current: ${currentPools.length}\n * 1h: ${pools1h.length}\n * 2h: ${pools2h.length}\n * 1d: ${pools1d.length}\n * 2d: ${pools2d.length}\n * 1w: ${pools1w.length}\n * 2w: ${pools2w.length}\n * 1m: ${pools1m.length}\n * 2m: ${pools2m.length}`
    )
    return { currentPools, pools1h, pools2h, pools1d, pools2d, pools1w, pools2w, pools1m, pools2m }
  } else if (config.protocol === Protocol.SUSHISWAP_V3) {
    const [currentPools, pools1h, pools2h, pools1d, pools2d, pools1w, pools2w, pools1m, pools2m] = await Promise.all([
      fetchV3Pools(sdk, config),
      blocks.oneHour ? fetchV3Pools(sdk, config, blocks.oneHour) : ([] as V3PoolsQuery[]),
      blocks.twoHour ? fetchV3Pools(sdk, config, blocks.twoHour) : ([] as V3PoolsQuery[]),
      blocks.oneDay ? fetchV3Pools(sdk, config, blocks.oneDay) : ([] as V3PoolsQuery[]),
      blocks.twoDay ? fetchV3Pools(sdk, config, blocks.twoDay) : ([] as V3PoolsQuery[]),
      blocks.oneWeek ? fetchV3Pools(sdk, config, blocks.oneWeek) : ([] as V3PoolsQuery[]),
      blocks.twoWeek ? fetchV3Pools(sdk, config, blocks.twoWeek) : ([] as V3PoolsQuery[]),
      blocks.oneMonth ? fetchV3Pools(sdk, config, blocks.oneMonth) : ([] as V3PoolsQuery[]),
      blocks.twoMonth ? fetchV3Pools(sdk, config, blocks.twoMonth) : ([] as V3PoolsQuery[]),
    ])
    console.log(
      `${config.name} results by timeframe\n * current: ${currentPools.length}\n * 1h: ${pools1h.length}\n * 2h: ${pools2h.length}\n * 1d: ${pools1d.length}\n * 2d: ${pools2d.length}\n * 1w: ${pools1w.length}\n * 2w: ${pools2w.length}\n * 1m: ${pools1m.length}\n * 2m: ${pools2m.length}`
    )
    return { currentPools, pools1h, pools2h, pools1d, pools2d, pools1w, pools2w, pools1m, pools2m }
  } else {
    console.warn('fetchPairs: config.version is not LEGACY or TRIDENT or V3, skipping')
  }
}

async function fetchLegacyOrTridentPairs(sdk: Sdk, config: SubgraphConfig, blockNumber?: number) {
  console.log(`Loading data from ${config.host} ${config.name}`)
  let cursor = ''
  const data: PairsQuery[] = []
  let count = 0
  do {
    const where = cursor !== '' ? { id_gt: cursor } : {}
    const block = blockNumber ? { number: blockNumber } : null
    const request = await sdk
      .Pairs({
        first: 1000,
        where,
        block,
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          console.error(e.message)
        }
        return undefined
      })
    const newCursor = request?.pairs.length === 1000 ? request?.pairs[request.pairs.length - 1]?.id : ''
    cursor = newCursor
    count += request?.pairs.length || 0
    if (request) {
      data.push(request)
    }
  } while (cursor !== '')
  console.log(`EXTRACT: ${config.host}/${config.name} - ${count} pairs found.`)
  return data
}

async function fetchV3Pools(sdk: Sdk, config: SubgraphConfig, blockNumber?: number) {
  console.log(`Loading data from ${config.host} ${config.name}`)
  let cursor = ''
  const data: V3PoolsQuery[] = []
  let count = 0

  do {
    const where = cursor !== '' ? { id_gt: cursor } : null
    const block = blockNumber ? { number: blockNumber } : null

    const request = await sdk
      .V3Pools({
        first: 1000,
        where,
        block,
      })
      .catch((e: unknown) => {
        if (e instanceof Error) {
          console.error(e.message)
        }
        return undefined
      })
    const newCursor = request?.pools.length === 1000 ? request?.pools[request.pools.length - 1]?.id : ''
    cursor = newCursor
    count += request?.pools.length || 0
    if (request) {
      data.push(request)
    }
  } while (cursor !== '')
  console.log(`EXTRACT: ${config.host}/${config.name} - ${count} pairs found.`)
  return data
}

function transform(queryResults: { chainId: ChainId; data: V2Data | V3Data }[]) {
  const tokens: Map<string, Prisma.TokenCreateManyInput> = new Map()
  const pools: Prisma.SushiPoolCreateManyInput[] = []

  for (const result of queryResults) {
    const { chainId, data } = result
    if (isV2Query(data)) {
      const { pools: v2Pools, tokens: v2Tokens } = transformLegacyOrTrident({ chainId, data })
      pools.push(...v2Pools)

      v2Tokens.forEach((token) => {
        const existing = tokens.get(token.id)
        if (!existing) {
          tokens.set(token.id, token)
        }
      })
    } else if (isV3Query(data)) {
      const { pools: v3Pools, tokens: v3Tokens } = transformV3({ chainId, data })
      pools.push(...v3Pools)

      v3Tokens.forEach((token) => {
        const existing = tokens.get(token.id)
        if (!existing) {
          tokens.set(token.id, token)
        }
      })
    } else {
      console.warn('Unknown query type, skipping')
    }
  }

  const dedupedTokens = [...new Set(Array.from(tokens.values()))]
  console.log(`${pools.length} pools, ${dedupedTokens.length} tokens`)
  return { pools: pools, tokens: dedupedTokens }
}

export const isV2Query = (data: V2Data | V3Data): data is V2Data =>
  data.currentPools.some((d) => d?.pairs !== undefined)

export const isV3Query = (data: V2Data | V3Data): data is V3Data =>
  data.currentPools.some((d) => d?.pools !== undefined)

function transformLegacyOrTrident(queryResult: { chainId: ChainId; data: V2Data }) {
  const oneHourData = new Map(
    queryResult.data.pools1h
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const twoHourData = new Map(
    queryResult.data.pools2h
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const oneDayData = new Map(
    queryResult.data.pools1d
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const twoDayData = new Map(
    queryResult.data.pools2d
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const oneWeekData = new Map(
    queryResult.data.pools1w
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const twoWeekData = new Map(
    queryResult.data.pools2w
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const oneMonthData = new Map(
    queryResult.data.pools1m
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )
  const twoMonthData = new Map(
    queryResult.data.pools2m
      .flatMap((page) => page.pairs)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.liquidityUSD),
        },
      ])
  )

  const tokens: Prisma.TokenCreateManyInput[] = []

  return {
    pools: queryResult.data.currentPools.flatMap((batch) => {
      if (!batch?.pairs) return []
      return batch?.pairs.flatMap((pair) => {
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: queryResult.chainId.toString().concat(':').concat(pair.token0.id),
            address: pair.token0.id,
            chainId: queryResult.chainId,
            name: pair.token0.name,
            symbol: pair.token0.symbol,
            decimals: Number(pair.token0.decimals),
          })
        )
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: queryResult.chainId.toString().concat(':').concat(pair.token1.id),
            address: pair.token1.id,
            chainId: queryResult.chainId,
            name: pair.token1.name,
            symbol: pair.token1.symbol,
            decimals: Number(pair.token1.decimals),
          })
        )

        const regex = /([^\w ]|_|-)/g
        const name = pair.token0.symbol
          .replace(regex, '')
          .slice(0, 15)
          .concat('-')
          .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
        let protocol: Protocol
        if (pair.source === 'LEGACY' && pair.type === 'CONSTANT_PRODUCT_POOL') {
          protocol = Protocol.SUSHISWAP_V2
        } else if (pair.source === 'TRIDENT' && pair.type === 'CONSTANT_PRODUCT_POOL') {
          protocol = Protocol.BENTOBOX_CLASSIC
        } else if (pair.source === 'TRIDENT' && pair.type === 'STABLE_POOL') {
          protocol = Protocol.BENTOBOX_STABLE
        } else {
          throw new Error('Unknown pool type')
        }

        const currentVolumeUSD = Number(pair.volumeUSD)
        const currentLiquidityUSD = Number(pair.liquidityUSD)
        const currentFeesUSD = Number(pair.feesUSD)

        const feeApr1h = calculateFeeApr(
          AprTimeRange.ONE_HOUR,
          oneHourData.get(pair.id)?.feesUSD ?? currentFeesUSD,
          pair.feesUSD,
          pair.liquidityUSD
        )
        const feeApr1d = calculateFeeApr(
          AprTimeRange.ONE_DAY,
          oneDayData.get(pair.id)?.feesUSD ?? currentFeesUSD,
          pair.feesUSD,
          pair.liquidityUSD
        )
        const feeApr1w = calculateFeeApr(
          AprTimeRange.ONE_WEEK,
          oneWeekData.get(pair.id)?.feesUSD ?? currentFeesUSD,
          pair.feesUSD,
          pair.liquidityUSD
        )
        const feeApr1m = calculateFeeApr(
          AprTimeRange.ONE_MONTH,
          oneMonthData.get(pair.id)?.feesUSD ?? currentFeesUSD,
          pair.feesUSD,
          pair.liquidityUSD
        )

        const fees1h = oneHourData.has(pair.id) ? currentFeesUSD - oneHourData.get(pair.id).feesUSD : currentFeesUSD
        const fees1d = oneDayData.has(pair.id) ? currentFeesUSD - oneDayData.get(pair.id).feesUSD : currentFeesUSD
        const fees1w = oneWeekData.has(pair.id) ? currentFeesUSD - oneWeekData.get(pair.id).feesUSD : currentFeesUSD
        const fees1m = oneMonthData.has(pair.id) ? currentFeesUSD - oneMonthData.get(pair.id).feesUSD : currentFeesUSD
        const feesChange1h = calculatePercentageChange(
          currentFeesUSD,
          oneHourData.get(pair.id)?.feesUSD ?? 0,
          twoHourData.get(pair.id)?.feesUSD ?? 0
        )
        const feesChange1d = calculatePercentageChange(
          currentFeesUSD,
          oneDayData.get(pair.id)?.feesUSD ?? 0,
          twoDayData.get(pair.id)?.feesUSD ?? 0
        )
        const feesChange1w = calculatePercentageChange(
          currentFeesUSD,
          oneWeekData.get(pair.id)?.feesUSD ?? 0,
          twoWeekData.get(pair.id)?.feesUSD ?? 0
        )
        const feesChange1m = calculatePercentageChange(
          currentFeesUSD,
          oneMonthData.get(pair.id)?.feesUSD ?? 0,
          twoMonthData.get(pair.id)?.feesUSD ?? 0
        )
        const volume1h = oneHourData.has(pair.id)
          ? currentVolumeUSD - oneHourData.get(pair.id).volumeUSD
          : currentVolumeUSD
        const volume1d = oneDayData.has(pair.id)
          ? currentVolumeUSD - oneDayData.get(pair.id).volumeUSD
          : currentVolumeUSD
        const volume1w = oneWeekData.has(pair.id)
          ? currentVolumeUSD - oneWeekData.get(pair.id).volumeUSD
          : currentVolumeUSD
        const volume1m = oneMonthData.has(pair.id)
          ? currentVolumeUSD - oneMonthData.get(pair.id).volumeUSD
          : currentVolumeUSD
        const volumeChange1h = calculatePercentageChange(
          currentVolumeUSD,
          oneHourData.get(pair.id)?.volumeUSD ?? 0,
          twoHourData.get(pair.id)?.volumeUSD ?? 0
        )
        const volumeChange1d = calculatePercentageChange(
          currentVolumeUSD,
          oneDayData.get(pair.id)?.volumeUSD ?? 0,
          twoDayData.get(pair.id)?.volumeUSD ?? 0
        )
        const volumeChange1w = calculatePercentageChange(
          currentVolumeUSD,
          oneWeekData.get(pair.id)?.volumeUSD ?? 0,
          twoWeekData.get(pair.id)?.volumeUSD ?? 0
        )
        const volumeChange1m = calculatePercentageChange(
          currentVolumeUSD,
          oneMonthData.get(pair.id)?.volumeUSD ?? 0,
          twoMonthData.get(pair.id)?.volumeUSD ?? 0
        )
        const liquidityUSDChange1h = oneHourData.get(pair.id)?.liquidityUSD
          ? currentLiquidityUSD / oneHourData.get(pair.id)?.liquidityUSD - 1
          : 0
        const liquidityUSDChange1d = oneDayData.get(pair.id)?.liquidityUSD
          ? currentLiquidityUSD / oneDayData.get(pair.id)?.liquidityUSD - 1
          : 0

        const liquidityUSDChange1w = oneWeekData.get(pair.id)?.liquidityUSD
          ? currentLiquidityUSD / oneWeekData.get(pair.id)?.liquidityUSD - 1
          : 0

        const liquidityUSDChange1m = oneMonthData.get(pair.id)?.liquidityUSD
          ? currentLiquidityUSD / oneMonthData.get(pair.id)?.liquidityUSD - 1
          : 0

        return {
          id: queryResult.chainId.toString().concat(':').concat(pair.id),
          address: pair.id,
          name: name,
          protocol,
          chainId: queryResult.chainId,
          swapFee: Number(pair.swapFee) / 10_000,
          twapEnabled: pair.twapEnabled,
          token0Id: queryResult.chainId.toString().concat(':').concat(pair.token0.id.toLowerCase()),
          token1Id: queryResult.chainId.toString().concat(':').concat(pair.token1.id.toLowerCase()),
          reserve0: pair.reserve0,
          reserve1: pair.reserve1,
          totalSupply: pair.liquidity,
          liquidityUSD: currentLiquidityUSD,
          liquidityNative: pair.liquidityNative,
          volumeUSD: currentVolumeUSD,
          feesUSD: currentFeesUSD,
          volumeNative: pair.volumeNative,
          token0Price: pair.token0Price,
          token1Price: pair.token1Price,
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
          ...(oneHourData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1h }),
          ...(oneDayData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1d }),
          ...(oneWeekData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1w }),
          ...(oneMonthData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1m }),
          ...(oneHourData.get(pair.id)?.feesUSD && { feeApr1h }),
          ...(oneDayData.get(pair.id)?.feesUSD && { feeApr1d }),
          ...(oneWeekData.get(pair.id)?.feesUSD && { feeApr1w }),
          ...(oneMonthData.get(pair.id)?.feesUSD && { feeApr1m }),
          ...(oneHourData.get(pair.id)?.feesUSD && { totalApr1h: feeApr1h }),
          ...(oneDayData.get(pair.id)?.feesUSD && { totalApr1d: feeApr1d }),
          ...(oneWeekData.get(pair.id)?.feesUSD && { totalApr1w: feeApr1w }),
          ...(oneMonthData.get(pair.id)?.feesUSD && { totalApr1m: feeApr1m }),
          createdAtBlockNumber: BigInt(pair.createdAtBlock),
        } satisfies Prisma.SushiPoolCreateManyInput
      })
    }),
    tokens,
  }
}

function transformV3(queryResult: { chainId: ChainId; data: V3Data }) {
  const oneHourData = new Map(
    queryResult.data.pools1h
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const twoHourData = new Map(
    queryResult.data.pools2h
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const oneDayData = new Map(
    queryResult.data.pools1d
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const twoDayData = new Map(
    queryResult.data.pools2d
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const oneWeekData = new Map(
    queryResult.data.pools1w
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const twoWeekData = new Map(
    queryResult.data.pools2w
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const oneMonthData = new Map(
    queryResult.data.pools1m
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const twoMonthData = new Map(
    queryResult.data.pools2m
      .flatMap((page) => page.pools)
      .map((pool) => [
        pool.id,
        {
          feesUSD: Number(pool.feesUSD),
          volumeUSD: Number(pool.volumeUSD),
          liquidityUSD: Number(pool.totalValueLockedUSD),
        },
      ])
  )
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = queryResult.data.currentPools.flatMap((batch) => {
    if (!batch?.pools) return []
    return batch?.pools.flatMap((pair) => {
      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: queryResult.chainId.toString().concat(':').concat(pair.token0.id),
          address: pair.token0.id,
          chainId: queryResult.chainId,
          name: pair.token0.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        })
      )
      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: queryResult.chainId.toString().concat(':').concat(pair.token1.id),
          address: pair.token1.id,
          chainId: queryResult.chainId,
          name: pair.token1.name,
          symbol: pair.token1.symbol,
          decimals: Number(pair.token1.decimals),
        })
      )
      const regex = /([^\w ]|_|-)/g
      const name = pair.token0.symbol
        .replace(regex, '')
        .slice(0, 15)
        .concat('-')
        .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
      const swapFee = Number(pair.feeTier) / 1_000_000

      const currentVolumeUSD = Number(pair.volumeUSD)
      const currentLiquidityUSD = Number(pair.totalValueLockedUSD)
      const currentFeesUSD = Number(pair.feesUSD)

      const feeApr1h = calculateFeeApr(
        AprTimeRange.ONE_HOUR,
        oneHourData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1d = calculateFeeApr(
        AprTimeRange.ONE_DAY,
        oneDayData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1w = calculateFeeApr(
        AprTimeRange.ONE_WEEK,
        oneWeekData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1m = calculateFeeApr(
        AprTimeRange.ONE_MONTH,
        oneMonthData.get(pair.id)?.feesUSD ?? currentFeesUSD,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )

      const fees1h = oneHourData.has(pair.id) ? currentFeesUSD - oneHourData.get(pair.id).feesUSD : currentFeesUSD
      const fees1d = oneDayData.has(pair.id) ? currentFeesUSD - oneDayData.get(pair.id).feesUSD : currentFeesUSD
      const fees1w = oneWeekData.has(pair.id) ? currentFeesUSD - oneWeekData.get(pair.id).feesUSD : currentFeesUSD
      const fees1m = oneMonthData.has(pair.id) ? currentFeesUSD - oneMonthData.get(pair.id).feesUSD : currentFeesUSD
      const feesChange1h = calculatePercentageChange(
        currentFeesUSD,
        oneHourData.get(pair.id)?.feesUSD ?? 0,
        twoHourData.get(pair.id)?.feesUSD ?? 0
      )
      const feesChange1d = calculatePercentageChange(
        currentFeesUSD,
        oneDayData.get(pair.id)?.feesUSD ?? 0,
        twoDayData.get(pair.id)?.feesUSD ?? 0
      )
      const feesChange1w = calculatePercentageChange(
        currentFeesUSD,
        oneWeekData.get(pair.id)?.feesUSD ?? 0,
        twoWeekData.get(pair.id)?.feesUSD ?? 0
      )
      const feesChange1m = calculatePercentageChange(
        currentFeesUSD,
        oneMonthData.get(pair.id)?.feesUSD ?? 0,
        twoMonthData.get(pair.id)?.feesUSD ?? 0
      )
      const volume1h = oneHourData.has(pair.id)
        ? currentVolumeUSD - oneHourData.get(pair.id).volumeUSD
        : currentVolumeUSD
      const volume1d = oneDayData.has(pair.id) ? currentVolumeUSD - oneDayData.get(pair.id).volumeUSD : currentVolumeUSD
      const volume1w = oneWeekData.has(pair.id)
        ? currentVolumeUSD - oneWeekData.get(pair.id).volumeUSD
        : currentVolumeUSD
      const volume1m = oneMonthData.has(pair.id)
        ? currentVolumeUSD - oneMonthData.get(pair.id).volumeUSD
        : currentVolumeUSD
      const volumeChange1h = calculatePercentageChange(
        currentVolumeUSD,
        oneHourData.get(pair.id)?.volumeUSD ?? 0,
        twoHourData.get(pair.id)?.volumeUSD ?? 0
      )
      const volumeChange1d = calculatePercentageChange(
        currentVolumeUSD,
        oneDayData.get(pair.id)?.volumeUSD ?? 0,
        twoDayData.get(pair.id)?.volumeUSD ?? 0
      )
      const volumeChange1w = calculatePercentageChange(
        currentVolumeUSD,
        oneWeekData.get(pair.id)?.volumeUSD ?? 0,
        twoWeekData.get(pair.id)?.volumeUSD ?? 0
      )
      const volumeChange1m = calculatePercentageChange(
        currentVolumeUSD,
        oneMonthData.get(pair.id)?.volumeUSD ?? 0,
        twoMonthData.get(pair.id)?.volumeUSD ?? 0
      )
      const liquidityUSDChange1h = oneHourData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneHourData.get(pair.id)?.liquidityUSD - 1
        : 0
      const liquidityUSDChange1d = oneDayData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneDayData.get(pair.id)?.liquidityUSD - 1
        : 0

      const liquidityUSDChange1w = oneWeekData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneWeekData.get(pair.id)?.liquidityUSD - 1
        : 0

      const liquidityUSDChange1m = oneMonthData.get(pair.id)?.liquidityUSD
        ? currentLiquidityUSD / oneMonthData.get(pair.id)?.liquidityUSD - 1
        : 0

      return {
        id: queryResult.chainId.toString().concat(':').concat(pair.id),
        address: pair.id,
        name: name,
        protocol: Protocol.SUSHISWAP_V3,
        chainId: queryResult.chainId,
        swapFee,
        twapEnabled: true,
        token0Id: queryResult.chainId.toString().concat(':').concat(pair.token0.id.toLowerCase()),
        token1Id: queryResult.chainId.toString().concat(':').concat(pair.token1.id.toLowerCase()),
        reserve0: (pair.totalValueLockedToken0 ** pair.token0.decimals).toFixed(0).toString(),
        reserve1: (pair.totalValueLockedToken1 ** pair.token1.decimals).toFixed(0).toString(),
        totalSupply: pair.liquidity,
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
        ...(oneMonthData.get(pair.id)?.liquidityUSD && { liquidityUSDChange1m }),
        ...(oneHourData.get(pair.id)?.feesUSD && { feeApr1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { feeApr1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { feeApr1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { feeApr1m }),
        ...(oneDayData.get(pair.id)?.feesUSD && { feeApr1d } || oneHourData.get(pair.id)?.feesUSD && { feeApr1d: feeApr1h }),
        ...(oneDayData.get(pair.id)?.feesUSD && { totalApr1d: feeApr1d }),
        ...(oneWeekData.get(pair.id)?.feesUSD && { totalApr1w: feeApr1w }),
        ...(oneMonthData.get(pair.id)?.feesUSD && { totalApr1m: feeApr1m }),
        liquidityUSD: currentLiquidityUSD,
        liquidityNative: pair.totalValueLockedETH,
        volumeUSD: currentVolumeUSD,
        feesUSD: currentFeesUSD,
        volumeNative: 0, // DOES NOT EXIST IN V3 subgraph
        token0Price: pair.token0Price,
        token1Price: pair.token1Price,
        createdAtBlockNumber: BigInt(pair.createdAtBlockNumber),
      } satisfies Prisma.SushiPoolCreateManyInput
    })
  })

  return { pools: poolsTransformed, tokens }
}

const calculateFeeApr = (
  timeRange: AprTimeRange,
  historicalFee: number,
  currentFee: number,
  currentLiquidityUSD: number
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

const calculatePercentageChange = (current: number, previous: number, previous2: number) => {
  if (current === 0) return 0
  const change1 = previous !== 0 ? current - previous : 0
  const change2 = previous !== 0 && previous2 !== 0 ? previous - previous2 : 0
  if (change2 === 0) return 0 // avoid division by 0
  return previous !== 0 && previous2 !== 0 ? change1 / change2 - 1 : 0
}

const calculateHistoricalBlock = (chainId: ChainId, currentBlock: number, seconds: number): number | undefined => {
  if (currentBlock === 0) return undefined
  if (seconds <= 0) return undefined
  const secondsBetweenBlocks = SECONDS_BETWEEN_BLOCKS[chainId]
  if (!secondsBetweenBlocks) {
    console.debug(`No secondsBetweenBlocks for chain ${chainId}`)
    return undefined
  }
  return currentBlock - Math.floor(seconds / secondsBetweenBlocks)
}
