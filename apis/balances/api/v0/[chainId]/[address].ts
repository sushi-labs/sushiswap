import { allChains, allProviders } from '@sushiswap/wagmi-config'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Address } from '@wagmi/core'
import { configureChains, createConfig, erc20ABI, fetchBalance, readContracts } from '@wagmi/core'
import { fetch } from '@whatwg-node/fetch'
import zip from 'lodash.zip'
import { z } from 'zod'

const { publicClient } = configureChains(allChains, allProviders)
createConfig({
  autoConnect: true,
  publicClient,
})

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
  tokens: z.array(z.coerce.string()).optional(),
})

const tokensSchema = z.array(z.coerce.string())

const handler = async (request: VercelRequest, response: VercelResponse) => {
  response.setHeader('Cache-Control', 'max-age=1, stale-while-revalidate=59')
  const { chainId, address } = querySchema.parse(request.query)

  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)

  const balance = await fetchBalance({
    chainId,
    address: address as Address,
  })

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

  const zipped = zip(
    tokens,
    balances.map((balance) => balance?.result || 0n)
  )
  return response.status(200).json({
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': balance.value.toString(),
    ...Object.fromEntries(
      zipped.filter(([, balance]) => balance !== 0n).map(([token, balance]) => [token, balance?.toString()])
    ),
  })
}

export default handler
