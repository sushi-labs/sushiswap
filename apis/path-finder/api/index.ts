import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  const tokenIn = request.query.tokenIn
  const tokenOut = request.query.tokenOut

  // TODO: Ilya

  return response.status(200).json({})
}
