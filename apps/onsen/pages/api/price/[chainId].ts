import { getPrice } from 'lib/graph'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId } = req.query
  const price = await getPrice(chainId as string)
  res.status(200).send(price)
}
