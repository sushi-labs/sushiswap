import type { NextApiRequest, NextApiResponse } from 'next'

import { getCharts } from '../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getCharts()
  res.status(200).send(data)
}
