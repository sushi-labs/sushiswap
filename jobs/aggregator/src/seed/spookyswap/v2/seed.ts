import { chainName } from '@sushiswap/chain'
import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, TraderJoePairsQuery } from '../../../../.graphclient/index.js'
import { PoolType, ProtocolName, ProtocolVersion } from '../../../config.js'
import { createPools, getLatestPoolTimestamp } from '../../../etl/pool/load.js'
import { createTokens } from '../../../etl/token/load.js'
import { GRAPH_HOST, SPOOKYSWAP_V2_SUBGRAPH_NAME, SPOOKYSWAP_V2_SUPPORTED_CHAINS } from '../config.js'

const PROTOCOL = ProtocolName.SPOOKYSWAP
const VERSION = ProtocolVersion.V2
const CONSTANT_PRODUCT_POOL = PoolType.CONSTANT_PRODUCT_POOL
const SWAP_FEE = 0.002
const TWAP_ENABLED = true

export async function spookySwapV2() {
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
  console.log(
    `Fetching pools from ${PROTOCOL} ${VERSION}, chains: ${SPOOKYSWAP_V2_SUPPORTED_CHAINS.map(
      (chainId) => chainName[chainId]
    ).join(', ')}`
  )

  let totalPairCount = 0
  for (const chainId of SPOOKYSWAP_V2_SUPPORTED_CHAINS) {
    // Continue from the latest pool creation timestamp,
    // if null, then it's the first time seeding and we grab everything
    const latestPoolTimestamp = await getLatestPoolTimestamp(client, chainId, PROTOCOL, [VERSION])

    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId] })
    if (!SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId]) {
      console.log(`Subgraph not found: ${chainId} ${SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId]}, Skipping`)
      continue
    }
    console.log(`Loading data from chain: ${chainName[chainId]}(${chainId}), ${SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId]}`)
    let pairCount = 0
    let cursor = ''

    do {
      const startTime = performance.now()
      let where = {}
      if (latestPoolTimestamp) {
        where =
          cursor !== '' ? { id_gt: cursor, timestamp_gt: latestPoolTimestamp } : { timestamp_gt: latestPoolTimestamp }
      } else {
        where = cursor !== '' ? { id_gt: cursor } : {}
      }
      const request = await sdk
        .TraderJoePairs({
          first: 1000,
          where,
        })
        .catch((e: string) => {
          console.log({ e })
          return undefined
        })
        .catch(() => undefined)
      const currentResultCount = request?.TJ_pairs.length ?? 0
      const endTime = performance.now()

      pairCount += currentResultCount
      console.log(
        `EXTRACT - extracted ${currentResultCount} pools, total: ${pairCount}, cursor: ${cursor} (${(
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

      const newCursor = request?.TJ_pairs[request.TJ_pairs.length - 1]?.id ?? ''
      cursor = newCursor
    } while (cursor !== '')
    totalPairCount += pairCount
    console.log(
      `Finished loading pairs from ${GRAPH_HOST[chainId]}/${SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId]}, ${pairCount} pairs`
    )
  }
  console.log(`Finished loading pairs for ${PROTOCOL} from all subgraphs, ${totalPairCount} pairs`)
}

function transform(
  chainId: number,
  data: TraderJoePairsQuery
): {
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
} {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const uniqueTokens: Set<string> = new Set()
  const poolsTransformed = data.TJ_pairs.map((pair) => {
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
      version: VERSION,
      type: CONSTANT_PRODUCT_POOL,
      chainId,
      swapFee: SWAP_FEE,
      twapEnabled: TWAP_ENABLED,
      token0Id: chainId.toString().concat(':').concat(pair.token0.id),
      token1Id: chainId.toString().concat(':').concat(pair.token1.id),
      liquidityUSD: 0,
    })
  })

  return { pools: poolsTransformed, tokens }
}
