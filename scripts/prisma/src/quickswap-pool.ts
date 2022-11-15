import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery, QuickSwapPairsQuery } from '../.graphclient'
import { GRAPH_HOST, QUICKSWAP_SUPPORTED_CHAINS } from './config'
import { mergePools } from './entity/pool/load'
import { filterPools } from './entity/pool/transform'
import { createTokens } from './entity/token/load'
import { filterTokensToCreate } from './entity/token/transform'

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
  await createTokens(client, tokens)
  await mergePools(client, PROTOCOL, pools)
  const endTime = performance.now()

  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  console.log(
    `Fetching pools from ${PROTOCOL}, chains: ${QUICKSWAP_SUPPORTED_CHAINS.map((chainId) => chainName[chainId]).join(
      ', '
    )}`
  )
  const v2Requests = QUICKSWAP_SUPPORTED_CHAINS.map((chainId) => {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: QUICKSWAP_SUPPORTED_CHAINS[chainId] })
    const data = []
    const size = 1000
    // TODO: use auto pagination when it works, currently skip only works up to 5000, and theres 40k pools on qs
    for (let i = 0; i < 6; i++) {
      data.push(sdk.QuickSwapPairs({ first: size, skip: i * size, where: {
        reserveUSD_gt: 50
      }}).catch(() => undefined))
    }
    return { chainId, data }
  })

  return await Promise.all(
    [...v2Requests].map((request) =>
      Promise.all(request.data).then((data) => {
        const pairs = data.filter((d) => d !== undefined).flat()
        return { chainId: request.chainId, data: pairs }
      })
    )
  )
}

async function transform(data: { chainId: ChainId; data: (QuickSwapPairsQuery | undefined)[] }[]): Promise<{
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = data
    .map((exchange) => {
      return exchange.data
        .map((batch) => {
          if (!batch?.QuickSwap_pairs) return []
          return batch?.QuickSwap_pairs.map((pair) => {
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
