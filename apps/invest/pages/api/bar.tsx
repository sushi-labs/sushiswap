import type { NextApiRequest, NextApiResponse } from 'next'

import { getSushiBar } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=100, stale-while-revalidate=599')
  const bar = await getSushiBar()
  res.status(200).send(bar)
}
