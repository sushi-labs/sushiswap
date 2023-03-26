import type { NextApiRequest, NextApiResponse } from 'next'

import { getTokens } from '../../../../lib/api'

type Data = Awaited<ReturnType<typeof getTokens>>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const tokens = await getTokens()
  return res.status(200).json(tokens)
}
