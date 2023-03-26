import { getPoolCount, PoolCountApiSchema } from '@sushiswap/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')

  const result = PoolCountApiSchema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json(result.error.format())
  }

  const count = await getPoolCount(req.query)
  res.status(200).json(count)
}
