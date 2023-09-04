import type {} from '@sushiswap/database'
import type { getPrice } from '@sushiswap/token-price-api/lib/api.js'
import { TokenPriceV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1/chainId/address'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import { parseArgs } from '../../../../functions.js'
import type { GetApiInputFromOutput } from '../../../../types.js'

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
