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
  const feeApr1h = poolsToUpdate
    .filter((p) => p.feeApr1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1h}`)
  const feeApr1hQuery = feeApr1h
    ? `
  feeApr1h = CASE 
              ${Prisma.join(feeApr1h, ' ')}
              ELSE feeApr1h 
            END,
  `
    : ''
  const feeApr1d = poolsToUpdate
    .filter((p) => p.feeApr1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1d}`)
  const feeApr1dQuery = feeApr1d
    ? `
  feeApr1d = CASE 
              ${Prisma.join(feeApr1d, ' ')}
              ELSE feeApr1d 
            END,
  `
    : ''
  const feeApr1w = poolsToUpdate
    .filter((p) => p.feeApr1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1w}`)
  const feeApr1wQuery = feeApr1w
    ? `
  feeApr1w = CASE 
              ${Prisma.join(feeApr1w, ' ')}
              ELSE feeApr1w 
            END,
  `
    : ''
  const feeApr1m = poolsToUpdate
    .filter((p) => p.feeApr1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1m}`)
  const feeApr1mQuery = feeApr1m
    ? `
  feeApr1m = CASE 
              ${Prisma.join(feeApr1m, ' ')}
              ELSE feeApr1m 
            END,
  `
    : ''
  const totalApr1h = poolsToUpdate
    .filter((p) => p.totalApr1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1h}`)
  const totalApr1hQuery = totalApr1h
    ? `
  totalApr1h = CASE 
              ${Prisma.join(totalApr1h, ' ')}
              ELSE totalApr1h 
            END,
  `
    : ''
  const totalApr1d = poolsToUpdate
    .filter((p) => p.totalApr1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1d}`)
  const totalApr1dQuery = totalApr1d
    ? `
  totalApr1d = CASE 
              ${Prisma.join(totalApr1d, ' ')}
              ELSE totalApr1d 
            END,
  `
    : ''
  const totalApr1w = poolsToUpdate
    .filter((p) => p.totalApr1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1w}`)
  const totalApr1wQuery = totalApr1w
    ? `
  totalApr1w = CASE 
              ${Prisma.join(totalApr1w, ' ')}
              ELSE totalApr1w 
            END,
  `
    : ''
  const totalApr1m = poolsToUpdate
    .filter((p) => p.totalApr1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1m}`)
  const totalApr1mQuery = totalApr1m
    ? `
  totalApr1w = CASE 
              ${Prisma.join(totalApr1m, ' ')}
              ELSE totalApr1w 
            END,
  `
    : ''
  const fees1h = poolsToUpdate
    .filter((p) => p.fees1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1h}`)
  const fees1hQuery = fees1h
    ? `
  fees1h = CASE 
              ${Prisma.join(fees1h, ' ')}
              ELSE fees1h 
            END,
  `
    : ''
  const fees1d = poolsToUpdate
    .filter((p) => p.fees1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1d}`)
  const fees1dQuery = fees1d
    ? `
  fees1d = CASE 
              ${Prisma.join(fees1d, ' ')}
              ELSE fees1d 
            END,
  `
    : ''
  const fees1w = poolsToUpdate
    .filter((p) => p.fees1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1w}`)
  const fees1wQuery = fees1w
    ? `
  fees1w = CASE 
              ${Prisma.join(fees1w, ' ')}
              ELSE fees1w 
            END,
  `
    : ''
  const fees1m = poolsToUpdate
    .filter((p) => p.fees1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1m}`)
  const fees1mQuery = fees1m
    ? `
  fees1m = CASE 
              ${Prisma.join(fees1m, ' ')}
              ELSE fees1m 
            END,
  `
    : ''
  const volume1h = poolsToUpdate
    .filter((p) => p.volume1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1h}`)
  const volume1hQuery = volume1h
    ? `
  volume1h = CASE 
  ${Prisma.join(volume1h, ' ')}
  ELSE volume1h 
  END,
  `
    : ''
  const volume1d = poolsToUpdate
    .filter((p) => p.volume1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1d}`)
  const volume1dQuery = volume1d
    ? `
  volume1d = CASE 
    ${Prisma.join(volume1d, ' ')}
    ELSE volume1d 
  END,
  `
    : ''
  const volume1w = poolsToUpdate
    .filter((p) => p.volume1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1w}`)
  const volume1wQuery = volume1w
    ? `
  volume1w = CASE 
    ${Prisma.join(volume1w, ' ')}
    ELSE volume1w 
  END,
  `
    : ''
  const volume1m = poolsToUpdate
    .filter((p) => p.volume1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1m}`)
  const volume1mQuery = volume1m
    ? `
  volume1m = CASE 
    ${Prisma.join(volume1m, ' ')}
    ELSE volume1m 
  END,
  `
    : ''
  const liquidityUSDChange1h = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1h}`)
  const liquidityUSDChange1hQuery = liquidityUSDChange1h
    ? `
  liquidityUSDChange1h = CASE
    ${Prisma.join(liquidityUSDChange1h, ' ')}
    ELSE liquidityUSDChange1h
  END,
  `
    : ''
  const liquidityUSDChange1d = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1d}`)
  const liquidityUSDChange1dQuery = liquidityUSDChange1d
    ? `
  liquidityUSDChange1d = CASE
    ${Prisma.join(liquidityUSDChange1d, ' ')}
    ELSE liquidityUSDChange1d
  END,
  `
    : ''
  const liquidityUSDChange1w = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1w}`)
  const liquidityUSDChange1wQuery = liquidityUSDChange1w
    ? `
  liquidityUSDChange1w = CASE
    ${Prisma.join(liquidityUSDChange1w, ' ')}
    ELSE liquidityUSDChange1w
  END,
  `
    : ''
  const liquidityUSDChange1m = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1m}`)
  const liquidityUSDChange1mQuery = liquidityUSDChange1m
    ? `
  liquidityUSDChange1m = CASE
    ${Prisma.join(liquidityUSDChange1m, ' ')}
    ELSE liquidityUSDChange1m
  END,
  `
    : ''
  const volumeChange1h = poolsToUpdate
    .filter((p) => p.volumeChange1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1h}`)
  const volumeChange1hQuery = volumeChange1h
    ? `
  volumeChange1h = CASE
    ${Prisma.join(volumeChange1h, ' ')}
    ELSE volumeChange1h
  END,
  `
    : ''
  const volumeChange1d = poolsToUpdate
    .filter((p) => p.volumeChange1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1d}`)
  const volumeChange1dQuery = volumeChange1d
    ? `
  volumeChange1d = CASE
    ${Prisma.join(volumeChange1d, ' ')}
    ELSE volumeChange1d
  END,
  `
    : ''
  const volumeChange1w = poolsToUpdate
    .filter((p) => p.volumeChange1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1w}`)
  const volumeChange1wQuery = volumeChange1w
    ? `
  volumeChange1w = CASE
    ${Prisma.join(volumeChange1w, ' ')}
    ELSE volumeChange1w
  END,
  `
    : ''
  const volumeChange1m = poolsToUpdate
    .filter((p) => p.volumeChange1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1m}`)
  const volumeChange1mQuery = volumeChange1m
    ? `
  volumeChange1m = CASE
    ${Prisma.join(volumeChange1m, ' ')}
    ELSE volumeChange1m
  END,
  `
    : ''
  const feesChange1h = poolsToUpdate
    .filter((p) => p.feesChange1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1h}`)
  const feesChange1hQuery = feesChange1h
    ? `
  feesChange1h = CASE
    ${Prisma.join(feesChange1h, ' ')}
    ELSE feesChange1h
  END,
  `
    : ''
  const feesChange1d = poolsToUpdate
    .filter((p) => p.feesChange1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1d}`)
  const feesChange1dQuery = feesChange1d
    ? `
  feesChange1d = CASE
    ${Prisma.join(feesChange1d, ' ')}
    ELSE feesChange1d
  END,
  `
    : ''
  const feesChange1w = poolsToUpdate
    .filter((p) => p.feesChange1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1w}`)
  const feesChange1wQuery = feesChange1w
    ? `
  feesChange1w = CASE
    ${Prisma.join(feesChange1w, ' ')}
    ELSE feesChange1w
  END,
  `
    : ''
  const feesChange1m = poolsToUpdate
    .filter((p) => p.feesChange1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1m}`)
  const feesChange1mQuery = feesChange1m
    ? `
  feesChange1m = CASE
    ${Prisma.join(feesChange1m, ' ')}
    ELSE feesChange1m
  END,
  `
    : ''

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
            ${feeApr1hQuery}
            ${feeApr1dQuery}
            ${feeApr1wQuery}
            ${feeApr1mQuery}
            ${totalApr1hQuery}
            ${totalApr1dQuery}
            ${totalApr1wQuery}
            ${totalApr1mQuery}
            ${fees1hQuery}
            ${fees1dQuery}
            ${fees1wQuery}
            ${fees1mQuery}
            ${volume1hQuery}
            ${volume1dQuery}
            ${volume1wQuery}
            ${volume1mQuery}
            ${liquidityUSDChange1hQuery}
            ${liquidityUSDChange1dQuery}
            ${liquidityUSDChange1wQuery}
            ${liquidityUSDChange1mQuery}
            ${volumeChange1hQuery}
            ${volumeChange1dQuery}
            ${volumeChange1wQuery}
            ${volumeChange1mQuery}
            ${feesChange1hQuery}
            ${feesChange1dQuery}
            ${feesChange1wQuery}
            ${feesChange1mQuery}
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
