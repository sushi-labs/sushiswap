import {
  GetTokenPricesChainArgs,
  getTokenPricesChainUrl,
  TokenPricesChain,
} from 'src/pure/token-price/v1/chainId/tokenPricesChain.js'
import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

export const useTokenPricesChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPricesChainArgs>) => {
  return useSWR<TokenPricesChain>(shouldFetch !== false ? getTokenPricesChainUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
