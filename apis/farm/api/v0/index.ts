import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('farms')

  if (!data) {
    return response.status(204)
  }

  const json = Object.fromEntries(Object.values(data).map(([chainId, data]) => [chainId, JSON.parse(data)]))

  const now = getUnixTime(Date.now())

  return response.status(200).json({
    ...json,
    updatedSecondsAgo: now - json.updatedAtTimestamp,
  })
}
