import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('farms')

  if (!data) {
    return response.status(204)
  }

  const now = getUnixTime(Date.now())

  return response.status(200).json(
    Object.fromEntries(
      Object.entries(data).map(([chainId, data]) => {
        const json = JSON.parse(data)
        return [
          chainId,
          {
            ...json,
            updatedSecondsAgo: now - json.updatedAtTimestamp,
          },
        ]
      })
    )
  )
}
