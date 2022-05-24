
import { getFarm } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const farm = (await getFarm(chainId as string, id as string))
  res.status(200).send(farm)
}
