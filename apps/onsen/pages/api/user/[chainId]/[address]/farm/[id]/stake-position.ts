import { getUserStakePositions } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chainId, id } = req.query
  const stakePositions = await getUserStakePositions(chainId as string, address as string, id as string)
  res.status(200).send(stakePositions)
}
