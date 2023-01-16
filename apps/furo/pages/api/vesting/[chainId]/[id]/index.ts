import type { NextApiRequest, NextApiResponse } from 'next'

import { getVesting } from '../../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const stream = await getVesting(chainId as string, id as string)
  res.status(200).send(stream)
}
