import type { NextApiRequest, NextApiResponse } from 'next'

<<<<<<<< HEAD:apps/earn/pages/api/graphPool/graph/[id].ts
import { getPool } from '../../../../lib/api'
========
import { getGraphPool } from '../../../lib/api'
>>>>>>>> origin/feature/add-incentive-integration-v2:apps/earn/pages/api/graphPool/[id].ts

// uses thegraph, not the pools api
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  if (!req.query?.id) res.status(422)
<<<<<<<< HEAD:apps/earn/pages/api/graphPool/graph/[id].ts
  const [pool] = await Promise.all([getPool(req.query.id as string)])
========
  const pool = await getGraphPool(req.query.id as string)
>>>>>>>> origin/feature/add-incentive-integration-v2:apps/earn/pages/api/graphPool/[id].ts
  res.status(200).json(pool)
}
