import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getGraphPools } from '../../../lib/api'

const schema = z.object({
  ids: z.string().transform((ids) => ids.split(',')),
})

// uses thegraph, not the pools api
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const result = schema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json(result.error.format())
  }

  const pool = await getGraphPools(result.data.ids)
  res.status(200).json(pool)
}
