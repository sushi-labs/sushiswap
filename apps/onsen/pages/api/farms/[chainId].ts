import type { NextApiRequest, NextApiResponse } from 'next'

import { getFarms } from '../../../graph/graph-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query
  const farms = await getFarms(chainId as string)
  res.status(200).send(farms?.filter(farm => farm.incentives && farm.incentives?.length > 0))
}
