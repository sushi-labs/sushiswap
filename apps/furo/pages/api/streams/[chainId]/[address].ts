import { StreamRepresentation } from 'features/context'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getStreams } from '../../../../graph/graph-client'

export type Streams = { incomingStreams: StreamRepresentation[]; outgoingStreams: StreamRepresentation[] }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, address } = req.query
  const streams = (await getStreams(chainId as string, (address as string).toLowerCase())) as Streams
  res.status(200).send(streams)
}
