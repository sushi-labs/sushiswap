import { Request, Response } from 'express'
import extractor from '../../extractor'
import schema from './schema'

async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
  // console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
  schema.parse(req.query)
  const poolCodes = extractor.getCurrentPoolCodes()
  const { serialize } = await import('wagmi')
  res.json(serialize(poolCodes))
}

export default handler
