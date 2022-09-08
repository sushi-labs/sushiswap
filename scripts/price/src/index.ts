import 'dotenv/config'

import { ChainId } from '@sushiswap/chain'
import { getUnixTime } from 'date-fns'

import { getBuiltGraphSDK } from '../.graphclient'
import { SUSHISWAP_CHAINS, SUSHISWAP_SUBGRAPH_NAME, TRIDENT_CHAINS, TRIDENT_SUBGRAPH_NAME } from './config'
import redis from './redis'

async function getSushiSwapResults() {
  const results = await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, name: SUSHISWAP_SUBGRAPH_NAME[chainId] })
      return sdk.SushiSwapTokens({ first: 100000, where: { derivedETH_gt: 0 } }).catch(() => {
        console.log(`Fetch failed: Exchange - ${ChainId[chainId]}`)
        return undefined
      })
    })
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((result, i) => {
      const nativePrice = Number(result.bundle?.ethPrice)
      const updatedAtBlock = Number(result._meta?.block.number)

      return {
        chainId: SUSHISWAP_CHAINS[i],
        updatedAtBlock,
        tokens: result.tokens.map((token) => ({
          id: token.id,
          priceUSD: token.derivedETH * nativePrice,
          liquidityNative: Number(token.liquidity),
        })),
      }
    })
}

async function getTridentResults() {
  const results = await Promise.all(
    TRIDENT_CHAINS.map((chainId) => {
      const sdk = getBuiltGraphSDK({ chainId, name: TRIDENT_SUBGRAPH_NAME[chainId] })
      return sdk
        .TridentTokens({
          first: 100000,
          where: {
            derivedNative_gt: 0,
          },
        })
        .catch(() => {
          console.log(`Fetch failed: Trident - ${ChainId[chainId]}`)
          return undefined
        })
    })
  )

  return results
    .filter((result): result is NonNullable<typeof results[0]> => result !== undefined)
    .map((result, i) => {
      //const nativePrice = Number(result.bundle?.nativePrice)
      const updatedAtBlock = Number(result._meta?.block.number)
      return {
        chainId: TRIDENT_CHAINS[i],
        updatedAtBlock,
        tokens: result.tokenPrices.map((tokenPrice) => {
          return {
            id: tokenPrice.id,
            priceUSD: Number(tokenPrice.lastUsdPrice),
            liquidityNative: Number(tokenPrice.token?.liquidityNative),
          }
        }),
      }
    })
}

export async function execute() {
  console.log(
    `Updating prices for chains: ${[...SUSHISWAP_CHAINS, ...TRIDENT_CHAINS]
      .map((chainId) => ChainId[chainId])
      .join(', ')}`
  )

  const results = (await Promise.all([getSushiSwapResults(), getTridentResults()])).flat()
  const chainIds = Array.from(new Set(results.map((result) => result.chainId)))
  // Legacy Exchange and Trident tokens combined, higher liquidity wins
  const combined = chainIds.map((chainId) => {
    // Get all sources for specific chain (Legacy, Trident or Legacy+Trident)
    const sources = results.filter((result) => result.chainId === chainId)

    let tokens

    // No need to go through everything if there's just going to be one entry anyway
    if (sources.length === 1) {
      tokens = sources[0].tokens
    } else {
      const allTokens = sources.flatMap((result) => result.tokens)
      const seenTokens = new Map<string, { priceUSD: number; liquidityNative: number }>()
      allTokens.forEach((token) => {
        const previousBestToken = seenTokens.get(token.id)

        if (previousBestToken) {
          if (previousBestToken.liquidityNative < token.liquidityNative) {
            seenTokens.set(token.id, { priceUSD: token.priceUSD, liquidityNative: token.liquidityNative })
          }
        } else {
          seenTokens.set(token.id, { priceUSD: token.priceUSD, liquidityNative: token.liquidityNative })
        }
      })
      tokens = Array.from(seenTokens.entries()).map(([id, { priceUSD }]) => ({ id, priceUSD }))
    }

    return { chainId, updatedAtBlock: sources[0].updatedAtBlock, updatedAtTimestamp: getUnixTime(Date.now()), tokens }
  })

  await redis.hset(
    'prices',
    Object.fromEntries(
      combined.map(({ chainId, tokens, updatedAtBlock, updatedAtTimestamp }) => [
        chainId,
        JSON.stringify({
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
