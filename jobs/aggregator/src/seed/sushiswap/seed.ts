import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, PairsQuery } from '../../../.graphclient/index.js'
import { ProtocolName } from '../../config.js'
import { createPools, getLatestPoolTimestamp } from '../../etl/pool/load.js'
import { createTokens } from '../../etl/token/load.js'
import { GRAPH_HOST, LEGACY_SUBGRAPH_NAME, SUSHISWAP_CHAINS, TRIDENT_CHAINS, TRIDENT_SUBGRAPH_NAME } from './config.js'

const PROTOCOL = ProtocolName.SUSHISWAP
const VERSIONS = ['LEGACY', 'TRIDENT']

export async function sushiSwap() {
  const client = await createClient()
  try {
    const startTime = performance.now()
    console.log(`Preparing to load pools/tokens, protocol: ${PROTOCOL}`)

    await start(client)

    const endTime = performance.now()
    console.log(`COMPLETE - Script ran for ${((endTime - startTime) / 1000).toFixed(1)} seconds. `)
  } catch (e) {
    console.error(e)
    await client.$disconnect()
  } finally {
    await client.$disconnect()
  }
}

async function start(client: PrismaClient) {
  const subgraphs = [
    TRIDENT_CHAINS.map((chainId) => {
      return { chainId, host: GRAPH_HOST[chainId], name: TRIDENT_SUBGRAPH_NAME[chainId] }
    }),
    SUSHISWAP_CHAINS.map((chainId) => {
      return { chainId, host: GRAPH_HOST[chainId], name: LEGACY_SUBGRAPH_NAME[chainId] }
    }),
  ].flat()

  const chains = Array.from(new Set(subgraphs.map((subgraph) => subgraph.chainId.toString())))
  console.log(`EXTRACT - Extracting from ${chains.length} different chains, ${chains.join(', ')}`)

  let totalPairCount = 0
  for (const subgraph of subgraphs) {
    const chainId = subgraph.chainId

    // Continue from the latest pool creation timestamp,
    // if null, then it's the first time seeding and we grab everything
    const latestPoolTimestamp = await getLatestPoolTimestamp(client, chainId, PROTOCOL, VERSIONS)

    const sdk = getBuiltGraphSDK({ chainId, host: subgraph.host, name: subgraph.name })

    console.log(`Loading data from ${subgraph.host} ${subgraph.name}`)
    let subgraphPairCount = 0
    let cursor = ''

    do {
      const startTime = performance.now()
      let where = {}
      if (latestPoolTimestamp) {
        where =
          cursor !== ''
            ? { id_gt: cursor, createdAtTimestamp_gt: latestPoolTimestamp }
            : { createdAtTimestamp_gt: latestPoolTimestamp }
      } else {
        where = cursor !== '' ? { id_gt: cursor } : {}
      }
      const request = await sdk
        .Pairs({
          first: 1000,
          where,
        })
        .catch((e: string) => {
          console.log({ e })
          return undefined
        })
        .catch(() => undefined)
      const currentResultCount = request?.pairs.length ?? 0
      const endTime = performance.now()

      subgraphPairCount += currentResultCount
      console.log(
        `EXTRACT - extracted ${currentResultCount} pools, current total: ${subgraphPairCount}, cursor: ${cursor} (${(
          (endTime - startTime) /
          1000
        ).toFixed(1)}s) `
      )

      if (request) {
        const { tokens, pools } = transform(chainId, request)
        // NOTE: This shouldn't have to be async, but was seeing this error:
        // (unlocked closed connection) (CallerID: planetscale-admin)'
        // this script doesn't have to be super fast, so keeping it async to not throttle the db
        await Promise.all([createTokens(client, tokens), createPools(client, pools)])
      }

      const newCursor = request?.pairs[request.pairs.length - 1]?.id ?? ''
      cursor = newCursor
    } while (cursor !== '')
    totalPairCount += subgraphPairCount
    console.log(`Finished loading pairs from ${subgraph.host}/${subgraph.name}, ${subgraphPairCount} pairs`)
  }
  console.log(`Finished loading pairs for ${PROTOCOL} from all subgraphs, ${totalPairCount} pairs`)
}

function transform(
  chainId: number,
  data: PairsQuery
): {
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
} {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const uniqueTokens: Set<string> = new Set()
  const poolsTransformed = data.pairs.map((pair) => {
    if (!uniqueTokens.has(pair.token0.id)) {
      uniqueTokens.add(pair.token0.id)
      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: chainId.toString().concat(':').concat(pair.token0.id),
          address: pair.token0.id,
          chainId,
          name: pair.token0.name,
          symbol: pair.token0.symbol,
          decimals: Number(pair.token0.decimals),
        })
      )
    }
    if (!uniqueTokens.has(pair.token1.id)) {
      uniqueTokens.add(pair.token1.id)
      tokens.push(
        Prisma.validator<Prisma.TokenCreateManyInput>()({
          id: chainId.toString().concat(':').concat(pair.token1.id),
          address: pair.token1.id,
          chainId,
          name: pair.token1.name,
          symbol: pair.token1.symbol,
          decimals: Number(pair.token1.decimals),
        })
      )
    }

    const regex = /([^\w ]|_|-)/g
    const name = pair.token0.symbol
      .replace(regex, '')
      .slice(0, 15)
      .concat('-')
      .concat(pair.token1.symbol.replace(regex, '').slice(0, 15))
    return Prisma.validator<Prisma.PoolCreateManyInput>()({
      id: chainId.toString().concat(':').concat(pair.id),
      address: pair.id,
      name,
      protocol: PROTOCOL,
      version: pair.source,
      type: pair.type,
      chainId,
      swapFee: Number(pair.swapFee) / 10000,
      twapEnabled: pair.twapEnabled,
      token0Id: chainId.toString().concat(':').concat(pair.token0.id),
      token1Id: chainId.toString().concat(':').concat(pair.token1.id),
      liquidityUSD: 0,
    })
  })

  return { pools: poolsTransformed, tokens }
}
