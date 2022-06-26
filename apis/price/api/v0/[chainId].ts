import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SUPPORTED_CHAINS } from '../../config'
import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { chainId } = request.query
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    response
      .status(400)
      .json({ message: 'Unsupported network. Supported chain ids: '.concat(SUPPORTED_CHAINS.join(', ')) })
  }
  const data = await redis.hget('prices', chainId as string)
  if (!data) {
    return response.status(204)
  }
  const json = JSON.parse(data)
  const updatedSecondsAgo = Number((Date.now() / 1000).toFixed()) - json.meta.updatedAtTimestamp
  json.meta.updatedSecondsAgo = updatedSecondsAgo
  return response.status(200).json(json)
}
