import { Request, Response } from 'express'
import { serializePoolsBinary } from 'sushi/router'
import { CHAIN_ID, POOLS_SERIALIZATION_INTERVAL } from '../../config.js'
import extractor from '../../extractor.js'

let lastPoolsBlob: Uint8Array = new Uint8Array(0)
let lastPoolsSerializationTime = 0

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
    lastPoolsBlob = serializePoolsBinary(poolCodes)
    lastPoolsSerializationTime = Date.now()
    console.log(
      `Pools binary serialization: ${poolCodes.length} pools ${Math.round(
        performance.now() - start,
      )}ms`,
    )
  }
  res.setHeader('Content-Type', 'application/octet-stream')
  res.set('Content-Type', 'application/octet-stream')
  return res.end(lastPoolsBlob)
}

export default handler
