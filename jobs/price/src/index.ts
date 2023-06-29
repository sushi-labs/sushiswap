import 'dotenv/config'

import { ChainId } from '@sushiswap/chain'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { getUnixTime } from 'date-fns'
import stringify from 'fast-json-stable-stringify'

import { pager } from './pager.js'

async function getSushiSwapResults() {
  const results = await Promise.all(
    SUSHISWAP_ENABLED_NETWORKS.map((chainId) =>
      pager(SUBGRAPH_HOST[chainId], SUSHISWAP_SUBGRAPH_NAME[chainId]).catch(() => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}`)
        return undefined
      })
    )
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((result, i) => {
      const nativePrice = Number(result.bundle?.nativePrice)
      const updatedAtBlock = Number(result._meta?.block.number)

      return {
        chainId: SUSHISWAP_ENABLED_NETWORKS[i],
        updatedAtBlock,
        tokens: result.tokenPrices.map((token) => ({
          id: token.id,
          priceUSD: token.derivedNative * nativePrice,
          liquidity: Number(token.token.liquidity),
        })),
      }
    })
}

async function getTridentResults() {
  const results = await Promise.all(
    TRIDENT_ENABLED_NETWORKS.map((chainId) =>
      pager(SUBGRAPH_HOST[chainId], TRIDENT_SUBGRAPH_NAME[chainId]).catch(() => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}`)
        return undefined
      })
    )
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((result, i) => {
      const nativePrice = Number(result.bundle?.nativePrice)
      const updatedAtBlock = Number(result._meta?.block.number)
      return {
        chainId: TRIDENT_ENABLED_NETWORKS[i],
        updatedAtBlock,
        tokens: result.tokenPrices.map((tokenPrice) => {
          return {
            id: tokenPrice.id,
            priceUSD: tokenPrice.derivedNative * nativePrice,
            liquidity: Number(tokenPrice.token.liquidity),
          }
        }),
      }
    })
}

export async function execute() {
  console.log(
    `Updating prices for chains: ${[...SUSHISWAP_ENABLED_NETWORKS, ...TRIDENT_ENABLED_NETWORKS]
      .map((chainId) => ChainId[chainId])
      .join(', ')}`
  )

  const results = (await Promise.all([getSushiSwapResults(), getTridentResults()])).flat()
  const chainIds = Array.from(new Set(results.map((result) => result.chainId)))
  // Legacy Exchange and Trident tokens combined, higher liquidity wins
  const combined = chainIds.map((chainId) => {
    // Get all sources for specific chain (Legacy, Trident or Legacy+Trident)
    const sources = results.filter((result) => result.chainId === chainId)

    let tokens: { id: string; priceUSD: number }[] = []

    // No need to go through everything if there's just going to be one entry anyway
    if (sources.length === 1) {
      const uniqueTokens = new Map()
      sources[0]?.tokens.forEach((token) => uniqueTokens.set(token.id, token.priceUSD))
      tokens = Array.from(uniqueTokens.entries()).map(([id, priceUSD]) => ({
        id,
        priceUSD,
      }))
    } else {
      const allTokens = sources.flatMap((result) => result.tokens)
      const seenTokens = new Map<string, { priceUSD: number; liquidity: number }>()
      allTokens.forEach((token) => {
        const previousBestToken = seenTokens.get(token.id)

        if (previousBestToken) {
          if (previousBestToken.liquidity < token.liquidity) {
            seenTokens.set(token.id, {
              priceUSD: token.priceUSD,
              liquidity: token.liquidity,
            })
          }
        } else {
          seenTokens.set(token.id, {
            priceUSD: token.priceUSD,
            liquidity: token.liquidity,
          })
        }
      })
      tokens = Array.from(seenTokens.entries()).map(([id, { priceUSD }]) => ({
        id,
        priceUSD,
      }))
    }

    return {
      chainId,
      updatedAtBlock: sources[0]?.updatedAtBlock,
      updatedAtTimestamp: getUnixTime(Date.now()),
      tokens,
    }
  })

  if (process.env['DRY_RUN']) return
  const { redis } = await import('./redis.js');
  await redis.hset(
    'prices',
    Object.fromEntries(
      combined.map(({ chainId, tokens, updatedAtBlock, updatedAtTimestamp }) => [
        chainId,
        stringify({
          chainId,
          ...tokens.reduce((acc, token) => ({ ...acc, [token.id]: token.priceUSD }), {}),
          updatedAtBlock,
          updatedAtTimestamp,
        }),
      ])
    )
  )
  console.log(`Finished updating prices`)
  process.exit()
}
