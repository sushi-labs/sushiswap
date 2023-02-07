import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import type { PoolType } from '../../lib/index.js'
import { getPoolCount } from '../../lib/api.js'

const schema = z.object({
  chainIds: z
    .string()
    .transform((val) => val.split(',').map((v) => parseInt(v)))
    .optional(),
  isIncentivized: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isIncentivized must true or false')
      }
    })
    .optional(),
  isWhitelisted: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isWhitelisted must true or false')
      }
    })
    .optional(),
  poolTypes: z
    .string()
    .optional()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
})

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  const result = schema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const { chainIds, isIncentivized, isWhitelisted, poolTypes } = result.data
  const count = await getPoolCount({ chainIds, isIncentivized, isWhitelisted, poolTypes })
  return response.status(200).json({ count })
}

export default handler
