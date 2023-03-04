import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

export async function whitelistPools2() {
  const productionClient = await createClient({
    datasources: {
      db: {
        url: process.env.PRODUCTION_DATABASE_URL as string,
      },
    },
  })
  const previewClient = await createClient({
    datasources: {
      db: {
        url: process.env.PREVIEW_DATABASE_URL as string,
      },
    },
  })

  try {
    const startTime = performance.now()

    await start(productionClient, previewClient)

    const endTime = performance.now()
    console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
  } catch (e) {
    console.error(e)
    await previewClient.$disconnect()
    await productionClient.$disconnect()
  } finally {
    await previewClient.$disconnect()
    await productionClient.$disconnect()
  }
}

async function start(productionClient: PrismaClient, previewClient: PrismaClient) {
  const approvedTokensResult = await productionClient.token.findMany({
    select: {
      id: true,
    },
    where: {
      isFeeOnTransfer: false,
      status: 'APPROVED',
    },
  })

  const approvedTokens = approvedTokensResult.map((token) => token.id)
  console.log(`Fetched ${approvedTokens.length} tokens (approved and not fee on transfer).`)

  const batchSize = 10000
  let cursor = null
  const poolsToUpdate: string[] = []
  let totalCount = 0

  do {
    const requestStartTime = performance.now()
    let result = []
    if (!cursor) {
      result = await getPoolsAddresses(previewClient, approvedTokens, batchSize)
    } else {
      result = await getPoolsAddresses(previewClient, approvedTokens, batchSize, 1, { id: cursor })
    }
    cursor = result.length == batchSize ? result[result.length - 1].id : null
    totalCount += result.length

    poolsToUpdate.push(...result.map((pool) => pool.id))
    const requestEndTime = performance.now()
    if (result.length > 0) {
      console.log(
        `Fetched a batch of pool addresses with ${result.length} (${(
          (requestEndTime - requestStartTime) /
          1000
        ).toFixed(1)}s). cursor: ${cursor}, pool count that needs whitelisting: ${result.length}`
      )
    } else {
      console.log(`No pools needs whitelisting.`)
    }
  } while (cursor != null)

  const updatePoolsBatchSize = 200
  let updatePoolCount = 0
  for (let i = 0; i < poolsToUpdate.length; i += updatePoolsBatchSize) {
    const batch = poolsToUpdate.slice(i, i + updatePoolsBatchSize)
    const batchToUpdate = batch.map((id) =>
      previewClient.pool.update({
        where: {
          id,
        },
        data: {
          isWhitelisted: true,
        },
      })
    )
    const poolsUpdated = await Promise.allSettled(batchToUpdate)

    console.log(`LOAD - ${poolsUpdated.length} pools whitelisted.`)
    updatePoolCount += poolsUpdated.length
  }
  console.log(`LOAD - COMPLETE, ${updatePoolCount} pools whitelisted.`)
}

async function getPoolsAddresses(
  client: PrismaClient,
  approvedIds: string[],
  take: number,
  skip?: number,
  cursor?: Prisma.PoolWhereUniqueInput
) {
  const approvedTokens = await client.pool.findMany({
    take,
    skip,
    cursor,
    select: {
      id: true,
    },
    where: {
      isWhitelisted: false,
      token0Id: { in: approvedIds },
      token1Id: { in: approvedIds },
    },
  })

  return approvedTokens
}
