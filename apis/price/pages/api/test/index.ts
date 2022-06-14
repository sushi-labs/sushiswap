import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const currentCount = JSON.parse((await redis.hget('count', 'test')) ?? '0')
  await redis.hset('count', 'test', JSON.stringify({ count: Number(currentCount.count) + 1 }))
  return response.status(200).json({ currentCount })
}
