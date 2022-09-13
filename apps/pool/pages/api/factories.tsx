import type { NextApiRequest, NextApiResponse } from 'next'

import { getFactories } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bundles = await getFactories()
  res.status(200).send(bundles)
}
