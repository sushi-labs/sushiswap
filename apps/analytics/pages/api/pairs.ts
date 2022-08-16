import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairs } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pairs = await getPairs(req.query)
  res.status(200).send(pairs)
}
