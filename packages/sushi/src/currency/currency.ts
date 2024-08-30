import invariant from 'tiny-invariant'
import { ChainId } from '../chain/index.js'
import type { Token } from './token.js'
import type { Type } from './type.js'
/**
 * A currency is any fungible financial instrument, including Ether, all ERC20 tokens, and other chain-native currencies
 */
export abstract class Currency {
  /**
   * Returns whether the currency is native to the chain and must be wrapped (e.g. Ether)
   */
  public abstract readonly isNative: boolean
  /**
   * Returns whether the currency is a token that is usable in Uniswap without wrapping
   */
  public abstract readonly isToken: boolean
  /**
   * The chain ID on which this currency resides
   */
  public readonly chainId: ChainId
  /**
   * The decimals used in representing currency amounts
   */
  public readonly decimals: number
  /**
   * The symbol of the currency, i.e. a short textual non-unique identifier
   */
  public readonly symbol?: string | undefined
  /**
   * The name of the currency, i.e. a descriptive textual non-unique identifier
   */
  public readonly name?: string | undefined
  /**
   * A link to the logo of the currency
   */
  public readonly logoUrl?: string | undefined
  /**
   * If the currency is approved
   */
  public readonly approved?: boolean | undefined

  /**
   * Constructs an instance of the abstract class `Currency`.
   * @param chainId the chain ID on which this currency resides
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   * @param rebase of the currency
   * @param logoUrl a link to the logo of the currency
   * @param approved if the currency is approved
   */
  protected constructor({
    chainId: _chainId,
    decimals: _decimals,
    symbol,
    name,
    logoUrl,
    approved,
  }: {
    chainId: number | string
    decimals: number | string
    symbol?: string | undefined
    name?: string | undefined
    logoUrl?: string | undefined
    approved?: boolean | undefined
  }) {
    const chainId = Number(_chainId) as ChainId
    const decimals = Number(_decimals)
    invariant(Number.isSafeInteger(chainId), 'CHAIN_ID')
    invariant(
      decimals >= 0 && decimals < 255 && Number.isInteger(decimals),
      'DECIMALS',
    )

    this.chainId = chainId
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
    this.logoUrl = logoUrl
    this.approved = approved
  }

  /**
   * Returns whether this currency is functionally equivalent to the other currency
   * @param other the other currency
   */
  public abstract equals(other: Type): boolean

  /**
   * Return the wrapped version of this currency
   */
  public abstract get wrapped(): Token
}
