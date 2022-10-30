import { PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from '../config'

const prisma = new PrismaClient()

// A `main` function so that we can use async/await
async function main() {
  // Seed the database with users and posts

  // EXTRACT
  const exchanges = await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
      // TODO: fix pagination......................
      return sdk.Pairs({ first: 1000, skip: 0 }).catch((reason) => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}. Reason: ${reason}`)
        return undefined
      })
    })
  )
  console.log(`EXTRACT - Extract pairs from ${exchanges.length} exchanges`)

  // TRANSFORM
  // TODO: tokens?
  const tokens: {
    address: string
    network: string
    chainId: string
    name: string
    symbol: string
    decimals: number
  }[] = []
  const transformed = exchanges
    .map((exchange, i) => {
      if (!exchange?.pairs) return []
      console.log(`TRANSFORM - ${chainName[SUSHISWAP_CHAINS[i]]} contains ${exchange.pairs.length} pairs`)
      return exchange?.pairs.map((pair) => {
        tokens.push({
          address: pair.token0.id,
          network: chainName[SUSHISWAP_CHAINS[i]],
          chainId: SUSHISWAP_CHAINS[i].toString(),
          name: pair.token0.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        })
        tokens.push({
          address: pair.token1.id,
          network: chainName[SUSHISWAP_CHAINS[i]],
          chainId: SUSHISWAP_CHAINS[i].toString(),
          name: pair.token1.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        })
        return {
          address: pair.id,
          name: pair.name,
          protocol: 'Sushiswap',
          version: 'V2',
          type: 'ConstantProductPool',
          network: chainName[SUSHISWAP_CHAINS[i]],
          chainId: SUSHISWAP_CHAINS[i].toString(),
          swapFee: Number(pair.swapFee) / 10000,
          twapEnabled: pair.twapEnabled,
          token0Id: pair.token0.id,
          token1Id: pair.token1.id,
          // reserve0:  BigInt(pair.reserve0),
          // reserve1:  BigInt(pair.reserve1),
          // totalSupply: BigInt(pair.liquidity),
          reserve0: pair.reserve0,
          reserve1: pair.reserve1,
          totalSupply: pair.liquidity,
          liquidityUSD: pair.liquidityUSD,
          liquidityNative: pair.liquidityNative,
          volumeUSD: pair.volumeUSD,
          volumeNative: pair.volumeNative,
          token0Price: pair.token0Price,
          token1Price: pair.token1Price,
          // createdAtTimestamp: new Date(pair.createdAtTimestamp),
          createdAtBlockNumber: pair.createdAtBlock,
          // createdAtBlockNumber: BigInt(pair.createdAtBlock),
        }
      })
    })
    .flat()
  console.log(`TRANSFORM - Transformed ${tokens.length} tokens and ${transformed.length} pools`)

  if (transformed.length === 0) {
    console.log('TRANSFORM - No pools to seed, exiting')
    return
  }

  // LOAD
  // create relations? TODO:

  // const [tokensLoaded, poolsLoaded] = await prisma.$transaction(
  //   [
  //     prisma.token.createMany({ data: tokens, skipDuplicates: true }),
  //     prisma.pool.createMany({ data: transformed, skipDuplicates: true }),
  //   ],
  // )
    // const tokensLoaded = await prisma.token.createMany({ data: tokens, skipDuplicates: true })
    const poolsLoaded = await prisma.pool.createMany({ data: transformed, skipDuplicates: true })
  // console.log(`LOAD - Loaded ${tokensLoaded.count} tokens and ${poolsLoaded.count} pairs`)
  console.log(`LOAD - Loaded ${poolsLoaded.count} pairs`)

  // TODO: Validate? check if e.g. a certain pair was retrieved?
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
