import { getUserStakes } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chainId } = req.query
  const farms = await getUserStakes(chainId as string, address as string)
  res.status(200).send(farms)
}
