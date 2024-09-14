import { Request, Response } from 'express'
import { serializePoolsBinary } from 'sushi'
import { ADDITIONAL_BASES } from 'sushi/config'
import { Token } from 'sushi/currency'
//import { serializePoolCodesJSON } from 'sushi/serializer'
import { Address } from 'viem'
import { CHAIN_ID } from '../../config/index.js'
import extractor from '../../extractor.js'

async function handler(req: Request, res: Response) {
  //res.setHeader('Cache-Control', 's-maxage=60')
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
    const additional0: Token[] =
      ADDITIONAL_BASES[CHAIN_ID]?.[token0.wrapped.address] ?? []
    const additional1: Token[] =
      ADDITIONAL_BASES[CHAIN_ID]?.[token1.wrapped.address] ?? []
    const pools = await extractor.getPoolCodesBetweenTokenSets(
      [token0, ...additional0],
      [token1, ...additional1],
    )
    //return res.json(serializePoolCodesJSON(pools))
    res.setHeader('Content-Type', 'application/octet-stream')
    res.set('Content-Type', 'application/octet-stream')
    return res.end(serializePoolsBinary(pools))
  }
}

export default handler
