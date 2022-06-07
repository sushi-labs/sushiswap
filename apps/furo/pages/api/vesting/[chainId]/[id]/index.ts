import { getVesting } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Stream } from '.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const stream = (await getVesting(chainId as string, id as string)) as Stream
  res.status(200).send(stream)
}
