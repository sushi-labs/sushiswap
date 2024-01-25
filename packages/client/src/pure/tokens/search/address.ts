import { getTokensByAddress } from '@sushiswap/tokens-api/lib/api'
import { SearchTokenApiSchema } from '@sushiswap/tokens-api/lib/schemas/search/address'

import { TOKENS_API } from '../../../constants.js'
import { type GetApiInputFromOutput } from '../../../types.js'

export { SearchTokenApiSchema }
export type TokenSearch = Awaited<ReturnType<typeof getTokensByAddress>>
export type GetTokenSearchsArgs = GetApiInputFromOutput<
  (typeof SearchTokenApiSchema)['_input'],
  (typeof SearchTokenApiSchema)['_output']
>

export const getSearchTokensUrl = (args: GetTokenSearchsArgs) => {
  return `${TOKENS_API}/api/v0/search/${args.address}`
}

export const getSearchTokens = async (
  args: GetTokenSearchsArgs,
): Promise<TokenSearch> => {
  return fetch(getSearchTokensUrl(args)).then((data) => data.json())
}
