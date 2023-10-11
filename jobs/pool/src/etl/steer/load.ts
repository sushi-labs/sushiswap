import { createClient, Prisma } from '@sushiswap/database'

export async function upsertVaults(vaults: Prisma.SteerVaultCreateManyInput[]) {
  const client = await createClient()

  const vaultTokens = vaults.flatMap((vault) => [
    vault.token0Id,
    vault.token1Id,
  ])
  const dbTokens = (
    await client.token.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          in: vaultTokens,
        },
      },
    })
  ).map((token) => token.id)

  const vaultPools = vaults.map((vault) => vault.poolId)
  const dbPools = (
    await client.sushiPool.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          in: vaultPools,
        },
      },
    })
  ).map((pool) => pool.id)

  const vaultsToUpdate = vaults.filter(
    (vault) =>
      dbTokens.includes(vault.token0Id) &&
      dbTokens.includes(vault.token1Id) &&
      dbPools.includes(vault.poolId),
  )

  if (vaultsToUpdate.length === 0) return

  const query = Prisma.sql`
    UPDATE SteerVault
    SET
      poolId = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.poolId}`,
          ),
          ' ',
        )}
        ELSE poolId
      END,
      feeTier = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.feeTier}`,
          ),
          ' ',
        )}
        ELSE feeTier
      END,
      apr = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.apr}`,
          ),
          ' ',
        )}
        ELSE apr
      END,
      apr1d = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.apr1d}`,
          ),
          ' ',
        )}
        ELSE apr1d
      END,
      apr1m = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.apr1m}`,
          ),
          ' ',
        )}
        ELSE apr1m
      END,
      apr1y = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.apr1y}`,
          ),
          ' ',
        )}
        ELSE apr1y
      END,
      token0Id = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.token0Id}`,
          ),
          ' ',
        )}
        ELSE token0Id
      END,
      reserve0 = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve0}`,
          ),
          ' ',
        )}
        ELSE reserve0
      END,
      fees0 = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees0}`,
          ),
          ' ',
        )}
        ELSE fees0
      END,
      token1Id = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.token1Id}`,
          ),
          ' ',
        )}
        ELSE token1Id
      END,
      reserve1 = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.reserve1}`,
          ),
          ' ',
        )}
        ELSE reserve1
      END,
      fees1 = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.fees1}`,
          ),
          ' ',
        )}
        ELSE fees1
      END,
      strategy = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.strategy}`,
          ),
          ' ',
        )}
        ELSE strategy
      END,
      description = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.description}`,
          ),
          ' ',
        )}
        ELSE description
      END,
      state = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.state}`,
          ),
          ' ',
        )}
        ELSE state
      END,
      performanceFee = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.performanceFee}`,
          ),
          ' ',
        )}
        ELSE performanceFee
      END,
      lowerTick = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.lowerTick}`,
          ),
          ' ',
        )}
        ELSE lowerTick
      END,
      upperTick = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.upperTick}`,
          ),
          ' ',
        )}
        ELSE upperTick
      END,
      adjustmentFrequency = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.adjustmentFrequency}`,
          ),
          ' ',
        )}
        ELSE adjustmentFrequency
      END,
      lastAdjustmentTimestamp = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.lastAdjustmentTimestamp}`,
          ),
          ' ',
        )}
        ELSE lastAdjustmentTimestamp
      END,
      creator = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.creator}`,
          ),
          ' ',
        )}
        ELSE creator
      END,
      admin = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) => Prisma.sql`WHEN id = ${update.id} THEN ${update.admin}`,
          ),
          ' ',
        )}
        ELSE admin
      END,
      manager = CASE
        ${Prisma.join(
          vaultsToUpdate.map(
            (update) =>
              Prisma.sql`WHEN id = ${update.id} THEN ${update.manager}`,
          ),
          ' ',
        )}
        ELSE manager
      END,
      updatedAt = NOW()
    WHERE id IN (${Prisma.join(
      vaultsToUpdate.map((update) => Prisma.sql`${update.id}`),
    )});
  `

  const [updated, created] = await Promise.all([
    vaultsToUpdate.length ? client.$executeRaw`${query}` : Promise.resolve(0),
    client.steerVault.createMany({
      data: vaultsToUpdate,
      skipDuplicates: true,
    }),
  ])

  const currentVaults = await client.steerVault.findMany({
    select: {
      id: true,
    },
    where: {
      isEnabled: true,
      wasEnabled: false,
    },
  })

  await client.steerVault.updateMany({
    where: {
      id: { in: currentVaults.map((vault) => vault.id) },
    },
    data: {
      wasEnabled: true,
    },
  })

  await client.$disconnect()

  console.log(`LOAD - Updated ${updated} and created ${created.count} vaults. `)
}
