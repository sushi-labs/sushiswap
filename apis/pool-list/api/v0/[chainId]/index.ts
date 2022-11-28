import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getPools } from '../../../lib/api'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const tokenAddress = request.query.token as string

  if (tokenAddress === undefined) {
    response.status(400).json({ message: 'No token argument provided.' })
  }
  const PROTOCOLS = ['SushiSwap'] // Hardcoded for now, should be a string array param?

  return await getPools(response, chainId, tokenAddress, PROTOCOLS)
}
