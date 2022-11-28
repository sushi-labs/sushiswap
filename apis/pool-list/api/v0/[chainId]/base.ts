import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getBase } from '../../../lib/api'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const excludeTokensArg = request.query.excludeTokens as string
  const excludeTokens = excludeTokensArg ? excludeTokensArg.split(',') : []
  const PROTOCOLS = ['SushiSwap'] // Hardcoded for now, should be a string array param?

  return await getBase(response, chainId, excludeTokens, PROTOCOLS)
}
