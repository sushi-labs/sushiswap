import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetTokenAddressesArgs, getTokenAddressesUrl, TokenAddress } from '../../../pure/tokens/chainId/addresses.js'

export const useTokenAddresses = ({ args, shouldFetch }: SWRHookConfig<GetTokenAddressesArgs>) => {
  return useSWR<TokenAddress>(shouldFetch !== false ? getTokenAddressesUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
