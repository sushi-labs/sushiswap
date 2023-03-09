import type { Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

export async function createTokens(client: PrismaClient, tokens: Prisma.TokenCreateManyInput[]) {
  if (tokens.length === 0) {
    return
  }
  const startTime = performance.now()

  const created = await client.token.createMany({
    data: tokens,
    skipDuplicates: true,
  })

  const endTime = performance.now()
  const duration = ((endTime - startTime) / 1000).toFixed(1)
  if (created.count > 0) {
    console.log(`LOAD - Created ${created.count} tokens. (${duration}s) `)
  } else {
    console.log(`LOAD - No tokens created, already exist. (${duration}s) `)
  }
}
