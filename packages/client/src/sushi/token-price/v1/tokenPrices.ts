import useSWR from 'swr'

import { getPrices } from '@sushiswap/token-price-api/lib/api'
import { TokenPricesV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../constants'
import { parseArgs } from '../../../functions'
import type { GetApiInputFromOutput, SWRHookConfig } from '../../../types'

export { TokenPricesV1ApiSchema }
export type TokenPrices = Awaited<ReturnType<typeof getPrices>>
export type GetTokenPricesArgs = GetApiInputFromOutput<
  typeof TokenPricesV1ApiSchema['_input'],
  typeof TokenPricesV1ApiSchema['_output']
>

export function getTokenPricesUrl(args?: GetTokenPricesArgs) {
  return `${TOKEN_PRICE_API}/api/v1?${parseArgs(args)}}`
}

export const getTokenPrices = async (
  args?: GetTokenPricesArgs,
): Promise<TokenPrices> => {
  return fetch(getTokenPricesUrl(args)).then((data) => data.json())
}

export const useTokenPrices = ({
  args,
  shouldFetch,
}: SWRHookConfig<GetTokenPricesArgs>) => {
  return useSWR<TokenPrices>(
    shouldFetch !== false ? getTokenPricesUrl(args) : null,
    async (url) => fetch(url).then((data) => data.json()),
  )
}
