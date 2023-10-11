// import { createClient, Prisma } from '@sushiswap/database'
// import { ChainId, chainName } from 'sushi/chain'
// import { performance } from 'perf_hooks'

//

// export async function test() {
//   try {
//     const startTime = performance.now()
//     const client = await createClient()
//     const incentives = await client.incentive.findMany({
//       select: {
//         id: true,
//         type: true,
//       },
//     })
//     console.log(incentives.length)

//     const batchSize = 250
//     let updatedCount = 0

//     for (let i = 0; i < incentives.length; i += batchSize) {
//       const batch = incentives.slice(i, i + batchSize)
//       const requests = batch.map((incentive) => {
//         return client.incentive.update({
//           select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
//           where: { id: incentive.id },
//           data: {
//             chefType: incentive.type,
//           },
//         })
//       })
//       const responses = await Promise.all(requests)
//       console.log(`BATCH: Updated ${responses.length}/${incentives.length} pools.`)
//       updatedCount += responses.length
//     }
//     console.log({updatedCount})

//     const endTime = performance.now()
//     console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
//   } catch (e) {
//     console.error(e)
//     await (await createClient()).$disconnect()
//   } finally {
//     await (await createClient()).$disconnect()
//   }
// }

// test()
