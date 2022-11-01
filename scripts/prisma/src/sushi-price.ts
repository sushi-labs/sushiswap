import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK, TokenPricesQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from '../config'
import { mergePrices } from './entity/price/load'
import { filterTokenPrices } from './entity/price/transform'
import { createTokens } from './entity/token/load'
import { filterTokens } from './entity/token/transform'
import { performance } from 'perf_hooks'

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
  return await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
      // TODO: fix pagination......................
      return sdk.TokenPrices({ first: 1000, skip: 0 }).catch((reason) => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}. Reason: ${reason}`)
        return undefined
      })
    })
  )
}

async function transform(data: (TokenPricesQuery | undefined)[]): Promise<{
  tokens: Prisma.TokenCreateManyInput[]
  pricesToCreate: Prisma.TokenPriceCreateManyInput[]
  pricesToUpdate: Prisma.TokenPriceCreateManyInput[]
}> {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const prices = data
    .map((exchange, i) => {
      if (!exchange?.tokenPrices) return []
      const nativePrice = Number(exchange.bundle?.nativePrice)
      if (!nativePrice) {
        console.warn(`TRANSFORM - ${chainName[SUSHISWAP_CHAINS[i]]} does not have a native price`)
        return []
      }
      return exchange?.tokenPrices.map((tokenPrice) => {
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(tokenPrice.id),
            address: tokenPrice.id,
            network: chainName[SUSHISWAP_CHAINS[i]],
            chainId: SUSHISWAP_CHAINS[i].toString(),
            name: tokenPrice.token.name,
            symbol: tokenPrice.token.symbol,
            decimals: Number(tokenPrice.token.decimals),
          })
        )
        return Prisma.validator<Prisma.TokenPriceCreateManyInput>()({
          id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(tokenPrice.id),
          address: tokenPrice.id,
          network: chainName[SUSHISWAP_CHAINS[i]],
          protocol: PROTOCOL,
          version: VERSION,
          chainId: SUSHISWAP_CHAINS[i].toString(),
          derivedNative: tokenPrice.derivedNative,
          usd: nativePrice * Number(tokenPrice.derivedNative),
        })
      })
    })
    .flat()

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
