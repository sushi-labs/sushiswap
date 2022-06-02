import type { NextApiRequest, NextApiResponse } from 'next'

import { getUserFarms } from '../../../../../graph/graph-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chainId } = req.query
  const farms = await getUserFarms(chainId as string, address as string)
  res.status(200).send(farms)
}
