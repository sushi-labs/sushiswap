import useSWR from 'swr'

import {
  type GetTokenSearchsArgs,
  type TokenSearch,
  getSearchTokensUrl,
} from '../../../pure/tokens/search/address.js'
import { type SWRHookConfig } from '../../../types.js'

export const useSearchTokens = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetTokenSearchsArgs>) => {
  return useSWR<TokenSearch>(
    shouldFetch !== false ? getSearchTokensUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
