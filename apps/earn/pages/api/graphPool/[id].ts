import type { NextApiRequest, NextApiResponse } from 'next'

import { getGraphPool } from '../../../lib/api'

// uses thegraph, not the pools api
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  if (!req.query?.id) res.status(422)
  const pool = await getGraphPool(req.query.id as string)
  res.status(200).json(pool)
}
