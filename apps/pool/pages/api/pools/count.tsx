import type { NextApiRequest, NextApiResponse } from 'next'

import { getPoolCount } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bundles = await getPoolCount()
  res.status(200).send(bundles)
}
