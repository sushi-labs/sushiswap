import type { Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

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

export async function getLatestPoolTimestamp(
  client: PrismaClient,
  chainId: number,
  protocol: string,
  versions: string[]
) {
  const startTime = performance.now()

  const latestPool = await client.pool.findFirst({
    select: {
      address: true,
      generatedAt: true,
    },
    where: {
      protocol,
      version: {
        in: versions,
      },
      chainId,
    },
    orderBy: {
      generatedAt: 'desc',
    },
  })

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  if (!latestPool) {
    return null
  }
  const latestPoolTimestamp = (latestPool.generatedAt.getTime() / 1000).toFixed()
  console.log(`Latest pool ${latestPool.address}, creation timestamp: ${latestPoolTimestamp} (${duration}s)`)
  return latestPoolTimestamp
}
