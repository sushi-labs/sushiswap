import type { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { Address, getAddress, isAddress } from 'viem'
import type { ChainId } from '../chain/index.js'
import { Token, Type } from '../currency/index.js'

type TagDetails = Tags[keyof Tags]

interface TagInfo extends TagDetails {
  id: string
}
/**
 * Token instances created from token info on a token list.
 */
export class WrappedTokenInfo implements Token {
  public readonly id: string
  public readonly isNative = false as const
  public readonly isToken = true as const
  public readonly list?: TokenList | undefined

  public readonly tokenInfo: TokenInfo

  constructor(tokenInfo: TokenInfo, list?: TokenList) {
    this.id = `${tokenInfo.chainId}:${tokenInfo.address}`
    this.tokenInfo = tokenInfo
    this.list = list
  }

  private _checksummedAddress: Address | null = null

  public get address(): Address {
    if (this._checksummedAddress) return this._checksummedAddress
    if (!isAddress(this.tokenInfo.address))
      throw new Error(`Invalid token address: ${this.tokenInfo.address}`)
    this._checksummedAddress = getAddress(this.tokenInfo.address)
    return this._checksummedAddress
  }

  public get chainId(): ChainId {
    return this.tokenInfo.chainId as ChainId
  }

  public get decimals(): number {
    return this.tokenInfo.decimals
  }

  public get name(): string {
    return this.tokenInfo.name
  }

  public get symbol(): string {
    return this.tokenInfo.symbol
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }

  private _tags: TagInfo[] | null = null
  public get tags(): TagInfo[] {
    if (this._tags !== null) return this._tags
    if (!this.tokenInfo.tags) {
      this._tags = []
      return this._tags
    }
    const listTags = this.list?.tags
    if (!listTags) {
      this._tags = []
      return this._tags
    }
    this._tags = this.tokenInfo.tags.map((tagId) => {
      return {
        ...listTags[tagId],
        id: tagId,
      } as TagInfo
    })
    return this._tags
  }

  equals(other: Type): boolean {
    return (
      other.chainId === this.chainId &&
      other.isToken &&
      other.address.toLowerCase() === this.address.toLowerCase()
    )
  }

  sortsBefore(other: Token): boolean {
    if (this.equals(other)) throw new Error('Addresses should not be equal')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  public get wrapped(): Token {
    return this
  }

  public serialize() {
    return {
      type: 'token',
      isNative: this.isNative,
      isToken: this.isToken,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      chainId: this.chainId,
      address: this.address,
    }
  }
}
