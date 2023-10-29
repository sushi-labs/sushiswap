import invariant from 'tiny-invariant'
import { Address, getAddress } from 'viem'

import { Currency } from './Currency.js'
import { type Type } from './Type.js'
import { type SerializedToken, tokenSchema } from './zod.js'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly id: string
  public readonly isNative = false as const
  public readonly isToken = true as const
  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: Address

  public constructor({
    // TODO:
    // id,
    chainId,
    address,
    decimals,
    symbol,
    name,
  }: {
    chainId: number | string
    address: string
    decimals: number | string
    symbol?: string | undefined
    name?: string | undefined
  }) {
    super({
      chainId,
      decimals,
      symbol,
      name,
    })
    try {
      this.address = getAddress(address)
      this.id = `${chainId}:${address}`
    } catch {
      throw `${address} is not a valid address`
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
