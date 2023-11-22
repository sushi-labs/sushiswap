import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { TokenInfo } from 'sushi'
import { getAddress, isAddress } from 'viem'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string()
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader(
    'Cache-Control',
    's-maxage=1800, stale-while-revalidate=3600',
  )

  const { chainId, address } = schema.parse(request.query)

  const result = await fetch(
    `https://tokens-git-feature-token-v2-api.sushi.com/api/v1/${chainId}/`,
  )
  // const result = await fetch(`https://tokens.sushi.com/v1/${chainId}/`)
  const tokenList = (await result.json()) as TokenInfo[]
  const json = tokenList.find((t) => t.address.toLowerCase() === address.toLowerCase())

  if (json !== undefined) {
    return response.status(200).json(json)
  } else {
    return response.status(404).json({ error: 'Token not found' })
  }
}

export default handler
