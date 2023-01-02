import type { VercelRequest, VercelResponse } from '@vercel/node'
import { RequestInfo, RequestInit } from 'node-fetch'
import { z } from 'zod'

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init))

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
  // tokens: z.array(z.coerce.string()),
})

const tokensSchema = z.array(z.coerce.string())

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, address } = schema.parse(request.query)

  // Or call DB directly?
  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)

  // const results = await readContracts({
  //   contracts: tokens.map(
  //     (address) =>
  //       ({
  //         chainId,
  //         address,
  //         abi: erc20ABI,
  //         functionName: 'balanceOf',
  //       } as const)
  //   ),
  // })

  return response.status(200).json({ tokens })
}

export default handler
