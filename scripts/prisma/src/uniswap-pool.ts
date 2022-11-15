import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery, V2PairsQuery } from '../.graphclient'
import { GRAPH_HOST, QUICKSWAP_SUPPORTED_CHAINS, UNISWAP_V2_SUBGRAPH_NAME, UNISWAP_SUPPORTED_CHAINS } from './config'
import { mergePools } from './entity/pool/load'
import { filterPools } from './entity/pool/transform'
import { createTokens } from './entity/token/load'
import { filterTokensToCreate } from './entity/token/transform'

const client = new PrismaClient()

const PROTOCOL = 'UniSwap'
const VERSION = 'V2'
const CONSTANT_PRODUCT_POOL = 'CONSTANT_PRODUCT_POOL'

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to load pools/tokens, protocol: ${PROTOCOL}`)

  // EXTRACT
  const exchanges = await extract()
  console.log(`EXTRACT - Pairs extracted from 1 subgraphs`)

  // TRANSFORM
  const { tokens, pools } = await transform(exchanges)

  // LOAD
  await createTokens(client, tokens)
  await mergePools(client, PROTOCOL, pools)
  const endTime = performance.now()

  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  console.log(
    `Fetching pools from ${PROTOCOL}, chains: ${UNISWAP_SUPPORTED_CHAINS.map((chainId) => chainName[chainId]).join(
      ', '
    )}`
  )
  const chainId = ChainId.ETHEREUM
  const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: UNISWAP_V2_SUBGRAPH_NAME[chainId] })
  if (!UNISWAP_V2_SUBGRAPH_NAME[chainId]) {
    throw new Error(`Subgraph not found: ${chainId} ${UNISWAP_V2_SUBGRAPH_NAME[chainId]}`)
  }
  console.log(UNISWAP_V2_SUBGRAPH_NAME[chainId])
  const data: (V2PairsQuery | undefined)[] = []
  let pairCount = 0
  let cursor: string = ''
  do {
    const where = cursor !== '' ? { reserveUSD_gt: 250, id_gt: cursor } : { reserveUSD_gt: 250 }
    const request = await sdk
      .V2Pairs({
        first: 1000,
        where,
      })
      .catch((e: string) => {
        console.log({ e })
        return undefined
      })
    const newCursor = request?.V2_pairs[request.V2_pairs.length - 1]?.id ?? ''
    cursor = newCursor
    console.log(`New cursor: ${newCursor}`)
    pairCount += request?.V2_pairs.length ?? 0
    data.push(request)
  } while (cursor !== '')
  console.log('Pair count:', pairCount)
  return [{ chainId, data }]
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
                network: chainName[exchange.chainId],
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
                network: chainName[exchange.chainId],
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
              network: chainName[exchange.chainId],
              chainId: exchange.chainId.toString(),
              swapFee: 0.003,
              twapEnabled: false,
              token0Id: pair.token0.id,
              token1Id: pair.token1.id,
              reserve0: pair.reserve0,
              reserve1: pair.reserve1,
              totalSupply: pair.liquidity,
              liquidityUSD: pair.liquidityUSD,
              liquidityNative: pair.liquidityNative,
              volumeUSD: pair.volumeUSD,
              volumeNative: '0',
              token0Price: pair.token0Price,
              token1Price: pair.token1Price,
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
