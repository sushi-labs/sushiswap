import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, TokenPricesQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config'
import { createTokens, updateTokenPrices } from './etl/token/load'
import { filterTokensByUsdPrice } from './etl/token/transform'

const client = new PrismaClient()

const PROTOCOL = 'SushiSwap'
const VERSION = 'V2'

async function main() {
  const startTime = performance.now()
  console.log(`Preparing to load tokens/prices, protocol: ${PROTOCOL}, version: ${VERSION}`)

  // EXTRACT
  const exchanges = await extract()
  console.log(`EXTRACT - Tokens and TokenPrices extracted from ${exchanges.length} different exchanges`)

  // TRANSFORM
  const { tokensToCreate, tokensToUpdate } = await transform(exchanges)

  // LOAD
  const batchSize = 500
  for (let i = 0; i < tokensToCreate.length; i += batchSize) {
    const batch = tokensToCreate.slice(i, i + batchSize)
    await createTokens(client, batch)
  }

  for (let i = 0; i < tokensToUpdate.length; i += batchSize) {
    const batch = tokensToUpdate.slice(i, i + batchSize)
    await updateTokenPrices(client, batch)
  }

  const endTime = performance.now()
  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  const result: { chainId: ChainId; data: TokenPricesQuery[] }[] = []

  const subgraphs = [
    TRIDENT_CHAINS.map((chainId) => {
      const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
      return { chainId, host: GRAPH_HOST[chainId], name: TRIDENT_SUBGRAPH_NAME[_chainId] }
    }),
    SUSHISWAP_CHAINS.map((chainId) => {
      return { chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] }
    }),
    // [{ chainId: ChainId.POLYGON, host: GRAPH_HOST[ChainId.POLYGON], name: 'sushi-0m/trident-polygon' }],
  ].flat()

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  let totalPairCount = 0
  for (const subgraph of subgraphs) {
    const chainId = subgraph.chainId
    const sdk = getBuiltGraphSDK({ chainId, host: subgraph.host, name: subgraph.name })

    console.log(`Loading data from ${subgraph.host} ${subgraph.name}`)
    let pairCount = 0
    let cursor: string = ''
    const data: TokenPricesQuery[] = []

    do {
      const where = cursor !== '' ? { id_gt: cursor } : {}
      const request = await sdk
        .TokenPrices({
          first: 1000,
          where,
        })
        .catch((e: string) => {
          console.log({ e })
          return undefined
        })
        .catch(() => undefined)
      const newCursor = request?.tokenPrices[request.tokenPrices.length - 1]?.id ?? ''
      cursor = newCursor
      pairCount += request?.tokenPrices.length ?? 0
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

async function transform(
  data: {
    chainId: ChainId
    data: (TokenPricesQuery | undefined)[]
  }[]
): Promise<{
  tokensToCreate: Prisma.TokenCreateManyInput[]
  tokensToUpdate: Prisma.TokenUpdateArgs[]
}> {
  const tokensIncludingLiquidity: Record<string, { token: Prisma.TokenCreateManyInput; liquidity: number }> = {}

  data.forEach((exchange) => {
    const { chainId, data } = exchange
    console.log({ chainId })
    data.forEach((data) => {
      if (data == undefined || !data?.tokenPrices) return
      const nativePrice = Number(data?.bundle?.nativePrice)
      data.tokenPrices.forEach((tokenPrice) => {
        const id = chainId.toString().concat('_').concat(tokenPrice.id)
        const usdPrice = nativePrice ? nativePrice * Number(tokenPrice.derivedNative) : null
        const price = Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: id,
          address: tokenPrice.id,
          chainId: chainId.toString(),
          name: tokenPrice.token.name,
          symbol: tokenPrice.token.symbol,
          decimals: Number(tokenPrice.token.decimals),
          usdPrice,
        })

        const currentLiquidity = Number(tokenPrice.token.liquidity)
        if (tokensIncludingLiquidity[id]) {
          const savedPrice = tokensIncludingLiquidity[id]
          if (savedPrice.liquidity < currentLiquidity) {
            tokensIncludingLiquidity[id] = { token: price, liquidity: currentLiquidity }
          }
        } else {
          tokensIncludingLiquidity[id] = { token: price, liquidity: currentLiquidity }
        }
      })
    })
  })

  const tokens = Object.values(tokensIncludingLiquidity).map((pricesWithLiquidity) => pricesWithLiquidity.token)
  console.log(`TRANSFORM - mapped ${tokens.length} tokens`)

  const batchSize = 500
  const tokensToCreate: Prisma.TokenCreateManyInput[] = []
  const tokensToUpdate: Prisma.TokenUpdateArgs[] = []
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const { tokensToCreate: toCreate, tokensToUpdate: toUpdate } = await filterTokensByUsdPrice(client, batch)
    tokensToCreate.push(...toCreate)
    tokensToUpdate.push(...toUpdate)
  }

  return { tokensToCreate, tokensToUpdate }
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
