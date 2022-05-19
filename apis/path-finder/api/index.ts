import type { VercelRequest, VercelResponse } from '@vercel/node'

// import {
//   findMultiRouteExactIn,
//   findMultiRouteExactOut,
//   findSingleRouteExactIn,
//   findSingleRouteExactOut,
// } from '@sushiswap/tines'

export default (request: VercelRequest, response: VercelResponse) => {
  const srcChain = request.query.srcChain
  const srcToken = request.query.srcToken

  const dstChain = request.query.dstChain
  const dstToken = request.query.dstToken

  // TODO: Ilya

  return response.status(200).json({})
}
