import type { NextApiRequest, NextApiResponse } from 'next'

import { getSushiBar } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const bar = await getSushiBar()
  res.status(200).send(bar)
}
