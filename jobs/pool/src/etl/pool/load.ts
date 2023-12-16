import { Prisma, createClient } from '@sushiswap/database'
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

      const totalIncentiveApr = existingPools.incentives.reduce(
        (total, incentive) => {
          return total + incentive.apr
        },
        0,
      )
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
  const feeApr1hQuery = feeApr1h.length
    ? Prisma.sql`feeApr1h = CASE 
        ${Prisma.join(feeApr1h, ' ')}
        ELSE feeApr1h 
      END,`
    : Prisma.empty
  const feeApr1d = poolsToUpdate
    .filter((p) => p.feeApr1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1d}`)
  const feeApr1dQuery = feeApr1d.length
    ? Prisma.sql`feeApr1d = CASE 
        ${Prisma.join(feeApr1d, ' ')}
        ELSE feeApr1d 
      END,`
    : Prisma.empty
  const feeApr1w = poolsToUpdate
    .filter((p) => p.feeApr1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1w}`)
  const feeApr1wQuery = feeApr1w.length
    ? Prisma.sql`feeApr1w = CASE 
        ${Prisma.join(feeApr1w, ' ')}
        ELSE feeApr1w 
      END,`
    : Prisma.empty
  const feeApr1m = poolsToUpdate
    .filter((p) => p.feeApr1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.feeApr1m}`)
  const feeApr1mQuery = feeApr1m.length
    ? Prisma.sql`feeApr1m = CASE 
        ${Prisma.join(feeApr1m, ' ')}
        ELSE feeApr1m 
      END,`
    : Prisma.empty
  const totalApr1h = poolsToUpdate
    .filter((p) => p.totalApr1h)
    .map(
      (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1h}`,
    )
  const totalApr1hQuery = totalApr1h.length
    ? Prisma.sql`totalApr1h = CASE 
        ${Prisma.join(totalApr1h, ' ')}
        ELSE totalApr1h 
      END,`
    : Prisma.empty
  const totalApr1d = poolsToUpdate
    .filter((p) => p.totalApr1d)
    .map(
      (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1d}`,
    )
  const totalApr1dQuery = totalApr1d.length
    ? Prisma.sql`totalApr1d = CASE 
        ${Prisma.join(totalApr1d, ' ')}
        ELSE totalApr1d 
      END,`
    : Prisma.empty
  const totalApr1w = poolsToUpdate
    .filter((p) => p.totalApr1w)
    .map(
      (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1w}`,
    )
  const totalApr1wQuery = totalApr1w.length
    ? Prisma.sql`totalApr1w = CASE 
        ${Prisma.join(totalApr1w, ' ')}
        ELSE totalApr1w 
      END,`
    : Prisma.empty
  const totalApr1m = poolsToUpdate
    .filter((p) => p.totalApr1m)
    .map(
      (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.totalApr1m}`,
    )
  const totalApr1mQuery = totalApr1m.length
    ? Prisma.sql`totalApr1w = CASE 
        ${Prisma.join(totalApr1m, ' ')}
        ELSE totalApr1w 
      END,`
    : Prisma.empty
  const fees1h = poolsToUpdate
    .filter((p) => p.fees1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1h}`)
  const fees1hQuery = fees1h.length
    ? Prisma.sql`fees1h = CASE 
        ${Prisma.join(fees1h, ' ')}
        ELSE fees1h 
      END,`
    : Prisma.empty
  const fees1d = poolsToUpdate
    .filter((p) => p.fees1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1d}`)
  const fees1dQuery = fees1d.length
    ? Prisma.sql`fees1d = CASE 
        ${Prisma.join(fees1d, ' ')}
        ELSE fees1d 
        END,`
    : Prisma.empty
  const fees1w = poolsToUpdate
    .filter((p) => p.fees1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1w}`)
  const fees1wQuery = fees1w.length
    ? Prisma.sql`fees1w = CASE 
        ${Prisma.join(fees1w, ' ')}
        ELSE fees1w 
      END,`
    : Prisma.empty
  const fees1m = poolsToUpdate
    .filter((p) => p.fees1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1m}`)
  const fees1mQuery = fees1m.length
    ? Prisma.sql`fees1m = CASE 
        ${Prisma.join(fees1m, ' ')}
        ELSE fees1m 
      END,`
    : Prisma.empty
  const volume1h = poolsToUpdate
    .filter((p) => p.volume1h)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1h}`)
  const volume1hQuery = volume1h.length
    ? Prisma.sql`volume1h = CASE 
        ${Prisma.join(volume1h, ' ')}
        ELSE volume1h 
      END,`
    : Prisma.empty
  const volume1d = poolsToUpdate
    .filter((p) => p.volume1d)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1d}`)
  const volume1dQuery = volume1d.length
    ? Prisma.sql`volume1d = CASE 
        ${Prisma.join(volume1d, ' ')}
        ELSE volume1d 
      END,`
    : Prisma.empty
  const volume1w = poolsToUpdate
    .filter((p) => p.volume1w)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1w}`)
  const volume1wQuery = volume1w.length
    ? Prisma.sql`volume1w = CASE 
        ${Prisma.join(volume1w, ' ')}
        ELSE volume1w 
      END,`
    : Prisma.empty
  const volume1m = poolsToUpdate
    .filter((p) => p.volume1m)
    .map((update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.volume1m}`)
  const volume1mQuery = volume1m.length
    ? Prisma.sql`volume1m = CASE 
        ${Prisma.join(volume1m, ' ')}
        ELSE volume1m 
      END,`
    : Prisma.empty
  const liquidityUSDChange1h = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1h)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1h}`,
    )
  const liquidityUSDChange1hQuery = liquidityUSDChange1h.length
    ? Prisma.sql`liquidityUSDChange1h = CASE
        ${Prisma.join(liquidityUSDChange1h, ' ')}
        ELSE liquidityUSDChange1h
      END,`
    : Prisma.empty
  const liquidityUSDChange1d = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1d)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1d}`,
    )
  const liquidityUSDChange1dQuery = liquidityUSDChange1d.length
    ? Prisma.sql`liquidityUSDChange1d = CASE
        ${Prisma.join(liquidityUSDChange1d, ' ')}
        ELSE liquidityUSDChange1d
      END,`
    : Prisma.empty
  const liquidityUSDChange1w = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1w)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1w}`,
    )
  const liquidityUSDChange1wQuery = liquidityUSDChange1w.length
    ? Prisma.sql`liquidityUSDChange1w = CASE
        ${Prisma.join(liquidityUSDChange1w, ' ')}
        ELSE liquidityUSDChange1w
      END,`
    : Prisma.empty
  const liquidityUSDChange1m = poolsToUpdate
    .filter((p) => p.liquidityUSDChange1m)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSDChange1m}`,
    )
  const liquidityUSDChange1mQuery = liquidityUSDChange1m.length
    ? Prisma.sql`liquidityUSDChange1m = CASE
        ${Prisma.join(liquidityUSDChange1m, ' ')}
        ELSE liquidityUSDChange1m
      END,`
    : Prisma.empty
  const volumeChange1h = poolsToUpdate
    .filter((p) => p.volumeChange1h)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1h}`,
    )
  const volumeChange1hQuery = volumeChange1h.length
    ? Prisma.sql`volumeChange1h = CASE
        ${Prisma.join(volumeChange1h, ' ')}
        ELSE volumeChange1h
      END,`
    : Prisma.empty
  const volumeChange1d = poolsToUpdate
    .filter((p) => p.volumeChange1d)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1d}`,
    )
  const volumeChange1dQuery = volumeChange1d.length
    ? Prisma.sql`volumeChange1d = CASE
        ${Prisma.join(volumeChange1d, ' ')}
        ELSE volumeChange1d
      END,`
    : Prisma.empty
  const volumeChange1w = poolsToUpdate
    .filter((p) => p.volumeChange1w)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1w}`,
    )
  const volumeChange1wQuery = volumeChange1w.length
    ? Prisma.sql`volumeChange1w = CASE
        ${Prisma.join(volumeChange1w, ' ')}
        ELSE volumeChange1w
      END,`
    : Prisma.empty
  const volumeChange1m = poolsToUpdate
    .filter((p) => p.volumeChange1m)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeChange1m}`,
    )
  const volumeChange1mQuery = volumeChange1m.length
    ? Prisma.sql`volumeChange1m = CASE
        ${Prisma.join(volumeChange1m, ' ')}
        ELSE volumeChange1m
      END,`
    : Prisma.empty
  const feesChange1h = poolsToUpdate
    .filter((p) => p.feesChange1h)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1h}`,
    )
  const feesChange1hQuery = feesChange1h.length
    ? Prisma.sql`feesChange1h = CASE
        ${Prisma.join(feesChange1h, ' ')}
        ELSE feesChange1h
      END,`
    : Prisma.empty
  const feesChange1d = poolsToUpdate
    .filter((p) => p.feesChange1d)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1d}`,
    )
  const feesChange1dQuery = feesChange1d.length
    ? Prisma.sql`feesChange1d = CASE
        ${Prisma.join(feesChange1d, ' ')}
        ELSE feesChange1d
      END,`
    : Prisma.empty
  const feesChange1w = poolsToUpdate
    .filter((p) => p.feesChange1w)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1w}`,
    )
  const feesChange1wQuery = feesChange1w.length
    ? Prisma.sql`feesChange1w = CASE
        ${Prisma.join(feesChange1w, ' ')}
        ELSE feesChange1w
      END,`
    : Prisma.empty
  const feesChange1m = poolsToUpdate
    .filter((p) => p.feesChange1m)
    .map(
      (update) =>
        Prisma.sql`WHEN id = ${update.id} THEN ${update.feesChange1m}`,
    )
  const feesChange1mQuery = feesChange1m.length
    ? Prisma.sql`feesChange1m = CASE
        ${Prisma.join(feesChange1m, ' ')}
        ELSE feesChange1m
      END,`
    : Prisma.empty

  const query = Prisma.sql`
    UPDATE SushiPool
    SET 
      reserve0 = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve0}`,
          ),
          ' ',
        )}
        ELSE reserve0 
      END,
      reserve1 = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve1}`,
          ),
          ' ',
        )}
        ELSE reserve1 
      END,
      totalSupply = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.totalSupply}`,
          ),
          ' ',
        )}
        ELSE totalSupply 
      END,
      liquidityUSD = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityUSD}`,
          ),
          ' ',
        )}
        ELSE liquidityUSD 
      END,
      feesUSD = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.feesUSD}`,
          ),
          ' ',
        )}
        ELSE feesUSD 
      END,
      liquidityNative = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.liquidityNative}`,
          ),
          ' ',
        )}
        ELSE liquidityNative 
      END,
      volumeUSD = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeUSD}`,
          ),
          ' ',
        )}
        ELSE volumeUSD 
      END,
      volumeNative = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.volumeNative}`,
          ),
          ' ',
        )}
        ELSE volumeNative 
      END,
      token0Price = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.token0Price}`,
          ),
          ' ',
        )}
        ELSE token0Price 
      END,
      token1Price = CASE 
        ${Prisma.join(
          poolsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.token1Price}`,
          ),
          ' ',
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
  const [updated, created] = await Promise.all([
    poolsToUpdate.length ? client.$executeRaw`${query}` : Promise.resolve(0),
    client.sushiPool.createMany({
      data: poolsToCreate,
      skipDuplicates: true,
    }),
  ])

  await client.$disconnect()
  console.log(`LOAD - Updated ${updated} and created ${created.count} pools. `)
}

export async function updatePoolsWithIncentivesTotalApr() {
  const client = await createClient()
  const startTime = performance.now()

  const updatedPoolsCount = await client.$executeRaw`
  UPDATE
    SushiPool p
  SET
    totalApr1h = COALESCE((SELECT SUM(i.apr) FROM Incentive i WHERE i.poolId = p.id), 0) + COALESCE(p.feeApr1h, 0),
    totalApr1d = COALESCE((SELECT SUM(i.apr) FROM Incentive i WHERE i.poolId = p.id), 0) + COALESCE(p.feeApr1d, 0),
    totalApr1w = COALESCE((SELECT SUM(i.apr) FROM Incentive i WHERE i.poolId = p.id), 0) + COALESCE(p.feeApr1w, 0),
    totalApr1m = COALESCE((SELECT SUM(i.apr) FROM Incentive i WHERE i.poolId = p.id), 0) + COALESCE(p.feeApr1m, 0),
    incentiveApr = COALESCE((SELECT SUM(i.apr) FROM Incentive i WHERE i.poolId = p.id), 0),
    isIncentivized = COALESCE((SELECT MAX(i.rewardPerDay > 0) FROM Incentive i WHERE i.poolId = p.id), false),
    wasIncentivized = true
  WHERE
    EXISTS (SELECT 1 FROM Incentive i WHERE i.poolId = p.id);
`

  const endTime = performance.now()

  await client.$disconnect()

  console.log(
    `LOAD - Updated ${updatedPoolsCount} pools with total APR (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s) `,
  )
}

export async function updatePoolsWithSteerVaults() {
  const client = await createClient()
  const startTime = performance.now()

  const poolsUpdatedCount = await client.$executeRaw`
    UPDATE
      SushiPool p
    SET
      hasEnabledSteerVault = COALESCE(
        (SELECT MAX(sv.isEnabled) FROM SteerVault sv WHERE sv.poolId = p.id),
        false
      ),
      hadEnabledSteerVault = COALESCE(
        (SELECT MAX(sv.isEnabled OR sv.wasEnabled) FROM SteerVault sv WHERE sv.poolId = p.id),
        false
      )
    WHERE
      EXISTS (SELECT 1 FROM SteerVault sv WHERE sv.poolId = p.id AND (sv.isEnabled OR sv.wasEnabled));
  `;

  const endTime = performance.now()

  await client.$disconnect()

  console.log(
    `LOAD - Updated ${poolsUpdatedCount} pools with steer vaults (${(
      (endTime - startTime) /
      1000
    ).toFixed(1)}s) `,
  )
}
