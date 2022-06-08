import { getUserStreams } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Streams } from 'types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const streams = (await getUserStreams(chainId as string, (id as string).toLowerCase())) as Streams
  res.status(200).send(streams)
}
