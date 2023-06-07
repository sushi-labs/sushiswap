import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import redis from '../../lib/redis.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('prices')

  if (!data) {
    return response.status(503)
  }

  const now = getUnixTime(Date.now())

  const json = Object.entries(data).reduce((acc, [key, value]) => {
    if (!value) return acc

    const parsed = JSON.parse(value)

    acc[key] = { ...parsed, updatedSecondsAgo: now - parsed.updatedAtTimestamp }
    return acc
  }, {} as Record<string, any>)

  return response.status(200).json(json)
}

export default handler
