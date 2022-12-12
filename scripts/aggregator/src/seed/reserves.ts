import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { readContracts } from '@wagmi/core'
import { performance } from 'perf_hooks'

import IUniswapV2PairArtifact from '@uniswap/v2-core/build/IUniswapV2Pair.json' assert { type: 'json' }
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

if (!Object.values(ProtocolVersion).includes(process.env.VERSION as ProtocolVersion)) {
  throw new Error(
    `Protocol version (${process.env.VERSION}) not supported, supported versions: ${[
      ProtocolVersion.V2,
      ProtocolVersion.LEGACY,
      ProtocolVersion.TRIDENT,
    ].join(',')}`
  )
}

const VERSIONS = ['V2', 'LEGACY', 'TRIDENT']

async function main() {
  console.log(`CHAIN_ID: ${CHAIN_ID}, VERSIONS: ${VERSIONS}, TYPE: ${TYPE}`)
  const pools = await getPools(CHAIN_ID, VERSIONS, TYPE)
  const poolsWithReserve = await getReserves(CHAIN_ID, pools)
  await updatePoolsWithReserve(CHAIN_ID, poolsWithReserve)
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
    cursor = result.length > batchSize ? result[result.length - 1].id : null
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
  // const tokensWithPools = await prisma.token.findMany({
  //   take,
  //   skip,
  //   cursor,
  //   include: {
  //     pools0: {

  //     },
  //     pools1: {

  //     },
  //   },
  //   where: {
  //     chainId,
  //     status: 'APPROVED',
  //   },
  // })
  // const pools = [tokensWithPools.flatMap((token) => token.pools0), tokensWithPools.flatMap((token) => token.pools1)].flat()
  // const unique = new Set(pools.map((pool) => pool))

  // return Array.from(unique).map((pool) => {
  //   return {
  //     id: pool.id,
  //     address: pool.address,
  //   }
  // })

  return prisma.pool.findMany({
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
      token0: {
        status: 'APPROVED',
      },
      token1: {
        status: 'APPROVED',
      },
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
      return prisma.pool.update({
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

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
