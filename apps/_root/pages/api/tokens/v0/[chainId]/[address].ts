import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getToken } from '../../../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
})

type Data = Awaited<ReturnType<typeof getToken>>

const handler = async (request: NextApiRequest, response: NextApiResponse<Data>) => {
  const { chainId, address } = schema.parse(request.query)
  try {
    const token = await getToken(chainId, address)
    return response.status(200).json(token)
  } catch (error: unknown) {
    return response.status(404)
  }
}

export default handler
