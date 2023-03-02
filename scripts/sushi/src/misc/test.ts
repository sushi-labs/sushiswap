// import {Prisma, PrismaClient} from '@sushiswap/database'
// import { ChainId, chainName } from '@sushiswap/chain'
// import { performance } from 'perf_hooks'

//

// export async function test() {
//   try {
//     const startTime = performance.now()
//     const pools = await client.pool.findMany({
//       take: 10000,
//       select: {
//         id: true,
//       },
//       where: {
//         chainId: 1,
//         protocol: 'UniSwap',
//       },
//     })
//     const results = [pools].flat()
//     let cursor = pools.length == 10000 ? pools[pools.length - 1].id : null
//     while (cursor != null) {
//       const result = await client.pool.findMany({
//         take: 10000,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         select: {
//           id: true,
//         },
//         where: {
//           chainId: 1,
//           protocol: 'UniSwap',
//         },
//       })
//       results.push(...result)
//       cursor = result.length == 10000 ? result[result.length - 1].id : null
//     }
//     console.log(results.length)

//     const batchSize = 250
//     let updatedCount = 0

//     for (let i = 0; i < results.length; i += batchSize) {
//       const batch = results.slice(i, i + batchSize)
//       const requests = batch.map((pool) => {
//         return client.pool.update({
//           select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
//           where: { id: pool.id },
//           data: {
//             protocol: "Uniswap",
//           },
//         })
//       })
//       const responses = await Promise.all(requests)
//       console.log(`BATCH: Updated ${responses.length} pools.`)
//       updatedCount += responses.length
//     }
//     console.log({updatedCount})

//     const endTime = performance.now()
//     console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
//   } catch (e) {
//     console.error(e)
//     await client.$disconnect()
//   } finally {
//     await client.$disconnect()
//   }
// }

// test()
