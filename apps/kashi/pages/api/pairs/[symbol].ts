import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairsForSymbol } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await getPairsForSymbol(JSON.parse(req.query))
  res.status(200).json(body)
}
