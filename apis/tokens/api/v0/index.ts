import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokens } from '../../lib/api'

export default async (request: VercelRequest, response: VercelResponse) => {
  const tokens = await getTokens()
  return response.status(200).json(tokens)
}
