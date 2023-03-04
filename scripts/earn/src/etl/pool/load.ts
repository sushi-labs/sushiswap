import { client, Prisma } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import { PoolMinimal } from './index.js'

/**
 * Merges(Create/Update) pools.
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param pools
 */
export async function mergePools(pools: Prisma.SushiPoolCreateManyInput[], isFirstRun: boolean) {
  if (!isFirstRun) {
    await upsertPools(pools)
  } else {
    await createPools(pools)
  }
}

async function upsertPools(pools: Prisma.SushiPoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)

  const poolsWithIncentives = await client.sushiPool.findMany({
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
      const totalIncentiveApr = poolWithIncentives.incentives.reduce((total, incentive) => {
        return total + incentive.apr
      }, 0)
      return client.sushiPool.update({
        select: { id: true },
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
          feeApr: pool.feeApr ?? 0,
          totalApr: (pool.feeApr ?? 0) + totalIncentiveApr,
        },
      })
    }

    return client.sushiPool.upsert({
      select: { id: true },
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
        feeApr: pool.feeApr,
        totalApr: pool.feeApr,
      },
      create: pool,
    })
  })

  const startTime = performance.now()
  const updatedPools = await Promise.all(upsertManyPools)
  const endTime = performance.now()

  console.log(`LOAD - Updated ${updatedPools.length} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

async function createPools(pools: Prisma.SushiPoolCreateManyInput[]) {
  let count = 0
  const startTime = performance.now()
  const created = await client.sushiPool.createMany({
    data: pools,
    skipDuplicates: true,
  })
  console.log(`LOAD - Batched and created ${created.count} pools`)
  count += created.count

  const endTime = performance.now()
  console.log(`LOAD - Created ${count} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

export async function updatePoolsWithIncentivesTotalApr() {
  const poolsWithIncentives = await client.sushiPool.findMany({
    where: {
      incentives: { some: {} },
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
    const incentiveApr = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr
    }, 0)

    const totalApr = incentiveApr + (pool.feeApr ?? 0)
    const isIncentivized = pool.incentives.some((incentive) => incentive.rewardPerDay > 0)

    return client.sushiPool.update({
      select: { id: true },
      where: {
        id: pool.id,
      },
      data: {
        totalApr,
        incentiveApr,
        isIncentivized,
        wasIncentivized: true,
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

export async function updatePoolsWithVolumeAndFee(pools: PoolMinimal[]) {
  const poolsToUpdate = pools.map((pool) => {
    return client.sushiPool.update({
      select: { id: true },
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
