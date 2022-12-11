import { Prisma, PrismaClient } from '@prisma/client'
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
