import { Request, Response } from 'express'
import { isAddressFast } from 'sushi/serializer'
import { Address } from 'viem'
import { CHAIN_ID } from '../../config/index.js'
import extractor from '../../extractor.js'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=3600')
  // console.log('HTTP: GET /token/:chainId/:address')
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  const address = req.params['address'] as Address
  if (!isAddressFast(address))
    return res.status(422).send(`Incorrect address ${address}`)

  const tokenManager = extractor.tokenManager
  let token = tokenManager.getKnownToken(address as Address)
  if (token === undefined) {
    token = await tokenManager.findToken(address as Address)
  }
  if (token)
    return res.json({
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
    })
  else return res.status(422).send(`Unknown token ${address}`)
}

export default handler
