import type { NextApiRequest, NextApiResponse } from 'next'
import numeral from 'numeral'

import { getOneYearBlock, getSushiBar } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const blocks = await getOneYearBlock()
  const blockNumber = blocks && blocks[0].number ? Number(blocks[0].number) : undefined
  if (!blockNumber) {
    res.status(204).send({})
  }
  const [currentBar, oneYearBar] = await Promise.all([await getSushiBar(), await getSushiBar(blockNumber)])
  if (!currentBar || !oneYearBar) {
    res.status(204).send({})
  }
  const apr = numeral(currentBar?.ratio / oneYearBar?.ratio - 1).format('0.00%')

  res.status(200).send({
    apr: {
      '1y': apr,
    },
  })
}
