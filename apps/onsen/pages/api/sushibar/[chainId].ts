import { getOneMonthBlock, getSushiBar } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'
import numeral from 'numeral'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query
  const blockNumber = await getOneMonthBlock(chainId as string)
  if (!blockNumber) {
    res.status(204).send({})
  }
  const [currentBar, oneMonthBar] = await Promise.all([
    await getSushiBar(chainId as string),
    await getSushiBar(chainId as string, Number(blockNumber))
  ])
  if (!currentBar || !oneMonthBar) {
    res.status(204).send({})
  }
  const apr = numeral((currentBar?.ratio / oneMonthBar?.ratio - 1) * 12).format('0.00%')

  res.status(200).send({apr})
}
