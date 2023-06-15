import { erc20Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Address } from 'viem'

import { MultiCallAggregator } from './MulticallAggregator'

export class TokenManager {
  client: MultiCallAggregator
  tokens: Map<Address, Token> = new Map()

  constructor(client: MultiCallAggregator) {
    this.client = client
  }

  addToken(token: Token) {
    this.tokens.set(token.address as Address, token)
  }
  addTokens(tokens: Token[]) {
    tokens.forEach((t) => this.tokens.set(t.address as Address, t))
  }

  async findToken(addr: Address): Promise<Token | undefined> {
    const cached = this.tokens.get(addr)
    if (cached !== undefined) return cached

    try {
      const [decimals, symbol, name] = await Promise.all([
        this.client.callValue(addr, erc20Abi, 'decimals'),
        this.client.callValue(addr, erc20Abi, 'symbol'),
        this.client.callValue(addr, erc20Abi, 'name'),
      ])

      const newToken = new Token({
        chainId: this.client.client.chain?.id as ChainId,
        address: addr,
        decimals: Number(decimals as bigint),
        symbol: symbol as string,
        name: name as string,
      })
      this.tokens.set(addr, newToken)
      return newToken
    } catch (e) {
      return undefined
    }
  }
}
