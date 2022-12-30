import type { NextApiRequest, NextApiResponse } from 'next'

import { getVestingTransactions } from '../../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chainId = req.query.chainId as string
  const id = req.query.id as string
  res.status(200).send(await getVestingTransactions(chainId, id))
}
