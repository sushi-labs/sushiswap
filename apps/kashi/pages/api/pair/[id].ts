import type { NextApiRequest, NextApiResponse } from 'next'

import { getPair } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('handle pool api', req.query)
  const [pair] = await Promise.all([getPair(req.query.id as string)])

  res.status(200).send({ pair })
}
