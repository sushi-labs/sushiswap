import CHAIN from '@sushiswap/chain'
import invariant from 'tiny-invariant'

import { WNATIVE } from './constants'
import { Currency } from './Currency'
import { Token } from './Token'
import { Type } from './Type'

export class Native extends Currency {
  public readonly isNative = true as const
  public readonly isToken = false as const
  public readonly symbol: string
  public readonly name: string
  protected constructor(native: { chainId: number; decimals: number; symbol: string; name: string }) {
    super(native)
    this.symbol = native.symbol
    this.name = native.name
  }
  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId]
    invariant(!!wnative, 'WRAPPED')
    return wnative
  }

  private static cache: Record<number, Native> = {}

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }

    invariant(!!(chainId in CHAIN), 'CHAINS')

    const { nativeCurrency } = CHAIN[chainId]

    invariant(!!nativeCurrency, 'NATIVE_CURRENCY')

    const { decimals, name, symbol } = nativeCurrency

    return (this.cache[chainId] = new Native({ chainId, decimals, name, symbol }))
  }

  public equals(other: Type): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
