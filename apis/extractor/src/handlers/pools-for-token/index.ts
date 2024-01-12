import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
import { Request, Response } from 'express'
import { Token } from 'sushi/currency'
import { Address } from 'viem'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  // console.log('HTTP: GET /get-pool-codes-for-tokens2', JSON.stringify(req.query))
  const { chainId, address } = schema.parse(req.query)
  const tokenManager = extractor.tokenManager
  let token = tokenManager.getKnownToken(address as Address)
  if (token === undefined) {
    token = await tokenManager.findToken(address as Address)
    if (token) tokenManager.addToken(token)
  }
  if (token) {
    const common: Token[] = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
    const additional: Token[] =
      ADDITIONAL_BASES[chainId]?.[token.wrapped.address] ?? []
    const tokens = Array.from(new Set([...common, ...additional]))
    const pools = await extractor.getPoolCodesBetweenTokenSets(tokens, [token])
    const { serialize } = await import('wagmi')
    return res.json(serialize(pools))
  } else return res.status(422).send(`Unknown token ${address}`)
}

export default handler
