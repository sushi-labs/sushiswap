import { getPool, PoolApiSchema } from '@sushiswap/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const result = PoolApiSchema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json(result.error.format())
  }
  const pool = await getPool(result.data)
  res.status(200).json(pool)
}
