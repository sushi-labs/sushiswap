import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SUPPORTED_CHAINS } from '../../../config'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  const tokenAddress = request.query.tokenAddress as string

  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    response
      .status(400)
      .json({ message: 'Unsupported network. Supported chain ids: '.concat(SUPPORTED_CHAINS.join(', ')) })
  }

  // price for [chainId] & [tokenAddress]
  return response.status(200).send(`price for ${chainId} & ${tokenAddress}`)
}
