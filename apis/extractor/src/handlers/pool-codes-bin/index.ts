import { Request, Response } from 'express'
import { serializePoolsBinary } from 'sushi/router'
import { CHAIN_ID, POOLS_SERIALIZATION_INTERVAL } from '../../config.js'
import extractor from '../../extractor.js'
import { querySchema } from './schema.js'

let lastAllPoolsBlob: Uint8Array = new Uint8Array(0)
let lastAllPoolsSerializationTime = 0

async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=1, s-maxage=1, stale-while-revalidate=59',
  )
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  res.setHeader('Content-Type', 'application/octet-stream')
  res.set('Content-Type', 'application/octet-stream')

  const { stateId } = querySchema.parse(req.query)

  const allPoolsSerialization =
    stateId === undefined || !extractor.isMarkExist(stateId)

  // Return previous if it is fresh enough
  if (
    allPoolsSerialization &&
    Date.now() - lastAllPoolsSerializationTime <=
      POOLS_SERIALIZATION_INTERVAL(CHAIN_ID)
  )
    return res.end(lastAllPoolsBlob)

  const start = performance.now()
  const newStateId = Date.now()
  const poolCodes = extractor.getCurrentPoolCodesUpdate(
    stateId as number,
    newStateId,
  )
  const data = serializePoolsBinary(poolCodes, newStateId.toString())
  if (allPoolsSerialization) {
    lastAllPoolsBlob = data
    lastAllPoolsSerializationTime = newStateId
  }
  const timing = Math.round(performance.now() - start)
  console.log(
    `Pools binary serialization: ${poolCodes.length} pools ${timing}ms`,
  )
  return res.end(data)
}

export default handler
