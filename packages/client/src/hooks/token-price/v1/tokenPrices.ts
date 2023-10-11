import useSWR from 'swr'

import {
  type GetTokenPricesArgs,
  type TokenPrices,
  getTokenPricesUrl,
} from '../../../pure/token-price/v1/tokenPrices.js'
import { type SWRHookConfig } from '../../../types.js'

export const useTokenPrices = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetTokenPricesArgs>) => {
  return useSWR<TokenPrices>(
    shouldFetch !== false ? getTokenPricesUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
