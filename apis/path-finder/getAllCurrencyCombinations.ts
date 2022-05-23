import { Token } from '@sushiswap/currency'
import flatMap from 'lodash.flatmap'

export const BASES_TO_CHECK_TRADES_AGAINST: { readonly [chainId: number]: Token[] } = {}

export const ADDITIONAL_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {}

export const CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: Token[] }
} = {}

export function getAllCurrencyCombinations(
  chainId: number,
  tokenIn: { chainId: number; address: string; decimals: number; symbol?: string; name?: string },
  tokenOut: { chainId: number; address: string; decimals: number; symbol?: string; name?: string }
) {
  const [currencyA, currencyB] = [new Token(tokenIn), new Token(tokenOut)]

  const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

  const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
  const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
  const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

  const bases: Token[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Token, Token][] = flatMap(bases, (base): [Token, Token][] =>
    bases.map((otherBase) => [base, otherBase])
  )

  if (!tokenA || !tokenB) {
    return []
  }

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
    .filter(([t0, t1]) => t0.address !== t1.address)
    .filter(([tokenA, tokenB]) => {
      if (!chainId) return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
      const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

      if (!customBasesA && !customBasesB) return true

      if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false
      if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false

      return true
    })
}
