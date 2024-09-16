import { Request, Response } from 'express'
import {
  CHAIN_ID,
  REQUESTED_PAIRS_SERIALIZATION_INTERVAL,
} from '../../config/index.js'
import extractor from '../../extractor.js'

let lastPairs: object = {}
let lastPairsSerializationTime = 0

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=60')
  // console.log('HTTP: GET /requested-pairs/:chainId'
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  if (
    Date.now() - lastPairsSerializationTime >
    REQUESTED_PAIRS_SERIALIZATION_INTERVAL(CHAIN_ID)
  ) {
    const start = performance.now()
    const pairs = extractor.requestedPairs

    const addrSet: Set<string> = new Set()
    let pairsCount = 0
    Array.from(pairs.entries()).forEach(([addr, set]) => {
      addrSet.add(addr)
      Array.from(set.keys()).forEach((addr) => addrSet.add(addr))
      pairsCount += set.size
    })
    const addrArray = Array.from(addrSet.keys())
    const addrMap: Map<string, number> = new Map()
    addrArray.forEach((addr, i) => addrMap.set(addr, i))

    const obj: Record<number, number[]> = {}
    Array.from(pairs.entries()).forEach(([addr, set]) => {
      obj[addrMap.get(addr) as number] = Array.from(set.keys()).map((addr) =>
        addrMap.get(addr),
      ) as number[]
    })

    lastPairs = {
      tokens: addrArray,
      pairs: obj,
    }
    lastPairsSerializationTime = Date.now()

    console.log(
      `Requested Pairs serialization: ${pairsCount} pairs ${
        addrArray.length
      } tokens ${Math.round(performance.now() - start)}ms`,
    )
  }

  return res.json(lastPairs)
}

export default handler
