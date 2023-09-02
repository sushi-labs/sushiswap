import useSWR from 'swr'

import { GetTokenArgs, getTokenUrl, Token } from '../../../pure/tokens/chainId/address.js'
import { SWRHookConfig } from '../../../types.js'

export const useToken = ({ args, shouldFetch }: SWRHookConfig<GetTokenArgs>) => {
  return useSWR<Token>(shouldFetch !== false ? getTokenUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
