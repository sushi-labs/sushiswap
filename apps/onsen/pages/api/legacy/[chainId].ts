import { getLegacyPairs } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query
  const legacyPairs = await getLegacyPairs(chainId as string)
  res.status(200).send(legacyPairs)
}
