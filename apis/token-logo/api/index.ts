import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  runtime: 'experimental-edge',
}

export default (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json(DEFAULT_TOKEN_LIST)
}
