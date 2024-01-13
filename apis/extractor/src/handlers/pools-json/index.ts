import { serializePoolCodesJSON } from '@sushiswap/router'
import { Request, Response } from 'express'
import { CHAIN_ID } from '../../config'
import extractor from '../../extractor'

async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=10, s-maxage=10, stale-while-revalidate=59',
  )
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  const poolCodes = extractor.getCurrentPoolCodes()
  return res.json(serializePoolCodesJSON(poolCodes))
}

export default handler
