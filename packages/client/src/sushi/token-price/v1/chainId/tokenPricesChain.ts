import type {} from '@sushiswap/database'
import type { getPricesByChainId } from '@sushiswap/token-price-api/lib/api.js'
import { TokenPricesChainV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1/chainId/index.js'
import { fetch } from '@whatwg-node/fetch'
import { parseArgs } from 'src/functions.js'
import useSWR from 'swr'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import type { GetApiInputFromOutput, SWRHookConfig } from '../../../../types.js'

export { TokenPricesChainV1ApiSchema }
export type TokenPricesChain = Awaited<ReturnType<typeof getPricesByChainId>>
export type GetTokenPricesChainArgs = GetApiInputFromOutput<
  (typeof TokenPricesChainV1ApiSchema)['_input'],
  (typeof TokenPricesChainV1ApiSchema)['_output']
>

export function getTokenPricesChainUrl(args: GetTokenPricesChainArgs) {
  return `${TOKEN_PRICE_API}/api/v1/${args.chainId}?${parseArgs(args)}`
}

export const getTokenPricesChain = async (args: GetTokenPricesChainArgs): Promise<TokenPricesChain> => {
  return fetch(getTokenPricesChainUrl(args)).then((data) => data.json())
}

export const useTokenPricesChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPricesChainArgs>) => {
  return useSWR<TokenPricesChain>(shouldFetch !== false ? getTokenPricesChainUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
