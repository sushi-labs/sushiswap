import { ChainId } from '@sushiswap/chain'
import { client, PoolType, PoolVersion, Prisma } from '@sushiswap/database'
import { SUBGRAPH_HOST, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, PairsQuery } from '../.graphclient/index.js'
import { EXCHANGE_SUBGRAPH_NAME, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config.js'
import { mergePools } from './etl/pool/index.js'
import { filterPools } from './etl/pool/index.js'
import { createTokens } from './etl/token/load.js'

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
    const { tokens, pools } = await transform(exchanges)

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
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function extract() {
  const result: { chainId: ChainId; data: PairsQuery[] }[] = []
  const subgraphs = [
    TRIDENT_CHAINS.map((chainId) => {
      const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
      return { chainId, host: SUBGRAPH_HOST[_chainId], name: TRIDENT_SUBGRAPH_NAME[_chainId] }
    }),
    SUSHISWAP_CHAINS.map((chainId) => {
      return {
        chainId,
        host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
        name: EXCHANGE_SUBGRAPH_NAME[chainId],
      }
    }),
    // [{ chainId: ChainId.POLYGON, host: GRAPH_HOST[ChainId.POLYGON], name: 'sushi-0m/trident-polygon' }], // TODO: do we want the first trident deployment to be included?
  ].flat()

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  let totalPairCount = 0
  for (const subgraph of subgraphs) {
    const chainId = subgraph.chainId
    const sdk = getBuiltGraphSDK({ chainId, host: subgraph.host, name: subgraph.name })

    console.log(`Loading data from ${subgraph.host} ${subgraph.name}`)
    let pairCount = 0
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
      pairCount += request?.pairs.length ?? 0
      if (request) {
        data.push(request)
      }
    } while (cursor !== '')

    console.log(`${subgraph.name}, pair count: ${pairCount}`)
    totalPairCount += pairCount
    result.push({ chainId, data })
  }
  console.log(`Total pair count across all subgraphs: ${totalPairCount}`)
  return result
}

async function transform(data: { chainId: ChainId; data: (PairsQuery | undefined)[] }[]): Promise<{
  pools: Prisma.SushiPoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const yesterday = new Date(Date.now() - 86400000)
  const unix24hAgo = Math.floor(yesterday.getTime() / 1000)
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = data
    .map((exchange) => {
      return exchange.data
        .map((batch) => {
          if (!batch?.pairs) return []
          return batch?.pairs.map((pair) => {
            tokens.push(
              Prisma.validator<Prisma.TokenCreateManyInput>()({
                id: exchange.chainId.toString().concat(':').concat(pair.token0.id),
                address: pair.token0.id,
                chainId: exchange.chainId,
                name: pair.token0.name,
                symbol: pair.token0.symbol,
                decimals: Number(pair.token0.decimals),
              })
            )
            tokens.push(
              Prisma.validator<Prisma.TokenCreateManyInput>()({
                id: exchange.chainId.toString().concat(':').concat(pair.token1.id),
                address: pair.token1.id,
                chainId: exchange.chainId,
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
              id: exchange.chainId.toString().concat(':').concat(pair.id),
              address: pair.id,
              name: name,
              version,
              type,
              chainId: exchange.chainId,
              swapFee: Number(pair.swapFee) / 10000,
              twapEnabled: pair.twapEnabled,
              token0Id: exchange.chainId.toString().concat(':').concat(pair.token0.id.toLowerCase()),
              token1Id: exchange.chainId.toString().concat(':').concat(pair.token1.id.toLowerCase()),
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
        .flat()
    })
    .flat()

  return { pools: poolsTransformed, tokens }
}
