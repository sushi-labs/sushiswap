import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'

import { KOVAN_STAKING_Token as TokenDTO } from '../../../.graphclient'

export function toToken(token: TokenDTO, chainId: ChainId): Token {
  return new Token({
    chainId,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}
