import { getTokenIdsByChainId } from '@sushiswap/tokens-api/lib/api.js'
import { TokenIdsApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/ids'

import { TOKENS_API } from '../../../constants.js'
import { type GetApiInputFromOutput } from '../../../types.js'

export { TokenIdsApiSchema }
export type TokenId = Awaited<ReturnType<typeof getTokenIdsByChainId>>
export type GetTokenIdsArgs = GetApiInputFromOutput<
  typeof TokenIdsApiSchema['_input'],
  typeof TokenIdsApiSchema['_output']
>

export const getTokenIdsUrl = (args: GetTokenIdsArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/ids`
}

export const getTokenIds = async (args: GetTokenIdsArgs): Promise<TokenId> => {
  return fetch(getTokenIdsUrl(args)).then((data) => data.json())
}
