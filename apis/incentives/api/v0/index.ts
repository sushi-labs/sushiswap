import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getIncentives } from '../../lib/api'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const incentives = await getIncentives()
  return response.status(200).json(incentives)
}

export default handler
