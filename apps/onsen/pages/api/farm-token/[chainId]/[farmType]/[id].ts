import { FarmType } from 'features/onsen/context/types'
import { getFarmToken } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id, farmType } = req.query
  const farmToken = await getFarmToken(chainId as string, id as string, farmType as FarmType)
  res.status(200).send(farmToken)
}
