import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getSteerVaultCount } from '../../lib/api/index.js'
import { SteerVaultCountApiSchema } from '../../lib/schemas/count.js'

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const result = SteerVaultCountApiSchema.safeParse(_request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const count = await getSteerVaultCount(result.data)
  return response.status(200).json(count)
}

export default handler
