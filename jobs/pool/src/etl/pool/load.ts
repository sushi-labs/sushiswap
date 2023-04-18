import { createClient, Prisma } from '@sushiswap/database'
import { performance } from 'perf_hooks'



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
          feeApr1h: pool.feeApr1h ?? 0,
          feeApr1d: pool.feeApr1d ?? 0,
          feeApr1w: pool.feeApr1w ?? 0,
          feeApr1m: pool.feeApr1m ?? 0,
          totalApr1h: (pool.feeApr1h ?? 0) + totalIncentiveApr,
          totalApr1d: (pool.feeApr1d ?? 0) + totalIncentiveApr,
          totalApr1w: (pool.feeApr1w ?? 0) + totalIncentiveApr,
          totalApr1m: (pool.feeApr1m ?? 0) + totalIncentiveApr,
          fees1h: pool.fees1h,
          fees1d: pool.fees1d,
          fees1w: pool.fees1w,
          fees1m: pool.fees1m,
          volume1h: pool.volume1h,
          volume1d: pool.volume1d,
          volume1w: pool.volume1w,
          volume1m: pool.volume1m,
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
    const incentiveApr = pool.incentives.reduce((totalIncentiveApr, incentive) => {
      return totalIncentiveApr + incentive.apr
    }, 0)


    const isIncentivized = pool.incentives.some((incentive) => incentive.rewardPerDay > 0)

    return client.sushiPool.update({
      select: { id: true },
      where: {
        id: pool.id,
      },
      data: {
        totalApr1h: incentiveApr + (pool.feeApr1h ?? 0),
        totalApr1d: incentiveApr + (pool.feeApr1d ?? 0),
        totalApr1w: incentiveApr + (pool.feeApr1w ?? 0),
        totalApr1m: incentiveApr + (pool.feeApr1m ?? 0),
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
