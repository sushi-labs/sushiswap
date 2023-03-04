import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokens } from '../../lib/api.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const tokens = await getTokens()
  return response.status(200).json(tokens)
}

export default handler
