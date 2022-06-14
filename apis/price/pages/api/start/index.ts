import { ChainId } from '@sushiswap/chain'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import { prices } from '../../../lib/mapper'
import redis from '../../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  execute(averageBlockTime)
  return response.status(200).json({ started: true })
}

const averageBlockTime = 13000

export async function execute(delay: number) {
  console.log('Fetching')
  const data = await prices(ChainId.ARBITRUM.toString())
  await redis.hset('prices', ChainId.ARBITRUM.toString(), JSON.stringify(data))
  setTimeout(() => execute(delay), delay)
}
