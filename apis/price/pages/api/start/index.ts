import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SUPPORTED_CHAINS } from '../../../config'
import { getPrices } from '../../../lib/graph'
import { pricesToJson } from '../../../lib/mapper'
import redis from '../../../lib/redis'

const pollInterval = 60000 // TODO: decide how often we should fetch new price data

export default async (request: VercelRequest, response: VercelResponse) => {
  execute(pollInterval)
  return response.status(200).json({ started: true })
}

export async function execute(delay: number) {
  const chainPrices: ReturnType<typeof getPrices>[] = []
  console.debug('Updating prices for chains: '.concat(SUPPORTED_CHAINS.join(', ')))
  for (const chainId of SUPPORTED_CHAINS as unknown as string[]) {
    chainPrices.push(getPrices(chainId))
  }

  await (
    await Promise.all(chainPrices)
  ).forEach(async (result) => {
    const json = pricesToJson(result.chainId, result.data)
    await redis.hset('prices', result.chainId, JSON.stringify(json))
  })

  console.debug(`Done updating prices, next update in ${(pollInterval / 1000).toString()} seconds.`)
  setTimeout(() => execute(delay), delay)
}
