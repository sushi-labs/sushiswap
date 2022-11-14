import { PrismaClient } from '@prisma/client'
import { ChainId } from '@sushiswap/chain'
import { Block, getBuiltGraphSDK as graphClientSdk, Pair } from '@sushiswap/graph-client'
import { TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config'
import { PairMinimal, updatePoolsWithVolumeAndFee } from './entity/pool'

const client = new PrismaClient()

async function main() {
  const startTime = performance.now()
  console.log('EXTRACT: Extracting pool data')

  // EXTRACT
  const { pairs, pairs1d, pairs1w } = await extract()
  // const test = 
  console.log(`EXTRACT: extracted 
  pairs(${pairs.map(p => p.responses?.length ?? 0).reduce((total, p) => total + p, 0)}) 
  pairs1d(${pairs1d.map(p => p.responses?.length ?? 0).reduce((total, p) => total + p, 0)})
  pairs1w(${pairs1w.map(p => p.responses?.length ?? 0).reduce((total, p) => total + p, 0)})`)

  // TRANSFORM
  const transformed = transform(pairs, pairs1d, pairs1w)

  // LOAD
  await updatePoolsWithVolumeAndFee(client, transformed)

  const endTime = performance.now()
  console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
}

async function extract() {
  const graphClient = graphClientSdk()
  const [{ oneDayBlocks }, { oneWeekBlocks }] = await Promise.all([
    graphClient.OneDayBlocks({ chainIds: SUSHISWAP_CHAINS }),
    graphClient.OneWeekBlocks({ chainIds: SUSHISWAP_CHAINS }),
  ])

  const pairs = await extractPairs()
  const pairs1d = await extractPairs(oneDayBlocks)
  const pairs1w = await extractPairs(oneWeekBlocks)
  return { pairs, pairs1d, pairs1w }
}

async function extractPairs(blocks?: Pick<Block, 'number' | 'id' | 'timestamp' | 'chainId'>[]) {
  const legacyRequests = SUSHISWAP_CHAINS.map((chainId) => {
    const blockNumber = blocks ? Number(blocks.find((block) => block.chainId === chainId)?.number) : undefined
    const requests = createQuery(chainId, GRAPH_HOST[chainId], EXCHANGE_SUBGRAPH_NAME[chainId], blockNumber)
    return { chainId, requests }
  })
  const tridentRequests = TRIDENT_CHAINS.map((chainId) => {
    const _chainId = chainId as typeof TRIDENT_ENABLED_NETWORKS[number]
    const blockNumber = blocks ? Number(blocks.find((block) => block.chainId === chainId)?.number) : undefined
    const requests = createQuery(chainId, GRAPH_HOST[chainId], TRIDENT_SUBGRAPH_NAME[_chainId], blockNumber)
    return { chainId, requests }
  })
  // OLD TRIDENT POLYGON
  const firstPolygonTrident = [ChainId.POLYGON].map((chainId) => {
    const blockNumber = blocks ? Number(blocks.find((block) => block.chainId === chainId)?.number) : undefined
    const requests = createQuery(chainId, GRAPH_HOST[chainId], 'sushi-0m/trident-polygon', blockNumber)
    return { chainId, requests }
  })

  return await Promise.all(
    [...legacyRequests, ...tridentRequests, ...firstPolygonTrident].map((request) =>
      Promise.resolve(request.requests).then((response) => {
        const responses = response?.pairs.filter((d) => d !== undefined).flat()
        return { chainId: request.chainId, responses }
      })
    )
  )
}

export function createQuery(chainId: ChainId, host: string, subgraphName: string, blockNumber?: number) {
  const sdk = getBuiltGraphSDK({ chainId, host, name: subgraphName })
  return blockNumber
    ? sdk.PairsVolumeFee({ block: { number: blockNumber }, where: { volumeUSD_gt: 0 } }).catch((e) => {
        console.log(`Error: ${chainId} host: ${host}, subgraph: ${subgraphName}, MESSAGE: ${e.message}`)
        return undefined
      })
    : sdk.PairsVolumeFee({ where: { volumeUSD_gt: 0 } }).catch((e) => {
        console.log(`Error: ${chainId} host: ${host}, subgraph: ${subgraphName}, MESSAGE: ${e.message}`)
        return undefined
      })
}

function transform(
  pairs: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'feesUSD'>[] | undefined
  }[],
  pairs1d: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'feesUSD'>[] | undefined
  }[],
  pairs1w: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'feesUSD'>[] | undefined
  }[]
) {
  const pairMap = pairs?.reduce<Record<string, { volumeUSD: string; feesUSD: string }>>((acc, result) => {
    if (result) {
      const { chainId, responses } = result
      if (responses) {
        responses.forEach((pair) => {
          acc[chainId.toString().concat('_').concat(pair.id)] = {
            volumeUSD: pair.volumeUSD,
            feesUSD: pair.feesUSD,
          }
        })
      }
    }
    return acc
  }, {})

  const pair1dMap = pairs1d?.reduce<Record<string, { volumeUSD: string; feesUSD: string }>>((acc, result) => {
    if (result) {
      const { chainId, responses } = result
      if (responses) {
        responses.forEach((pair) => {
          acc[chainId.toString().concat('_').concat(pair.id)] = {
            volumeUSD: pair.volumeUSD,
            feesUSD: pair.feesUSD,
          }
        })
      }
    }
    return acc
  }, {})

  const pair1wMap = pairs1w?.reduce<Record<string, { volumeUSD: string; feesUSD: string }>>((acc, result) => {
    if (result) {
      const { chainId, responses } = result
      if (responses) {
        responses.forEach((pair) => {
          acc[chainId.toString().concat('_').concat(pair.id)] = {
            volumeUSD: pair.volumeUSD,
            feesUSD: pair.feesUSD,
          }
        })
      }
    }
    return acc
  }, {})

  const transformedPairs = Object.entries(pairMap)
    .map(([id, pair]) => {
      // TODO: null check for these?
      const pair1d = pair1dMap[id]
      const pair1w = pair1wMap[id]
      return transformPair(id, pair, pair1d, pair1w)
    })
    .filter((d) => d !== undefined) as PairMinimal[]
  return transformedPairs
}

export function transformPair(
  id: string,
  pair: { volumeUSD: string; feesUSD: string },
  pair1d: { volumeUSD: string; feesUSD: string },
  pair1w: { volumeUSD: string; feesUSD: string }
): PairMinimal | undefined {
  if (!pair.volumeUSD && !pair.feesUSD) {
    return undefined
  }
  const volume1d = pair1d ? Number(pair.volumeUSD) - Number(pair1d.volumeUSD) : Number(pair.volumeUSD)
  const volume1w = pair1w ? Number(pair.volumeUSD) - Number(pair1w.volumeUSD) : Number(pair.volumeUSD)
  const fees1d = pair1d ? Number(pair.feesUSD) - Number(pair1d.feesUSD) : Number(pair.feesUSD)
  const fees1w = pair1w ? Number(pair.feesUSD) - Number(pair1w.feesUSD) : Number(pair.feesUSD)

  return {
    id,
    volume1d,
    volume1w,
    fees1d,
    fees1w,
  }
}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })
