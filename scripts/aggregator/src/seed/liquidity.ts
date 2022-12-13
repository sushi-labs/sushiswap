import { Prisma, PrismaClient, Token as PrismaToken } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { performance } from 'perf_hooks'
import { PoolType, ProtocolVersion } from '../config.js'
import '../lib/wagmi.js'

const prisma = new PrismaClient()

if (process.env.CHAIN_ID === undefined) {
  throw new Error('CHAIN_ID env var not set')
}

if (process.env.VERSION === undefined || process.env.TYPE === undefined) {
  throw new Error('VERSION, and TYPE env vars must be set, e.g. VERSION=V2 TYPE=CONSTANT_PRODUCT_POOL.')
}

const CHAIN_ID = Number(process.env.CHAIN_ID) as ChainId
const TYPE = process.env.TYPE

if (TYPE !== PoolType.CONSTANT_PRODUCT_POOL) {
  throw new Error(
    `Pool type not supported, ${TYPE}. Current implementation only supports ${PoolType.CONSTANT_PRODUCT_POOL}`
  )
}

const CURRENT_SUPPORTED_VERSIONS = [ProtocolVersion.V2,
  ProtocolVersion.LEGACY,
  ProtocolVersion.TRIDENT]
  
if (!Object.values(CURRENT_SUPPORTED_VERSIONS).includes(process.env.VERSION as ProtocolVersion)) {
  throw new Error(
    `Protocol version (${process.env.VERSION}) not supported, supported versions: ${CURRENT_SUPPORTED_VERSIONS.join(',')}`
  )
}

const VERSIONS = ['V2', 'LEGACY', 'TRIDENT']

async function main() {
  const startTime = performance.now()
  console.log(`CHAIN_ID: ${CHAIN_ID}, VERSIONS: ${VERSIONS}, TYPE: ${TYPE}`)

  const pools = await getPools(CHAIN_ID)
  const poolsToUpdate = transform(pools)
  await updatePools(poolsToUpdate)

  const endTime = performance.now()
  console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
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

  return prisma.pool.findMany({
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
  id: string;
  chainId: number;
  address: string;
  token0: PrismaToken;
  token1: PrismaToken;
  swapFee: number;
  type: string;
  reserve0: string;
  reserve1: string;
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
