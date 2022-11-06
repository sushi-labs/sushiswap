import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK, TokenPricesQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config'
import { mergePrices } from './entity/price/load'
import { filterTokenPrices } from './entity/price/transform'
import { createTokens } from './entity/token/load'
import { filterTokens } from './entity/token/transform'
import { performance } from 'perf_hooks'
import { TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'

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
  const { tokens, pricesToCreate, pricesToUpdate } = await transform(exchanges)

  // LOAD
  await createTokens(client, tokens)
  await mergePrices(client, PROTOCOL, VERSION, pricesToCreate, pricesToUpdate)

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
  tokens: Prisma.TokenCreateManyInput[]
  pricesToCreate: Prisma.TokenPriceCreateManyInput[]
  pricesToUpdate: Prisma.TokenPriceCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const pricesWithLiquidity: Record<string, { price: Prisma.TokenPriceCreateManyInput; liquidity: number }> = {}

  data.forEach((exchange) => {
    const { chainId, data } = exchange
    console.log({ chainId })
    data.forEach((data) => {
      if (data == undefined || !data?.tokenPrices) return
      const nativePrice = Number(data?.bundle?.nativePrice)
      if (!nativePrice) {
        console.warn(`TRANSFORM - ${chainName[chainId]} does not have a native price`)
        return
      }
      data.tokenPrices.map((tokenPrice) => {
        const id = chainId.toString().concat('_').concat(tokenPrice.id)
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: id,
            address: tokenPrice.id,
            network: chainName[chainId],
            chainId: chainId.toString(),
            name: tokenPrice.token.name,
            symbol: tokenPrice.token.symbol,
            decimals: Number(tokenPrice.token.decimals),
          })
        )
        const price = Prisma.validator<Prisma.TokenPriceCreateManyInput>()({
          id: id,
          address: tokenPrice.id,
          network: chainName[chainId],
          protocol: PROTOCOL,
          version: VERSION,
          chainId: chainId.toString(),
          derivedNative: tokenPrice.derivedNative,
          usd: nativePrice * Number(tokenPrice.derivedNative),
        })
        const currentLiquidity = Number(tokenPrice.token.liquidity)
        if (pricesWithLiquidity[id]) {
          const savedPrice = pricesWithLiquidity[id]
          if (savedPrice.liquidity < currentLiquidity) {
            console.log(
              `DEBUG: ${tokenPrice.token.symbol} replaced, previous liquidity: ${savedPrice.liquidity} new: ${currentLiquidity}.`
            )
            pricesWithLiquidity[id] = { price, liquidity: currentLiquidity }
          }
        }
        pricesWithLiquidity[id] = { price, liquidity: currentLiquidity }
      })
    })
  })

  const prices = Object.values(pricesWithLiquidity).map((pricesWithLiquidity) => pricesWithLiquidity.price)

  const filteredTokens = await filterTokens(client, tokens)
  const { pricesToCreate, pricesToUpdate } = await filterTokenPrices(client, prices)
  return { tokens: filteredTokens, pricesToCreate, pricesToUpdate }
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
