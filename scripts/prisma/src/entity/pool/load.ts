import { Pool, Prisma, PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'

/**
 * Merges(Create/Update) pools.
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param pools
 */
export async function mergePools(
  client: PrismaClient,
  protocol: string,
  version: string,
  pools: Prisma.PoolCreateManyInput[]
) {
  const containsProtocolPools = await alreadyContainsProtocol(client, protocol, version)
  if (containsProtocolPools) {
    const upsertedPools = await upsertPools(client, pools)
  } else {
    await createPools(client, pools)
  }
}

async function upsertPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)
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

  const upsertManyPools = pools.map((pool) => {
    const poolWithIncentives = poolsWithIncentives.find((p) => p.id === pool.id)
    if (poolWithIncentives) {
      const bestIncentiveApr = poolWithIncentives.incentives.reduce((best, incentive) => {
        if (incentive.apr > best) {
          return incentive.apr
        }
        return best
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
          totalApr: (pool.apr ?? 0) + bestIncentiveApr,
        }
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
        totalApr: pool.apr
      },
      create: pool,
    })
  })

  const startTime = performance.now()
  const updatedPools = await Promise.all(upsertManyPools)
  const endTime = performance.now()
  console.log(`LOAD - Updated ${updatedPools.length} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
  return updatedPools
}

async function createPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  let count = 0
  const batchSize = 500
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

async function alreadyContainsProtocol(client: PrismaClient, protocol: string, version: string) {
  const count = await client.pool.count({
    where: {
      protocol,
      version,
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
    const bestIncentiveApr = pool.incentives.reduce((best, incentive) => {
      const apr = incentive.apr
      if (apr > best) {
        return apr
      }
      return best
    }, 0)
    const totalApr = bestIncentiveApr + (pool.apr ?? 0)
    return client.pool.update({
      where: {
        id: pool.id,
      },
      data: {
        totalApr,
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
