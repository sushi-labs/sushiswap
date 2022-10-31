import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainName } from '@sushiswap/chain'
import { getBuiltGraphSDK, PairsQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS } from '../config'

const prisma = new PrismaClient()

const PROTOCOL = 'SushiSwap'
const VERSION = 'V2'
const POOL_TYPE = 'ConstantProductPool'

const poolSelect = Prisma.validator<Prisma.PoolSelect>()({
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
})

async function main() {
  // EXTRACT
  const exchanges = await extract()
  console.log(`EXTRACT - Pairs extracted from ${exchanges.length} different exchanges`)

  // TRANSFORM
  const { tokens, pools } = await transform(exchanges)

  if (pools.length === 0) {
    console.log('TRANSFORM - No pools to seed, exiting')
    return
  }

  // LOAD
  await createTokens(tokens)
  const containsProtocolPools = await alreadyContainsProtocol(PROTOCOL, VERSION)
  if (containsProtocolPools) {
    await upsertPools(pools)
  } else {
    await createPools(pools)
  }
}

async function extract() {
  return await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: EXCHANGE_SUBGRAPH_NAME[chainId] })
      // TODO: fix pagination......................
      return sdk.Pairs({ first: 1000, skip: 0 }).catch((reason) => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}. Reason: ${reason}`)
        return undefined
      })
    })
  )
}

async function transform(data: (PairsQuery | undefined)[]) {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const poolsTransformed = data
    .map((exchange, i) => {
      if (!exchange?.pairs) return []
      console.log(`TRANSFORM - ${chainName[SUSHISWAP_CHAINS[i]]} contains ${exchange.pairs.length} pairs`)
      return exchange?.pairs.map((pair) => {
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.token0.id),
            address: pair.token0.id,
            network: chainName[SUSHISWAP_CHAINS[i]],
            chainId: SUSHISWAP_CHAINS[i].toString(),
            name: pair.token0.name,
            symbol: pair.token0.symbol,
            decimals: Number(pair.token0.decimals),
          })
        )
        tokens.push(
          Prisma.validator<Prisma.TokenCreateManyInput>()({
            id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.token1.id),
            address: pair.token1.id,
            network: chainName[SUSHISWAP_CHAINS[i]],
            chainId: SUSHISWAP_CHAINS[i].toString(),
            name: pair.token1.name,
            symbol: pair.token1.symbol,
            decimals: Number(pair.token1.decimals),
          })
        )
        return Prisma.validator<Prisma.PoolCreateManyInput>()({
          id: SUSHISWAP_CHAINS[i].toString().concat('_').concat(pair.id),
          address: pair.id,
          name: pair.name,
          protocol: PROTOCOL,
          version: VERSION,
          type: POOL_TYPE,
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
        })
      })
    })
    .flat()

  const uniqueIds: Set<string> = new Set()
  const uniqueTokens = tokens.filter((token) => {
    if (!uniqueIds.has(token.id)) {
      uniqueIds.add(token.id)
      return true
    }
    return false
  })
  console.log(`TRANSFORM - Transformed ${uniqueTokens.length} tokens and ${poolsTransformed.length} pools`)

  const poolsFound = await prisma.pool.findMany({
    where: {
      address: { in: poolsTransformed.map((pool) => pool.address) },
    },
    select: poolSelect,
  })

  const tokensFound = await prisma.token.findMany({
    where: {
      id: { in: uniqueTokens.map((token) => token.id) },
    },
    select: {
      id: true,
    },
  })

  console.log(`TRANSFORM - Found ${tokensFound.length} tokens and ${poolsFound.length} pools`)

  const tokensToCreate = uniqueTokens.filter((token) => !tokensFound.find((t) => t.id === token.id))

  const pools = poolsTransformed.filter((pool) => {
    const poolExists = poolsFound.find((p) => p.id === pool.id)
    if (!poolExists) {
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
  return { tokens: tokensToCreate, pools }
}

async function alreadyContainsProtocol(protocol: string, version: string) {
  const count = await prisma.pool.count({
    where: {
      protocol,
      version,
    },
  })
  return count > 0
}

async function upsertPools(pools: Prisma.PoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)
  const upsertManyPools = pools.map((pool) => {
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
      create: pool,
    })
  })

  const poolBatchSize = 20
  for (let i = 0; i < upsertManyPools.length; i += poolBatchSize) {
    const updatedPools = await prisma.$transaction([...upsertManyPools.slice(i, i + poolBatchSize)])
    console.log(`LOAD - Updated ${updatedPools.length} pools`)
  }
}

async function createPools(pools: Prisma.PoolCreateManyInput[]) {
  let count = 0
  const batchSize = 500
  for (let i = 0; i < pools.length; i += batchSize) {
    const created = await prisma.pool.createMany({
      data: pools.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} pools`)
    count += created.count
  }
  console.log(`LOAD - Created ${count} pools. `)
}

async function createTokens(tokens: Prisma.TokenCreateManyInput[]) {
  if (tokens.length === 0) {
    console.log(`LOAD - Not updating any tokens, all tokens seem to be created. `)
    return
  }
  let count = 0
  const batchSize = 500
  for (let i = 0; i < tokens.length; i += batchSize) {
    const created = await prisma.token.createMany({
      data: tokens.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} tokens`)
    count += created.count
  }
  console.log(`LOAD - Created ${count} tokens. `)
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
