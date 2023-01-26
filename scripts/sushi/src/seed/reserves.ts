import '../lib/wagmi.js'

import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json' assert { type: 'json' }
import { readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import { PoolType, ProtocolVersion } from '../config.js'

const client = new PrismaClient()

const CURRENT_SUPPORTED_VERSIONS = [ProtocolVersion.V2, ProtocolVersion.LEGACY, ProtocolVersion.TRIDENT]

export async function reserves(chainId: ChainId, version: ProtocolVersion, type: PoolType) {
  try {
    if (!Object.values(CURRENT_SUPPORTED_VERSIONS).includes(version)) {
      throw new Error(
        `Protocol version (${version}) not supported, supported versions: ${CURRENT_SUPPORTED_VERSIONS.join(',')}`
      )
    }
    if (type !== PoolType.CONSTANT_PRODUCT_POOL) {
      throw new Error(`Pool type ${type} not supported, supported types: ${PoolType.CONSTANT_PRODUCT_POOL}`)
    }

    const startTime = performance.now()
    console.log(`CHAIN_ID: ${chainId}, VERSIONS: ${CURRENT_SUPPORTED_VERSIONS}, TYPE: ${type}`)
    const pools = await getPools(chainId, CURRENT_SUPPORTED_VERSIONS, type)
    const poolsWithReserve = await getReserves(chainId, pools)
    await updatePoolsWithReserve(chainId, poolsWithReserve)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function getPools(chainId: ChainId, versions: string[], type: string) {
  const startTime = performance.now()

  const batchSize = 2500
  let cursor = null
  const results = []
  let totalCount = 0
  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsAddresses(chainId, versions, type, batchSize)
    } else {
      result = await getPoolsAddresses(chainId, versions, type, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
    totalCount += result.length
    results.push(result)
    const requestEndTime = performance.now()
    console.log(
      `Fetched a batch of pool addresses with ${result.length} (${((requestEndTime - requestStartTime) / 1000).toFixed(
        1
      )}s). cursor: ${cursor}, total: ${totalCount}`
    )
  } while (cursor != null)

  const poolAddresses = results.flat().map((pool) => pool.address)

  const endTime = performance.now()

  console.log(`Fetched ${poolAddresses.length} pool addresses (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  return poolAddresses
}

async function getPoolsAddresses(
  chainId: ChainId,
  versions: string[],
  type: string,
  take?: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
): Promise<{ id: string; address: string }[]> {
  return client.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
      address: true,
    },
    where: {
      chainId,
      version: {
        in: versions,
      },
      type,
      isWhitelisted: true,
    },
  })
}

async function getReserves(chainId: ChainId, poolAddresses: string[]) {
  const startTime = performance.now()
  const poolsWithReserve: PoolWithReserve[] = []
  const batchSize = poolAddresses.length > 2500 ? 2500 : poolAddresses.length

  let totalSuccessCount = 0
  let totalFailedCount = 0
  for (let i = 0; i < poolAddresses.length; i += batchSize) {
    const max = i + batchSize <= poolAddresses.length ? i + batchSize : i + (poolAddresses.length % batchSize)
    const batch = poolAddresses.slice(i, max).map((address) => ({
      address,
      chainId,
      abi: IUniswapV2PairArtifact.abi,
      functionName: 'getReserves',
      allowFailure: true,
    }))
    const batchStartTime = performance.now()
    const reserves: any = await readContracts({
      contracts: batch,
    })

    let failures = 0
    const mappedPools = poolAddresses.slice(i, max).reduce<PoolWithReserve[]>((prev, address, i) => {
      if (!reserves[i] || !reserves[i].reserve0 || !reserves[i].reserve1) {
        failures++
        return prev
      }
      return [
        ...prev,
        {
          address,
          reserve0: reserves[i].reserve0.toString() as string,
          reserve1: reserves[i].reserve1.toString() as string,
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
      `Fetched reserves, ${totalSuccessCount}/${poolAddresses.length} (${(
        (batchEndTime - batchStartTime) /
        1000
      ).toFixed(1)}s). `
    )

    poolsWithReserve.push(...mappedPools)
  }

  const endTime = performance.now()

  console.log(
    `Successfully fetched reserves for ${totalSuccessCount} pools, fails: ${totalFailedCount} (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s). `
  )
  return poolsWithReserve
}

async function updatePoolsWithReserve(chainId: ChainId, pools: PoolWithReserve[]) {
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
    console.log(
      `Updated ${responses.length} pools, ${updatedCount}/${pools.length} (${((endTime - startTime) / 1000).toFixed(
        1
      )}s).`
    )
    updatedCount += responses.length
  }
  const endTime = performance.now()
  console.log(`LOAD - Updated a total of ${updatedCount} pools (${((endTime - startTime) / 1000).toFixed(1)}s). `)
}

interface PoolWithReserve {
  address: string
  reserve0: string
  reserve1: string
}
