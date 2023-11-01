import { getPricesByChainId } from '@sushiswap/token-price-api/lib/api.js'
import { TokenPricesChainV1ApiSchema } from '@sushiswap/token-price-api/lib/schemas/v1/chainId'
import { fetch } from '@whatwg-node/fetch'

import { TOKEN_PRICE_API } from '../../../../constants.js'
import { parseArgs } from '../../../../functions.js'
import type { GetApiInputFromOutput } from '../../../../types.js'

export { TokenPricesChainV1ApiSchema }
export type TokenPricesChain = Awaited<ReturnType<typeof getPricesByChainId>>
export type GetTokenPricesChainArgs = GetApiInputFromOutput<
  typeof TokenPricesChainV1ApiSchema['_input'],
  typeof TokenPricesChainV1ApiSchema['_output']
>

export function getTokenPricesChainUrl(args: GetTokenPricesChainArgs) {
  return `${TOKEN_PRICE_API}/api/v1/${args.chainId}?${parseArgs(args)}`
}

export const getTokenPricesChain = async (
  args: GetTokenPricesChainArgs,
): Promise<TokenPricesChain> => {
  return fetch(getTokenPricesChainUrl(args)).then((data) => data.json())
}
