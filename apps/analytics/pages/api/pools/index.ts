import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getPools, GetPoolsQuery } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const query = req.query as unknown
  const pairs = await getPools(query as GetPoolsQuery)
  res.status(200).send(stringify(pairs))
}
