import { erc20Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { Address } from 'viem'

import { MultiCallAggregator } from './MulticallAggregator'
import { PermanentCache } from './PermanentCache'
import { warnLog } from './WarnLog'

interface TokenCacheRecord {
  address: Address
  name: string
  symbol: string
  decimals: number
}

// For some tokens that are not 100% ERC-20:
const SpecialTokens: Record<string, Omit<TokenCacheRecord, 'address'>> = {
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
    name: 'Maker Token',
    symbol: 'MKR',
    decimals: 18,
  },
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
        false,
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
    const special = SpecialTokens[addr]
    if (special) {
      const newToken = new Token({
        chainId: this.client.client.chain?.id as ChainId,
        address: address,
        decimals: special.decimals,
        symbol: special.symbol,
        name: special.name,
      })
      this.addToken(newToken)
      return newToken
    }

    try {
      const [decimals, symbol, name] = await Promise.allSettled([
        this.client.callValue(address, erc20Abi, 'decimals'),
        this.client.callValue(address, erc20Abi, 'symbol'),
        this.client.callValue(address, erc20Abi, 'name'),
      ])

      const newToken = new Token({
        chainId: this.client.client.chain?.id as ChainId,
        address: address,
        decimals:
          decimals.status === 'fulfilled'
            ? Number(decimals.value as bigint)
            : 18,
        symbol:
          symbol.status === 'fulfilled'
            ? (symbol.value as string)
            : `Unknown_${address.substring(2, 10)}`,
        name:
          name.status === 'fulfilled'
            ? (name.value as string)
            : `Unknown_${address.substring(2, 10)}`,
      })
      this.addToken(newToken)
      return newToken
    } catch (_e) {
      warnLog(
        this.client.client.chain?.id,
        `Token downloading error ${address}`,
      )
      return undefined
    }
  }

  getKnownToken(addr: Address): Token | undefined {
    return this.tokens.get(addr.toLowerCase() as Address)
  }
}
