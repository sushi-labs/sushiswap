import type { getTokens as _getTokens } from '@sushiswap/tokens-api/lib/api.js'
import { TokensApiSchema } from '@sushiswap/tokens-api/lib/schemas/index'

import { TOKENS_API } from '../../constants.js'
import { type GetApiInputFromOutput } from '../../types.js'

export { TokensApiSchema }
export type Token = Awaited<ReturnType<typeof _getTokens>>
export type GetTokensArgs = GetApiInputFromOutput<
  typeof TokensApiSchema['_input'],
  typeof TokensApiSchema['_output']
>

export const getTokensUrl = (/*args: GetTokensArgs*/) => {
  return `${TOKENS_API}/api/v0`
}

export const getTokens = async (/*args: GetTokensArgs*/): Promise<Token> => {
  return fetch(getTokensUrl(/*args*/)).then((data) => data.json())
}

export * from './chainId/index.js'
export * from './search/index.js'
