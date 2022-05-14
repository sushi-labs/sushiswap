import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'

import { Currency } from './Currency'
import { Type } from './Type'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly isNative: false = false
  public readonly isToken: true = true
  /**
   * The contract address on the chain on which this token lives
   */
  public readonly address: string

  public constructor(token: { chainId: number; address: string; decimals: number; symbol?: string; name?: string }) {
    super(token)
    try {
      this.address = getAddress(token.address)
    } catch {
      throw `${token.address} is not a valid address`
    }
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Type): boolean {
    return other.isToken && this.chainId === other.chainId && this.address === other.address
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
}
