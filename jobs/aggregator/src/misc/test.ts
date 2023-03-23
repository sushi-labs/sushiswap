// import {createClient, Prisma, PrismaClient} from '@sushiswap/database'
// import { ChainId, chainName } from '@sushiswap/chain'
// import { performance } from 'perf_hooks'
// import { ProtocolName } from '../config.js'



// export async function test() {
//   const client = await createClient()
//   try {
//     const startTime = performance.now()
//     const pools = await client.pool.findMany({
//       take: 10000,
//       select: {
//         id: true,
//       },
//       where: {
//         chainId: 100,
//         protocol: 'UbeSwap',
//       },
//     })
//     console.log(pools.length)

//     // const batchSize = 250
//     // let updatedCount = 0

//     // for (let i = 0; i < pools.length; i += batchSize) {
//     //   const batch = pools.slice(i, i + batchSize)
//     //   const requests = batch.map((pool) => {
//     //     return client.pool.update({
//     //       select: { id: true }, // select only the `id` field, otherwise it returns everything and we don't use the data after updating.
//     //       where: { id: pool.id },
//     //       data: {
//     //         protocol: ProtocolName.HONEYSWAP,
//     //       },
//     //     })
//     //   })
//     //   const responses = await Promise.all(requests)
//     //   console.log(`BATCH: Updated ${responses.length} pools.`)
//     //   updatedCount += responses.length
//     // }
//     // console.log({updatedCount})

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
