import { createClient, Prisma } from '@sushiswap/database'
import { performance } from 'perf_hooks'

export async function upsertPools(pools: Prisma.SushiPoolCreateManyInput[]) {
  if (pools.length === 0) return
  const client = await createClient()
  const poolsWithIncentives = await client.sushiPool.findMany({
    where: {
      id: {
        in: pools.map((pool) => pool.id),
      },
    },
    select: {
      id: true,
      incentives: true,
    },
  })

  const poolsToCreate: Prisma.SushiPoolCreateManyInput[] = []
  const poolsToUpdate: Prisma.SushiPoolCreateManyInput[] = []

  for (const pool of pools) {
    const existingPools = poolsWithIncentives.find((p) => p.id === pool.id)
    if (existingPools) {
      if (!existingPools.incentives) {
        poolsToUpdate.push(pool)
        continue
      }

      const totalIncentiveApr = existingPools.incentives.reduce((total, incentive) => {
        return total + incentive.apr
      }, 0)
      poolsToUpdate.push({
        ...pool,
        totalApr1h: (pool.feeApr1h ?? 0) + totalIncentiveApr,
        totalApr1d: (pool.feeApr1d ?? 0) + totalIncentiveApr,
        totalApr1w: (pool.feeApr1w ?? 0) + totalIncentiveApr,
        totalApr1m: (pool.feeApr1m ?? 0) + totalIncentiveApr,
      })
      continue
    }
    poolsToCreate.push(pool)
  }

  const [updated, created] = await Promise.all([
    poolsToUpdate.length
      ? client.$executeRaw`
          UPDATE SushiPool
          SET 
            reserve0 = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve0}`),
                ' '
              )}
              ELSE reserve0 
            END,
            reserve1 = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve1}`),
                ' '
              )}
              ELSE reserve1 
            END,
            totalSupply = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalSupply}`),
                ' '
              )}
              ELSE totalSupply 
            END,
            liquidityUSD = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSD}`),
                ' '
              )}
              ELSE liquidityUSD 
            END,
            feesUSD = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesUSD}`),
                ' '
              )}
              ELSE feesUSD 
            END,
            liquidityNative = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityNative}`),
                ' '
              )}
              ELSE liquidityNative 
            END,
            volumeUSD = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeUSD}`),
                ' '
              )}
              ELSE volumeUSD 
            END,
            volumeNative = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeNative}`),
                ' '
              )}
              ELSE volumeNative 
            END,
            token0Price = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.token0Price}`),
                ' '
              )}
              ELSE token0Price 
            END,
            token1Price = CASE 
              ${Prisma.join(
                poolsToUpdate.map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.token1Price}`),
                ' '
              )}
              ELSE token1Price 
            END,
            feeApr1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feeApr1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1h}`),
                ' '
              )}
              ELSE feeApr1h 
            END,
            feeApr1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feeApr1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1d}`),
                ' '
              )}
              ELSE feeApr1d 
            END,
            feeApr1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feeApr1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1w}`),
                ' '
              )}
              ELSE feeApr1w 
            END,
            feeApr1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feeApr1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1m}`),
                ' '
              )}
              ELSE feeApr1m
            END,
            totalApr1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.totalApr1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1h}`),
                ' '
              )}
              ELSE totalApr1h 
            END,
            totalApr1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.totalApr1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1d}`),
                ' '
              )}
              ELSE totalApr1d 
            END,
            totalApr1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.totalApr1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1w}`),
                ' '
              )}
              ELSE totalApr1w 
            END,
            totalApr1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.totalApr1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1m}`),
                ' '
              )}
              ELSE totalApr1m
            END,
            fees1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.fees1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1h}`),
                ' '
              )}
              ELSE fees1h
            END,
            fees1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.fees1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1d}`),
                ' '
              )}
              ELSE fees1d
            END,
            fees1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.fees1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1w}`),
                ' '
              )}
              ELSE fees1w
            END,
            fees1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.fees1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1m}`),
                ' '
              )}
              ELSE fees1m
            END,
            volume1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volume1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1h}`),
                ' '
              )}
              ELSE volume1h
            END,
            volume1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volume1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1d}`),
                ' '
              )}
              ELSE volume1d
            END,
            volume1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volume1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1w}`),
                ' '
              )}
              ELSE volume1w
            END,
            volume1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volume1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1m}`),
                ' '
              )}
              ELSE volume1m
            END,
            liquidityUSDChange1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.liquidityUSDChange1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1h}`),
                ' '
              )}
              ELSE liquidityUSDChange1h
            END,
            liquidityUSDChange1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.liquidityUSDChange1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1d}`),
                ' '
              )}
              ELSE liquidityUSDChange1d
            END,
            liquidityUSDChange1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.liquidityUSDChange1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1w}`),
                ' '
              )}
              ELSE liquidityUSDChange1w
            END,
            liquidityUSDChange1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.liquidityUSDChange1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1m}`),
                ' '
              )}
              ELSE liquidityUSDChange1m
            END,
            volumeChange1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volumeChange1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1h}`),
                ' '
              )}
              ELSE volumeChange1h
            END,
            volumeChange1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volumeChange1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1d}`),
                ' '
              )}
              ELSE volumeChange1d
            END,
            volumeChange1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volumeChange1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1w}`),
                ' '
              )}
              ELSE volumeChange1w
            END,
            volumeChange1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.volumeChange1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1m}`),
                ' '
              )}
              ELSE volumeChange1m
            END,
            feesChange1h = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feesChange1h).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1h}`),
                ' '
              )}
              ELSE feesChange1h
            END,
            feesChange1d = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feesChange1d).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1d}`),
                ' '
              )}
              ELSE feesChange1d
            END,
            feesChange1w = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feesChange1w).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1w}`),
                ' '
              )}
              ELSE feesChange1w
            END,
            feesChange1m = CASE 
              ${Prisma.join(
                poolsToUpdate.filter(p => p.feesChange1m).map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1m}`),
                ' '
              )}
              ELSE feesChange1m
            END,
            updatedAt = NOW()
          WHERE id IN (${Prisma.join(poolsToUpdate.map((update) => update.id))});
      `
      : Promise.resolve(0),
    client.sushiPool.createMany({
      data: poolsToCreate,
      skipDuplicates: true,
    }),
  ])
  console.log(`LOAD - Updated ${updated} and created ${created.count} pools. `)
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
