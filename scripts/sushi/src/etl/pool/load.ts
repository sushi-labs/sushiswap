import { Prisma, PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'
import { PairMinimal as PoolMinimal } from '.'

/**
 * Merges(Create/Update) pools.
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param pools
 */
export async function mergePools(
  client: PrismaClient,
  protocol: string,
  versions: string[],
  pools: Prisma.PoolCreateManyInput[],
  updateApr: boolean = false
) {
  const containsProtocolPools = await alreadyContainsProtocol(client, protocol, versions)
  if (containsProtocolPools) {
    await upsertPools(client, pools, updateApr)
  } else {
    await createPools(client, pools)
  }
}

async function upsertPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[], updateApr: boolean) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)
  let upsertManyPools
  if (!updateApr) {
    upsertManyPools = pools.map((pool) => {
      return client.pool.upsert({
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
  } else {
    const poolsWithIncentives = await client.pool.findMany({
      where: {
        id: {
          in: pools.map((pool) => pool.id),
        },
        incentives: {
          some: {},
        },
      },
      include: {
        incentives: true,
      },
    })

    upsertManyPools = pools.map((pool) => {
      const poolWithIncentives = poolsWithIncentives.find((p) => p.id === pool.id)
      if (poolWithIncentives) {
        const totalIncentiveApr = poolWithIncentives.incentives.reduce((total, incentive) => {
          return total + incentive.apr
        }, 0)
        return client.pool.update({
          where: { id: pool.id },
          data: {
            reserve0: pool.reserve0,
            reserve1: pool.reserve1,
            totalSupply: pool.totalSupply,
            liquidityUSD: pool.liquidityUSD,
            liquidityNative: pool.liquidityNative,
            volumeUSD: pool.volumeUSD,
            volumeNative: pool.volumeNative,
            token0Price: pool.token0Price,
            token1Price: pool.token1Price,
            totalApr: (pool.apr ?? 0) + totalIncentiveApr,
          },
        })
      }

      return client.pool.upsert({
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
          totalApr: pool.apr,
        },
        create: pool,
      })
    })
  }

  const startTime = performance.now()
  const batchSize = 500
  for (let i = 0; i < pools.length; i += batchSize) {
    const updatedPools = await Promise.all(upsertManyPools.slice(i, i + batchSize))
  }
  const endTime = performance.now()

  console.log(`LOAD - Updated ${upsertManyPools.length} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

async function createPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  let count = 0
  const batchSize = 500
  // const batchSize = 1
  const startTime = performance.now()
  for (let i = 0; i < pools.length; i += batchSize) {
    const created = await client.pool.createMany({
      data: pools.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} pools`)
    count += created.count
  }
  const endTime = performance.now()
  console.log(`LOAD - Created ${count} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

async function alreadyContainsProtocol(client: PrismaClient, protocol: string, versions: string[]) {
  const count = await client.pool.count({
    where: {
      AND: {
        protocol,
        version: {
          in: versions,
        },
      },
    },
  })
  return count > 0
}

export async function updatePoolsWithIncentivesTotalApr(client: PrismaClient) {
  const poolsWithIncentives = await client.pool.findMany({
    where: {
      incentives: {
        some: {},
      },
    },
    include: {
      incentives: {
        include: {
          rewardToken: true,
        },
      },
    },
  })
  const poolsToUpdate = poolsWithIncentives.map((pool) => {
    const bestIncentiveApr = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr
    }, 0)

    const totalApr = bestIncentiveApr + (pool.apr ?? 0)
    const isIncentivized = pool.incentives.some((incentive) => incentive.rewardPerDay > 0)

    return client.pool.update({
      where: {
        id: pool.id,
      },
      data: {
        totalApr,
        isIncentivized,
      },
    })
  })

  const startTime = performance.now()
  const updatedPools = await Promise.all(poolsToUpdate)
  const endTime = performance.now()
  console.log(
    `LOAD - Updated ${updatedPools.length} pools with total APR (${((endTime - startTime) / 1000).toFixed(1)}s) `
  )
}

export async function updatePoolsWithVolumeAndFee(client: PrismaClient, pools: PoolMinimal[]) {
  const poolsToUpdate = pools.map((pool) => {
    return client.pool.update({
      where: {
        id: pool.id,
      },
      data: {
        volume1d: pool.volume1d,
        fees1d: pool.fees1d,
        volume1w: pool.volume1w,
        fees1w: pool.fees1w,
      },
    })
  })
  console.log(`LOAD - Starting to update ${poolsToUpdate.length} pools.`)
  const startTime = performance.now()
  const updatedPools = await Promise.allSettled(poolsToUpdate)
  // const rejected = updatedPools.filter(result => result.status == 'rejected').map(result => result.reason)
  //   console.log(rejected) // ['failed to fetch']
  const endTime = performance.now()
  console.log(
    `LOAD - Updated ${updatedPools.length} pools with daily and weekly volume/fee data. (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s) `
  )
}
