import type {} from '@sushiswap/database'
import { getPrice } from '@sushiswap/token-price-api/lib/api/v2'
import { TokenPriceV2ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v2/chainId/address'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import { parseArgs } from '../../../../functions.js'
import type { GetApiInputFromOutput } from '../../../../types.js'

export { TokenPriceV2ApiSchema }
export type TokenPriceV2 = Awaited<ReturnType<typeof getPrice>>
export type GetTokenPriceV2Args = GetApiInputFromOutput<
  typeof TokenPriceV2ApiSchema['_input'],
  typeof TokenPriceV2ApiSchema['_output']
>

export function getTokenPriceV2Url(args: GetTokenPriceV2Args) {
  return `${TOKEN_PRICE_API}/api/v2?${parseArgs(args)}}`
}

export const getTokenPriceV2 = async (
  args: GetTokenPriceV2Args,
): Promise<TokenPriceV2> => {
  return fetch(getTokenPriceV2Url(args)).then((data) => data.json())
}
