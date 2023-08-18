import { SWRHookConfig } from 'src/types.js'
import useSWR from 'swr'

import {
  GetTokenPricesChainArgs,
  getTokenPricesChainUrl,
  TokenPricesChain,
} from '../../../../pure/token-price/v1/chainId/tokenPricesChain.js'

export const useTokenPricesChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPricesChainArgs>) => {
  return useSWR<TokenPricesChain>(shouldFetch !== false ? getTokenPricesChainUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
