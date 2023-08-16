import type { getPopularTokens as _getPopularTokens } from '@sushiswap/tokens-api/lib/api'
import { PopularTokensApiSchema } from '@sushiswap/tokens-api/lib/schemas/chainId/popular'
import { TOKENS_API } from 'src/constants'
import { GetApiInputFromOutput, SWRHookConfig } from 'src/types'
import useSWR from 'swr'

export { PopularTokensApiSchema }
export type PopularToken = Awaited<ReturnType<typeof _getPopularTokens>>
export type GetPopularTokensArgs = GetApiInputFromOutput<
  (typeof PopularTokensApiSchema)['_input'],
  (typeof PopularTokensApiSchema)['_output']
>

export const getPopularTokensUrl = (args: GetPopularTokensArgs) => {
  return `${TOKENS_API}/api/v0/${args.chainId}/popular`
}

export const getPopularTokens = async (args: GetPopularTokensArgs): Promise<PopularToken> => {
  return fetch(getPopularTokensUrl(args)).then((data) => data.json())
}

export const usePopularTokens = ({ args, shouldFetch }: SWRHookConfig<GetPopularTokensArgs>) => {
  return useSWR<PopularToken>(shouldFetch !== false ? getPopularTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
