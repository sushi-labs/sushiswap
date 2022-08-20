import type { NextApiRequest, NextApiResponse } from 'next'

import { getStats } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pairs = await getStats()
  res.status(200).send(pairs)
}
