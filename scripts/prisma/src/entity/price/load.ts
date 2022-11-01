import { Prisma, PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'

/**
 * Merges(Create/Update) prices.
 * Using this wrapper function because createMany() has better performance than upsert(), speeds up the initial seeding.
 * @param client
 * @param prices
 */
export async function mergePrices(
  client: PrismaClient,
  protocol: string,
  version: string,
  pricesToCreate: Prisma.TokenPriceCreateManyInput[],
  pricesToUpdate: Prisma.TokenPriceCreateManyInput[]
) {
  const containsProtocolPrices = await alreadyContainsProtocol(client, protocol, version)
  if (containsProtocolPrices) {
    await updatePrices(client, pricesToUpdate)
    await createPrices(client, pricesToCreate)
  } else {
    await createPrices(client, pricesToCreate)
  }
}

async function updatePrices(client: PrismaClient, prices: Prisma.TokenPriceCreateManyInput[]) {
  if (prices.length === 0) {
    return
  }
  console.log(`LOAD - Preparing to update ${prices.length} prices`)
  const pricesToUpdate = prices.map((price) => {
    return client.tokenPrice.update({
      where: {
        id: price.id,
      },
      data: {
        derivedNative: price.derivedNative,
        usd: price.usd,
      },
    })
  })

  const startTime = performance.now()
  const updatedPrices = await Promise.all(pricesToUpdate)
  const endTime = performance.now()
  console.log(`LOAD - Updated ${updatedPrices.length} prices. (${((endTime - startTime) / 1000).toFixed(1)}s) `)
}

async function createPrices(client: PrismaClient, prices: Prisma.TokenPriceCreateManyInput[]) {
  if (prices.length === 0) {
    return
  }
  let count = 0
  const batchSize = 500
  const startTime = performance.now()
  for (let i = 0; i < prices.length; i += batchSize) {
    const created = await client.tokenPrice.createMany({
      data: prices.slice(i, i + batchSize),
      skipDuplicates: true,
    })
    console.log(`LOAD - Batched and created ${created.count} prices`)
    count += created.count
  }
  const endTime = performance.now()
  console.log(`LOAD - Created ${count} prices. (${((endTime - startTime) / 1000).toFixed(1)}s)`)
}

async function alreadyContainsProtocol(client: PrismaClient, protocol: string, version: string) {
  const count = await client.tokenPrice.count({
    where: {
      protocol,
      version,
    },
  })
  return count > 0
}
