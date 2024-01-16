import { Request, Response } from 'express'
import { CHAIN_ID } from '../../config'
import extractor from '../../extractor'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=60')
  // console.log('HTTP: GET /requested-pairs/:chainId'
  const chainId = req.params['chainId']
  if (chainId === undefined || Number(chainId) !== CHAIN_ID)
    return res.status(422).send(`Unsupported network ${chainId}`)

  const pairs = extractor.requestedPairs

  const addrSet: Set<string> = new Set()
  Array.from(pairs.entries()).forEach(([addr, set]) => {
    addrSet.add(addr)
    Array.from(set.keys()).forEach((addr) => addrSet.add(addr))
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

  return res.json({
    tokens: addrArray,
    pairs: obj,
  })
}

export default handler
