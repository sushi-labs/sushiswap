import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Token as TokenDTO } from '@sushiswap/graph-client'

export function toToken(token: TokenDTO, chainId: ChainId): Token {
  return new Token({
    chainId,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}
