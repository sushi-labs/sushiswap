import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getGraphPool } from '../../../lib/api'

const schema = z.object({
  id: z.string(),
})

// uses thegraph, not the pools api
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const result = schema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json(result.error.format())
  }

  const pool = await getGraphPool(result.data.id)
  res.status(200).json(pool)
}
