import { Request, Response } from 'express'
import { baseAgainstTokens, serializePoolsBinary } from 'sushi'
import { isAddressFast } from 'sushi/serializer'
import { Address } from 'viem'
import { CHAIN_ID } from '../../config/index.js'
import extractor from '../../extractor.js'

async function handler(req: Request, res: Response) {
  //res.setHeader('Cache-Control', 's-maxage=60')
  // console.log('HTTP: GET /pools-for-token/:chainId/:address')
  const _chainId = req.params['chainId']
  if (_chainId === undefined || Number(_chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${_chainId}`)

  const address = req.params['address'] as Address
  if (!isAddressFast(address))
    return res.status(422).send(`Incorrect address ${address}`)

  const tokenManager = extractor.tokenManager
  let token = tokenManager.getKnownToken(address as Address)
  if (token === undefined) {
    token = await tokenManager.findToken(address as Address)
    if (token) tokenManager.addToken(token)
  }
  if (token) {
    const pools = await extractor.getPoolCodesBetweenTokenSets(
      baseAgainstTokens(token, true),
      [token],
    )
    //return res.json(serializePoolCodesJSON(pools))
    res.setHeader('Content-Type', 'application/octet-stream')
    res.set('Content-Type', 'application/octet-stream')
    return res.end(serializePoolsBinary(pools))
  } else return res.status(422).send(`Unknown token ${address}`)
}

export default handler
