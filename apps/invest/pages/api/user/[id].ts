import type { NextApiRequest, NextApiResponse } from 'next'

import { getUser, GetUserQuery } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=100, stale-while-revalidate=599')
  if (req.query.id === 'undefined') {
    return res.status(200).send({ user: [] })
  }
  const user = await getUser(req.query as GetUserQuery)
  res.status(200).send(user)
}
