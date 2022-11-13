import { Prisma, PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'

export async function createTokens(client: PrismaClient, tokens: Prisma.TokenCreateManyInput[]) {
  if (tokens.length === 0) {
    return
  }
  let count = 0
  const batchSize = 500
  for (let i = 0; i < tokens.length; i += batchSize) {
    const created = await client.token.createMany({
      data: tokens.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} tokens`)
    count += created.count
  }
  console.log(`LOAD - Created ${count} tokens. `)
}

export async function updateTokenPrices(client: PrismaClient, prices: Prisma.TokenUpdateArgs[]) {
  if (prices.length === 0) {
    return
  }
  console.log(`LOAD - Preparing to update usd price for ${prices.length} tokens`)
  const requests = prices.map((price) => client.token.update(price))
  const startTime = performance.now()
  const updatedPools = await Promise.all(requests)
  const endTime = performance.now()

  console.log(`LOAD - Updated ${updatedPools.length} prices. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}
