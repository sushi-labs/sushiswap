import { Request, Response } from 'express'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader(
    'Cache-Control',
    'maxage=10, s-maxage=10, stale-while-revalidate=59',
  )
  // console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
  schema.parse(req.query)
  const poolCodes = extractor.getCurrentPoolCodes()
  res.json(poolCodes)
}

export default handler
