import { ChainId } from 'sushi/chain'
import { Token, Type } from 'sushi/currency'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
} from '@sushiswap/router-config'
import flatMap from 'lodash.flatmap'

export function getCurrencyCombinations(
  chainId: ChainId,
  currencyA: Type,
  currencyB: Type,
) {
  const [tokenA, tokenB] = chainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined]

  const common =
    chainId in BASES_TO_CHECK_TRADES_AGAINST
      ? BASES_TO_CHECK_TRADES_AGAINST[chainId]
      : []
  const additionalA = tokenA
    ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? []
    : []
  const additionalB = tokenB
    ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? []
    : []

  const bases: Token[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Token, Token][] = flatMap(
    bases,
    (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase]),
  )

  if (!tokenA || !tokenB) {
    return []
  }

  const combinations0: [Token, Token][] = [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Token, Token] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Token, Token] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Token, Token] =>
      Boolean(tokens[0] && tokens[1]),
    )
    .filter(([t0, t1]) => t0.address !== t1.address)
    .filter(([tokenA, tokenB]) => {
      if (!chainId) return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Token[] | undefined = customBases?.[tokenA.address]
      const customBasesB: Token[] | undefined = customBases?.[tokenB.address]

      if (!customBasesA && !customBasesB) return true

      if (customBasesA && !customBasesA.find((base) => tokenB.equals(base)))
        return false
      if (customBasesB && !customBasesB.find((base) => tokenA.equals(base)))
        return false

      return true
    })

  const combinationUniqueAndSorted: Map<string, [Token, Token]> = new Map()
  combinations0.forEach(([t0, t1]) => {
    const [s0, s1] = t0.sortsBefore(t1) ? [t0, t1] : [t1, t0]
    const id = s0.address + s1.address
    combinationUniqueAndSorted.set(id, [s0, s1])
  })
  return Array.from(combinationUniqueAndSorted.values())
}

export function getV3CurrencyCombinations(
  chainId: ChainId,
  currencyA: Type,
  currencyB: Type,
) {
  const [tokenA, tokenB] = chainId
    ? [currencyA?.wrapped, currencyB?.wrapped]
    : [undefined, undefined]

  const common =
    chainId in BASES_TO_CHECK_TRADES_AGAINST
      ? BASES_TO_CHECK_TRADES_AGAINST[chainId]
      : []

  if (!tokenA || !tokenB) {
    return []
  }

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...common.map((common): [Token, Token] => [tokenA, common]),
    // token B against all bases
    ...common.map((common): [Token, Token] => [tokenB, common]),
  ]
    .filter((tokens): tokens is [Token, Token] =>
      Boolean(tokens[0] && tokens[1]),
    )
    .filter(([t0, t1]) => t0.address !== t1.address)
}
