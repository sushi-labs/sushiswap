import type { NextApiRequest, NextApiResponse } from 'next'

import { getToken } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  console.log('handle pool api', req.query)
  const [token] = await Promise.all([getToken(req.query.id as string)])

  res.status(200).send({ token })
}
