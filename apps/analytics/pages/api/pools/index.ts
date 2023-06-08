import { getPools, PoolsApiSchema } from '@sushiswap/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600')

    const result = PoolsApiSchema.safeParse(req.query)
    if (!result.success) {
      return res.status(400).json(result.error.format())
    }

    const pools = await getPools(req.query)
    res.status(200).json(pools)
  } catch (error) {
    console.error(error)
    res.status(500).send('')
  }
}
