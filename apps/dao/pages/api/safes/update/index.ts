import log from '@sushiswap/logger'
import { SAFES } from 'config'
import { getSafe } from 'gnosis'
import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let successfulUpdates = 0
  for (const [address, safe] of Object.entries(SAFES)) {
    try {
      const result = await getSafe(safe.chainId.toString(), safe.address)
      log(`Safe for ${safe.address} on chainId ${safe.chainId.toString()}`, result)
      await redis.hset('safes', address, JSON.stringify(result))
      await new Promise((resolve) => setTimeout(resolve, 5000))
      successfulUpdates += 1
    } catch (e) {
      log.warn(`Safe for ${address} could not be updated, ${e}`)
    }
  }
  res.status(200).send(`Updated info on ${successfulUpdates} of ${Object.entries(SAFES).length} safes.`)
}
