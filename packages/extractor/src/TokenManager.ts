import { erc20Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { Address } from 'viem'

import { MultiCallAggregator } from './MulticallAggregator'
import { PermanentCache } from './PermanentCache'

interface TokenCacheRecord {
  address: Address
  name: string
  symbol: string
  decimals: number
}

export class TokenManager {
  client: MultiCallAggregator
  tokens: Map<Address, Token> = new Map()
  tokenPermanentCache: PermanentCache<TokenCacheRecord>

  constructor(client: MultiCallAggregator, ...paths: string[]) {
    this.client = client
    this.tokenPermanentCache = new PermanentCache(...paths)
  }

  async addCachedTokens() {
    const cachedRecords = await this.tokenPermanentCache.getAllRecords()
    cachedRecords.forEach((r) => {
      this.addToken(
        new Token({
          ...r,
          chainId: this.client.client.chain?.id as ChainId,
        }),
        false
      )
    })
  }

  addToken(token: Token, addToCache = true) {
    const addr = token.address.toLowerCase() as Address
    if (!this.tokens.has(addr)) {
      this.tokens.set(addr, token)
      if (addToCache) {
        // no await - don't wait it
        this.tokenPermanentCache.add({
          address: token.address as Address,
          name: token.name as string,
          symbol: token.symbol as string,
          decimals: token.decimals,
        })
      }
    }
  }
  addTokens(tokens: Token[]) {
    tokens.forEach((t) => this.addToken(t))
  }

  async findToken(address: Address): Promise<Token | undefined> {
    const addr = address.toLowerCase() as Address
    const cached = this.tokens.get(addr)
    if (cached !== undefined) return cached

    try {
      const [decimals, symbol, name] = await Promise.all([
        this.client.callValue(address, erc20Abi, 'decimals'),
        this.client.callValue(address, erc20Abi, 'symbol'),
        this.client.callValue(address, erc20Abi, 'name'),
      ])

      const newToken = new Token({
        chainId: this.client.client.chain?.id as ChainId,
        address: address,
        decimals: Number(decimals as bigint),
        symbol: symbol as string,
        name: name as string,
      })
      this.addToken(newToken)
      return newToken
    } catch (e) {
      return undefined
    }
  }

  getKnownToken(addr: Address): Token | undefined {
    return this.tokens.get(addr.toLowerCase() as Address)
  }
}
