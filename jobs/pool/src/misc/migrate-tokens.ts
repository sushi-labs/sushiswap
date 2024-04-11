// import { PrismaClient, createDirectClient } from "@sushiswap/database"

// export async function whitelistTokens2() {
//     const productionClient = await createDirectClient({
//       datasources: {
//         db: {
//             url: process.env.PRODUCTION_DATABASE_URL as string,
//           },
//         },
//       })
//       const previewClient = await createDirectClient({
//         datasources: {
//           db: {
//             url: process.env.PREVIEW_DATABASE_URL as string,
//         },
//       },
//     })

//     try {
//       const startTime = performance.now()

//       await start(productionClient, previewClient)

//       const endTime = performance.now()
//       console.log(`COMPLETED (${((endTime - startTime) / 1000).toFixed(1)}s). `)
//     } catch (e) {
//       console.error(e)
//       await previewClient.$disconnect()
//       await productionClient.$disconnect()
//     } finally {
//       await previewClient.$disconnect()
//       await productionClient.$disconnect()
//     }
//   }

//   async function start(productionClient: PrismaClient, previewClient: PrismaClient) {
//     const approvedTokensResult = await productionClient.token.findMany({
//       select: {
//         id: true,
//         address: true,
//         chainId: true,
//         name: true,
//         symbol: true,
//         decimals: true,
//         status: true,
//         isFeeOnTransfer: true,
//         isCommon: true,
//       },
//       where: {
//         status: 'APPROVED',
//       },
//     })

//     const existingTokens = await previewClient.token.findMany({
//         select: {
//             id: true,
//             name: true,
//             symbol: true,
//         },
//         where: {
//             id: {
//                 in: approvedTokensResult.map((token) => token.id),
//             },
//         },
//     })

//     const tokensToCreate = approvedTokensResult.filter((token) => !existingTokens.find((existingToken) => existingToken.id === token.id))
//     const tokensToUpdate = approvedTokensResult.filter((token) => existingTokens.find((existingToken) => existingToken.id === token.id))
//     const batchSize = 200

//     console.log(`Tokens to create: ${tokensToCreate.length}, tokens to update: ${tokensToUpdate.length}`)

//     for (let i = 0; i < tokensToCreate.length; i += batchSize) {
//         const batch = tokensToCreate.slice(i, i + batchSize)

//           const tokensCreated = await previewClient.token.createMany({
//             data: batch,
//           })

//         console.log(`LOAD - ${tokensCreated.count} tokens created.`)
//     }

//     let updateTokenCount = 0
//     for (let i = 0; i < tokensToUpdate.length; i += batchSize) {
//       const batch = tokensToUpdate.slice(i, i + batchSize)
//       const batchToUpdate = batch.map((token) =>
//         previewClient.token.update({
//           where: {
//             id: token.id,
//           },
//           data: {
//             status: 'APPROVED',
//             name: token.name,
//             symbol: token.symbol,
//             isFeeOnTransfer: token.isFeeOnTransfer,
//             isCommon: token.isCommon,
//           },
//         })
//       )
//       const tokensUpdated = await Promise.allSettled(batchToUpdate)

//       console.log(`LOAD - ${tokensUpdated.length} tokens updated.`)
//       updateTokenCount += tokensUpdated.length
//     }
//     console.log(`LOAD - COMPLETE, ${updateTokenCount} tokens updated.`)
//   }
//   whitelistTokens2()
