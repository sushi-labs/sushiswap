import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('prices')

  if (!data) {
    return response.status(204)
  }

  const json = data

  return response.status(200).json(json)
}
