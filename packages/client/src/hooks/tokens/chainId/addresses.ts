import useSWR from 'swr'

import {
  type GetTokenAddressesArgs,
  type TokenAddress,
  getTokenAddressesUrl,
} from '../../../pure/tokens/chainId/addresses.js'
import { type SWRHookConfig } from '../../../types.js'

export const useTokenAddresses = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetTokenAddressesArgs>) => {
  return useSWR<TokenAddress>(
    shouldFetch !== false ? getTokenAddressesUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
