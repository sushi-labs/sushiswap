import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetPopularTokensArgs, getPopularTokensUrl, PopularToken } from '../../../pure/tokens/chainId/popular.js'

export const usePopularTokens = ({ args, shouldFetch }: SWRHookConfig<GetPopularTokensArgs>) => {
  return useSWR<PopularToken>(shouldFetch !== false ? getPopularTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
