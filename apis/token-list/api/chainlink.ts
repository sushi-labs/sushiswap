import CHAINLINK_TOKEN_LIST from '@sushiswap/chainlink-token-list'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json(CHAINLINK_TOKEN_LIST)
}
