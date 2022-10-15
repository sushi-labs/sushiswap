import type { NextApiRequest, NextApiResponse } from 'next'

import { getPair } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pair = await getPair(req.query.id as string)
  res.status(200).send({ pair })
}
