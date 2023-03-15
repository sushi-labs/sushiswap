import type { NextApiRequest, NextApiResponse } from 'next'

import { getSushiBar } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const bar = await getSushiBar()
  res.status(200).send(bar)
}
