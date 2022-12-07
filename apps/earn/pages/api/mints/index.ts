import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getMints, GetMintsQuery } from 'lib/api'
import type { Mint as MintDTO } from '@sushiswap/graph-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const mints = await getMints(query as GetMintsQuery) as MintDTO []
  res.status(200).send(stringify(mints))
}
