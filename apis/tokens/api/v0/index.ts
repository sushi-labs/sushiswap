import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokens } from '../../lib/api.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')
  const tokens = await getTokens()
  return response.status(200).json(tokens)
}

export default handler
