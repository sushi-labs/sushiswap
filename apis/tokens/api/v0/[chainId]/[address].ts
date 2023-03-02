import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Address, configureChains, createClient, fetchToken } from '@wagmi/core'
import { z } from 'zod'

import { getToken } from '../../../lib/api.js'
import { allChains } from '@sushiswap/wagmi-config/chains'
import { allProviders } from '@sushiswap/wagmi-config/providers'

const { provider } = configureChains(allChains, allProviders)
createClient({
  autoConnect: true,
  provider,
})

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, address } = schema.parse(request.query)
  try {
    const token = await getToken(chainId, address)
    return response.status(200).json(token)
  } catch (error) {
    const tokenFromContract = await fetchToken({
      chainId,
      address: address as Address,
    }).catch(() => {
      return undefined
    })
    if (tokenFromContract) {
      return response
        .status(200)
        .json({
          id: `${chainId}:${tokenFromContract.address}`,
          address: tokenFromContract.address,
          name: tokenFromContract.name,
          symbol: tokenFromContract.symbol,
          decimals: tokenFromContract.decimals,
          isCommon: false,
        })
    } else {
      return response.status(404).send('Not found')
    }
  }
}

export default handler
