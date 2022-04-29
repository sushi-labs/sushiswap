import type { VercelRequest, VercelResponse } from '@vercel/node'
import CHAINLINK_TOKEN_LIST from '@sushiswap/chainlink-token-list'

export default (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json(CHAINLINK_TOKEN_LIST)
}
