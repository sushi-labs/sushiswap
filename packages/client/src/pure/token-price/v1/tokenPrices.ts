import { getPrices } from '@sushiswap/token-price-api/lib/api.js'
import { TokenPricesV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../constants.js'
import { parseArgs } from '../../../functions.js'
import type { GetApiInputFromOutput } from '../../../types.js'

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
