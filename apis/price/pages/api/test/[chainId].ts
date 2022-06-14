import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { chainId } = request.query
  console.log("hey")
  const data = await redis.hget('prices', chainId as string)
  console.log("yey")
  if (!data) {
    return response.status(204)
  }
  return response.status(200).json(JSON.parse(data))
}
