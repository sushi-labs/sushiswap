import { Request, Response } from 'express'
//import { serializePoolCodesJSON } from 'sushi/serializer'
import { CHAIN_ID, POOLS_SERIALIZATION_INTERVAL } from '../../config/index.js'
import extractor from '../../extractor.js'

let lastPools: object = {}
let lastPoolsSerializationTime = 0

// just for test
async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=1, s-maxage=1, stale-while-revalidate=59',
  )
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  if (
    Date.now() - lastPoolsSerializationTime >
    POOLS_SERIALIZATION_INTERVAL(CHAIN_ID)
  ) {
    const start = performance.now()
    const poolCodes = extractor.getCurrentPoolCodes()
    //lastPools = serializePoolCodesJSON(poolCodes)
    lastPools = {
      poolCodes,
    }
    lastPoolsSerializationTime = Date.now()
    console.log(
      `Pools serialization: ${poolCodes.length} pools ${Math.round(
        performance.now() - start,
      )}ms`,
    )
  }
  return res.json(lastPools)
}

export default handler
