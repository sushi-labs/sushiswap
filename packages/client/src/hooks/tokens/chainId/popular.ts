import useSWR from 'swr'

import {
  type GetPopularTokensArgs,
  type PopularToken,
  getPopularTokensUrl,
} from '../../../pure/tokens/chainId/popular.js'
import { type SWRHookConfig } from '../../../types.js'

export const usePopularTokens = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetPopularTokensArgs>) => {
  return useSWR<PopularToken>(
    shouldFetch !== false ? getPopularTokensUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
