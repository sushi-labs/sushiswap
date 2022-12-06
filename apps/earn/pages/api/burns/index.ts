import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getBurns, GetBurnsQuery } from 'lib/api'
import type { Burn as BurnDTO } from '@sushiswap/graph-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const burns = await getBurns(query as GetBurnsQuery) as BurnDTO []
  res.status(200).send(stringify(burns))
}
