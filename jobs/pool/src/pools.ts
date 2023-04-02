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

import { getBuiltGraphSDK, PairsQuery, V3PoolsQuery } from '../.graphclient/index.js'
import { mergePools } from './etl/pool/index.js'
import { filterPools } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'
import { Sdk } from '../.graphclient/index.js'
import { config } from 'process'

interface SubgraphConfig {
  chainId: ChainId
  host: string
  name: string
  version: PoolVersion
}

const FIRST_TIME_SEED = process.env.FIRST_TIME_SEED === 'true'
if (FIRST_TIME_SEED) {
  console.log('FIRST_TIME_SEED is true')
}

export async function execute() {
  try {
    const startTime = performance.now()
    console.log(`Preparing to load pools/tokens`)

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
  const result: { chainId: ChainId; data: PairsQuery[] | V3PoolsQuery[] }[] = []
  const subgraphs: SubgraphConfig[] = [
    // TRIDENT_ENABLED_NETWORKS.map((chainId) => {
    //   const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
    //   return {
    //     chainId,
    //     host: SUBGRAPH_HOST[_chainId],
    //     name: TRIDENT_SUBGRAPH_NAME[_chainId],
    //     version: PoolVersion.TRIDENT,
    //   }
    // }),
    // SUSHISWAP_ENABLED_NETWORKS.map((chainId) => {
    //   return {
    //     chainId,
    //     host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
    //     name: SUSHISWAP_SUBGRAPH_NAME[chainId],
    //     version: PoolVersion.LEGACY,
    //   }
    // }),
    SUSHISWAP_V3_ENABLED_NETWORKS.map((chainId) => ({
      chainId,
      host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
      name: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
      version: PoolVersion.V3,
    })),
  ].flat()

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  let totalPairCount = 0
  for (const subgraph of subgraphs) {
    const pairs = await fetchPairs(subgraph)
    console.log(`${subgraph.name}, pair count: ${pairs.length}`)
    totalPairCount += pairs.length
    result.push({ chainId: subgraph.chainId, data: pairs })
  }
  console.log(`Total pair count across all subgraphs: ${totalPairCount}`)
  return result
}

async function fetchPairs(config: SubgraphConfig) {
  if (config.version === PoolVersion.LEGACY || config.version === PoolVersion.TRIDENT) {
    return await fetchLegacyOrTridentPairs(config)
  } else if (config.version === PoolVersion.V3) {
    return await fetchV3Pools(config)
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

  do {
    const where = cursor !== '' ? { id_gt: cursor } : {}
    const request = await sdk
      .Pairs({
        first: 1000,
        where,
      })
      .catch((e: string) => {
        console.error({ e })
        return undefined
      })
      .catch(() => undefined)
    const newCursor = request?.pairs[request.pairs.length - 1]?.id ?? ''
    cursor = newCursor
    if (request) {
      data.push(request)
    }
  } while (cursor !== '')
  return data
}

async function fetchV3Pools(config: SubgraphConfig) {
  const chainId = config.chainId
  const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
  console.log(`Loading data from ${config.host} ${config.name}`)
  let cursor = ''
  const data: V3PoolsQuery[] = []

  do {
    const where = cursor !== '' ? { id_gt: cursor } : {}
    const request = await sdk
      .V3Pools({
        first: 1000,
        where,
      })
      .catch((e: string) => {
        console.error({ e })
        return undefined
      })
    const newCursor = request?.pools[request.pools.length - 1]?.id ?? ''
    cursor = newCursor
    if (request) {
      data.push(request)
    }
  } while (cursor !== '')
  return data
}

function transform(queryResults: { chainId: ChainId; data: PairsQuery[] | V3PoolsQuery[] }[]) {
  // IF V2
  const tokens: Prisma.TokenCreateManyInput[] = []
  const pools: Prisma.SushiPoolCreateManyInput[] = []
  for (const result of queryResults) {
    const { chainId, data } = result
    if (isV2Query(data)) {
      const { pools: v2Pools, tokens: v2Tokens } = transformLegacyOrTrident({ chainId, data })
      pools.push(...v2Pools)
      tokens.push(...v2Tokens)
    } else if (isV3Query(data)) {

      const { pools: v3Pools, tokens: v3Tokens } = transformV3({ chainId, data })
      pools.push(...v3Pools)
      tokens.push(...v3Tokens)
    } else {
      console.warn('Unknown query type, skipping')
    }
  }

  return { pools: pools, tokens:  [...new Set(tokens)] }
}

export const isV2Query = (data: PairsQuery[] | V3PoolsQuery[]): data is PairsQuery[] =>
  data.some((d) => d?.source !== undefined)

export const isV3Query = (data: PairsQuery[] | V3PoolsQuery[]): data is V3PoolsQuery[] =>
  data.some((d) => d?.totalValueLockedETH !== undefined)

function transformLegacyOrTrident(queryResult: { chainId: ChainId; data: PairsQuery[] }) {
  const yesterday = new Date(Date.now() - 86400000)
  const unix24hAgo = Math.floor(yesterday.getTime() / 1000)
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = queryResult.data
    .map((batch) => {
      if (!batch?.pairs) return []
      return batch?.pairs.map((pair) => {
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
        const isAprValid = Number(pair.aprUpdatedAtTimestamp) > unix24hAgo
        const feeApr = isAprValid ? Number(pair.apr) : 0
        const regex = /([^\w ]|_|-)/g
        const name = pair.token0.symbol
          .replace(regex, '')
          .slice(0, 15)
          .concat('-')
          .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
        let version: PoolVersion
        if (pair.source == PoolVersion.LEGACY) {
          version = PoolVersion.LEGACY
        } else if (pair.source == PoolVersion.TRIDENT) {
          version = PoolVersion.TRIDENT
        } else {
          throw new Error('Unknown pool version')
        }
        let type: PoolType

        if (pair.type == PoolType.CONSTANT_PRODUCT_POOL) {
          type = PoolType.CONSTANT_PRODUCT_POOL
        } else if (pair.type == PoolType.STABLE_POOL) {
          type = PoolType.STABLE_POOL
        } else {
          throw new Error('Unknown pool type')
        }

        return Prisma.validator<Prisma.SushiPoolCreateManyInput>()({
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
        })
      })
    })
    .flat() as Prisma.SushiPoolCreateManyInput[]

  return { pools: poolsTransformed, tokens }
}

function transformV3(queryResult: { chainId: ChainId; data: V3PoolsQuery[] }) {

  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = queryResult.data
    .map((batch) => {
      if (!batch?.pools) return []
      return batch?.pools.map((pair) => {
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

          // TODO: pass in more data, historical, calculate apr..
          const feeApr = 0
        return Prisma.validator<Prisma.SushiPoolCreateManyInput>()({
          id: queryResult.chainId.toString().concat(':').concat(pair.id),
          address: pair.id,
          name: name,
          version: PoolVersion.V3,
          type: PoolType.CONCENTRATED_LIQUIDITY_POOL,
          chainId: queryResult.chainId,
          swapFee: Number(pair.feeTier) / 10_000,
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
        })
      })
    })
    .flat() as Prisma.SushiPoolCreateManyInput[]

  return { pools: poolsTransformed, tokens }
}
