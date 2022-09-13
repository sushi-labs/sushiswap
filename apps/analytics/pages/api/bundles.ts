import type { NextApiRequest, NextApiResponse } from 'next'

import { getBundles } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const bundles = await getBundles()
  res.status(200).send(bundles)
}
