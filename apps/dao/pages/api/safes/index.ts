import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function getSafes(req: NextApiRequest, res: NextApiResponse) {
  const results = await redis.hvals('safes')
  const json = results.map((result) => JSON.parse(result))
  res.status(200).json(json)
}
