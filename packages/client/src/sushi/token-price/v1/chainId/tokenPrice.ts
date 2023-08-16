import type {} from '@sushiswap/database'
import type { getPrice } from '@sushiswap/token-price-api/lib/api.js'
import { TokenPriceV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1/chainId/address.js'
import { fetch } from '@whatwg-node/fetch'
import { parseArgs } from 'src/functions.js'
import useSWR from 'swr'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import type { GetApiInputFromOutput, SWRHookConfig } from '../../../../types.js'

export { TokenPriceV1ApiSchema }
export type TokenPrice = Awaited<ReturnType<typeof getPrice>>
export type GetTokenPriceArgs = GetApiInputFromOutput<
  (typeof TokenPriceV1ApiSchema)['_input'],
  (typeof TokenPriceV1ApiSchema)['_output']
>

export function getTokenPriceUrl(args: GetTokenPriceArgs) {
  return `${TOKEN_PRICE_API}/api/v1?${parseArgs(args)}}`
}

export const getTokenPrice = async (args: GetTokenPriceArgs): Promise<TokenPrice> => {
  return fetch(getTokenPriceUrl(args)).then((data) => data.json())
}

export const useTokenPriceChain = ({ args, shouldFetch }: SWRHookConfig<GetTokenPriceArgs>) => {
  return useSWR<TokenPrice>(shouldFetch !== false ? getTokenPriceUrl(args) : null, async (url) =>
    fetch(url).then((data) => data.json())
  )
}
