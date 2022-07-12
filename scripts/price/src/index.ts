import 'dotenv/config'

import { GRAPH_HOST, LEGACY_SUBGRAPH_NAME, SUPPORTED_CHAINS } from './config'
import redis from './redis'
import { getBuiltGraphSDK } from '.graphclient'

export async function execute() {
  console.log(`Updating prices for chains: ${SUPPORTED_CHAINS.join(', ')}`)

  const results = await Promise.all(
    SUPPORTED_CHAINS.map((chainId) => {
      if (!SUPPORTED_CHAINS.includes(chainId)) {
        throw Error(`Unsupported Chain ${chainId}`)
      }
      console.log({ chainId, host: GRAPH_HOST, subgraphName: LEGACY_SUBGRAPH_NAME[chainId] })
      const sdk = getBuiltGraphSDK({ chainId, host: GRAPH_HOST, subgraphName: LEGACY_SUBGRAPH_NAME[chainId] })
      return sdk.TokenPrices()
    })
  )

  await redis.hset(
    'prices',
    Object.fromEntries(
      results.map(({ chainId, data }) => {
        const ethPrice = data.bundle?.ethPrice
        const updatedAtBlock = data._meta?.block.number
        const updatedAtTimestamp = getUnixTime(Date.now())
        return [
          chainId,
          JSON.stringify({
            chainId,
            ...Object.fromEntries(
              data.tokens
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
      })
    )
  )
  console.log(`Finished updating prices for chains: ${SUPPORTED_CHAINS.join(', ')}`)
  process.exit()
}
execute()
