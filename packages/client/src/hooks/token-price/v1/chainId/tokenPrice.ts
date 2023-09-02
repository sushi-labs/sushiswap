import useSWR from 'swr'

import { GetTokenPriceArgs, getTokenPriceUrl, TokenPrice } from '../../../../pure/token-price/v1/chainId/tokenPrice.js'
import { SWRHookConfig } from '../../../../types.js'

export const useTokenPriceChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPriceArgs>) => {
  return useSWR<TokenPrice>(shouldFetch !== false ? getTokenPriceUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
