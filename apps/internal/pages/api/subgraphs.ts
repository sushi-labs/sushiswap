import { getAllSubgraphs } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const subgraphs = await getAllSubgraphs()
  res.status(200).send(subgraphs)
}
