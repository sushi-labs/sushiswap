import type { getTokenAddressesByChainId } from '@sushiswap/tokens-api/lib/api'
import { TokenAddressesApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/addresses'

import { TOKENS_API } from '../../../constants.js'
import type { GetApiInputFromOutput } from '../../../types.js'

export { TokenAddressesApiSchema }
export type TokenAddress = Awaited<
  ReturnType<typeof getTokenAddressesByChainId>
>
export type GetTokenAddressesArgs = GetApiInputFromOutput<
  (typeof TokenAddressesApiSchema)['_input'],
  (typeof TokenAddressesApiSchema)['_output']
>

export const getTokenAddressesUrl = (args: GetTokenAddressesArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/addresses`
}

export const getTokenAddresses = async (
  args: GetTokenAddressesArgs,
): Promise<TokenAddress> => {
  return fetch(getTokenAddressesUrl(args)).then((data) => data.json())
}
