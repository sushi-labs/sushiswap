import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'

import { getFuroTokens } from '../../../lib/api'
import { FURO_ENABLED_NETWORKS } from '@sushiswap/graph-config'

export const FuroTokensSchema = z.object({
  // first: z.coerce.number().default(20),
  // skip: z.coerce.number().default(0),
  tokenSymbols: z
    .string()
    .optional()
    .transform((val) => val?.split(',')),
  // orderBy: z.string().default('liquidityUSD'),
  // orderDirection: z.string().default('desc'),
  chainIds: z
    .string()
    .optional()
    .default(FURO_ENABLED_NETWORKS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v))),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')
  const query = req.query

  const result = FuroTokensSchema.safeParse(query)
  if (!result.success) return res.status(400).send(result.error)

  const tokens = await getFuroTokens(result.data)
  res.status(200).send(stringify(tokens))
}
