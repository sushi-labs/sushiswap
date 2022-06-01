import { getSubscriptions } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, address } = req.query
  const subscriptions = await getSubscriptions(chainId as string, address as string)
  res.status(200).send(subscriptions)
}
