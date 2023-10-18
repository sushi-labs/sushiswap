import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getSteerVault } from '../../../lib/api/index.js'
import { SteerVaultApiSchema } from '../../../lib/schemas/vault.js'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const result = SteerVaultApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const vault = await getSteerVault(result.data)
  return response.status(200).json(vault)
}

export default handler
