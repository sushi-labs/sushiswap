import { PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from '../config'

const prisma = new PrismaClient()

async function main() {
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
  const tokens: {
    id: string
    address: string
    network: string
    chainId: string
    name: string
    symbol: string
    decimals: number
  }[] = []
  const poolsTransformed = exchanges
    .map((exchange, i) => {
      if (!exchange?.pairs) return []
      console.log(`TRANSFORM - ${chainName[SUSHISWAP_CHAINS[i]]} contains ${exchange.pairs.length} pairs`)
      return exchange?.pairs.map((pair) => {
        tokens.push({
          id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.token0.id),
          address: pair.token0.id,
          network: chainName[SUSHISWAP_CHAINS[i]],
          chainId: SUSHISWAP_CHAINS[i].toString(),
          name: pair.token0.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        })
        tokens.push({
          id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.token1.id),
          address: pair.token1.id,
          network: chainName[SUSHISWAP_CHAINS[i]],
          chainId: SUSHISWAP_CHAINS[i].toString(),
          name: pair.token1.name,
          symbol: pair.token1.symbol,
          decimals: Number(pair.token1.decimals),
        })
        return {
          id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.id),
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

  const uniqueIds: Set<string> = new Set()
  const uniqueTokens = tokens
    .filter((token) => {
      if (!uniqueIds.has(token.id)) {
        uniqueIds.add(token.id)
        return true
      }
      return false
    })
    .sort()
  console.log(`TRANSFORM - Transformed ${uniqueTokens.length} tokens and ${poolsTransformed.length} pools`)

  if (poolsTransformed.length === 0) {
    console.log('TRANSFORM - No pools to seed, exiting')
    return
  }

  const poolsFound = await prisma.pool.findMany({
    where: {
      address: { in: poolsTransformed.map((pool) => pool.address) },
    },
    select: {
      id: true,
      address: true,
      reserve0: true,
      reserve1: true,
      totalSupply: true,
      liquidityUSD: true,
      liquidityNative: true,
      volumeUSD: true,
      volumeNative: true,
      token0Price: true,
      token1Price: true,
    },
  })

  const tokensFound = await prisma.token.findMany({
    where: {
      id: { in: uniqueTokens.map((token) => token.id) },
    },
    select: {
      id: true,
    },
  })

  // const test = poolsTransformed.filter((pool) => !poolsFound.find((p) => p.id === pool.id))
  // for(let i = 0; i < test.length; i++) {
  //   console.log(`DEBUG - these pools need to be created, are they? ${test[i].id}`)
  // }
  console.log(`TRANSFORM - Found ${tokensFound.length} tokens and ${poolsFound.length} pools`)

  const tokensToCreate = uniqueTokens.filter((token) => !tokensFound.find((t) => t.id === token.id))
  console.log(`TRANSFORM - Tokens to create: ${tokensToCreate.length}`)

  // TODO: this could be improved, perhaps an entity to read off instead, to see if the protocol has been initialized
  // instead of reading and checking all the pools
  if (poolsFound.length === 0 || tokensFound.length === 0) {
    // const tokensLoaded = await prisma.token.createMany({ data: uniqueTokens, skipDuplicates: true })
    let tokensCreatedCount = 0
    const batchSize = 500
    for (let i = 0; i < tokensToCreate.length; i += batchSize) {
      const createdTokens = await prisma.token.createMany({
        data: tokensToCreate.slice(i, i + batchSize),
        skipDuplicates: true,
      })
      console.log(`LOAD - Batched and created ${createdTokens.count} tokens`)
      tokensCreatedCount += createdTokens.count
    }
    // const createdTokens = await prisma.$transaction([...prisma.token.createMany({ data: uniqueTokens, skipDuplicates: true })])
    const createdPools = await prisma.pool.createMany({ data: poolsTransformed, skipDuplicates: true })
    console.log(
      `LOAD - Initialize first time seeding, created ${tokensCreatedCount} tokens and ${createdPools.count} pools. `
    )
    return // Exit after first time seeding
  }

  console.log(`TRANSFORM - db contains ${poolsFound.length} pools`)
  const poolsToUpdate = poolsTransformed.filter((pool) => {
    const poolExists = poolsFound.find((p) => p.id === pool.id)
    if (!poolExists) {
      console.log(`TRANSFORM - ${pool.id} does not exist in db, will be created`)
      return true
    }
    return (
      pool.reserve0 !== poolExists.reserve0 ||
      pool.reserve1 !== poolExists.reserve1 ||
      pool.totalSupply !== poolExists.totalSupply ||
      pool.liquidityUSD !== poolExists.liquidityUSD ||
      pool.liquidityNative !== poolExists.liquidityNative ||
      pool.volumeUSD !== poolExists.volumeUSD ||
      pool.volumeNative !== poolExists.volumeNative ||
      pool.token0Price !== poolExists.token0Price ||
      pool.token1Price !== poolExists.token1Price
    )
  })
  console.log(`TRANSFORM - pools to update: ${poolsToUpdate.length}`)

  const updateManyPools = poolsToUpdate.map((pool) => {
    return prisma.pool.upsert({
      where: { id: pool.id },
      update: {
        reserve0: pool.reserve0,
        reserve1: pool.reserve1,
        totalSupply: pool.totalSupply,
        liquidityUSD: pool.liquidityUSD,
        liquidityNative: pool.liquidityNative,
        volumeUSD: pool.volumeUSD,
        volumeNative: pool.volumeNative,
        token0Price: pool.token0Price,
        token1Price: pool.token1Price,
      },
      create: pool
    })
  })

  let tokensCreatedCount = 0
  const tokenBatchSize = 500
  for (let i = 0; i < tokensToCreate.length; i += tokenBatchSize) {
    const createdTokens = await prisma.token.createMany({
      data: tokensToCreate.slice(i, i + tokenBatchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${createdTokens.count} tokens`)
    tokensCreatedCount += createdTokens.count
  }
  console.log(`LOAD - Created ${tokensCreatedCount} tokens. `)

  const poolBatchSize = 20
  for (let i = 0; i < updateManyPools.length; i += poolBatchSize) {
    const updatedPools = await prisma.$transaction([...updateManyPools.slice(i, i + poolBatchSize)])
    console.log(`LOAD - Updated ${updatedPools.length} pools`)
  }

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
