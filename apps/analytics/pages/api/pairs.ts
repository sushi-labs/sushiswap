import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairs } from '../../lib/api'
import { QuerypairsArgs } from '.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const { query } = req
  const pairs = await getPairs(query as unknown as QuerypairsArgs & { networks: string })
  res.status(200).send(JSON.stringify(pairs))
}
