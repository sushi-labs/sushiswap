import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  const amount = request.query.amount

  const gasPrice = request.query.gasPrice

  const srcChainId = request.query.srcChainId
  const srcToken = request.query.srcToken

  const dstChainId = request.query.dstChainId
  const dstToken = request.query.dstToken

  // TODO: Ilya

  return response.status(200).json({})
}
