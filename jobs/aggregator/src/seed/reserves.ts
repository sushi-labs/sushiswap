import '../lib/wagmi.js'

import { constantProductPoolAbi, stablePoolAbi } from '@sushiswap/abi'
import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { Address, readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import { PoolType, ProtocolName, ProtocolVersion } from '../config.js'

const SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]
const SUPPORTED_TYPES = [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL]

export async function reserves(chainId: number) {
  const client = await createClient()
  try {
    const startTime = performance.now()
    console.log(`RESERVES - CHAIN_ID: ${chainId}, VERSIONS: ${SUPPORTED_VERSIONS}, TYPE: ${SUPPORTED_TYPES}`)
    const pools = await getPools(client, chainId)
    const poolsWithReserve = await getReserves(chainId, pools)
    await updatePoolsWithReserve(client, chainId, poolsWithReserve)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getPools(client: PrismaClient, chainId: number) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsPagination(client, chainId, batchSize)
    } else {
      result = await getPoolsPagination(client, chainId, batchSize, 1, { id: cursor })
    }
    cursor = result.length === batchSize ? result[result.length - 1].id : null
    totalCount += result.length
    results.push(result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pool addresses with ${result.length} (${((requestEndTime - requestStartTime) / 1000).toFixed(
        1
      )}s). cursor: ${cursor}, total: ${totalCount}`
    )
  } while (cursor != null)

  const pools = results.flat()

  const endTime = performance.now()

  console.log(`Fetched ${pools.length} pool addresses (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  const poolsMap = new Map<string, PoolResult>()
  pools.forEach((pool) => {
    poolsMap.set(pool.address, pool)
  })
  return poolsMap
}

async function getPoolsPagination(
  client: PrismaClient,
  chainId: number,
  take?: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
) {
  return client.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
      address: true,
      type: true,
      reserve0: true,
      reserve1: true,
    },
    where: {
      OR: [
        {
          chainId,
          version: {
            in: SUPPORTED_VERSIONS,
          },
          type: {
            in: SUPPORTED_TYPES,
          },
          isWhitelisted: true,
        },
        {
          chainId,
          protocol: ProtocolName.SUSHISWAP,
          type: { in: [PoolType.CONSTANT_PRODUCT_POOL, PoolType.STABLE_POOL] },
          version: {
            in: SUPPORTED_VERSIONS,
          },
        },
      ],
    },
  })
}

async function getReserves(chainId: number, pools: Map<string, PoolResult>) {
  const startTime = performance.now()
  const poolsWithReserve: PoolWithReserve[] = []
  const batchSize = pools.size > 250 ? 250 : pools.size

  let totalSuccessCount = 0
  let totalFailedCount = 0
  for (let i = 0; i < pools.size; i += batchSize) {
    const max = i + batchSize <= pools.size ? i + batchSize : i + (pools.size % batchSize)

    const batch = Array.from(pools.values())
      .slice(i, max)
      .map(
        (pool) =>
          ({
            address: pool.address as Address,
            chainId,
            abi: pool.type === PoolType.CONSTANT_PRODUCT_POOL ? constantProductPoolAbi : stablePoolAbi,
            functionName: 'getReserves',
            allowFailure: true,
          } as const)
      )
    const batchStartTime = performance.now()
    const reserves = await readContracts({
      contracts: batch,
    })

    let failures = 0
    const mappedPools = Array.from(pools.values())
      .slice(i, max)
      .reduce<PoolWithReserve[]>((prev, pool, i) => {
        if (reserves[i] === null || reserves[i] === undefined) {
          failures++
          return prev
        }
        return [
          ...prev,
          {
            address: pool.address,
            reserve0: reserves[i][0].toString() as string,
            reserve1: reserves[i][1].toString() as string,
          },
        ]
      }, [])

    if (failures > 0) {
      console.log(`Failed to fetch reserves for ${failures} pools.`)
    }
    const batchEndTime = performance.now()
    totalFailedCount += failures
    totalSuccessCount += mappedPools.length
    console.log(
      `Fetched a batch with reserves, ${batchSize} (${((batchEndTime - batchStartTime) / 1000).toFixed(1)}s). `
    )

    poolsWithReserve.push(...mappedPools)
  }

  const endTime = performance.now()

  console.log(
    `Finished fetching reserves for ${totalSuccessCount} pools, fails: ${totalFailedCount} (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s). `
  )

  const poolsToUpdate: PoolWithReserve[] = []

  poolsWithReserve.forEach((pool) => {
    const poolResult = pools.get(pool.address)
    if (poolResult !== undefined && (poolResult.reserve0 !== pool.reserve0 || poolResult.reserve1 !== pool.reserve1)) {
      // console.log(
      //   `Pool ${pool.address} needs to be updated. Old reserve0: ${poolResult.reserve0}, new reserve0: ${pool.reserve0}. Old reserve1: ${poolResult.reserve1}, new reserve1: ${pool.reserve1}.`
      // )
      poolsToUpdate.push(pool)
    }
  })

  if (poolsToUpdate.length !== pools.size) {
    console.log(`${poolsToUpdate.length} out of ${pools.size} pools need to be updated`)
  }

  return poolsToUpdate
}

async function updatePoolsWithReserve(client: PrismaClient, chainId: number, pools: PoolWithReserve[]) {
  const startTime = performance.now()
  const batchSize = 250
  let updatedCount = 0

  for (let i = 0; i < pools.length; i += batchSize) {
    const batch = pools.slice(i, i + batchSize)
    const requests = batch.map((pool) => {
      const id = chainId.toString().concat(':').concat(pool.address.toLowerCase())

      return client.pool.update({
        select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
        where: { id },
        data: {
          reserve0: pool.reserve0,
          reserve1: pool.reserve1,
        },
      })
    })
    const startTime = performance.now()
    const responses = await Promise.all(requests)
    const endTime = performance.now()
    updatedCount += responses.length
    console.log(
      `Updated ${responses.length} pools, ${updatedCount}/${pools.length} (${((endTime - startTime) / 1000).toFixed(
        1
      )}s).`
    )
  }

  const endTime = performance.now()
  console.log(`LOAD - Updated a total of ${updatedCount} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface PoolWithReserve {
  address: string
  reserve0: string
  reserve1: string
}

interface PoolResult {
  address: string
  id: string
  type: string
  reserve0: string
  reserve1: string
}
