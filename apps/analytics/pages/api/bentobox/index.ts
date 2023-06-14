import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'

import { getBentoBoxTokens } from '../../../lib/api'
import { BENTOBOX_ENABLED_NETWORKS } from '@sushiswap/graph-config'

export const bentoBoxTokensSchema = z.object({
  tokenSymbols: z
    .string()
    .optional()
    .transform((val) => val?.split(',')),
  chainIds: z
    .string()
    .optional()
    .default(BENTOBOX_ENABLED_NETWORKS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v))),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const query = req.query

  const result = bentoBoxTokensSchema.safeParse(query)
  if (!result.success) return res.status(400).send(result.error)

  const tokens = await getBentoBoxTokens(result.data)
  res.status(200).send(stringify(tokens))
}
