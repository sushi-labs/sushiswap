import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainIds, chainName } from '@sushiswap/chain'
import { request } from 'http'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery, V2PairsQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS, TRIDENT_SUBGRAPH_NAME } from './config'
import { mergePools } from './etl/pool/load'
import { filterPools } from './etl/pool/transform'
import { createTokens } from './etl/token/load'
import { filterTokensToCreate } from './etl/token/transform'

const client = new PrismaClient()

const PROTOCOL = 'SushiSwap'

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to load pools/tokens, protocol: ${PROTOCOL}`)

  // EXTRACT
  const exchanges = await extract()
  console.log(`EXTRACT - Pairs extracted from ${exchanges.length} different subgraphs`)

  // TRANSFORM
  const { tokens, pools } = await transform(exchanges)

  // LOAD
  const batchSize = 500

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const filteredTokens = await filterTokensToCreate(client, batch)
    await createTokens(client, filteredTokens)
  }

  for (let i = 0; i < pools.length; i += batchSize) {
    const batch = pools.slice(i, i + batchSize)
    const filteredPools = await filterPools(client, batch)
    await mergePools(client, PROTOCOL, ['LEGACY', 'TRIDENT'], filteredPools)
  }
  const endTime = performance.now()

  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}


async function extract() {
  const result: { chainId: ChainId; data: PairsQuery[] }[] = []

  const subgraphs = [
    TRIDENT_CHAINS.map((chainId) => {
      return { chainId, host: GRAPH_HOST[chainId], name: TRIDENT_SUBGRAPH_NAME[chainId] }
    }),
    SUSHISWAP_CHAINS.map((chainId) => {
      return { chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] }
    }),
  ].flat()

  const chains = Array.from(new Set(subgraphs.map(subgraph => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  let totalPairCount = 0
  for (const subgraph of subgraphs) {
    const chainId = subgraph.chainId
    const sdk = getBuiltGraphSDK({ chainId, host: subgraph.host, name: subgraph.name })

    console.log(`Loading data from ${subgraph.host} ${subgraph.name}`)
    let pairCount = 0
    let cursor: string = ''
    const data: PairsQuery[] = []

    do {
      const where = cursor !== '' ? { id_gt: cursor } : {}
      const request = await sdk
        .Pairs({
          first: 1000,
          where,
        })
        .catch((e: string) => {
          console.log({ e })
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
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
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
            const regex = /([^\w ]|_|-)/g
            const name = pair.token0.symbol
              .replace(regex, '')
              .slice(0, 15)
              .concat('-')
              .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
            return Prisma.validator<Prisma.PoolCreateManyInput>()({
              id: exchange.chainId.toString().concat(':').concat(pair.id),
              address: pair.id,
              name,
              protocol: PROTOCOL,
              version: pair.source,
              type: pair.type,
              chainId: exchange.chainId,
              swapFee: Number(pair.swapFee) / 10000,
              twapEnabled: pair.twapEnabled,
              token0Id: pair.token0.id,
              token1Id: pair.token1.id,
              liquidityUSD: pair.liquidityUSD,
            })
          })
        })
        .flat()
    })
    .flat()

  return { pools: poolsTransformed, tokens }
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
