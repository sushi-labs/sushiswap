import type { NextApiRequest, NextApiResponse } from 'next'

import { getUserStreams } from '../../../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const streams = await getUserStreams(chainId as string, (id as string).toLowerCase())
  res.status(200).send(streams)
}
