import { CommonToken, GetCommonTokensArgs, getCommonTokensUrl } from 'src/pure/tokens/chainId/common.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useCommonTokens = ({ args, shouldFetch }: SWRHookConfig<GetCommonTokensArgs>) => {
  return useSWR<CommonToken>(shouldFetch !== false ? getCommonTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
