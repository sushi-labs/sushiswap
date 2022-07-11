import DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json(DEFAULT_TOKEN_LIST)
}
