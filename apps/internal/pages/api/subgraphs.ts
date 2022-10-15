import { getSubgraphs } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const subgraphs = await getSubgraphs()
  res.status(200).send(subgraphs)
}
