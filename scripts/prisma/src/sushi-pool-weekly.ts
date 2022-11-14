import { Prisma, PrismaClient } from '@prisma/client'
import { ChainId, chainIds, chainName, chainShortName } from '@sushiswap/chain'
import { SUSHISWAP_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { request } from 'http'
import { performance } from 'perf_hooks'
import { getBuiltGraphSDK, PairsQuery } from '../.graphclient'
import { EXCHANGE_SUBGRAPH_NAME, GRAPH_HOST, SUSHISWAP_CHAINS, TRIDENT_CHAINS } from './config'
import { mergePools } from './entity/pool/load'
import { filterPools } from './entity/pool/transform'
import { createTokens } from './entity/token/load'
import { filterTokensToCreate } from './entity/token/transform'
import {
  TwoDayBlocksQuery,
  getBuiltGraphSDK as graphClientSdk,
  Pair,
  Block,
  Block_height,
} from '@sushiswap/graph-client'
import { findBreakingChanges } from 'graphql'

const client = new PrismaClient()

const PROTOCOL = 'SushiSwap'

async function main() {
  // SUPPORTED_CHAIN_IDS
  const startTime = performance.now()

  const { pairs, pairs1d, pairs1w } = await extract()

  const transformed = transform(pairs, pairs1d, pairs1w)
  // console.log(oneDayRequests.length, pairs1w.length)
  // pairs1w.forEach((p) => console.log(p.chainId, p.data.length))
}

async function extract() {
  // console.log(
  //   `Fetching pools from sushiswap from chains: `,
  //   SUSHISWAP_CHAINS.map((chainId) => chainName[chainId]).join(', ')
  // )
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
    ? sdk.PairsVolumeLiquidity({ skip: 0, block: { number: blockNumber } }).catch((e) => {
        console.log(
          `Error: ${chainId} host: ${GRAPH_HOST[chainId]}, subgraph: ${EXCHANGE_SUBGRAPH_NAME[chainId]}, MESSAGE: ${e.message}`
        )
        return undefined
      })
    : sdk.PairsVolumeLiquidity({ skip: 0 }).catch((e) => {
        console.log(
          `Error: ${chainId} host: ${GRAPH_HOST[chainId]}, subgraph: ${EXCHANGE_SUBGRAPH_NAME[chainId]}, MESSAGE: ${e.message}`
        )
        return undefined
      })
}

async function transform(
  pairs: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>[] | undefined
  }[],
  pairs1d: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>[] | undefined
  }[],
  pairs1w: {
    chainId: ChainId
    responses: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>[] | undefined
  }[]
) {
  // const zip: Record<string, {
  //   id: number,
  //   volume1d: string,
  //   volume1w: string,
  //   fees1d,
  //   fees1w,
  // }>

  const allPairs: Record<
    string,
    {
      pairs: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>
      pairs1d: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>
      pairs1w: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>
    }
  > = {}

  pairs.forEach((pair) => {
    const { chainId, responses } = pair
    if (responses) {
      responses.forEach((response) => {
        const id = chainId.toString().concat('_').concat(response.id)
        allPairs[id].pairs = response
      })
    }
  })

  pairs1d.forEach((pair) => {
    const { chainId, responses } = pair
    if (responses) {
      responses.forEach((response) => {
        const id = chainId.toString().concat('_').concat(response.id)
        allPairs[id].pairs1d = response
      })
    }
  })

  pairs1w.forEach((pair) => {
    const { chainId, responses } = pair
    if (responses) {
      responses.forEach((response) => {
        const id = chainId.toString().concat('_').concat(response.id)
        allPairs[id].pairs1w = response
      })
    }
  })

  const transformedPairs = Object.values(allPairs).map((pair) => {
    return transformPair(pair.pairs, pair.pairs1d, pair.pairs1w)
  })
}

export function transformPair(
  pair: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>,
  pair1d: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>,
  pair1w: Pick<Pair, 'id' | 'volumeUSD' | 'liquidityUSD'>
) {
  const volume1d = pair1d ? Number(pair.volumeUSD) - Number(pair1d.volumeUSD) : Number(pair.volumeUSD)
  const volume1w = pair1w ? Number(pair.volumeUSD) - Number(pair1w.volumeUSD) : Number(pair.volumeUSD)
  const fees1d = pair1d ? Number(pair.feesUSD) - Number(pair1d.feesUSD) : Number(pair.feesUSD)
  const fees1w = pair1w ? Number(pair.feesUSD) - Number(pair1w.feesUSD) : Number(pair.feesUSD)
  return {
    id: `${pair.chainId}_${pair.id}`,
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
