import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { Native, Token } from '@sushiswap/currency'

import { userStreamsQuery } from '../.graphclient'

export function toToken(token: userStreamsQuery['incomingStreams'][0]['token'], chainId: ChainId): Token {
  if (token.id === AddressZero) {
    return Native.onChain(chainId).wrapped
  }

  return new Token({
    chainId,
    address: token.id,
    decimals: Number(token.decimals),
    symbol: token.symbol,
    name: token.name,
  })
}
