import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairs } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await getPairs(req.query)
  res.status(200).json(body)
}
