import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getBurns, GetBurnsQuery } from 'lib/swap_api'
import type { Burn as BurnDTO } from '.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const burns = await getBurns(query as GetBurnsQuery) as BurnDTO []
  res.status(200).send(stringify(burns))
}
