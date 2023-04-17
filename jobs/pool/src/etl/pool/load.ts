import { createClient, Prisma } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import { PoolMinimal } from './index.js'


export async function upsertPools(pools: Prisma.SushiPoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)

  const client = await createClient()
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
      const totalIncentiveApr1h = poolWithIncentives.incentives.reduce((total, incentive) => {
        return total + incentive.apr1h
      }, 0)
      const totalIncentiveApr1d = poolWithIncentives.incentives.reduce((total, incentive) => {
        return total + incentive.apr1d
      }, 0)
      const totalIncentiveApr1w = poolWithIncentives.incentives.reduce((total, incentive) => {
        return total + incentive.apr1w
      }, 0)
      const totalIncentiveApr1m = poolWithIncentives.incentives.reduce((total, incentive) => {
        return total + incentive.apr1m
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
          feeApr1h: pool.feeApr1h ?? 0,
          feeApr1d: pool.feeApr1d ?? 0,
          feeApr1w: pool.feeApr1w ?? 0,
          feeApr1m: pool.feeApr1m ?? 0,
          totalApr1h: (pool.feeApr1h ?? 0) + totalIncentiveApr1h,
          totalApr1d: (pool.feeApr1d ?? 0) + totalIncentiveApr1d,
          totalApr1w: (pool.feeApr1w ?? 0) + totalIncentiveApr1w,
          totalApr1m: (pool.feeApr1m ?? 0) + totalIncentiveApr1m,
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
        feeApr1h: pool.feeApr1h,
        feeApr1d: pool.feeApr1d,
        feeApr1w: pool.feeApr1w,
        feeApr1m: pool.feeApr1m,
        totalApr1h: pool.totalApr1h,
        totalApr1d: pool.totalApr1d,
        totalApr1w: pool.totalApr1w,
        totalApr1m: pool.totalApr1m,
        fees1h: pool.fees1h,
        fees1d: pool.fees1d,
        fees1w: pool.fees1w,
        fees1m: pool.fees1m,
        volume1h: pool.volume1h,
        volume1d: pool.volume1d,
        volume1w: pool.volume1w,
        volume1m: pool.volume1m,
      },
      create: pool,
    })
  })

  const startTime = performance.now()
  const updatedPools = await Promise.all(upsertManyPools)
  const endTime = performance.now()

  console.log(`LOAD - Updated ${updatedPools.length} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

// async function createPools(pools: Prisma.SushiPoolCreateManyInput[]) {
//   let count = 0
//   const startTime = performance.now()
//   const client = await createClient()
//   const created = await client.sushiPool.createMany({
//     data: pools,
//     skipDuplicates: true,
//   })
//   console.log(`LOAD - Batched and created ${created.count} pools`)
//   count += created.count

//   const endTime = performance.now()
//   console.log(`LOAD - Created ${count} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
// }

export async function updatePoolsWithIncentivesTotalApr() {
  const client = await createClient()
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
    const incentiveApr1h = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr1h
    }, 0)

    const incentiveApr1d = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr1d
    }, 0)

    const incentiveApr1w = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr1w
    }, 0)
    const incentiveApr1m = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr1m
    }, 0)

    const isIncentivized = pool.incentives.some((incentive) => incentive.rewardPerDay > 0)

    return client.sushiPool.update({
      select: { id: true },
      where: {
        id: pool.id,
      },
      data: {
        totalApr1h: incentiveApr1h + (pool.feeApr1h ?? 0),
        totalApr1d: incentiveApr1d + (pool.feeApr1d ?? 0),
        totalApr1w: incentiveApr1w + (pool.feeApr1w ?? 0),
        totalApr1m: incentiveApr1m + (pool.feeApr1m ?? 0),
        incentiveApr1h,
        incentiveApr1d,
        incentiveApr1w,
        incentiveApr1m,
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
  const client = await createClient()
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
