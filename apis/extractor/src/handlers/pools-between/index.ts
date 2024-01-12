import { Request, Response } from 'express'
import { Address } from 'viem'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  // console.log('HTTP: GET /get-pool-codes-for-tokens2', JSON.stringify(req.query))
  const { token0: addr0, token1: addr1 } = schema.parse(req.query)
  const tokenManager = extractor.tokenManager
  const token0 = tokenManager.getKnownToken(addr0 as Address)
  const token1 = tokenManager.getKnownToken(addr1 as Address)
  if (!token0 || !token1) {
    return res.status(422).send(`Unknown token ${token0 ? addr0 : addr1}`)
  } else {
    const pools = await extractor.getPoolCodesBetweenTokenSets(
      [token0],
      [token1],
    )
    const { serialize } = await import('wagmi')
    return res.json(serialize(pools))
  }
}

export default handler
