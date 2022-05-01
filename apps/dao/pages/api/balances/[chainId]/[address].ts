import type { NextApiRequest, NextApiResponse } from 'next'
import redis from 'redis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query
  if (!(await redis.hexists('balances', address.toString()))) {
    res.status(404).send(`No balances found for ${address.toString()}`)
  }
  const result = await redis.hget('balances', address.toString())
  const json = JSON.parse(result)
  res.status(200).json(json)
}
