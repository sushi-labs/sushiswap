import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  const { address, chainId } = request.query
  return response.status(200).json({ address, chainId })
}
