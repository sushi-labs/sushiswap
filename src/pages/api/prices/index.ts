import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../../services/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const prices = (await redis.hvals('prices')).map((price: string) => price)
  res.status(200).json({ prices })
}

export default withSentry(handler)
