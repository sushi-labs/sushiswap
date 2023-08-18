import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import { GetTokenPriceArgs, getTokenPriceUrl, TokenPrice } from '../../../../pure/token-price/v1/chainId/tokenPrice.js'

export const useTokenPriceChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPriceArgs>) => {
  return useSWR<TokenPrice>(shouldFetch !== false ? getTokenPriceUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
