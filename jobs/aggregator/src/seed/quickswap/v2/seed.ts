import { ChainId, chainName } from '@sushiswap/chain'
import { createClient, Prisma, PrismaClient } from '@sushiswap/database'
import { performance } from 'perf_hooks'

import { getBuiltGraphSDK, V2PairsQuery } from '../../../../.graphclient/index.js'
import { PoolType, ProtocolName, ProtocolVersion } from '../../../config.js'
import { createPools, isProtocolExisting } from '../../../etl/pool/load.js'
import { createTokens } from '../../../etl/token/load.js'
import { GRAPH_HOST, QUICKSWAP_SUBGRAPH_NAME, QUICKSWAP_SUPPORTED_CHAINS } from '../config.js'

const PROTOCOL = ProtocolName.QUICKSWAP
const VERSION = ProtocolVersion.V2
const CONSTANT_PRODUCT_POOL = PoolType.CONSTANT_PRODUCT_POOL
const SWAP_FEE = 0.003
const TWAP_ENABLED = true
const LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID: Map<ChainId, NewestPool> = new Map()
interface NewestPool {
  address: string
  timestamp: number
}

export async function quickswapV2() {
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

/**
 * NOTE: This should not run as a job the first time. It should be run manually to seed the database, compare the count with subgraph pair count to verify everything is correct.
 * This function handles three different cases:
 * 1. If there are no pools in the database, it will fetch all pools from the subgraph and insert them into the database.
 * 2. If there are pools in the database, it will fetch 1000 pools from the subgraph, check if they exist in the database, and insert them if they don't. Then save the last created pool timestamp in memory.
 * 3. Continue from the previous state, step 2. There's now a timestamp to compare against, so we can fetch pools from the subgraph that are newer than the timestamp.
 * @param client
 */
async function start(client: PrismaClient) {
  console.log(
    `Fetching pools from ${PROTOCOL} ${VERSION}, chains: ${QUICKSWAP_SUPPORTED_CHAINS.map(
      (chainId) => chainName[chainId]
    ).join(', ')}`
  )

  let totalPairCount = 0
  for (const chainId of QUICKSWAP_SUPPORTED_CHAINS) {
    // First check if we have pools in the db at all. If we don't, we need to fetch everything.
    // if we have an id, use that and order by latest. Otherwise
    const hasPools = await isProtocolExisting(client, chainId, PROTOCOL, VERSION)

    const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST[chainId], name: QUICKSWAP_SUBGRAPH_NAME[chainId] })
    if (!QUICKSWAP_SUBGRAPH_NAME[chainId]) {
      console.log(`Subgraph not found: ${chainId} ${QUICKSWAP_SUBGRAPH_NAME[chainId]}, Skipping`)
      continue
    }
    console.log(`Loading data from chain: ${chainName[chainId]}(${chainId}), ${QUICKSWAP_SUBGRAPH_NAME[chainId]}`)
    let pairCount = 0
    let cursor = ''

    // before starting, determine case

    let query = {}

    if (!hasPools) {
      console.log(`${PROTOCOL} ${VERSION} has no pools on chain ${chainId}, fetching all pools from subgraph.`)
      query = {
        first: 1000,
      }
      do {
        if (cursor !== '') {
          query = {
            first: 1000,
            where: {
              id_gt: cursor,
            },
          }
        }
        const startTime = performance.now()
        let request: V2PairsQuery | undefined = undefined
        try {
          request = await sdk.V2Pairs(query)
        } catch (e: any) {
          console.log({ e })
        }

        const currentResultCount = request?.V2_pairs.length ?? 0
        const endTime = performance.now()

        pairCount += currentResultCount
        const queryDuration = ((endTime - startTime) / 1000).toFixed(1)
        console.log(
          `EXTRACT - extracted ${currentResultCount} pools, total: ${pairCount}, cursor: ${cursor} (${queryDuration}`
        )

        // if (request) {
        //   const { tokens, pools } = transform(chainId, request)
        //   // NOTE: This shouldn't have to be async, but was seeing this error:
        //   // (unlocked closed connection) (CallerID: planetscale-admin)'
        //   // this script doesn't have to be super fast, so keeping it async to not throttle the db
        //   await Promise.all([createTokens(client, tokens), createPools(client, pools)])
        // }

        const newCursor = request?.V2_pairs[request.V2_pairs.length - 1]?.id ?? ''
        cursor = newCursor
      } while (cursor !== '')
      totalPairCount += pairCount
      console.log(
        `Finished loading pairs from ${GRAPH_HOST[chainId]}/${QUICKSWAP_SUBGRAPH_NAME[chainId]}, ${pairCount} pairs`
      )
    } else {
      const newestPool = LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(chainId)
      if (!newestPool) {
        console.log(`${PROTOCOL} ${VERSION} has pools, but this is the first run since starting up this instance.`)
        query = {
          first: 1000,
          orderBy: 'createdAtTimestamp',
          orderDirection: 'desc',
        }
        let request: V2PairsQuery | undefined = undefined
        try {
          request = await sdk.V2Pairs(query)
        } catch (e: any) {
          console.log({ e })
        }

        if (!request) {
          console.warn(
            `UNEXPECTED STATE, ${PROTOCOL} ${VERSION} no pools found, but db has pools, the subgraph should have pools. Subgraph not responding?`
          )
          return
        }

        const latestPool = request.V2_pairs.length ? request.V2_pairs?.[0] : undefined
        if (latestPool) {
          LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
            address: latestPool.id,
            timestamp: latestPool.createdAtTimestamp,
          })
          console.log(
            `${PROTOCOL} ${VERSION} Newest pool saved in memory: ${latestPool.id}, timestamp: ${latestPool.createdAtTimestamp}.`
          )
        }

        // const { tokens, pools } = transform(chainId, request)
        // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
      } else {
        query = {
          first: 1000,
          where: {
            createdAtTimestamp_gt: newestPool.timestamp,
          },
          orderBy: 'createdAtTimestamp',
          orderDirection: 'desc',
        }
        let request: V2PairsQuery | undefined = undefined
        try {
          request = await sdk.V2Pairs(query)
        } catch (e: any) {
          console.log({ e })
        }
        if (request.V2_pairs.length) {
          LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
            address: request.V2_pairs[0].id,
            timestamp: request.V2_pairs[0].createdAtTimestamp,
          })
          try {
            // const { tokens, pools } = transform(chainId, request)
            // await Promise.all([createTokens(client, tokens), createPools(client, pools)])
            const latestPool = request.V2_pairs.length ? request.V2_pairs?.[0] : undefined
            if (latestPool) {
              LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(chainId, {
                address: latestPool.id,
                timestamp: latestPool.createdAtTimestamp,
              })
              console.log(
                `${PROTOCOL} ${VERSION} Newest pool saved in memory: ${latestPool.id}, timestamp: ${latestPool.createdAtTimestamp}.`
              )
            } else {
              console.log(`${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`)
            }
          } catch (e: any) {
            console.log({ e })
          }
        } else {
          console.log(`${PROTOCOL} ${VERSION} The latest pool is still ${newestPool.address}, timestamp: ${newestPool.timestamp}, no new pools found.`)
        }
      }
    }
    console.log(
      `Finished loading pairs from ${GRAPH_HOST[chainId]}/${QUICKSWAP_SUBGRAPH_NAME[chainId]}, ${pairCount} pairs`
    )
  }
  console.log(`Finished loading pairs for ${PROTOCOL} from all subgraphs, ${totalPairCount} pairs`)
}

function transform(
  chainId: ChainId,
  data: V2PairsQuery
): {
  pools: Prisma.PoolCreateManyInput[]
  tokens: Prisma.TokenCreateManyInput[]
} {
  const tokens: Prisma.TokenCreateManyInput[] = []
  const uniqueTokens: Set<string> = new Set()
  const poolsTransformed = data.V2_pairs.map((pair) => {
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
          chainId: chainId,
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
