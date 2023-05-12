import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getUser } from '../../../lib/api'
import { ChainId } from '@sushiswap/chain'

const schema = z.object({
  id: z.string(),
  chainIds: z
    .string()
    .optional()
    .transform((chainIds) => chainIds?.split(',').map((chainId) => Number(chainId) as ChainId)),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  if (!req.query?.id) res.status(422)

  const result = schema.safeParse(req.query)
  if (!result.success) {
    return res.status(400).json(result.error.format())
  }
  const args = result.data

  const user = await getUser(args)
  res.status(200).json(user)
}
