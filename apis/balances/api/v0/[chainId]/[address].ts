import { allChains } from '../../../chains'
import { allProviders } from '../../../providers'
import { Address, erc20ABI, readContracts, configureChains, createClient } from '@wagmi/core'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'
import { z } from 'zod'
import zip from 'lodash.zip'

const { provider, webSocketProvider } = configureChains(allChains, allProviders)
createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

const querySchema = z.object({
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
  // Serve from cache, but update it, if requested after 1 second.
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const { chainId, address } = querySchema.parse(request.query)

  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)
  const balances = await readContracts({
    allowFailure: true,
    contracts: tokens.map(
      (token) =>
        ({
          chainId,
          address: token as Address,
          abi: erc20ABI,
          args: [address as Address],
          functionName: 'balanceOf',
        } as const)
    ),
  })
  const zipped = zip(tokens, balances)
  return response
    .status(200)
    .json(
      Object.fromEntries(
        zipped.filter(([, balance]) => !balance?.isZero()).map(([token, balance]) => [token, balance?.toString()])
      )
    )
}

export default handler
