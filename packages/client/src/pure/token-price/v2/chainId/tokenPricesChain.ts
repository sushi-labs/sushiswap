import type {} from '@sushiswap/database'
import { getPrices } from '@sushiswap/token-price-api/lib/api/v2'
import { TokenPricesChainV2ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v2/chainId/index'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import { parseArgs } from '../../../../functions.js'
import type { GetApiInputFromOutput } from '../../../../types.js'

export { TokenPricesChainV2ApiSchema }
export type TokenPricesChainV2 = Awaited<ReturnType<typeof getPrices>>
export type GetTokenPricesChainV2Args = GetApiInputFromOutput<
  typeof TokenPricesChainV2ApiSchema['_input'],
  typeof TokenPricesChainV2ApiSchema['_output']
>

export function getTokenPricesChainV2Url(args: GetTokenPricesChainV2Args) {
  return `${TOKEN_PRICE_API}/api/v2/${args.chainId}?${parseArgs(args)}`
}

export const getTokenPricesChainV2 = async (
  args: GetTokenPricesChainV2Args,
): Promise<TokenPricesChainV2> => {
  return fetch(getTokenPricesChainV2Url(args)).then((data) => data.json())
}
