import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { TokenInfo } from 'sushi'
import { isAddress } from 'viem'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string().refine(isAddress, {
    message: 'Address is not checksummed.',
  }),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')

  const { chainId, address } = schema.parse(request.query)

  const result = await fetch(`https://tokens.sushi.com/v1/${chainId}/`)
  const tokenList = (await result.json()) as TokenInfo[]
  const json = tokenList.find((t) => t.address === address)

  if (json !== undefined) {
    return response.status(200).json(json)
  } else {
    return response.status(404).json({ error: 'Token not found' })
  }
}

export default handler
