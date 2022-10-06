import type { NextApiRequest, NextApiResponse } from 'next'

import { getPool } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=100, stale-while-revalidate=599')
  const [pair] = await Promise.all([getPool(req.query.id as string)])
  res.status(200).send({ pair })
}
