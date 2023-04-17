import { ChainId } from '@sushiswap/chain'
import { createClient, Prisma, Protocol } from '@sushiswap/database'
import {
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

import { getBuiltGraphSDK, PairsQuery, V3PoolsQuery } from '../.graphclient/index.js'
// import { upsertPools } from './etl/pool/index.js'
// import { filterPools } from './etl/pool/index.js'
// import { createTokens } from './etl/token/load.js'

interface SubgraphConfig {
  chainId: ChainId
  host: string
  name: string
  protocol: Protocol
}

interface Blocks {
  oneHour: number | undefined
  oneDay: number | undefined
  oneWeek: number | undefined
  oneMonth: number | undefined
}

type V2Data = {
  currentPools: PairsQuery[]
  pools1h: PairsQuery[]
  pools1d: PairsQuery[]
  pools1w: PairsQuery[]
  pools1m: PairsQuery[]
}
type V3Data = {
  currentPools: V3PoolsQuery[]
  pools1h: V3PoolsQuery[]
  pools1d: V3PoolsQuery[]
  pools1w: V3PoolsQuery[]
  pools1m: V3PoolsQuery[]
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
    const batchSize = 500

    // for (let i = 0; i < tokens.length; i += batchSize) {
    //   const batch = tokens.slice(i, i + batchSize)
    //   await createTokens(batch)
    // }

    // for (let i = 0; i < pools.length; i += batchSize) {
    //   const batch = pools.slice(i, i + batchSize)
    //   const filteredPools = await filterPools(batch)
    //   await upsertPools(filteredPools)
    // }
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

  const sdk = getBuiltGraphSDK()
  const [oneHourBlocks, oneDayBlocks, oneWeekBlocks, oneMonthBlocks] = await Promise.all([
    sdk.OneHourBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneDayBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneWeekBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
    sdk.OneMonthBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
  ])

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  for (const subgraph of subgraphs) {
    const blocks: Blocks = {
      oneHour:
        Number(oneHourBlocks.oneHourBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneDay:
        Number(oneDayBlocks.oneDayBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneWeek:
        Number(oneWeekBlocks.oneWeekBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
      oneMonth:
        Number(oneMonthBlocks.oneMonthBlocks.find((block) => block.chainId === subgraph.chainId)?.number) ?? undefined,
    }
    const pairs = await fetchPairs(subgraph, blocks)
    console.log(`${subgraph.name}, batches: ${pairs.currentPools.length}`)
    result.push({ chainId: subgraph.chainId, data: pairs })
  }
  return result
}

async function fetchPairs(config: SubgraphConfig, blocks: Blocks) {
  if (config.protocol === Protocol.SUSHISWAP_V2 || config.protocol === Protocol.BENTOBOX_CLASSIC) {
    const [currentPools, pools1h, pools1d, pools1w, pools1m] = await Promise.all([
      fetchLegacyOrTridentPairs(config),
      blocks.oneHour ? fetchLegacyOrTridentPairs(config, blocks.oneHour) : ([] as PairsQuery[]),
      blocks.oneDay ? fetchLegacyOrTridentPairs(config, blocks.oneDay) : ([] as PairsQuery[]),
      blocks.oneWeek ? fetchLegacyOrTridentPairs(config, blocks.oneWeek) : ([] as PairsQuery[]),
      blocks.oneMonth ? fetchLegacyOrTridentPairs(config, blocks.oneMonth) : ([] as PairsQuery[]),
    ])
    return { currentPools, pools1h, pools1d, pools1w, pools1m }
  } else if (config.protocol === Protocol.SUSHISWAP_V3) {
    const [currentPools, pools1h, pools1d, pools1w, pools1m] = await Promise.all([
      fetchV3Pools(config),
      blocks.oneHour ? fetchV3Pools(config, blocks.oneHour) : ([] as V3PoolsQuery[]),
      blocks.oneDay ? fetchV3Pools(config, blocks.oneDay) : ([] as V3PoolsQuery[]),
      blocks.oneWeek ? fetchV3Pools(config, blocks.oneWeek) : ([] as V3PoolsQuery[]),
      blocks.oneMonth ? fetchV3Pools(config, blocks.oneMonth) : ([] as V3PoolsQuery[]),
    ])
    return { currentPools, pools1h, pools1d, pools1w, pools1m }
  } else {
    console.warn('fetchPairs: config.version is not LEGACY or TRIDENT or V3, skipping')
  }
}

async function fetchLegacyOrTridentPairs(config: SubgraphConfig, blockNumber?: number) {
  const chainId = config.chainId
  const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
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
        block
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

async function fetchV3Pools(config: SubgraphConfig, blockNumber?: number) {
  const chainId = config.chainId
  const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
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
        },
      ])
  )

  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = queryResult.data.currentPools.flatMap((batch) => {
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

      const feeApr1h = calculateFeeApr(
        AprTimeRange.ONE_HOUR,
        oneHourData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.liquidityUSD
      )
      const feeApr1d = calculateFeeApr(
        AprTimeRange.ONE_DAY,
        oneDayData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.liquidityUSD
      )
      const feeApr1w = calculateFeeApr(
        AprTimeRange.ONE_WEEK,
        oneWeekData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.liquidityUSD
      )
      const feeApr1m = calculateFeeApr(
        AprTimeRange.ONE_MONTH,
        oneMonthData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.liquidityUSD
      )

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
        liquidityUSD: pair.liquidityUSD,
        liquidityNative: pair.liquidityNative,
        volumeUSD: pair.volumeUSD,
        volumeNative: pair.volumeNative,
        token0Price: pair.token0Price,
        token1Price: pair.token1Price,
        fees1h: oneHourData.has(pair.id) ? Number(pair.feesUSD) - oneHourData.get(pair.id).feesUSD : pair.feesUSD,
        fees1d: oneDayData.has(pair.id) ? Number(pair.feesUSD) - oneDayData.get(pair.id).feesUSD : pair.feesUSD,
        fees1w: oneWeekData.has(pair.id) ? Number(pair.feesUSD) - oneWeekData.get(pair.id).feesUSD : pair.feesUSD,
        fees1m: oneMonthData.has(pair.id) ? Number(pair.feesUSD) - oneMonthData.get(pair.id).feesUSD : pair.feesUSD,
        volume1h: oneHourData.has(pair.id)
          ? Number(pair.volumeUSD) - oneHourData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        volume1d: oneDayData.has(pair.id) ? Number(pair.volumeUSD) - oneDayData.get(pair.id).volumeUSD : pair.volumeUSD,
        volume1w: oneWeekData.has(pair.id)
          ? Number(pair.volumeUSD) - oneWeekData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        volume1m: oneMonthData.has(pair.id)
          ? Number(pair.volumeUSD) - oneMonthData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        feeApr1h,
        feeApr1d,
        feeApr1w,
        feeApr1m,
        totalApr1h: feeApr1h,
        totalApr1d: feeApr1d,
        totalApr1w: feeApr1w,
        totalApr1m: feeApr1m,
        createdAtBlockNumber: BigInt(pair.createdAtBlock),
      } satisfies Prisma.SushiPoolCreateManyInput
    })
  })

  return { pools: poolsTransformed, tokens }
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

      const feeApr1h = calculateFeeApr(
        AprTimeRange.ONE_HOUR,
        oneHourData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1d = calculateFeeApr(
        AprTimeRange.ONE_DAY,
        oneDayData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1w = calculateFeeApr(
        AprTimeRange.ONE_WEEK,
        oneWeekData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )
      const feeApr1m = calculateFeeApr(
        AprTimeRange.ONE_MONTH,
        oneMonthData.get(pair.id)?.feesUSD ?? 0,
        pair.feesUSD,
        pair.totalValueLockedUSD
      )

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
        fees1h: oneHourData.has(pair.id) ? Number(pair.feesUSD) - oneHourData.get(pair.id).feesUSD : pair.feesUSD,
        fees1d: oneDayData.has(pair.id) ? Number(pair.feesUSD) - oneDayData.get(pair.id).feesUSD : pair.feesUSD,
        fees1w: oneWeekData.has(pair.id) ? Number(pair.feesUSD) - oneWeekData.get(pair.id).feesUSD : pair.feesUSD,
        fees1m: oneMonthData.has(pair.id) ? Number(pair.feesUSD) - oneMonthData.get(pair.id).feesUSD : pair.feesUSD,
        volume1h: oneHourData.has(pair.id)
          ? Number(pair.volumeUSD) - oneHourData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        volume1d: oneDayData.has(pair.id) ? Number(pair.volumeUSD) - oneDayData.get(pair.id).volumeUSD : pair.volumeUSD,
        volume1w: oneWeekData.has(pair.id)
          ? Number(pair.volumeUSD) - oneWeekData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        volume1m: oneMonthData.has(pair.id)
          ? Number(pair.volumeUSD) - oneMonthData.get(pair.id).volumeUSD
          : pair.volumeUSD,
        feeApr1h,
        feeApr1d,
        feeApr1w,
        feeApr1m,
        totalApr1h: feeApr1h,
        totalApr1d: feeApr1d,
        totalApr1w: feeApr1w,
        totalApr1m: feeApr1m,
        liquidityUSD: pair.totalValueLockedUSD,
        liquidityNative: pair.totalValueLockedETH,
        volumeUSD: pair.volumeUSD,
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
