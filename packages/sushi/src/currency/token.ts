import invariant from 'tiny-invariant'
import { type Address, getAddress } from 'viem'
import type { ID } from '../types/id.js'
import { Currency } from './currency.js'
import { type Type } from './type.js'
import { type SerializedToken, tokenSchema } from './zod.js'
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly id: ID
  public readonly isNative = false as const
  public readonly isToken = true as const

  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: Address

  /**
   * Relevant for fee-on-transfer (FOT) token taxes,
   * Not every ERC20 token is FOT token, so this field is optional
   */
  public readonly buyFeeBps?: bigint
  public readonly sellFeeBps?: bigint

  public constructor({
    // TODO:
    // id,
    chainId,
    address,
    decimals,
    symbol,
    name,
    buyFeeBps,
    sellFeeBps,
    logoUrl,
    approved,
  }: {
    chainId: number | string
    address: string
    decimals: number | string
    symbol?: string | undefined
    name?: string | undefined
    buyFeeBps?: bigint
    sellFeeBps?: bigint
    logoUrl?: string | undefined
    approved?: boolean | undefined
  }) {
    super({
      chainId,
      decimals,
      symbol,
      name,
      logoUrl,
      approved,
    })
    try {
      this.address = getAddress(address)
      this.id = `${chainId}:${address}` as ID
      // this.tokenId = `${t.address || ''}_${t.chainId}`
    } catch {
      throw `${address} is not a valid address`
    }

    if (buyFeeBps) {
      invariant(buyFeeBps >= 0n, 'NON-NEGATIVE FOT FEES')
      this.buyFeeBps = buyFeeBps
    }
    if (sellFeeBps) {
      invariant(sellFeeBps >= 0n, 'NON-NEGATIVE FOT FEES')
      this.sellFeeBps = sellFeeBps
    }
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Type): boolean {
    return (
      other.isToken &&
      this.chainId === other.chainId &&
      this.address === other.address
    )
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }

  /**
   * Return this token, which does not need to be wrapped
   */
  public get wrapped(): Token {
    return this
  }

  // public get tokenURI(): string {
  //   return `tokens/${this.chainId}/${this.address}.jpg`
  // }

  /**
   * Serialize to JSON object
   */
  public serialize(): SerializedToken {
    return tokenSchema.parse({
      isNative: this.isNative,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      chainId: this.chainId,
      address: this.address,
    })
  }

  public static deserialize({
    name,
    symbol,
    address,
    decimals,
    chainId,
  }: SerializedToken): Token {
    return new Token({
      name,
      symbol,
      address,
      decimals,
      chainId,
    })
  }
}
