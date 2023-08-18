import type { getTokenAddressesByChainId } from '@sushiswap/tokens-api/lib/api.js'
import { TokenAddressesApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/addresses.js'
import { TOKENS_API } from 'src/constants.js'
import { GetApiInputFromOutput } from 'src/types.js'

export { TokenAddressesApiSchema }
export type TokenAddress = Awaited<ReturnType<typeof getTokenAddressesByChainId>>
export type GetTokenAddressesArgs = GetApiInputFromOutput<
  (typeof TokenAddressesApiSchema)['_input'],
  (typeof TokenAddressesApiSchema)['_output']
>

export const getTokenAddressesUrl = (args: GetTokenAddressesArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/addresses`
}

export const getTokenAddresses = async (args: GetTokenAddressesArgs): Promise<TokenAddress> => {
  return fetch(getTokenAddressesUrl(args)).then((data) => data.json())
}
