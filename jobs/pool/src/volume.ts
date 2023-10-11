// import { ChainId, chainShortName } from 'sushi/chain'
// import { createClient, PoolVersion } from '@sushiswap/database'
// import {
//   SUBGRAPH_HOST,
//   SUSHISWAP_ENABLED_NETWORKS,
//   SUSHISWAP_SUBGRAPH_NAME,
//   SUSHISWAP_V3_ENABLED_NETWORKS,
//   SUSHISWAP_V3_SUBGRAPH_NAME,
//   SWAP_ENABLED_NETWORKS,
//   TRIDENT_ENABLED_NETWORKS,
//   TRIDENT_SUBGRAPH_NAME,
// } from '@sushiswap/graph-config'
// import { performance } from 'perf_hooks'

// import { Block, getBuiltGraphSDK, PairsVolumeFeeQuery, V3PoolsVolumeFeeQuery } from '../.graphclient/index.js'
// import { PoolMinimal, updatePoolsWithVolumeAndFee } from './etl/pool/index.js'

// interface SubgraphConfig {
//   chainId: ChainId
//   host: string
//   name: string
//   version: PoolVersion
// }

// interface VolumeFee {
//   id: string
//   volumeUSD: string
//   feesUSD: string
// }

// interface SubgraphResults {
//   chainId: ChainId
//   current: Map<string, VolumeFee>
//   oneDay: Map<string, VolumeFee>
//   oneWeek: Map<string, VolumeFee>
// }

// type Blocks = Pick<Block, 'number' | 'id' | 'timestamp' | 'chainId'>[]

// export async function execute() {
//   try {
//     const startTime = performance.now()
//     console.log('EXTRACT: Extracting volume data')

//     // EXTRACT
//     const volumeFee = await extract()

//     // TRANSFORM
//     const transformed = transform(volumeFee)
//     console.log(`TRANSFORM: ${transformed.length} pairs`)

//     // LOAD
//     const batchSize = 500
//     for (let i = 0; i < transformed.length; i += batchSize) {
//       const batch = transformed.slice(i, i + batchSize)
//       await updatePoolsWithVolumeAndFee(batch)
//     }
//     const endTime = performance.now()
//     console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
//   } catch (e) {
//     console.error(e)
//     await (await createClient()).$disconnect()
//   } finally {
//     await (await createClient()).$disconnect()
//   }
// }

// async function extract() {
//   const graphClientSdk = getBuiltGraphSDK()
//   const [{ oneDayBlocks }, { oneWeekBlocks }] = await Promise.all([
//     graphClientSdk.OneDayBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
//     graphClientSdk.OneWeekBlocks({ chainIds: SWAP_ENABLED_NETWORKS }),
//   ])
//   const subgraphs: SubgraphConfig[] = [
//     TRIDENT_ENABLED_NETWORKS.map((chainId) => {
//       const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
//       return {
//         chainId,
//         host: SUBGRAPH_HOST[_chainId],
//         name: TRIDENT_SUBGRAPH_NAME[_chainId],
//         version: PoolVersion.TRIDENT,
//       }
//     }),
//     SUSHISWAP_ENABLED_NETWORKS.map((chainId) => {
//       return {
//         chainId,
//         host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
//         name: SUSHISWAP_SUBGRAPH_NAME[chainId],
//         version: PoolVersion.LEGACY,
//       }
//     }),
//     SUSHISWAP_V3_ENABLED_NETWORKS.map((chainId) => ({
//       chainId,
//       host: SUBGRAPH_HOST[Number(chainId) as keyof typeof SUBGRAPH_HOST],
//       name: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
//       version: PoolVersion.V3,
//     })),
//   ].flat()

//   const results: SubgraphResults[] = []
//   for (const subgraph of subgraphs) {

//     const [current, oneDay, oneWeek] = await Promise.all([
//       fetchVolume(subgraph),
//       fetchVolume(subgraph, oneDayBlocks),
//       fetchVolume(subgraph, oneWeekBlocks)
//     ])
//     results.push({ chainId: subgraph.chainId, current, oneDay, oneWeek })
//   }

//   return results
// }

// async function fetchVolume(config: SubgraphConfig, blocks?: Blocks) {
//   const blockNumber = blocks ? Number(blocks.find((block) => block.chainId === config.chainId)?.number) : undefined
//   if (config.version === PoolVersion.LEGACY || config.version === PoolVersion.TRIDENT) {
//     return await fetchLegacyOrTridentPairs(config, blockNumber)
//   } else if (config.version === PoolVersion.V3) {
//     return await fetchV3Pools(config, blockNumber)
//   } else {
//     console.warn('fetchPairs: config.version is not LEGACY or TRIDENT or V3, skipping')
//   }
// }

// async function fetchLegacyOrTridentPairs(config: SubgraphConfig, blockNumber?: number) {
//   const chainId = config.chainId
//   const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
//   console.log(`Loading data from ${config.host} ${config.name}`)
//   let cursor = ''
//   const data: PairsVolumeFeeQuery[] = []
//   let count = 0
//   do {
//     const where = cursor !== '' ? { id_gt: cursor, volumeUSD_gt: 0 } : { volumeUSD_gt: 0 }
//     const block = blockNumber ? { number: blockNumber } : null
//     const request = (await sdk
//       .PairsVolumeFee({
//         first: 1000,
//         where,
//         block,
//       })
//       .catch((e: unknown) => {
//         if (e instanceof Error) {
//           console.error(e.message)
//         }
//         return undefined
//       })) as PairsVolumeFeeQuery | undefined

//     const newCursor = request?.pairs.length === 1000 ? request?.pairs[request.pairs.length - 1]?.id : ''
//     cursor = newCursor
//     count += request?.pairs.length || 0
//     if (request) {
//       data.push(request)
//     }
//   } while (cursor !== '')
//   console.log(`EXTRACT: ${config.host}/${config.name} - ${count} pairs found, block: ${blockNumber}.`)
//   const result: Map<string, VolumeFee> = new Map()
//   data.forEach((d) =>
//     d?.pairs.forEach((pair) => {
//       result.set(pair.id, { id: pair.id, volumeUSD: pair.volumeUSD, feesUSD: pair.feesUSD })
//     })
//   )

//   return result
// }

// async function fetchV3Pools(config: SubgraphConfig, blockNumber?: number) {
//   const chainId = config.chainId
//   const sdk = getBuiltGraphSDK({ chainId, host: config.host, name: config.name })
//   console.log(`Loading data from ${config.host} ${config.name}`)
//   let cursor = ''
//   const data: V3PoolsVolumeFeeQuery[] = []
//   let count = 0
//   do {
//     const where = cursor !== '' ? { id_gt: cursor, volumeUSD_gt: 0 } : { volumeUSD_gt: 0 }
//     const block = blockNumber ? { number: blockNumber } : null
//     const request = (await sdk
//       .V3PoolsVolumeFee({
//         first: 1000,
//         where,
//         block,
//       })
//       .catch((e: unknown) => {
//         if (e instanceof Error) {
//           console.error(e.message)
//         }
//         return undefined
//       })) as V3PoolsVolumeFeeQuery | undefined

//     const newCursor = request?.pools.length === 1000 ? request?.pools[request.pools.length - 1]?.id : ''
//     cursor = newCursor
//     count += request?.pools.length || 0
//     if (request) {
//       data.push(request)
//     }
//   } while (cursor !== '')
//   console.log(`EXTRACT: ${config.host}/${config.name} - ${count} pairs found.`)
//   const result: Map<string, VolumeFee> = new Map()
//   data.forEach((d) =>
//     d?.pools.forEach((pool) => {
//       result.set(pool.id, { id: pool.id, volumeUSD: pool.volumeUSD, feesUSD: pool.feesUSD })
//     })
//   )
//   return result
// }

// export function createQuery(chainId: ChainId, host: string, subgraphName: string, blockNumber?: number) {
//   const sdk = getBuiltGraphSDK({ chainId, host, name: subgraphName })
//   return blockNumber
//     ? (sdk.PairsVolumeFee({ block: { number: blockNumber }, where: { volumeUSD_gt: 0 } }).catch((e) => {
//         console.error(`Error: ${chainId} host: ${host}, subgraph: ${subgraphName}, MESSAGE: ${e.message}`)
//         return undefined
//       }) as Promise<PairsVolumeFeeQuery> | undefined)
//     : (sdk.PairsVolumeFee({ where: { volumeUSD_gt: 0 } }).catch((e) => {
//         console.error(`Error: ${chainId} host: ${host}, subgraph: ${subgraphName}, MESSAGE: ${e.message}`)
//         return undefined
//       }) as Promise<PairsVolumeFeeQuery> | undefined)
// }

// function transform(
//   data: SubgraphResults[]
// ) {
//   const minimals: PoolMinimal[] = []

//   data.forEach((d) => {
//     const { chainId, current, oneDay, oneWeek } = d
//     current.forEach((pair) => {
//       const pair1d = oneDay.get(pair.id)
//       const pair1w = oneWeek.get(pair.id)

//       const volume1d = pair1d ? Number(pair.volumeUSD) - Number(pair1d.volumeUSD) : Number(pair.volumeUSD)
//       const volume1w = pair1w ? Number(pair.volumeUSD) - Number(pair1w.volumeUSD) : Number(pair.volumeUSD)
//       const fees1d = pair1d ? Number(pair.feesUSD) - Number(pair1d.feesUSD) : Number(pair.feesUSD)
//       const fees1w = pair1w ? Number(pair.feesUSD) - Number(pair1w.feesUSD) : Number(pair.feesUSD)

//       minimals.push({
//         id: chainId.toString().concat(':').concat(pair.id),
//         volume1d,
//         volume1w,
//         fees1d,
//         fees1w,
//       })
//     })
//   })
//   return minimals

// }
