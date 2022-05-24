import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string
  if (!(await redis.hexists('safes', address))) {
    return res.status(404).send(`No safe found for ${address}`)
  }
  const safe = await redis.hget('safes', address)
  const balance = await redis.hget('balances', address)
  if (!safe || !balance) {
    return res.status(404).send(`missing safe/balance for ${address}`)
  }
  const json = { ...JSON.parse(safe), balance: JSON.parse(balance) }
  return res.status(200).json(json)
}
