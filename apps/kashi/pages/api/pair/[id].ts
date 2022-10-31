import type { NextApiRequest, NextApiResponse } from 'next'

import { getPair } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = await getPair(req.query.id as string)
  res.status(200).json(body)
}
