import { getStreams } from 'graph/graph-client'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Streams } from 'types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, address } = req.query
  const streams = (await getStreams(chainId as string, (address as string).toLowerCase())) as Streams
  res.status(200).send(streams)
}
