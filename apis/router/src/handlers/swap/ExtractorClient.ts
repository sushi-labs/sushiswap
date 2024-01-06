import { PoolCode } from '@sushiswap/router'
import { ChainId, Type } from 'sushi/chain'
import { Native, Token } from 'sushi/currency'

export class ExtractorClient {
  chainId: ChainId
  tokenMap: Map<string, Token> = new Map()
  poolCodes: PoolCode[] = []

  constructor(chainId: ChainId) {
    this.chainId = chainId
  }

  getTokens(...addresses: string[]): Type | Promise<Type> {
    const tokens = addresses.map((addr) => {
      const addrL = addr.toLowerCase()
      if (addrL === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        return Native.onChain(this.chainId)
      return this.tokenMap.get(addrL)
    })
  }
}
