import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getTokenIdsByChainId } from '../../../../../lib/api'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})

type Data = Awaited<ReturnType<typeof getTokenIdsByChainId>>[number]['id'][]

const handler = async (request: NextApiRequest, response: NextApiResponse<Data>) => {
  const { chainId } = schema.parse(request.query)
  const token = await getTokenIdsByChainId(chainId)
  return response.status(200).json(token.map(({ id }) => id))
}

export default handler
