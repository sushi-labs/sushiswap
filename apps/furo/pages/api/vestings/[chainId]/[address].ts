import { getVestings } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Vestings } from 'types'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, address } = req.query
  const vestings = (await getVestings(chainId as string, (address as string).toLowerCase())) as Vestings
  res.status(200).send(vestings)
}
