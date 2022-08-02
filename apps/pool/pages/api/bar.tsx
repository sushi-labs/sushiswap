import type { NextApiRequest, NextApiResponse } from 'next'
import numeral from 'numeral'

import { getOneMonthBlock, getSushiBar } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const blocks = await getOneMonthBlock()
  const blockNumber = blocks && blocks[0].number ? Number(blocks[0].number) : undefined
  if (!blockNumber) {
    res.status(204).send({})
  }
  const [currentBar, oneMonthBar] = await Promise.all([await getSushiBar(), await getSushiBar(blockNumber)])
  if (!currentBar || !oneMonthBar) {
    res.status(204).send({})
  }
  const apr = numeral((currentBar?.ratio / oneMonthBar?.ratio - 1) * 12).format('0.00%')

  res.status(200).send({
    apr: {
      '1m': apr,
    },
  })
}
