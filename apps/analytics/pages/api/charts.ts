import type { NextApiRequest, NextApiResponse } from 'next'

import { getCharts } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const data = await getCharts(req.query as { networks: string })
  res.status(200).send(data)
}
