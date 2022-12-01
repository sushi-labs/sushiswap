import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery, V2PairsQuery } from '../.graphclient'
import { GRAPH_HOST, QUICKSWAP_SUBGRAPH_NAME, QUICKSWAP_SUPPORTED_CHAINS } from './config'
import { mergePools } from './etl/pool/load'
import { filterPools } from './etl/pool/transform'
import { createTokens } from './etl/token/load'
import { filterTokensToCreate } from './etl/token/transform'

const client = new PrismaClient()

const PROTOCOL = 'QuickSwap'
const VERSION = 'V2'
const CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL'

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to load pools/tokens, protocol: ${PROTOCOL}`)

  // EXTRACT
  const exchanges = await extract()
  console.log(`EXTRACT - Pairs extracted from ${exchanges.length} different subgraphs`)

  // TRANSFORM
  const { tokens, pools } = await transform(exchanges)

  // LOAD
  const batchSize = 250
  for (let i = 0; i < pools.length; i += batchSize) {
    const batch = pools.slice(i, i + batchSize)
    const filteredPools = await filterPools(client, batch)
    await mergePools(client, PROTOCOL, [VERSION], filteredPools)
  }

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const filteredTokens = await filterTokensToCreate(client, batch)
    await createTokens(client, filteredTokens)
  }
  const endTime = performance.now()

  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  console.log(
    `Fetching pools from ${PROTOCOL} ${VERSION}, chains: ${QUICKSWAP_SUPPORTED_CHAINS.map(
      (chainId) => chainName[chainId]
    ).join(', ')}`
  )
  const result: { chainId: ChainId; data: V2PairsQuery[] }[] = []

  for (const chainId of QUICKSWAP_SUPPORTED_CHAINS) {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: QUICKSWAP_SUBGRAPH_NAME[chainId] })
    if (!QUICKSWAP_SUBGRAPH_NAME[chainId]) {
      console.log(`Subgraph not found: ${chainId} ${GRAPH_HOST[chainId]}, Skipping`)
      continue
    }
    console.log(`Loading data from chain: ${chainName[chainId]}(${chainId}), ${QUICKSWAP_SUBGRAPH_NAME[chainId]}`)
    let pairCount = 0
    let cursor: string = ''
    const data: V2PairsQuery[] = []

    do {
      const where = cursor !== '' ? { id_gt: cursor } : {}
      const request = await sdk
        .V2Pairs({
          first: 1000,
          where,
        })
        .catch((e: string) => {
          console.log({ e })
          return undefined
        })
        .catch(() => undefined)
      const newCursor = request?.V2_pairs[request.V2_pairs.length - 1]?.id ?? ''
      cursor = newCursor
      pairCount += request?.V2_pairs.length ?? 0
      if (request) {
        data.push(request)
      }

      if (pairCount % 10000 === 0) {
        console.log(`Fetched ${pairCount} pairs in total so far`)
      }
    } while (cursor !== '')

    console.log('Pair count:', pairCount)
    result.push({ chainId, data })
  }

  return result
}

async function transform(data: { chainId: ChainId; data: (V2PairsQuery | undefined)[] }[]): Promise<{
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = data
    .map((exchange) => {
      return exchange.data
        .map((batch) => {
          if (!batch?.V2_pairs) return []
          return batch?.V2_pairs.map((pair) => {
            tokens.push(
              Prisma.validator<Prisma.TokenCreateManyInput>()({
                id: exchange.chainId.toString().concat('_').concat(pair.token0.id),
                address: pair.token0.id,
                chainId: exchange.chainId.toString(),
                name: pair.token0.name,
                symbol: pair.token0.symbol,
                decimals: Number(pair.token0.decimals),
              })
            )
            tokens.push(
              Prisma.validator<Prisma.TokenCreateManyInput>()({
                id: exchange.chainId.toString().concat('_').concat(pair.token1.id),
                address: pair.token1.id,
                chainId: exchange.chainId.toString(),
                name: pair.token1.name,
                symbol: pair.token1.symbol,
                decimals: Number(pair.token1.decimals),
              })
            )
            return Prisma.validator<Prisma.PoolCreateManyInput>()({
              id: exchange.chainId.toString().concat('_').concat(pair.id),
              address: pair.id,
              name: pair.token0.symbol.concat('-').concat(pair.token1.symbol),
              protocol: PROTOCOL,
              version: VERSION,
              type: CONSTANT_PRODUCT_POOL,
              chainId: exchange.chainId.toString(),
              swapFee: 0.003,
              twapEnabled: false,
              token0Id: pair.token0.id,
              token1Id: pair.token1.id,
              reserve0: pair.reserve0,
              reserve1: pair.reserve1,
              totalSupply: pair.liquidity,
              liquidityUSD: pair.liquidityUSD,
              createdAtBlockNumber: BigInt(pair.createdAtBlock),
            })
          })
        })
        .flat()
    })
    .flat()

  const filteredPools = await filterPools(client, poolsTransformed)
  const filteredTokens = await filterTokensToCreate(client, tokens)

  return { pools: filteredPools, tokens: filteredTokens }
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
