import { PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '../../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from '../../config'

const prisma = new PrismaClient()

async function main() {

  // EXTRACT
  const exchanges = await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
      // TODO: fix pagination...................... 
      return sdk.Tokens({ first: 1000, skip: 0}).catch((reason) => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}. Reason: ${reason}`)
        return undefined
      })
    })
  )
  console.log(`EXTRACT - Extract tokens from ${exchanges.length} exchanges`)

  // TRANSFORM
  const transformed = exchanges.map((exchange, i) => {
    if (!exchange?.tokens) return []
    console.log(`TRANSFORM - ${chainName[SUSHISWAP_CHAINS[i]]} contains ${exchange.tokens.length} tokens`)
    return exchange?.tokens.map((token) => {
      return {
        id: SUSHISWAP_CHAINS[i].toString().concat("_").concat(token.id),
        address: token.id,
        network: chainName[SUSHISWAP_CHAINS[i]],
        chainId: SUSHISWAP_CHAINS[i].toString(),
        name: token.name,
        symbol: token.symbol,
        decimals: Number(token.decimals)
      }
    })
  }).flat()
  console.log(`TRANSFORM - Transformed ${transformed.length} tokens`)
  
  if (transformed.length === 0) {
    console.log('TRANSFORM - No tokens to seed, exiting')
    return
  }

  // LOAD
  const loaded = await prisma.token.createMany({ data: transformed, skipDuplicates: true})
  console.log(`LOAD - Loaded ${loaded.count} tokens`)

  // TODO: Validate? check if e.g. a certain token exists?
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
