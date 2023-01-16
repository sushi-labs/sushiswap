import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Address, configureChains, createClient,erc20ABI, readContracts } from '@wagmi/core'
import zip from 'lodash.zip'
import fetch from 'node-fetch'
import { z } from 'zod'

import { allChains } from '../../../../../chains'
import { allProviders } from '../../../../../providers'

const { provider } = configureChains(allChains, allProviders)
createClient({
  autoConnect: true,
  provider,
})

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  owner: z.coerce.string(),
  spender: z.coerce.string(),
})

const tokensSchema = z.array(z.coerce.string())

const handler = async (request: VercelRequest, response: VercelResponse) => {
  // Serve from cache, but update it, if requested after 1 second.
  response.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const { chainId, owner, spender } = querySchema.parse(request.query)
  const res = await fetch(`https://tokens.sushi.com/v0/${chainId}/addresses`)
  const data = await res.json()
  const tokens = tokensSchema.parse(data)
  const allowances = await readContracts({
    allowFailure: true,
    contracts: tokens.map(
      (token) =>
        ({
          chainId,
          address: token as Address,
          abi: erc20ABI,
          args: [owner as Address, spender as Address],
          functionName: 'allowance',
        } as const)
    ),
  })
  const zipped = zip(tokens, allowances)
  return response
    .status(200)
    .json(
      Object.fromEntries(
        zipped
          .filter(([, allowance]) => !allowance?.isZero())
          .map(([token, allowance]) => [token, allowance?.toString()])
      )
    )
}

export default handler
