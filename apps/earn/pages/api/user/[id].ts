import type { NextApiRequest, NextApiResponse } from 'next'

import { getUser, GetUserQuery } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const user = await getUser(req.query as GetUserQuery)
  res.status(200).json(user)
}
