import { Request, Response } from 'express'
import { Address } from 'viem'
import { CHAIN_ID } from '../../config'
import extractor from '../../extractor'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=60')
  // console.log('HTTP: GET /pools-between/:chainId/:addr0/:addr1'
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  const addr0 = req.params['addr0'] as Address
  const addr1 = req.params['addr1'] as Address
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
