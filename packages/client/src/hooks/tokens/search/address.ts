import { getSearchTokensUrl, GetTokenSearchsArgs, TokenSearch } from 'src/pure/tokens/search/address.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useSearchTokens = ({ args, shouldFetch }: SWRHookConfig<GetTokenSearchsArgs>) => {
  return useSWR<TokenSearch>(shouldFetch !== false ? getSearchTokensUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
