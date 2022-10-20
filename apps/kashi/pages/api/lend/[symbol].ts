import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairsForSymbol } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.query.symbol as string
  const body = await getPairsForSymbol({
    where: {
      asset_: {
        symbol_contains_nocase: symbol.toLowerCase(),
      },
      totalBorrow_: { base_not: '0' },
    },
    orderBy: 'supplyAPR',
    orderDirection: 'desc',
  })
  res.status(200).json(body)
}
