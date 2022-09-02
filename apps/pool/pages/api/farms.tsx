import type { NextApiRequest, NextApiResponse } from 'next'

import { getFarms } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const farms = await getFarms()
  res.status(200).send(farms)
}
