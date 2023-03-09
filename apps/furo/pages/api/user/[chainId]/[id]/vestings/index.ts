import type { NextApiRequest, NextApiResponse } from 'next'

import { getUserVestings } from '../../../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const vestings = await getUserVestings(chainId as string, (id as string).toLowerCase())
  res.status(200).send(vestings)
}
