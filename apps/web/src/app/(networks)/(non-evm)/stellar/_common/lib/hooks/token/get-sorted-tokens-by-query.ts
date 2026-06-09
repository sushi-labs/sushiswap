import type { StellarToken } from 'sushi/stellar'

const alwaysTrue = () => true

export function createTokenFilterFunction<
  T extends StellarToken<{ domain?: string }>,
>(search: string): (tokens: T) => boolean {
  // Check if searching by Stellar contract address (starts with C and is 56 chars)
  if (search.startsWith('C') && search.length >= 10) {
    return (t: T) => search.toUpperCase() === t.address
  }

  const lowerSearchParts = search
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (lowerSearchParts.length === 0) return alwaysTrue

  const matchesSearch = (s: string | undefined): boolean => {
    if (!s) return false

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

  return (t: T): boolean =>
    matchesSearch(t.symbol) ||
    matchesSearch(t.name) ||
    matchesSearch(t.metadata?.domain)
}

export function filterTokens<T extends StellarToken>(
  tokens: T[],
  search: string,
): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const tokenComparator = () => {
  return (tokenA: StellarToken, tokenB: StellarToken): number => {
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

export function getSortedTokensByQuery(
  tokens: StellarToken[] | undefined,
  searchQuery: string,
): StellarToken[] {
  const sortedTokens = tokens ? tokens.toSorted(tokenComparator()) : []

  const symbolMatch = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (symbolMatch.length !== 1) {
    return sortedTokens
  }

  const exactMatches: StellarToken[] = []
  const symbolSubstrings: StellarToken[] = []
  const rest: StellarToken[] = []

  // sort tokens by exact match -> substring on symbol match -> rest
  for (const token of sortedTokens) {
    if (token.symbol?.toLowerCase() === symbolMatch[0]) {
      exactMatches.push(token)
    } else if (token.symbol?.toLowerCase().startsWith(symbolMatch[0]!)) {
      symbolSubstrings.push(token)
    } else {
      rest.push(token)
    }
  }

  return [...exactMatches, ...symbolSubstrings, ...rest]
}
