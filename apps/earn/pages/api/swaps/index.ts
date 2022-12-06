import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getSwaps, GetSwapsQuery } from 'lib/api'
import type { Swap as SwapDTO } from '@sushiswap/graph-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const swaps = await getSwaps(query as GetSwapsQuery) as SwapDTO []
  res.status(200).send(stringify(swaps))
}
