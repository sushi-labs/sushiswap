import type { VercelRequest, VercelResponse } from '@vercel/node'

import redis from '../../lib/redis'

export default async (request: VercelRequest, response: VercelResponse) => {
  const data = await redis.hgetall('farms')

  if (!data) {
    return response.status(503)
  }

  const farms = Object.values(data).reduce((previousValue: any, data: any) => {
    const { chainId, farms } = JSON.parse(data)
    return [
      ...previousValue,
      ...Object.entries(farms).reduce((previousValue: any[], [key, value]: [string, any], i) => {
        previousValue[i] = {
          ...value,
          id: `${chainId}:${key}`,
          chainId,
          pool: key,
        }
        return previousValue
      }, []),
    ]
  }, [])

  return response.status(200).json(farms)
}
