import * as DEFAULT_TOKEN_LIST from '@sushiswap/default-token-list' assert { type: 'json' }
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 'max-age=0, s-maxage=900')
  return response.status(200).json(DEFAULT_TOKEN_LIST)
}
