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
  await createTokens(client, tokensToCreate)
  await updateTokenPrices(client, tokensToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  console.log(
    `Fetching pools from sushiswap from chains: `,
    SUSHISWAP_CHAINS.map((chainId) => chainName[chainId]).join(', ')
  )
  const size = 1000
  const legacyRequests = SUSHISWAP_CHAINS.map((chainId) => {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
    const data = []
    // TODO: use auto pagination when it works, currently skip only works up to 5000, and we have more than 6k pools on polygon
    for (let i = 0; i < 6; i++) {
      data.push(
        sdk.TokenPrices({ first: 1000, skip: i * size }).catch((reason) => {
          console.log(
            `Fetch failed: Exchange - ${GRAPH_HOST[chainId]}${EXCHANGE_SUBGRAPH_NAME[chainId]}. Reason: ${reason}`
          )
          return undefined
        })
      )
    }
    return { chainId, data }
  })
  const tridentRequests = TRIDENT_CHAINS.map((chainId) => {
    const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: TRIDENT_SUBGRAPH_NAME[_chainId] })
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push(
        sdk.TokenPrices({ first: 1000, skip: i * size }).catch((reason) => {
          console.log(
            `Fetch failed: Exchange - ${GRAPH_HOST[chainId]}${EXCHANGE_SUBGRAPH_NAME[chainId]}. Reason: ${reason}`
          )
          return undefined
        })
      )
    }
    return { chainId, data }
  })
  // OLD TRIDENT POLYGON
  const polygon = [ChainId.POLYGON].map((chainId) => {
    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: 'sushi-0m/trident-polygon' })
    const data = []
    for (let i = 0; i < 6; i++) {
      data.push(
        sdk.TokenPrices({ first: 1000, skip: i * size }).catch((reason) => {
          console.log(
            `Fetch failed: Exchange - ${GRAPH_HOST[chainId]}${EXCHANGE_SUBGRAPH_NAME[chainId]}. Reason: ${reason}`
          )
          return undefined
        })
      )
    }
    return { chainId, data }
  })

  return await Promise.all(
    [...legacyRequests, ...tridentRequests, ...polygon].map((request) =>
      Promise.all(request.data).then((data) => {
        const tokenPrices = data.filter((d) => d !== undefined).flat()
        return { chainId: request.chainId, data: tokenPrices }
      })
    )
  )
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
          network: chainName[chainId],
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
  const { tokensToCreate, tokensToUpdate } = await filterTokensByUsdPrice(client, tokens)

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
