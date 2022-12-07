import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query.chainId as string
  return response.status(200).json({})
}
