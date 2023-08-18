import { GetTokenArgs, getTokenUrl, Token } from 'src/pure/tokens/chainId/address.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useToken = ({ args, shouldFetch }: SWRHookConfig<GetTokenArgs>) => {
  return useSWR<Token>(shouldFetch !== false ? getTokenUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
