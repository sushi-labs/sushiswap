import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string
  if (!(await redis.hexists('safes', address))) {
    res.status(404).send(`No safe found for ${address}`)
  }
  const safe = await redis.hget('safes', address)
  const balance = await redis.hget('balances', address)
  const json = { ...JSON.parse(safe), balance: JSON.parse(balance) }
  res.status(200).json(json)
}
