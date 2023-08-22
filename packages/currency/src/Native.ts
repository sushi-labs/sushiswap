import { chains } from '@sushiswap/chain'
import invariant from 'tiny-invariant'

import { WNATIVE } from './constants/tokens'
import { Currency } from './Currency'
import { Token } from './Token'
import { Type } from './Type'
import { nativeSchema, SerializedNative } from './zod'

export class Native extends Currency {
  public readonly id: string
  public readonly isNative = true as const
  public readonly isToken = false as const
  public readonly symbol: string
  public readonly name: string
  protected constructor(native: { chainId: number; decimals: number; symbol: string; name: string }) {
    super(native)
    this.id = `${native.chainId}:NATIVE`
    this.symbol = native.symbol
    this.name = native.name
  }
  public get wrapped(): Token {
    const wnative = WNATIVE[this.chainId]
    invariant(!!wnative, 'WRAPPED')
    return wnative
  }

  // public get tokenURI(): string {
  //   return `native-currency/${this.symbol.toLowerCase()}.svg`
  // }

  private static cache: Record<number, Native> = {}

  public static onChain(chainId: number): Native {
    if (chainId in this.cache) {
      return this.cache[chainId]
    }

    invariant(!!(chainId in chains), 'CHAINS')

    const { nativeCurrency } = chains[chainId]

    invariant(!!nativeCurrency, 'NATIVE_CURRENCY')

    const { decimals, name, symbol } = nativeCurrency

    this.cache[chainId] = new Native({
      chainId,
      decimals,
      name,
      symbol,
    })

    return this.cache[chainId]
  }

  public equals(other: Type): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  public serialize(): SerializedNative {
    return nativeSchema.parse({
      isNative: this.isNative,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      chainId: this.chainId,
    })
  }

  public static deserialize(native: SerializedNative): Native {
    return Native.onChain(native.chainId)
  }
}
