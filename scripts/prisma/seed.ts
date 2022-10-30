import { PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from './.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from './config'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  // Seed the database with users and posts

  // EXTRACT
  const exchanges = await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
      return sdk.Tokens({ first: 1000 }).catch(() => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}`)
        return undefined
      })
    })
  )
  console.log(`Extract - Extract tokens from ${exchanges.length} exchanges`)

  // TRANSFORM
  const transformed = exchanges.map((exchange, i) => {
    if (!exchange?.tokens) return []
    return exchange?.tokens.map((token) => {
      return {
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
  const loadedCount = await prisma.token.createMany({ data: transformed, skipDuplicates: true})
  console.log(`LOAD - Lodaded ${loadedCount.count} tokens`)

  // TODO: Validate? check if e.g. a certain token was retrieved?
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
