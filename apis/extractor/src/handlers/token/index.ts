import { Request, Response } from 'express'
import { Address } from 'viem'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  // console.log('HTTP: GET /token')
  const { address } = schema.parse(req.query)
  const tokenManager = extractor.tokenManager
  let token = tokenManager.getKnownToken(address as Address)
  if (token === undefined) {
    token = await tokenManager.findToken(address as Address)
    if (token) tokenManager.addToken(token)
  }
  if (token)
    return res.json(
      JSON.stringify({
        chainId: token.chainId,
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name,
      }),
    )
  else return res.status(422).send(`Unknown token ${address}`)
}

export default handler
