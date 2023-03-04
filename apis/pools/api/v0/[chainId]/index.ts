import type { VercelRequest, VercelResponse } from '@vercel/node'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json([])
}

export default handler
