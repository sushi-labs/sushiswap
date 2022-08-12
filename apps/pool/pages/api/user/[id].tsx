import type { NextApiRequest, NextApiResponse } from 'next'

import { getUser } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.id === 'undefined') {
    return res.status(200).send({ user: [] })
  }

  const user = await getUser(req.query.id as string)
  res.status(200).send(user)
}
