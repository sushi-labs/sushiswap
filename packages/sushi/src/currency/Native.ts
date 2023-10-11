import invariant from 'tiny-invariant'
import { natives } from '../chain/index.js'

import { Currency } from './Currency.js'
import { Token } from './Token.js'
import { type Type } from './Type.js'
import { WNATIVE } from './constants/tokens.js'
import { type SerializedNative, nativeSchema } from './zod.js'

export class Native extends Currency {
  public readonly id: string
  public readonly isNative = true as const
  public readonly isToken = false as const
  public override readonly symbol: string
  public override readonly name: string
  protected constructor(native: {
    chainId: number
    decimals: number
    symbol: string
    name: string
  }) {
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
    const cached = this.cache[chainId]

    if (typeof cached !== 'undefined') {
      return cached
    }

    const nativeCurrency = natives?.[chainId]

    invariant(!!nativeCurrency, 'NATIVE_CURRENCY')

    const { decimals, name, symbol } = nativeCurrency

    const native = new Native({
      chainId,
      decimals,
      name,
      symbol,
    })

    this.cache[chainId] = new Native({
      chainId,
      decimals,
      name,
      symbol,
    })

    return native
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
