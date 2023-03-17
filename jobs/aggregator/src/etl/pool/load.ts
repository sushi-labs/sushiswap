import type { Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'
import { ProtocolName, ProtocolVersion } from 'src/config.js'

export async function createPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  const startTime = performance.now()

  const created = await client.pool.createMany({
    data: pools,
    skipDuplicates: true,
  })

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  if (created.count > 0) {
    console.log(`LOAD - Created ${created.count} pools. (${duration}s) `)
  } else {
    console.log(`LOAD - No pools created, already exist. (${duration}s) `)
  }
}

export async function getNonExistingPools(client: PrismaClient, pools: Prisma.PoolCreateManyInput[]) {
  const startTime = performance.now()

  const existingPools = await client.pool.findMany({
    where: {
      id: {
        in: pools.map((pool) => pool.id),
      },
    },
    select: {
      id: true,
    },
  })

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  console.log(`LOAD - Found ${existingPools.length} existing pools. (${duration}s) `)

  const existingPoolIds = existingPools.map((pool) => pool.id)
  return pools.filter((pool) => !existingPoolIds.includes(pool.id))
}

export async function isProtocolExisting(client: PrismaClient, chainId: number, protocol: ProtocolName, version: ProtocolVersion) {
  const startTime = performance.now()

  const latestPool = await client.pool.findFirst({
    select: {
      address: true,
    },
    where: {
      protocol,
      version,
      chainId,
    },
    orderBy: {
      generatedAt: 'desc',
    },
  })
  const protocolExists = latestPool !== null

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)

  console.log(`${chainId} ${protocol} ${version}, has pools: ${protocolExists}. (${duration}s)`)
  return protocolExists
}
