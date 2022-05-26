
  
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'

import { TokenRepresentation } from './representations'

export function toToken(token: TokenRepresentation, chainId: ChainId): Token {
  return new Token({
    chainId,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}