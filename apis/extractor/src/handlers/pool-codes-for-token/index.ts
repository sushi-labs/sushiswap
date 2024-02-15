import { PoolCode } from '@sushiswap/router'
import { Request, Response } from 'express'
import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST } from 'sushi/config'
import { Token } from 'sushi/currency'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=10, s-maxage=10, stale-while-revalidate=59',
  )
  // console.log('HTTP: GET /get-pool-codes-for-tokens', JSON.stringify(req.query))
  const { chainId, address } = schema.parse(req.query)
  const tokenManager = extractor.tokenManager
  const token = (await tokenManager.findToken(address)) as Token
  const poolCodesMap = new Map<string, PoolCode>()
  const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
  const additional = ADDITIONAL_BASES[chainId]?.[token.wrapped.address] ?? []
  const tokens = Array.from(new Set([token.wrapped, ...common, ...additional]))
  const { prefetched: cachedPoolCodes, fetchingNumber } =
    extractor.getPoolCodesForTokensFull(tokens)
  cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
  if (fetchingNumber > 0) {
    const poolCodes = await extractor.getPoolCodesForTokensAsync(tokens, 2_000)
    poolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
  }
  return res.json(Array.from(poolCodesMap.values()))
}

export default handler
