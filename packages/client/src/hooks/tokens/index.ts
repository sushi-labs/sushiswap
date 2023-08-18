import { GetTokensArgs, getTokensUrl, Token } from 'src/pure/tokens/index.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useTokens = ({ /*args,*/ shouldFetch }: SWRHookConfig<GetTokensArgs>) => {
  return useSWR<Token>(shouldFetch !== false ? getTokensUrl(/*args*/) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}

export * from './chainId/index.js'
export * from './search/index.js'
