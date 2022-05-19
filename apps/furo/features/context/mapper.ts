import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'

import { TokenRepresentation } from './representations'

export function toToken(token: TokenRepresentation): Token {
  return new Token({
    // TODO: make dynamic
    chainId: ChainId.ETHEREUM,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}
