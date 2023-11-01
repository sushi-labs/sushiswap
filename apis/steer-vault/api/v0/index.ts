import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getSteerVaults } from '../../lib/api'
import { SteerVaultsApiSchema } from '../../lib/schemas'

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const result = SteerVaultsApiSchema.safeParse(request.query)
  if (!result.success) {
    return response.status(400).json(result.error.format())
  }

  const vaults = await getSteerVaults(result.data)
  return response.status(200).json(vaults)
}

export default handler
