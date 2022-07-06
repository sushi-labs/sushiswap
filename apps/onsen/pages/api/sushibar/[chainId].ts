import { getOneMonthBlock, getSushiBar } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'
import numeral from 'numeral'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query

  const blocks = await getOneMonthBlock(chainId as string)
  const blockNumber = blocks && blocks[0].number ? Number(blocks[0].number) : undefined
  if (!blockNumber) {
    res.status(204).send({})
  }
  const [currentBar, oneMonthBar] = await Promise.all([
    await getSushiBar(chainId as string),
    await getSushiBar(chainId as string, blockNumber),
  ])
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
