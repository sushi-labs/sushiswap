import { createClient, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

export async function whitelistTokens2() {
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

  const batchSize = 200
  let updateTokenCount = 0
  for (let i = 0; i < approvedTokens.length; i += batchSize) {
    const batch = approvedTokens.slice(i, i + batchSize)
    const batchToUpdate = batch.map((id) =>
      previewClient.token.update({
        where: {
          id,
        },
        data: {
          status: 'APPROVED',
          isFeeOnTransfer: false,
        },
      })
    )
    const tokensUpdated = await Promise.allSettled(batchToUpdate)

    console.log(`LOAD - ${tokensUpdated.length} tokens approved.`)
    updateTokenCount += tokensUpdated.length
  }
  console.log(`LOAD - COMPLETE, ${updateTokenCount} tokens approved.`)
}
