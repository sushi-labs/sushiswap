import type { NextApiRequest, NextApiResponse } from 'next'

import { getPoolCount } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const count = await getPoolCount(req.query)
  res.status(200).send(count)
}
