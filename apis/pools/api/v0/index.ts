import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getPools } from '../../lib/api'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const pools = await getPools({ })
  return response.status(200).json(pools)
}

export default handler
