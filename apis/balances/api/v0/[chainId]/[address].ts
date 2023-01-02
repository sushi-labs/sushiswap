import { allChains } from '../../../chains'
import { allProviders } from '../../../providers'
import { Address, erc20ABI, readContracts, configureChains, createClient } from '@wagmi/core'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'
import { z } from 'zod'

const alchemyId = process.env['ALCHEMY_ID']

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

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
  const { chainId, address } = querySchema.parse(request.query)

  // Or call DB directly?
  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)

  // Even just importing this config is causing an error:
  // const config = await import('@sushiswap/wagmi-config')

  // Code below is fine, but wagmi isn't working for some reason...
  const results = await readContracts({
    allowFailure: true,
    contracts: tokens.map(
      (address) =>
        ({
          chainId,
          address: address as Address,
          abi: erc20ABI,
          args: [address as Address],
          functionName: 'balanceOf',
        } as const)
    ),
  })

  return response.status(200).json({ chainId, address, results })

  // return response.status(200).json(Object.fromEntries(tokens.map((token, i) => [token, results[i]])))
}

export default handler
