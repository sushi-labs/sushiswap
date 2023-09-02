import useSWR from 'swr'

import { GetTokenAddressesArgs, getTokenAddressesUrl, TokenAddress } from '../../../pure/tokens/chainId/addresses.js'
import { SWRHookConfig } from '../../../types.js'

export const useTokenAddresses = ({ args, shouldFetch }: SWRHookConfig<GetTokenAddressesArgs>) => {
  return useSWR<TokenAddress>(shouldFetch !== false ? getTokenAddressesUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
