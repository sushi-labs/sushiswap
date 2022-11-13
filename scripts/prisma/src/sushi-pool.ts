import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainIds, chainName } from '@sushiswap/chain'
import { SUSHISWAP_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { request } from 'http'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config'
import { mergePools } from './entity/pool/load'
import { filterPools } from './entity/pool/transform'
import { createTokens } from './entity/token/load'
import { filterTokensToCreate } from './entity/token/transform'

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
  await createTokens(client, tokens)
  await mergePools(client, PROTOCOL, pools)
  const endTime = performance.now()

  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  console.log(
    `Fetching pools from sushiswap from chains: `,
    SUSHISWAP_CHAINS.map((chainId) => chainName[chainId]).join(', ')
  )
  const legacyRequests = SUSHISWAP_CHAINS.map((chainId) => {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
    const data = []
    const size = 1000
    // TODO: use auto pagination when it works, currently skip only works up to 5000, and we have more than 6k pools on polygon
    for (let i = 0; i < 6; i++) {
      data.push(sdk.Pairs({ first: size, skip: i * size }).catch(() => undefined))
    }
    return { chainId, data }
  })
  const tridentRequests = TRIDENT_CHAINS.map((chainId) => {
    const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: TRIDENT_SUBGRAPH_NAME[_chainId] })
    const data = []
    const size = 1000
    for (let i = 0; i < 6; i++) {
      data.push(sdk.Pairs({ first: size, skip: i * size }).catch(() => undefined))
    }
    return { chainId, data }
  })
  // OLD TRIDENT POLYGON
  const polygon = [ChainId.POLYGON].map((chainId) => {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: 'sushi-0m/trident-polygon' })
    const data = []
    const size = 1000
    for (let i = 0; i < 6; i++) {
      data.push(sdk.Pairs({ first: size, skip: i * size }).catch(() => undefined))
    }
    return { chainId, data }
  })

  return await Promise.all(
    [...legacyRequests, ...tridentRequests, ...polygon].map((request) =>
      Promise.all(request.data).then((data) => {
        const pairs = data.filter((d) => d !== undefined).flat()
        return { chainId: request.chainId, data: pairs }
      })
    )
  )
}

async function transform(data: { chainId: ChainId; data: (PairsQuery | undefined)[] }[]): Promise<{
  pools: Prisma.PoolCreateManyInput[]
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
            const isAprValid = Number(pair.aprUpdatedAtTimestamp) > unix24hAgo
            const apr = isAprValid ? Number(pair.apr) : 0
            return Prisma.validator<Prisma.PoolCreateManyInput>()({
              id: exchange.chainId.toString().concat('_').concat(pair.id),
              address: pair.id,
              name: pair.name,
              protocol: PROTOCOL,
              version: pair.source,
              type: pair.type,
              network: chainName[exchange.chainId],
              chainId: exchange.chainId.toString(),
              swapFee: Number(pair.swapFee) / 10000,
              twapEnabled: pair.twapEnabled,
              token0Id: pair.token0.id,
              token1Id: pair.token1.id,
              reserve0:  pair.reserve0,
              reserve1:  pair.reserve1,
              totalSupply: pair.liquidity,
              apr,
              liquidityUSD: pair.liquidityUSD,
              liquidityNative: pair.liquidityNative,
              volumeUSD: pair.volumeUSD,
              volumeNative: pair.volumeNative,
              token0Price: pair.token0Price,
              token1Price: pair.token1Price,
              totalApr: apr,
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
