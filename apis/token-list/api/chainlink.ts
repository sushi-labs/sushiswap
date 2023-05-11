import CHAINLINK_TOKEN_LIST from '@sushiswap/chainlink-token-list'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const handler = (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600')
  return response.status(200).json(CHAINLINK_TOKEN_LIST)
}
export default handler
