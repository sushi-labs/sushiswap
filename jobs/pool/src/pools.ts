import { ChainId } from '@sushiswap/chain'
import { createClient, PoolType, PoolVersion, Prisma } from '@sushiswap/database'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  SUSHISWAP_V3_ENABLED_NETWORKS,
  SUSHISWAP_V3_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, OneDayBlocksQuery, PairsQuery, V3PoolsQuery } from '../.graphclient/index.js'
import { mergePools } from './etl/pool/index.js'
import { filterPools } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'

interface SubgraphConfig {
  chainId: ChainId
  host: string
  name: string
  version: PoolVersion
}

type V2Data = {
  currentPools: PairsQuery[]
  poolsOneDayAgo: PairsQuery[]
}
type V3Data = {
  currentPools: V3PoolsQuery[]
  poolsOneDayAgo: V3PoolsQuery[]
}

const FIRST_TIME_SEED = process.env.FIRST_TIME_SEED === 'true'
if (FIRST_TIME_SEED) {
  console.log('FIRST_TIME_SEED is true')
}

export async function execute() {
  try {
    const startTime = performance.now()
    console.log('Preparing to load pools/tokens')

    // EXTRACT
    const exchanges = await extract()
    console.log(`EXTRACT - Pairs extracted from ${exchanges.length} different subgraphs`)

    // TRANSFORM
    const { tokens, pools } = transform(exchanges)

    // LOAD
    const batchSize = 500

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize)
      await createTokens(batch)
    }

    for (let i = 0; i < pools.length; i += batchSize) {
      const batch = pools.slice(i, i + batchSize)
      const filteredPools = await filterPools(batch)
      await mergePools(filteredPools, FIRST_TIME_SEED)
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

async function extract() {
  const result: { chainId: ChainId; data: V2Data | V3Data }[] = []
  const subgraphs: SubgraphConfig[] = [
    TRIDENT_ENABLED_NETWORKS.map((chainId) => {
      const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
      return {
        chainId,
        host: SUBGRAPH_HOST[_chainId],
        name: TRIDENT_SUBGRAPH_NAME[_chainId],
        version: PoolVersion.TRIDENT,
      }
    }),
    SUSHISWAP_ENABLED_NETWORKS.map((chainId) => {
      return {
        chainId,
        host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
        name: SUSHISWAP_SUBGRAPH_NAME[chainId],
        version: PoolVersion.LEGACY,
      }
    }),
    SUSHISWAP_V3_ENABLED_NETWORKS.map((chainId) => ({
      chainId,
      host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
      name: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
      version: PoolVersion.V3,
    })),
  ]
    .flat()

  const sdk = getBuiltGraphSDK()
  const oneDayBlocks = await sdk.OneDayBlocks({ chainIds: SUSHISWAP_V3_ENABLED_NETWORKS })

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  for (const subgraph of subgraphs) {
    const pairs = await fetchPairs(subgraph, oneDayBlocks)
    console.log(`${subgraph.name}, batches: ${pairs.currentPools.length}`)
    result.push({ chainId: subgraph.chainId, data: pairs })
  }
  return result
}

async function fetchPairs(config: SubgraphConfig, blocks: OneDayBlocksQuery) {
  if (config.version === PoolVersion.LEGACY || config.version === PoolVersion.TRIDENT) {
    const currentPools = await fetchLegacyOrTridentPairs(config)
    return { currentPools, poolsOneDayAgo: [] as PairsQuery[] }
  } else if (config.version === PoolVersion.V3) {
    const blockNumber = blocks
      ? Number(blocks.oneDayBlocks.find((block) => block.chainId === config.chainId)?.number)
      : undefined

    const [currentPools, poolsOneDayAgo] = await Promise.all([
      fetchV3Pools(config),
      blockNumber ? fetchV3Pools(config, blockNumber) : ([] as V3PoolsQuery[]),
    ])
    return { currentPools, poolsOneDayAgo }
  } else {
    console.warn('fetchPairs: config.version is not LEGACY or TRIDENT or V3, skipping')
  }
}

async function fetchLegacyOrTridentPairs(config: SubgraphConfig) {
  const chainId = config.chainId
  const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
  console.log(`Loading data from ${config.host} ${config.name}`)
  let cursor = ''
  const data: PairsQuery[] = []
  let count = 0
  do {
    const where = cursor !== '' ? { id_gt: cursor } : {}
    const request = await sdk
      .Pairs({
        first: 1000,
        where,
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
  const yesterday = new Date(Date.now() - 86400000)
  const unix24hAgo = Math.floor(yesterday.getTime() / 1000)
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
      const isAprValid = Number(pair.aprUpdatedAtTimestamp) > unix24hAgo && !isNaN(Number(pair.apr))
      const feeApr = isAprValid ? Number(pair.apr) : 0
      const regex = /([^\w ]|_|-)/g
      const name = pair.token0.symbol
        .replace(regex, '')
        .slice(0, 15)
        .concat('-')
        .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
      let version: PoolVersion
      if (pair.source === PoolVersion.LEGACY) {
        version = PoolVersion.LEGACY
      } else if (pair.source === PoolVersion.TRIDENT) {
        version = PoolVersion.TRIDENT
      } else {
        throw new Error('Unknown pool version')
      }
      let type: PoolType

      if (pair.type === PoolType.CONSTANT_PRODUCT_POOL) {
        type = PoolType.CONSTANT_PRODUCT_POOL
      } else if (pair.type === PoolType.STABLE_POOL) {
        type = PoolType.STABLE_POOL
      } else {
        throw new Error('Unknown pool type')
      }

      return {
        id: queryResult.chainId.toString().concat(':').concat(pair.id),
        address: pair.id,
        name: name,
        version,
        type,
        chainId: queryResult.chainId,
        swapFee: Number(pair.swapFee) / 10_000,
        twapEnabled: pair.twapEnabled,
        token0Id: queryResult.chainId.toString().concat(':').concat(pair.token0.id.toLowerCase()),
        token1Id: queryResult.chainId.toString().concat(':').concat(pair.token1.id.toLowerCase()),
        reserve0: pair.reserve0,
        reserve1: pair.reserve1,
        totalSupply: pair.liquidity,
        feeApr,
        liquidityUSD: pair.liquidityUSD,
        liquidityNative: pair.liquidityNative,
        volumeUSD: pair.volumeUSD,
        volumeNative: pair.volumeNative,
        token0Price: pair.token0Price,
        token1Price: pair.token1Price,
        totalApr: feeApr,
        createdAtBlockNumber: BigInt(pair.createdAtBlock),
      } satisfies Prisma.SushiPoolCreateManyInput
    })
  })

  return { pools: poolsTransformed, tokens }
}

function transformV3(queryResult: { chainId: ChainId; data: V3Data }) {
  const aprParams: Map<string, number> = new Map()

  for (const query of queryResult.data.poolsOneDayAgo) {
    query?.pools.forEach((pair) => {
      aprParams.set(pair.id, pair.feesUSD)
    })
  }

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
      const feeApr = aprParams.has(pair.id)
        ? calculateFeeApr(aprParams.get(pair.id), pair.feesUSD, pair.totalValueLockedUSD)
        : 0
      return {
        id: queryResult.chainId.toString().concat(':').concat(pair.id),
        address: pair.id,
        name: name,
        version: PoolVersion.V3,
        type: PoolType.CONCENTRATED_LIQUIDITY_POOL,
        chainId: queryResult.chainId,
        swapFee,
        twapEnabled: true,
        token0Id: queryResult.chainId.toString().concat(':').concat(pair.token0.id.toLowerCase()),
        token1Id: queryResult.chainId.toString().concat(':').concat(pair.token1.id.toLowerCase()),
        reserve0: (pair.totalValueLockedToken0 ** pair.token0.decimals).toFixed(0).toString(),
        reserve1: (pair.totalValueLockedToken1 ** pair.token1.decimals).toFixed(0).toString(),
        totalSupply: pair.liquidity,
        feeApr,
        liquidityUSD: pair.totalValueLockedUSD,
        liquidityNative: pair.totalValueLockedETH,
        volumeUSD: pair.volumeUSD,
        volumeNative: 0, // DOES NOT EXIST IN V3 subgraph
        token0Price: pair.token0Price,
        token1Price: pair.token1Price,
        totalApr: feeApr,
        createdAtBlockNumber: BigInt(pair.createdAtBlockNumber),
      } satisfies Prisma.SushiPoolCreateManyInput
    })
  })

  return { pools: poolsTransformed, tokens }
}

const calculateFeeApr = (historicalFee: number, currentFee: number, currentLiquidityUSD) => {
  if (Number(currentLiquidityUSD) === 0) return 0

  return ((currentFee - historicalFee) * 365) / currentLiquidityUSD
}
