import type { NextApiRequest, NextApiResponse } from 'next'

import { getPools } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pairs = await getPools(req.query)
  res.status(200).send(pairs)
}
