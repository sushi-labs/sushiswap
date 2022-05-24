
import { getFarms } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query
  const farms = (await getFarms(chainId as string))
  res.status(200).send(farms)
}
