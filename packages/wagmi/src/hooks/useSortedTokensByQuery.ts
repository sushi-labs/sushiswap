'use client'

import { isAddress } from 'viem'
import { Amount, Token, Type } from 'sushi/currency'
import { Fraction } from 'sushi'
import { useMemo } from 'react'

const alwaysTrue = () => true

/**
 * Create a filter function to apply to a token for whether it matches a particular search query
 * @param search the search query to apply to the token
 */
export function createTokenFilterFunction<T extends Token>(
  search: string,
): (tokens: T) => boolean {
  const isValidAddress = isAddress(search)

  if (isValidAddress) {
    return (t: T) => search.toLowerCase() === t.address.toLowerCase()
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string): boolean => {
    const sParts = s
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    return lowerSearchParts.every(
      (p) =>
        p.length === 0 ||
        sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)),
    )
  }

  return ({ name, symbol }: T): boolean =>
    Boolean((symbol && matchesSearch(symbol)) || (name && matchesSearch(name)))
}

export function filterTokens<T extends Token>(
  tokens: T[],
  search: string,
): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const balanceComparator = (
  balanceA?: Amount<Type>,
  balanceB?: Amount<Type>,
) => {
  if (balanceA && balanceB) {
    if (balanceA.asFraction.equalTo(balanceB.asFraction)) return 0
    return balanceA.asFraction.greaterThan(balanceB.asFraction) ? -1 : 1
  } else if (balanceA?.greaterThan('0')) {
    return -1
  } else if (balanceB?.greaterThan('0')) {
    return 1
  }
  return 0
}

export const tokenComparator = (
  balancesMap: Record<string, Amount<Type>> | undefined,
  pricesMap: Record<string, Fraction> | undefined,
) => {
  return (tokenA: Token, tokenB: Token): number => {
    const priceA = pricesMap?.[tokenA.address]
      ? balancesMap?.[tokenA.address]?.multiply(pricesMap[tokenA.address])
      : undefined
    const priceB = pricesMap?.[tokenB.address]
      ? balancesMap?.[tokenB.address]?.multiply(pricesMap[tokenB.address])
      : undefined

    const priceComp = balanceComparator(priceA, priceB)
    if (priceComp !== 0) {
      return priceComp
    }

    const balanceComp = balanceComparator(
      balancesMap?.[tokenA.address],
      balancesMap?.[tokenB.address],
    )
    if (balanceComp !== 0) {
      return balanceComp
    }

    if (tokenA.symbol && tokenB.symbol) {
      // sort by symbol
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

export function getSortedTokensByQuery(
  tokens: Token[] | undefined,
  searchQuery: string,
): Token[] {
  if (!tokens) {
    return []
  }

  if (searchQuery === '') {
    return tokens
  }

  const symbolMatch = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (symbolMatch.length > 1) {
    return tokens
  }

  const exactMatches: Token[] = []
  const symbolSubstrings: Token[] = []
  const rest: Token[] = []

  // sort tokens by exact match -> subtring on symbol match -> rest
  tokens.map((token) => {
    if (token.symbol?.toLowerCase() === symbolMatch[0]) {
      return exactMatches.push(token)
    } else if (
      token.symbol?.toLowerCase().startsWith(searchQuery.toLowerCase().trim())
    ) {
      return symbolSubstrings.push(token)
    } else {
      return rest.push(token)
    }
  })

  return [...exactMatches, ...symbolSubstrings, ...rest]
}

export function useSortedTokensByQuery(
  tokens: Token[] | undefined,
  searchQuery: string,
): Token[] {
  return useMemo(
    () => getSortedTokensByQuery(tokens, searchQuery),
    [tokens, searchQuery],
  )
}
