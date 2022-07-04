import { getUserRewards } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chainId, id } = req.query
  const rewards = await getUserRewards(chainId as string, address as string, id as string)
  res.status(200).send(rewards)
}
