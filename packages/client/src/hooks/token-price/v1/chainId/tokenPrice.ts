import { GetTokenPriceArgs, getTokenPriceUrl, TokenPrice } from 'src/pure/token-price/v1/chainId/tokenPrice.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useTokenPriceChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPriceArgs>) => {
  return useSWR<TokenPrice>(shouldFetch !== false ? getTokenPriceUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
