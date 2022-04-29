import invariant from 'tiny-invariant'
import CHAIN from '@sushiswap/chain'
import { Currency } from './Currency'
import { Token } from './Token'
import { Type } from './Type'

export const WNATIVE: Record<number, Token> = {
  [1]: new Token({
    chainId: 1,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
  }),
}

export class Native extends Currency {
  public readonly isNative: true = true
  public readonly isToken: false = false
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
