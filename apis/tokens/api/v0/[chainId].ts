import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getTokens } from '../../lib/api'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId
  if (!chainId) throw Error('chainId is required!')
  if (typeof chainId !== 'string') throw Error('chainId typeof string is required!')
  const tokens = await getTokens(chainId)
  return response.status(200).json(tokens)
}
