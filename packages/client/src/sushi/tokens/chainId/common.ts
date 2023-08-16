import type { getCommonTokens as _getCommonTokens } from '@sushiswap/tokens-api/lib/api'
import { CommonTokensApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/common'
import { TOKENS_API } from 'src/constants'
import { GetApiInputFromOutput, SWRHookConfig } from 'src/types'
import useSWR from 'swr'

export { CommonTokensApiSchema }
export type CommonToken = Awaited<ReturnType<typeof _getCommonTokens>>
export type GetCommonTokensArgs = GetApiInputFromOutput<
  (typeof CommonTokensApiSchema)['_input'],
  (typeof CommonTokensApiSchema)['_output']
>

export const getCommonTokensUrl = (args: GetCommonTokensArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/common`
}

export const getCommonTokens = async (args: GetCommonTokensArgs): Promise<CommonToken> => {
  return fetch(getCommonTokensUrl(args)).then((data) => data.json())
}

export const useCommonTokens = ({ args, shouldFetch }: SWRHookConfig<GetCommonTokensArgs>) => {
  return useSWR<CommonToken>(shouldFetch !== false ? getCommonTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
