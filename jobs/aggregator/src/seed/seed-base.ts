// import {
//   getBuiltGraphSDK,
//   getSdk,
//   MessariPairsQuery,
//   PairsQuery,
//   PCSPairsQuery,
//   Sdk,
//   TraderJoePairsQuery,
//   V2PairsQuery,
//   V3PairsQuery,
//   PairsQueryVariables,
//   V2PairsQueryVariables,
//   V3PairsQueryVariables,
//   PCSPairsQueryVariables,
//   TraderJoePairsQueryVariables,
//   MessariPairsQueryVariables,
//   Pair,
// } from '.graphclient/index.js'
// import { ChainId, chainName } from '@sushiswap/chain'
// import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
// import { performance } from 'perf_hooks'
// import { PoolType, ProtocolName, ProtocolVersion } from 'src/config.js'
// import { isProtocolExisting } from 'src/etl/pool/load.js'

// // import { getBuiltGraphSDK, V2PairsQuery } from '../../../../.graphclient/index.js'
// // import { PoolType, ProtocolName, ProtocolVersion } from '../../../config.js'
// // import { createPools, isProtocolExisting } from '../../../etl/pool/load.js'
// // import { createTokens } from '../../../etl/token/load.js'
// // import { GRAPH_HOST, QUICKSWAP_SUBGRAPH_NAME, QUICKSWAP_SUPPORTED_CHAINS } from '../config.js'

// // const PROTOCOL = ProtocolName.QUICKSWAP
// // const VERSION = ProtocolVersion.V2
// // const CONSTANT_PRODUCT_POOL = PoolType.CONSTANT_PRODUCT_POOL
// // const SWAP_FEE = 0.003
// // const TWAP_ENABLED = true
// // const LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID: Map<ChainId, NewestPool> = new Map()

// export interface NewestPool {
//   address: string
//   timestamp: number
// }

// export interface OptionalPoolConfiguration {
//   type: PoolType
//   swapFee: number
//   twapEnabled: boolean
// }

// export enum SchemaType {
//   SushiSwap = 'SushiSwap',
//   UniswapV2 = 'UniswapV2',
//   UniswapV3 = 'UniswapV3',
//   PancakeSwap = 'PancakeSwap',
//   TraderJoe = 'TraderJoe',
//   Messari = 'Messari',
// }

// export interface SeedConfiguration {
//   supportedChains: ChainId[]
//   subgraphs: Map<ChainId, string>
//   graphHost: Map<ChainId, string>
//   schema: SchemaType
//   protocol: ProtocolName
//   version: ProtocolVersion
//   poolConfiguration?: OptionalPoolConfiguration
//   newestPool?: NewestPool
//   // TODO: dry run?
//   // TODO: initial run?
// }

// function logPrefix(config: SeedConfiguration) {
//   return `${config.protocol} ${config.version}`
// }

// export async function seed(config: SeedConfiguration) {
//   const client = await createClient()
//   try {
//     const startTime = performance.now()
//     console.log(`${logPrefix(config)} - STARTING...`)

//     await start(client, config)

//     const endTime = performance.now()
//     console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds.`)
//   } catch (e) {
//     console.error(e)
//     await client.$disconnect()
//   } finally {
//     await client.$disconnect()
//   }
// }

// /**
//  * NOTE: This should not run as a job the first time. It should be run manually to seed the database, compare the count with subgraph pair count to verify everything is correct.
//  * This function handles three different cases:
//  * 1. If there are no pools in the database, it will fetch all pools from the subgraph and insert them into the database.
//  * 2. If there are pools in the database, it will fetch 1000 pools from the subgraph, check if they exist in the database, and insert them if they don't. Then save the last created pool timestamp in memory.
//  * 3. Continue from the previous state, step 2. There's now a timestamp to compare against, so we can fetch pools from the subgraph that are newer than the timestamp.
//  * @param client
//  */
// async function start(client: PrismaClient, config: SeedConfiguration) {
//   const { supportedChains, subgraphs, graphHost, schema, protocol, version, poolConfiguration, newestPool } = config
//   const networks = supportedChains.map((chainId) => chainName[chainId]).join(', ')
//   console.log(`${logPrefix(config)} Fetching pools for the follwoing networks: ${networks}`)

//   //   let totalPairCount = 0
//   for (const chainId of supportedChains) {
//     // const hasPools = await isProtocolExisting(client, chainId, protocol, version) // TODO: fix initial run
//     const name = subgraphs.get(chainId)
//     const host = graphHost.get(chainId)
//     if (!name || !host) {
//       console.log(`${logPrefix(config)} Subgraph not found for ${chainId}, host or name is missing.`)
//       continue
//     }
//     const sdk = getBuiltGraphSDK({ chainId, host, name: name })

//     console.log(`Loading data from chain: ${chainName[chainId]}(${chainId}), ${host}/${name}`)

//     if (newestPool) {
//       try {
//         let query = {
//           first: 1000,
//           where: {
//             createdAtTimestamp_gt: newestPool.timestamp,
//           },
//           orderBy: 'createdAtTimestamp',
//           orderDirection: 'desc',
//         }
//         const { result, newestPool: subgraphNewestPool } = await getPools(sdk, schema, query)

//         const { tokens, pools } = transform(chainId, config, result)
//         // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
//       } catch (e: any) {
//         console.warn({ e })
//       }

//       if (request.V2_pairs.length) {
//         LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
//           address: request.V2_pairs[0].id,
//           timestamp: request.V2_pairs[0].createdAtTimestamp,
//         })
//         try {
//           // const { tokens, pools } = transform(chainId, request)
//           // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
//           const latestPool = request.V2_pairs.length ? request.V2_pairs?.[0] : undefined
//           if (latestPool) {
//             LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
//               address: latestPool.id,
//               timestamp: latestPool.createdAtTimestamp,
//             })
//             console.log(
//               `${PROTOCOL} ${VERSION} Newest pool saved in memory: ${latestPool.id}, timestamp: ${latestPool.createdAtTimestamp}.`
//             )
//           } else {
//             console.log(
//               `${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`
//             )
//           }
//         } catch (e: any) {
//           console.log({ e })
//         }
//       } else {
//         console.log(
//           `${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`
//         )
//       }
//     }
//   }

//   //     //   const newestPool = LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(chainId)
//   //       if (!newestPool) {
//   //         console.log(`${logPrefix(config)} no last pool in memory, begin fetching 1000 pools to find which one was the last created, then check if any pools are missing in db.`)
//   //         query = {
//   //           first: 1000,
//   //           orderBy: 'createdAtTimestamp',
//   //           orderDirection: 'desc',
//   //         }
//   //         let request: V2PairsQuery | undefined = undefined
//   //         try {
//   //           request = await sdk.V2Pairs(query)
//   //         } catch (e: any) {
//   //           console.log({ e })
//   //         }

//   //         if (!request) {
//   //           console.warn(
//   //             `UNEXPECTED STATE, ${PROTOCOL} ${VERSION} no pools found, but db has pools, the subgraph should have pools. Subgraph not responding?`
//   //           )
//   //           return
//   //         }

//   //         const latestPool = request.V2_pairs.length ? request.V2_pairs?.[0] : undefined
//   //         if (latestPool) {
//   //           LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
//   //             address: latestPool.id,
//   //             timestamp: latestPool.createdAtTimestamp,
//   //           })
//   //           console.log(
//   //             `${PROTOCOL} ${VERSION} Newest pool saved in memory: ${latestPool.id}, timestamp: ${latestPool.createdAtTimestamp}.`
//   //           )
//   //         }

//   //         // const { tokens, pools } = transform(chainId, request)
//   //         // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
//   //       } else {
//   //         query = {
//   //           first: 1000,
//   //           where: {
//   //             createdAtTimestamp_gt: newestPool.timestamp,
//   //           },
//   //           orderBy: 'createdAtTimestamp',
//   //           orderDirection: 'desc',
//   //         }
//   //         let request: V2PairsQuery | undefined = undefined
//   //         try {
//   //           request = await sdk.V2Pairs(query)
//   //         } catch (e: any) {
//   //           console.log({ e })
//   //         }
//   //         if (request.V2_pairs.length) {
//   //           LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
//   //             address: request.V2_pairs[0].id,
//   //             timestamp: request.V2_pairs[0].createdAtTimestamp,
//   //           })
//   //           try {
//   //             // const { tokens, pools } = transform(chainId, request)
//   //             // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
//   //             const latestPool = request.V2_pairs.length ? request.V2_pairs?.[0] : undefined
//   //             if (latestPool) {
//   //               LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
//   //                 address: latestPool.id,
//   //                 timestamp: latestPool.createdAtTimestamp,
//   //               })
//   //               console.log(
//   //                 `${PROTOCOL} ${VERSION} Newest pool saved in memory: ${latestPool.id}, timestamp: ${latestPool.createdAtTimestamp}.`
//   //               )
//   //             } else {
//   //               console.log(
//   //                 `${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`
//   //               )
//   //             }
//   //           } catch (e: any) {
//   //             console.log({ e })
//   //           }
//   //         } else {
//   //           console.log(
//   //             `${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`
//   //           )
//   //         }
//   //       }
//   //     // }
//   //     console.log(
//   //       `Finished loading pairs from ${GRAPH_HOST[chainId]}/${QUICKSWAP_SUBGRAPH_NAME[chainId]}, ${pairCount} pairs`
//   //     )
//   //   }
//   //   console.log(`Finished loading pairs for ${PROTOCOL} from all subgraphs, ${totalPairCount} pairs`)
// }

// // TODO: fortsatt hara, query type?
// async function getPools(
//   sdk: Sdk,
//   schema: SchemaType,
//   query:
//     | PairsQueryVariables
//     | V2PairsQueryVariables
//     | V3PairsQueryVariables
//     | PCSPairsQueryVariables
//     | TraderJoePairsQueryVariables
//     | MessariPairsQueryVariables
// ) {
//   if (schema === SchemaType.SushiSwap) {
//     const result = await sdk.Pairs(query as PairsQueryVariables)
//     const newestPool = result.pairs.length
//       ? ({ address: result.pairs[0].id, timestamp: Number(result.pairs[0].createdAtTimestamp) } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else if (schema === SchemaType.UniswapV2) {
//     const result = await sdk.V2Pairs(query as V2PairsQueryVariables)
//     const newestPool = result.V2_pairs.length
//       ? ({ address: result.V2_pairs[0].id, timestamp: Number(result.V2_pairs[0].createdAtTimestamp) } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else if (schema === SchemaType.UniswapV3) {
//     const result = await sdk.V3Pairs(query as V3PairsQueryVariables)
//     const newestPool = result.V3_pools.length
//       ? ({ address: result.V3_pools[0].id, timestamp: Number(result.V3_pools[0].createdAtTimestamp) } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else if (schema === SchemaType.PancakeSwap) {
//     const result = await sdk.PCSPairs(query as PCSPairsQueryVariables)
//     const newestPool = result.MINIMAL_pairs.length
//       ? ({
//           address: result.MINIMAL_pairs[0].id,
//           timestamp: Number(result.MINIMAL_pairs[0].createdAtTimestamp),
//         } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else if (schema === SchemaType.TraderJoe) {
//     const result = await sdk.TraderJoePairs(query as TraderJoePairsQueryVariables)
//     const newestPool = result.TJ_pairs.length
//       ? ({ address: result.TJ_pairs[0].id, timestamp: Number(result.TJ_pairs[0].createdAtTimestamp) } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else if (schema === SchemaType.Messari) {
//     const result = await sdk.MessariPairs(query as MessariPairsQueryVariables)
//     const newestPool = result.MESSARI_liquidityPools.length
//       ? ({
//           address: result.MESSARI_liquidityPools[0].id,
//           timestamp: Number(result.MESSARI_liquidityPools[0].createdAtTimestamp),
//         } as NewestPool)
//       : undefined
//     return { result, newestPool }
//   } else {
//     throw new Error('Unknown schema type, SDK does not support this. Should be unreachable code.')
//   }
// }

// function transform(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: PairsQuery | V2PairsQuery | V3PairsQuery | PCSPairsQuery | TraderJoePairsQuery | MessariPairsQuery
// ) {
//   const schema = config.schema

//   if (schema === SchemaType.SushiSwap) {
//     return transformSushi(chainId, config, data as PairsQuery)
//   } else if (schema === SchemaType.Messari) {
//     return transformMessari(chainId, config, data as MessariPairsQuery)
//   } else if (schema === SchemaType.UniswapV2) {
//     return transformUniswapV2(chainId, config, data as V2PairsQuery)
//   }
//   // else if (schema === SchemaType.UniswapV3) {

//   // }
//   else if (schema === SchemaType.PancakeSwap) {
//     return transformPancakeSwap(chainId, config, data as PCSPairsQuery)
//   } else if (schema === SchemaType.TraderJoe) {
//     return transformTraderJoe(chainId, config, data as TraderJoePairsQuery)
//   } else {
//     throw new Error(`${logPrefix(config)} Unsupported schema.`)
//   }
// }

// function transformSushi(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: PairsQuery
// ): {
//   pools: Prisma.PoolCreateManyInput[]
//   tokens: Prisma.TokenCreateManyInput[]
// } {
//   const { protocol } = config
//   const tokens: Prisma.TokenCreateManyInput[] = []
//   const uniqueTokens: Set<string> = new Set()
//   const poolsTransformed = data.pairs.map((pair) => {
//     if (!uniqueTokens.has(pair.token0.id)) {
//       uniqueTokens.add(pair.token0.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token0.id),
//           address: pair.token0.id,
//           chainId,
//           name: pair.token0.name,
//           symbol: pair.token0.symbol,
//           decimals: Number(pair.token0.decimals),
//         })
//       )
//     }
//     if (!uniqueTokens.has(pair.token1.id)) {
//       uniqueTokens.add(pair.token1.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token1.id),
//           address: pair.token1.id,
//           chainId: chainId,
//           name: pair.token1.name,
//           symbol: pair.token1.symbol,
//           decimals: Number(pair.token1.decimals),
//         })
//       )
//     }

//     const regex = /([^\w ]|_|-)/g
//     const name = pair.token0.symbol
//       .replace(regex, '')
//       .slice(0, 15)
//       .concat('-')
//       .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
//     return Prisma.validator<Prisma.PoolCreateManyInput>()({
//       id: chainId.toString().concat(':').concat(pair.id),
//       address: pair.id,
//       name,
//       protocol,
//       version: pair.source,
//       type: pair.type,
//       chainId,
//       swapFee: Number(pair.swapFee) / 10000,
//       twapEnabled: pair.twapEnabled,
//       token0Id: chainId.toString().concat(':').concat(pair.token0.id),
//       token1Id: chainId.toString().concat(':').concat(pair.token1.id),
//       liquidityUSD: 0,
//     })
//   })

//   return { pools: poolsTransformed, tokens }
// }

// function transformMessari(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: MessariPairsQuery
// ): {
//   pools: Prisma.PoolCreateManyInput[]
//   tokens: Prisma.TokenCreateManyInput[]
// } {
//   const { protocol, version } = config
//   const type = config.poolConfiguration?.type
//   const swapFee = config.poolConfiguration?.swapFee
//   const twapEnabled = config.poolConfiguration?.twapEnabled
//   if (!type || !swapFee || !twapEnabled) {
//     throw new Error(
//       `${logPrefix(
//         config
//       )} - ERROR: Pool type, swap fee and twapEnabled are all required when transforming pools using schema: ${
//         config.schema
//       }.`
//     )
//   }

//   const tokens: Prisma.TokenCreateManyInput[] = []
//   const uniqueTokens: Set<string> = new Set()
//   const poolsTransformed = data.MESSARI_liquidityPools.map((pair) => {
//     if (!uniqueTokens.has(pair.inputTokens[0].id)) {
//       uniqueTokens.add(pair.inputTokens[0].id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.inputTokens[0].id),
//           address: pair.inputTokens[0].id,
//           chainId,
//           name: pair.inputTokens[0].name,
//           symbol: pair.inputTokens[0].symbol,
//           decimals: Number(pair.inputTokens[0].decimals),
//         })
//       )
//     }
//     if (!uniqueTokens.has(pair.inputTokens[1].id)) {
//       uniqueTokens.add(pair.inputTokens[1].id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.inputTokens[1].id),
//           address: pair.inputTokens[1].id,
//           chainId: chainId,
//           name: pair.inputTokens[1].name,
//           symbol: pair.inputTokens[1].symbol,
//           decimals: Number(pair.inputTokens[1].decimals),
//         })
//       )
//     }

//     const regex = /([^\w ]|_|-)/g
//     const name = pair.inputTokens[0].symbol
//       .replace(regex, '')
//       .slice(0, 15)
//       .concat('-')
//       .concat(pair.inputTokens[1].symbol.replace(regex, '').slice(0, 15))
//     return Prisma.validator<Prisma.PoolCreateManyInput>()({
//       id: chainId.toString().concat(':').concat(pair.id),
//       address: pair.id,
//       name,
//       protocol,
//       version,
//       type,
//       chainId,
//       swapFee,
//       twapEnabled,
//       token0Id: chainId.toString().concat(':').concat(pair.inputTokens[0].id),
//       token1Id: chainId.toString().concat(':').concat(pair.inputTokens[1].id),
//       liquidityUSD: 0,
//     })
//   })

//   return { pools: poolsTransformed, tokens }
// }

// function transformUniswapV2(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: V2PairsQuery
// ): {
//   pools: Prisma.PoolCreateManyInput[]
//   tokens: Prisma.TokenCreateManyInput[]
// } {
//   const { protocol, version } = config
//   const type = config.poolConfiguration?.type
//   const swapFee = config.poolConfiguration?.swapFee
//   const twapEnabled = config.poolConfiguration?.twapEnabled
//   if (!type || !swapFee || !twapEnabled) {
//     throw new Error(
//       `${logPrefix(
//         config
//       )} - ERROR: Pool type, swap fee and twapEnabled are all required when transforming pools using schema: ${
//         config.schema
//       }.`
//     )
//   }
//   const tokens: Prisma.TokenCreateManyInput[] = []
//   const uniqueTokens: Set<string> = new Set()

//   const poolsTransformed = data.V2_pairs.map((pair) => {
//     if (!uniqueTokens.has(pair.token0.id)) {
//       uniqueTokens.add(pair.token0.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token0.id),
//           address: pair.token0.id,
//           chainId,
//           name: pair.token0.name,
//           symbol: pair.token0.symbol,
//           decimals: Number(pair.token0.decimals),
//         })
//       )
//     }
//     if (!uniqueTokens.has(pair.token1.id)) {
//       uniqueTokens.add(pair.token1.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token1.id),
//           address: pair.token1.id,
//           chainId: chainId,
//           name: pair.token1.name,
//           symbol: pair.token1.symbol,
//           decimals: Number(pair.token1.decimals),
//         })
//       )
//     }

//     const regex = /([^\w ]|_|-)/g
//     const name = pair.token0.symbol
//       .replace(regex, '')
//       .slice(0, 15)
//       .concat('-')
//       .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
//     return Prisma.validator<Prisma.PoolCreateManyInput>()({
//       id: chainId.toString().concat(':').concat(pair.id),
//       address: pair.id,
//       name,
//       protocol,
//       version,
//       type,
//       chainId,
//       swapFee,
//       twapEnabled,
//       token0Id: chainId.toString().concat(':').concat(pair.token0.id),
//       token1Id: chainId.toString().concat(':').concat(pair.token1.id),
//       liquidityUSD: 0,
//     })
//   })

//   return { pools: poolsTransformed, tokens }
// }

// function transformTraderJoe(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: TraderJoePairsQuery
// ): {
//   pools: Prisma.PoolCreateManyInput[]
//   tokens: Prisma.TokenCreateManyInput[]
// } {
//   const { protocol, version } = config
//   const type = config.poolConfiguration?.type
//   const swapFee = config.poolConfiguration?.swapFee
//   const twapEnabled = config.poolConfiguration?.twapEnabled
//   if (!type || !swapFee || !twapEnabled) {
//     throw new Error(
//       `${logPrefix(
//         config
//       )} - ERROR: Pool type, swap fee and twapEnabled are all required when transforming pools using schema: ${
//         config.schema
//       }.`
//     )
//   }
//   const tokens: Prisma.TokenCreateManyInput[] = []
//   const uniqueTokens: Set<string> = new Set()
//   const poolsTransformed = data.TJ_pairs.map((pair) => {
//     if (!uniqueTokens.has(pair.token0.id)) {
//       uniqueTokens.add(pair.token0.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token0.id),
//           address: pair.token0.id,
//           chainId,
//           name: pair.token0.name,
//           symbol: pair.token0.symbol,
//           decimals: Number(pair.token0.decimals),
//         })
//       )
//     }
//     if (!uniqueTokens.has(pair.token1.id)) {
//       uniqueTokens.add(pair.token1.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token1.id),
//           address: pair.token1.id,
//           chainId: chainId,
//           name: pair.token1.name,
//           symbol: pair.token1.symbol,
//           decimals: Number(pair.token1.decimals),
//         })
//       )
//     }

//     const regex = /([^\w ]|_|-)/g
//     const name = pair.token0.symbol
//       .replace(regex, '')
//       .slice(0, 15)
//       .concat('-')
//       .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
//     return Prisma.validator<Prisma.PoolCreateManyInput>()({
//       id: chainId.toString().concat(':').concat(pair.id),
//       address: pair.id,
//       name,
//       protocol,
//       version,
//       type,
//       chainId,
//       swapFee,
//       twapEnabled,
//       token0Id: chainId.toString().concat(':').concat(pair.token0.id),
//       token1Id: chainId.toString().concat(':').concat(pair.token1.id),
//       liquidityUSD: 0,
//     })
//   })

//   return { pools: poolsTransformed, tokens }
// }

// function transformPancakeSwap(
//   chainId: ChainId,
//   config: SeedConfiguration,
//   data: PCSPairsQuery
// ): {
//   pools: Prisma.PoolCreateManyInput[]
//   tokens: Prisma.TokenCreateManyInput[]
// } {
//   const { protocol, version } = config
//   const type = config.poolConfiguration?.type
//   const swapFee = config.poolConfiguration?.swapFee
//   const twapEnabled = config.poolConfiguration?.twapEnabled
//   if (!type || !swapFee || !twapEnabled) {
//     throw new Error(
//       `${logPrefix(
//         config
//       )} - ERROR: Pool type, swap fee and twapEnabled are all required when transforming pools using schema: ${
//         config.schema
//       }.`
//     )
//   }
//   const tokens: Prisma.TokenCreateManyInput[] = []
//   const uniqueTokens: Set<string> = new Set()
//   const poolsTransformed = data.MINIMAL_pairs.map((pair) => {
//     if (!uniqueTokens.has(pair.token0.id)) {
//       uniqueTokens.add(pair.token0.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token0.id),
//           address: pair.token0.id,
//           chainId,
//           name: pair.token0.name,
//           symbol: pair.token0.symbol,
//           decimals: Number(pair.token0.decimals),
//         })
//       )
//     }
//     if (!uniqueTokens.has(pair.token1.id)) {
//       uniqueTokens.add(pair.token1.id)
//       tokens.push(
//         Prisma.validator<Prisma.TokenCreateManyInput>()({
//           id: chainId.toString().concat(':').concat(pair.token1.id),
//           address: pair.token1.id,
//           chainId: chainId,
//           name: pair.token1.name,
//           symbol: pair.token1.symbol,
//           decimals: Number(pair.token1.decimals),
//         })
//       )
//     }

//     const regex = /([^\w ]|_|-)/g
//     const name = pair.token0.symbol
//       .replace(regex, '')
//       .slice(0, 15)
//       .concat('-')
//       .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
//     return Prisma.validator<Prisma.PoolCreateManyInput>()({
//       id: chainId.toString().concat(':').concat(pair.id),
//       address: pair.id,
//       name,
//       protocol,
//       version,
//       type,
//       chainId,
//       swapFee,
//       twapEnabled,
//       token0Id: chainId.toString().concat(':').concat(pair.token0.id),
//       token1Id: chainId.toString().concat(':').concat(pair.token1.id),
//       liquidityUSD: 0,
//     })
//   })

//   return { pools: poolsTransformed, tokens }
// }
