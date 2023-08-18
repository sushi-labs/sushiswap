import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetTokenIdsArgs, getTokenIdsUrl, TokenId } from '../../../pure/tokens/chainId/ids.js'

export const useTokenIds = ({ args, shouldFetch }: SWRHookConfig<GetTokenIdsArgs>) => {
  return useSWR<TokenId>(shouldFetch !== false ? getTokenIdsUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
