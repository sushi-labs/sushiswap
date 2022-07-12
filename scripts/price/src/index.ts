import 'dotenv/config'

import { getUnixTime } from 'date-fns'

import { getBuiltGraphSDK } from '../.graphclient'
import { GRAPH_HOST, LEGACY_SUBGRAPH_NAME, SUSHISWAP_CHAINS, TRIDENT_CHAINS, TRIDENT_SUBGRAPH_NAME } from './config'
import redis from './redis'

export async function execute() {
  console.log(`Updating prices for SushiSwap chains: ${SUSHISWAP_CHAINS.join(', ')}`)

  const sushiSwapResults = await Promise.all(
    SUSHISWAP_CHAINS.map((chainId) => {
      if (!SUSHISWAP_CHAINS.includes(chainId)) {
        throw Error(`Unsupported Chain ${chainId}`)
      }
      console.log({ chainId, host: GRAPH_HOST, subgraphName: LEGACY_SUBGRAPH_NAME[chainId] })
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST, subgraphName: LEGACY_SUBGRAPH_NAME[chainId] })
      return sdk.SushiSwapTokenPrices({ first: 100000 })
    })
  )

  const tridentResults = await Promise.all(
    TRIDENT_CHAINS.map((chainId) => {
      if (!TRIDENT_CHAINS.includes(chainId)) {
        throw Error(`Unsupported Chain ${chainId}`)
      }
      console.log({ chainId, host: GRAPH_HOST, subgraphName: TRIDENT_SUBGRAPH_NAME[chainId] })
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST, subgraphName: TRIDENT_SUBGRAPH_NAME[chainId] })
      return sdk.TridentTokenPrices({ first: 100000 })
    })
  )

  await redis.hset(
    'prices',
    Object.fromEntries([
      ...SUSHISWAP_CHAINS.map((chainId, i) => {
        const ethPrice = sushiSwapResults[i].bundle?.ethPrice
        const updatedAtBlock = sushiSwapResults[i]._meta?.block.number
        const updatedAtTimestamp = getUnixTime(Date.now())
        return [
          chainId,
          JSON.stringify({
            chainId,
            ...Object.fromEntries(
              sushiSwapResults[i].tokens
                .filter((token) => token.derivedETH != 0)
                .map((token) => {
                  const price = Number(token.derivedETH) * Number(ethPrice)
                  return [token.id, price]
                })
            ),
            updatedAtBlock,
            updatedAtTimestamp,
          }),
        ]
      }),
      TRIDENT_CHAINS.map((chainId, i) => {
        const updatedAtBlock = tridentResults[i]._meta?.block.number
        const updatedAtTimestamp = getUnixTime(Date.now())
        return [
          chainId,
          JSON.stringify({
            chainId,
            ...Object.fromEntries(
              tridentResults[i].tokenPrices
                .filter((price) => price.derivedUSD != 0)
                .map((price) => {
                  return [price.id, Number(price.derivedUSD)]
                })
            ),
            updatedAtBlock,
            updatedAtTimestamp,
          }),
        ]
      }),
    ])
  )
  // console.log(`Finished updating prices for chains: ${SUSHISWAP_CHAINS.join(', ')}`)
  process.exit()
}
execute()
