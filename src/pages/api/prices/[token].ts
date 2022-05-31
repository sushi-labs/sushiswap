import { withSentry } from '@sentry/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../../services/redis'

const handler = async ({ query: { token } }: NextApiRequest, res: NextApiResponse) => {
  const price = await redis.hget('prices', token as string)
  res.status(200).json({ price })
}

export default withSentry(handler)
