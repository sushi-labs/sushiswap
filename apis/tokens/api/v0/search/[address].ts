import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

import { getTokensByAddress } from '../../../lib/api'

const schema = z.object({
  address: z.coerce.string(),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400')
  const { address } = schema.parse(request.query)
  try {
    const tokens = await getTokensByAddress(address)
    return response.status(200).json(tokens)
  } catch (error) {
    return response.status(404).send('Not found')
  }
}

export default handler
