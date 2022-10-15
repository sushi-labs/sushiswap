import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairs, getPairsForSymbol } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let pairs
  // console.log('>>>', req.query)
  if (req.query.symbol) {
    pairs = await getPairsForSymbol({
      ...req.query,
      asset: req.query.asset === 'true',
      symbol: (req.query.symbol as string).toLowerCase(),
    })
  } else {
    pairs = await getPairs(req.query)
  }

  res.status(200).send(pairs)
}
