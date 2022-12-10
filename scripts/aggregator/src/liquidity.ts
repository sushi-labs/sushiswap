import { PrismaClient, Token as PrismaToken } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { Amount, Token } from '@sushiswap/currency'
import { Fraction, JSBI, MAX_SAFE_INTEGER } from '@sushiswap/math'
import { parseUnits } from '@ethersproject/units'
import { performance } from 'perf_hooks'
import './lib/wagmi.js'

const prisma = new PrismaClient()

async function main() {
  const startTime = performance.now()
  // TODO: pass in params, e.g. chainId
  // Hardcoded for now.
  // Limitations: this only works for constant product pools
  const chainId = ChainId.POLYGON

  const pools = await getPools(chainId)
  const poolsToUpdate = transform(pools) 
  await updatePools(poolsToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
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
      token0: {
        derivedUSD: {
          not: null,
        },
      },
      token1: {
        derivedUSD: {
          not: null,
        },
      },
    },
  })

  const batchSize = 2500
  const requestCount = Math.ceil(count / batchSize)

  const requests = [...Array(requestCount).keys()].map((i) =>
    prisma.pool.findMany({
      select: {
        id: true,
        chainId: true,
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
        token0: {
          derivedUSD: {
            not: null,
          },
        },
        token1: {
          derivedUSD: {
            not: null,
          },
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
  let poolsToUpdate: PoolWithLiquidity[] = []
  for (const pool of pools) {
    const pt0 = pool.token0
    const pt1 = pool.token1
    if (pt0.derivedUSD === null && pt1.derivedUSD === null) continue

    if (
      pool.token0.derivedUSD !== null &&
      pool.token0.derivedUSD.gt(0) &&
      pool.token1.derivedUSD !== null &&
      pool.token1.derivedUSD.gt(0)
    ) {

      const amount0 = Number(pool.reserve0) / 10 ** pool.token0.decimals * Number(pool.token0.derivedUSD)
      const amount1 = Number(pool.reserve1) / 10 ** pool.token1.decimals * Number(pool.token1.derivedUSD)
      const liquidityUSD = amount0 + amount1
      poolsToUpdate.push({ id: pool.id, liquidityUSD: liquidityUSD.toString() })
    } else if (pool.token0.derivedUSD !== null && pool.token0.derivedUSD.gt(0)) {
      const amount0 = Number(pool.reserve0) / 10 ** pool.token0.decimals * Number(pool.token0.derivedUSD)
      const liquidityUSD = amount0 * 2
      poolsToUpdate.push({ id: pool.id, liquidityUSD: liquidityUSD.toString() })
    } else if (pool.token1.derivedUSD !== null  && pool.token1.derivedUSD.gt(0)) {
      const amount1 = Number(pool.reserve1) / 10 ** pool.token1.decimals * Number(pool.token1.derivedUSD)
      const liquidityUSD = amount1 * 2
      poolsToUpdate.push({ id: pool.id, liquidityUSD: liquidityUSD.toString() })
    }
  }

  return poolsToUpdate
}

async function updatePools(pools: PoolWithLiquidity[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < pools.length; i += batchSize) {
    const batch = pools.slice(i, i + batchSize)
    const requests = batch.map((pool) => {
      return prisma.pool.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id: pool.id },
        data: {
          liquidityUSD: pool.liquidityUSD,
        },
      })
    })
    const responses = await Promise.all(requests)
    console.log(`BATCH: Updated ${responses.length} pools.`)
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(`Updated ${updatedCount} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface Pool {
  type: string
  id: string
  chainId: number
  address: string
  token0: PrismaToken
  token1: PrismaToken
  swapFee: number
  reserve0: string
  reserve1: string
}

interface PoolWithLiquidity {
  id: string
  liquidityUSD: string
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
