import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function getBalances(req: NextApiRequest, res: NextApiResponse) {
  const results = await redis.hvals('balances')
  const json = results.map((result) => JSON.parse(result))
  res.status(200).json(json)
}
