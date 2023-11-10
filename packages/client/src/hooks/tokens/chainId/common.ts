import useSWR from 'swr'

import {
  type CommonToken,
  type GetCommonTokensArgs,
  getCommonTokensUrl,
} from '../../../pure/tokens/chainId/common.js'
import { type SWRHookConfig } from '../../../types.js'

export const useCommonTokens = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetCommonTokensArgs>) => {
  return useSWR<CommonToken>(
    shouldFetch !== false ? getCommonTokensUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
