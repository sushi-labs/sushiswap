import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getUnixTime } from 'date-fns'

import redis from '../../lib/redis.js'
import { SUPPORTED_CHAINS } from './config.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const chainId = request.query['chainId'] as string

  if (!(chainId in SUPPORTED_CHAINS)) {
    response.status(422).json({
      message: 'Unsupported network. Supported chain ids: '.concat(
        SUPPORTED_CHAINS.join(', '),
      ),
    })
  }

  const data = await redis.hget('prices', chainId)

  if (!data) {
    return response.status(503)
  }

  const json = JSON.parse(data)

  const now = getUnixTime(Date.now())

  return response.status(200).json({
    ...json,
    updatedSecondsAgo: now - json.updatedAtTimestamp,
  })
}

export default handler
