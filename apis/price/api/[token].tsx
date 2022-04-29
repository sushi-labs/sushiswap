import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(request: VercelRequest, response: VercelResponse) {
  const { token } = request.query
  response.end('')
}
