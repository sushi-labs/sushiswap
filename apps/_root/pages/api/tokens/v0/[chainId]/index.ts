import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getTokensByChainId } from '../../../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

type Data = Awaited<ReturnType<typeof getTokensByChainId>>

const handler = async (request: NextApiRequest, response: NextApiResponse<Data>) => {
  const { chainId } = schema.parse(request.query)
  const tokens = await getTokensByChainId(chainId)
  return response.status(200).json(tokens)
}

export default handler
