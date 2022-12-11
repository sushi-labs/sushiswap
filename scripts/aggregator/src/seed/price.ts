import { BigNumber } from '@ethersproject/bignumber'
import { PrismaClient, Token } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { calcTokenPrices, ConstantProductRPool } from '@sushiswap/tines'
import { performance } from 'perf_hooks'
import './lib/wagmi.js'

const prisma = new PrismaClient()

async function main() {
  const startTime = performance.now()
  // TODO: pass in params, e.g. chainId, baseToken, priceType (enum, USD or ETH?)
  // Hardcoded for now.
  // Limitations: this only works for constant product pools
  const chainId = ChainId.POLYGON

  const baseToken = await getBaseToken(chainId, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') // USDC
  const pools = await getPools(chainId)

  const { constantProductPools, tokens } = transform(pools)
  const tokensToUpdate = calculatePrices(constantProductPools, baseToken, tokens)

  await updateTokenPrices(tokensToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

async function getBaseToken(chainId: ChainId, address: string) {
  const baseToken = await prisma.token.findFirst({
    select: {
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      chainId,
      address: address.toLowerCase(),
    },
  })

  if (!baseToken) throw new Error(`${baseToken} not found in database, check the address and chainId.`)
  return baseToken
}

async function getPools(chainId: ChainId) {
  const startTime = performance.now()
  const count = await prisma.pool.count({
    where: {
      chainId,
      type: 'CONSTANT_PRODUCT_POOL',
      reserve0: {
        not: '0',
      },
      reserve1: {
        not: '0',
      },
    },
  })

  const batchSize = 2500
  const requestCount = Math.ceil(count / batchSize)

  const requests = [...Array(requestCount).keys()].map((i) =>
    prisma.pool.findMany({
      select: {
        id: true,
        address: true,
        token0: true,
        token1: true,
        swapFee: true,
        type: true,
        reserve0: true,
        reserve1: true,
      },
      where: {
        chainId,
        type: 'CONSTANT_PRODUCT_POOL',
        reserve0: {
          not: '0',
        },
        reserve1: {
          not: '0',
        },
      },
      take: batchSize,
      skip: i * batchSize,
    })
  )

  const responses = await Promise.all(requests)
  const flatResponse = responses.flat()

  const endTime = performance.now()

  console.log(`Fetched ${flatResponse.length} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return flatResponse
}

function transform(pools: Pool[]) {
  const tokens: Map<string, Token> = new Map()
  const constantProductPools = pools.map((pool) => {
    const token0 = {
      address: pool.token0.address,
      name: pool.token0.name,
      symbol: pool.token0.symbol,
    }
    const token1 = {
      address: pool.token1.address,
      name: pool.token1.name,
      symbol: pool.token1.symbol,
    }
    if (!tokens.has(token0.address)) tokens.set(token0.address, pool.token0)
    if (!tokens.has(token1.address)) tokens.set(token1.address, pool.token1)

    return new ConstantProductRPool(
      pool.address,
      token0,
      token1,
      pool.swapFee,
      BigNumber.from(pool.reserve0),
      BigNumber.from(pool.reserve1)
    )
  })
  return { constantProductPools, tokens }
}

function calculatePrices(
  constantProductPools: ConstantProductRPool[],
  baseToken: { symbol: string; address: string; name: string; decimals: number },
  tokens: Map<string, Token>
) {
  const results = calcTokenPrices(constantProductPools, baseToken)
  const tokensWithPrices = []

  for (const [rToken, value] of results.entries()) {
    const token = tokens.get(rToken.address)
    if (!token || value === 0) continue
    const price = Number((value / Math.pow(10, baseToken.decimals - token.decimals)).toFixed(12))
    if (price > Number.MAX_SAFE_INTEGER) continue
    tokensWithPrices.push({ id: token.id, price })
  }

  return tokensWithPrices
}

async function updateTokenPrices(tokens: { id: string; price: number }[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0
  // 64 bit signed integer
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize)
    const requests = batch.map((token) => {
      return prisma.token.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id: token.id },
        data: {
          derivedUSD: token.price,
        },
      })
    })
    const responses = await Promise.all(requests)
    console.log(`BATCH: Updated ${responses.length} prices.`)
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(`Updated ${updatedCount} prices (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface Pool {
  id: string
  address: string
  type: string
  token0: Token
  token1: Token
  swapFee: number
  reserve0: string
  reserve1: string
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
