import type { VercelRequest, VercelResponse } from '@vercel/node'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return response.status(200).json([])
}

export default handler
