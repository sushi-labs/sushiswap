import { TOKENS_SUPPORTED_CHAIN_IDS } from 'config'
import { getTokens } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const tokens = await getTokens({
    chainIds: req?.query?.chainIds ? JSON.parse(req.query.chainIds as string) : TOKENS_SUPPORTED_CHAIN_IDS,
    filter: req?.query?.filter ? JSON.parse(req.query.filter as string) : '',
  })
  res.status(200).send(tokens)
}
