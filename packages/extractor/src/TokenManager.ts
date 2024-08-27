import { nativeToken } from 'sushi'
import { erc20Abi, erc20Abi_bytes32 } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { Address, Hex, hexToString, trim } from 'viem'
import { Logger } from './Logger.js'
import { MultiCallAggregator } from './MulticallAggregator.js'
import { PermanentCache } from './PermanentCache.js'

interface TokenCacheRecord {
  address: Address
  name: string
  symbol: string
  decimals: number
}

// For some tokens that are not 100% ERC-20:
const SpecialTokens: Partial<
  Record<ChainId, Record<string, Omit<TokenCacheRecord, 'address'>>>
> = {
  [ChainId.ETHEREUM]: {
    '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': {
      name: 'DGD',
      symbol: 'DGD',
      decimals: 9,
    },
  },
  [ChainId.SKALE_EUROPA]: {
    '0xD2Aaa00700000000000000000000000000000000': {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
}

export class TokenManager {
  client: MultiCallAggregator
  tokens: Map<Address, Token> = new Map()
  tokenPermanentCache: PermanentCache<TokenCacheRecord>
  cacheTokensAddingPromise?: Promise<void>

  constructor(
    client: MultiCallAggregator,
    cacheReadOnly: boolean,
    ...paths: string[]
  ) {
    this.client = client
    this.tokenPermanentCache = new PermanentCache(cacheReadOnly, ...paths)
    // this.addToken(nativeToken(client.chainId), false)
  }

  async addCachedTokens() {
    if (this.cacheTokensAddingPromise) {
      // protecting agains multiple cache reading
      return await this.cacheTokensAddingPromise
    }
    const cachedRecordsPromise = this.tokenPermanentCache.getAllRecords()
    this.cacheTokensAddingPromise =
      cachedRecordsPromise as Promise<unknown> as Promise<void>
    const cachedRecords = await cachedRecordsPromise
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
    const special =
      SpecialTokens?.[this.client.chainId as keyof typeof SpecialTokens]?.[
        address
      ]
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
      const [decimalsR, symbolR, nameR] = await Promise.allSettled([
        this.client.callValue(address, erc20Abi, 'decimals'),
        this.client.callValue(address, erc20Abi, 'symbol'),
        this.client.callValue(address, erc20Abi, 'name'),
      ])
      if (decimalsR.status === 'rejected') {
        // most probable there is no token at this address
        Logger.error(
          this.client.client.chain?.id,
          `Unexisted token request ${address}`,
          new Error('Stack'),
        )
        return
      }
      if (symbolR.status === 'rejected' || nameR.status === 'rejected') {
        // In the chance that there is an error upon decoding the contract result,
        // it could be likely that the contract data is represented as bytes32 instead
        // of a string.
        try {
          const [decimals, symbol, name] = await Promise.all([
            this.client.callValue(address, erc20Abi_bytes32, 'decimals'),
            this.client.callValue(address, erc20Abi_bytes32, 'symbol'),
            this.client.callValue(address, erc20Abi_bytes32, 'name'),
          ])

          const newToken = new Token({
            chainId: this.client.client.chain?.id as ChainId,
            address: address,
            decimals: Number(decimals as bigint),
            name: hexToString(trim(name as Hex, { dir: 'right' })),
            symbol: hexToString(trim(symbol as Hex, { dir: 'right' })),
          })
          this.addToken(newToken)
          return newToken
        } catch (e) {
          Logger.error(
            this.client.client.chain?.id,
            `Token bytes32 downloading error ${address}`,
            e,
          )
        }
        return
      }

      const newToken = new Token({
        chainId: this.client.client.chain?.id as ChainId,
        address: address,
        decimals: Number(decimalsR.value as bigint),
        symbol: symbolR.value as string,
        name: nameR.value as string,
      })
      this.addToken(newToken)
      return newToken
    } catch (e) {
      Logger.error(
        this.client.client.chain?.id,
        `Token downloading error ${address}`,
        e,
      )
    }
  }

  getKnownToken(addr: Address): Token | undefined {
    return this.tokens.get(addr.toLowerCase() as Address)
  }
}
