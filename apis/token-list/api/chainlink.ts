import CHAINLINK_TOKEN_LIST from '@sushiswap/chainlink-token-list/dist/sushiswap-chainlink.tokenlist.json' assert { type: 'json' }
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (_request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json(CHAINLINK_TOKEN_LIST)
}
