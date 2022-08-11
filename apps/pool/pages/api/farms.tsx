import type { NextApiRequest, NextApiResponse } from 'next'

import { getFarms } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const farms = await getFarms()
  res.status(200).send(farms)
}
