import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { CommonToken, GetCommonTokensArgs, getCommonTokensUrl } from '../../../pure/tokens/chainId/common.js'

export const useCommonTokens = ({ args, shouldFetch }: SWRHookConfig<GetCommonTokensArgs>) => {
  return useSWR<CommonToken>(shouldFetch !== false ? getCommonTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
