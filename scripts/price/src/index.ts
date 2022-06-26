import 'dotenv/config'

import { getUnixTime } from 'date-fns'

import { SUPPORTED_CHAINS } from './config'
import { getPrices } from './lib/graph'
import redis from './lib/redis'

export async function execute() {
  console.log(`Updating prices for chains: ${SUPPORTED_CHAINS.join(', ')}`)
  const results = await Promise.all(SUPPORTED_CHAINS.map((chainId) => getPrices(chainId)))
  await redis.hset(
    'prices',
    Object.fromEntries(
      results.map(({ chainId, data }) => {
        const ethPrice = data.legacy_exchange_bundle?.ethPrice
        const updatedAtBlock = data.legacy_exchange__meta?.block.number
        const updatedAtTimestamp = getUnixTime(Date.now())
        return [
          chainId,
          JSON.stringify({
            chainId,
            ...Object.fromEntries(
              data.legacy_exchange_tokens
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
