import '../lib/wagmi.js'

import { ChainId } from '@sushiswap/chain'
import { client, Prisma, Token as PrismaToken } from '@sushiswap/database/dist/index.js'
import { performance } from 'perf_hooks'

import { PoolType, ProtocolVersion } from '../config.js'

const SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]
const SUPPORTED_TYPES = [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL]

export async function liquidity(chainId: ChainId) {
  try {
    const startTime = performance.now()
    console.log(`LIQUIDITY - CHAIN_ID: ${chainId}, VERSIONS: ${SUPPORTED_VERSIONS}, TYPE: ${SUPPORTED_TYPES}`)

    const pools = await getPools(chainId)
    const poolsToUpdate = transform(pools)
    await updatePools(poolsToUpdate)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getPools(chainId: ChainId) {
  const startTime = performance.now()
  const batchSize = 2500
  let cursor = null
  const results: Pool[] = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsByPagination(chainId, batchSize)
    } else {
      result = await getPoolsByPagination(chainId, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
    totalCount += result.length
    results.push(...result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pool addresses with ${result.length} (${((requestEndTime - requestStartTime) / 1000).toFixed(
        1
      )}s). cursor: ${cursor}, total: ${totalCount}`
    )
  } while (cursor != null)

  const endTime = performance.now()

  console.log(`Fetched ${results.length} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return results
}

async function getPoolsByPagination(
  chainId: ChainId,
  take?: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
): Promise<Pool[]> {
  return client.pool.findMany({
    take,
    skip,
    cursor,
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
      type: {
        in: SUPPORTED_TYPES,
      },
      version: {
        in: SUPPORTED_VERSIONS,
      },
      reserve0: {
        notIn: ['0', '1'],
      },
      reserve1: {
        notIn: ['0', '1'],
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
}

function transform(pools: Pool[]) {
  const poolsToUpdate: PoolWithLiquidity[] = []
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
      const amount0 = (Number(pool.reserve0) / 10 ** pool.token0.decimals) * Number(pool.token0.derivedUSD)
      const amount1 = (Number(pool.reserve1) / 10 ** pool.token1.decimals) * Number(pool.token1.derivedUSD)
      const liquidityUSD = amount0 + amount1
      poolsToUpdate.push({ id: pool.id, liquidityUSD: liquidityUSD.toString() })
    } else if (pool.token0.derivedUSD !== null && pool.token0.derivedUSD.gt(0)) {
      const amount0 = (Number(pool.reserve0) / 10 ** pool.token0.decimals) * Number(pool.token0.derivedUSD)
      const liquidityUSD = amount0 * 2
      poolsToUpdate.push({ id: pool.id, liquidityUSD: liquidityUSD.toString() })
    } else if (pool.token1.derivedUSD !== null && pool.token1.derivedUSD.gt(0)) {
      const amount1 = (Number(pool.reserve1) / 10 ** pool.token1.decimals) * Number(pool.token1.derivedUSD)
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
      return client.pool.update({
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
  id: string
  chainId: number
  address: string
  token0: PrismaToken
  token1: PrismaToken
  swapFee: number
  type: string
  reserve0: string
  reserve1: string
}

interface PoolWithLiquidity {
  id: string
  liquidityUSD: string
}
