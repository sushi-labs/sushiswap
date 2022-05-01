import type { NextApiRequest, NextApiResponse } from 'next'
import { getBalance } from 'gnosis'
import { SAFES } from 'config'
import redis from 'redis'
import { ChainId } from '@sushiswap/chain'
import log from '@sushiswap/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const filteredSafes = Object.entries(SAFES).filter(([, safe]) => safe.chainId !== ChainId.HARMONY)
  let successfulUpdates = 0
  for (const [address, safe] of filteredSafes) {
    try {
      const balance = await getBalance(safe.chainId.toString(), safe.address)
      log(`Balance for ${address} on chainId ${safe.chainId.toString()}`, balance)
      await redis.hset('balances', address, JSON.stringify(balance))
      await new Promise((resolve) => setTimeout(resolve, 5000))
      successfulUpdates += 1
    } catch (e) {
      log.warn(`Balance for ${address} could not be updated, ${e}`)
    }
  }
  res.status(200).send(`Updated balance for ${successfulUpdates} of ${filteredSafes.length} safes.`)
}
