import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { chainId } = request.query
  const data = await redis.hget('prices', chainId as string)
  if (!data) {
    return response.status(204)
  }
  const json = JSON.parse(data)
  const fetchedSecondsAgo = Number((Date.now() / 1000).toFixed()) - json.meta.fetchedAtTimestamp
  json.meta.fetchedSecondsAgo = fetchedSecondsAgo
  return response.status(200).json(json)
}
