import { PrismaClient, Token } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { readContracts, watchReadContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'
import { BigNumber } from '@ethersproject/bignumber'
import './lib/wagmi.js'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json' assert { type: 'json' }
import { ConstantProductRPool, calcTokenPrices } from '@sushiswap/tines'

const prisma = new PrismaClient()

async function main() {
  // TODO: pass in params, e.g. chainId
  // Hardcoded for now.
  // Limitations: only works for constant product pools
  // const chainId = ChainId.POLYGON
  const chainId = ChainId.OPTIMISM
  
  const baseToken = await getBaseToken(chainId, '0x7f5c764cbc14f9669b88837ca1490cca17c31607') // USDC


  // const baseToken = await getBaseToken(chainId, '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063') // DAI
  // const baseToken = await getBaseToken(chainId, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270') // WNATIVE
  // const baseToken = await getBaseToken(chainId, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619') // WETH
  // const baseToken = await getBaseToken(chainId, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174') // USDC
  // const baseToken = await getBaseToken(chainId, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f') // USDT
  if (!baseToken) throw new Error(`${baseToken} not found in database, check the address and chainId.`)

  const pools = await getPools(chainId)
  const constantProductPools = transformToConstantProductPool(pools)
  const results = calcTokenPrices(constantProductPools, baseToken)


  const test2 = []

  for (const [token, value] of results.entries()) {

    const foundPool = pools.find((pool) => (pool.token0.address == token.address || pool.token1.address == token.address) )
    if (!foundPool) continue
    const decimal = foundPool.token0.address == token.address ? foundPool.token0.decimals : foundPool.token1.decimals
    const price = value / Math.pow(10, baseToken.decimals - decimal)
    test2.push({token, price})
  }

  for (const result of test2) {

    // const price = result[1]
    const price = result.price
    // if (price > 0.01) console.log(`${result.token.symbol} price: ${price.toFixed(2)}`)
    console.log(`${result.token.address}\t${result.token.symbol}\t${price.toFixed(2)}`)
    // if (symbol == "MIM") console.log(`${symbol} price: ${(price).toFixed(2)}`)
  }
}

async function getBaseToken(chainId: ChainId, address: string) {
  return await prisma.token.findFirst({
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
        // token0: {
        //   status: 'APPROVED',
        // },
        // token1: {
        //   status: 'APPROVED',
        // },
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

function transformToConstantProductPool(pools: Pool[]) {
  return pools.map((pool) => {
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
    
    return new ConstantProductRPool(
      pool.address,
      token0,
      token1,
      pool.swapFee,
      BigNumber.from(pool.reserve0),
      BigNumber.from(pool.reserve1)
    )
  })
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
