import { GetTokenPricesArgs, getTokenPricesUrl, TokenPrices } from 'src/pure/token-price/v1/tokenPrices.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useTokenPrices = ({ args, shouldFetch }: SWRHookConfig<GetTokenPricesArgs>) => {
  return useSWR<TokenPrices>(shouldFetch !== false ? getTokenPricesUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
