import { Prisma, PrismaClient } from '@prisma/client'
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
  versions: string[],
  pools: Prisma.PoolCreateManyInput[]
) {
  const containsProtocolPools = await alreadyContainsProtocol(client, protocol, versions)
  if (containsProtocolPools) {
    await upsertPools(client, pools)
  } else {
    await createPools(client, pools)
  }
}

async function upsertPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  console.log(`LOAD - Preparing to update ${pools.length} pools`)

  const upsertManyPools = pools.map((pool) =>
    client.pool.upsert({
      where: { id: pool.id },
      update: {
        liquidityUSD: pool.liquidityUSD,
      },
      create: pool,
    })
  )

  const startTime = performance.now()
  await Promise.all(upsertManyPools)
  const endTime = performance.now()

  console.log(`LOAD - Updated ${upsertManyPools.length} pools. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

async function createPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  let count = 0
  const startTime = performance.now()
  const created = await client.pool.createMany({
    data: pools,
    skipDuplicates: true,
  })
  console.log(`LOAD - Batched and created ${created.count} pools`)
  count += created.count

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
