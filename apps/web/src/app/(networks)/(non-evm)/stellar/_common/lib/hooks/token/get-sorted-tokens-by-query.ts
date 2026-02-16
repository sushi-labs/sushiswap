import type { Token } from '~stellar/_common/lib/types/token.type'

const alwaysTrue = () => true

export function createTokenFilterFunction<T extends Token>(
  search: string,
): (tokens: T) => boolean {
  // Check if searching by Stellar contract address (starts with C and is 56 chars)
  if (search.startsWith('C') && search.length >= 10) {
    return (t: T) => search.toUpperCase() === t.contract.toUpperCase()
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

  return ({ name, code }: T): boolean =>
    Boolean((code && matchesSearch(code)) || (name && matchesSearch(name)))
}

export function filterTokens<T extends Token>(
  tokens: T[],
  search: string,
): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const tokenComparator = () => {
  return (tokenA: Token, tokenB: Token): number => {
    if (tokenA.code && tokenB.code) {
      return tokenA.code.toLowerCase() < tokenB.code.toLowerCase() ? -1 : 1
    } else {
      return tokenA.code ? -1 : tokenB.code ? -1 : 0
    }
  }
}

export function getSortedTokensByQuery(
  tokens: Token[] | undefined,
  searchQuery: string,
): Token[] {
  const sortedTokens = tokens ? tokens.toSorted(tokenComparator()) : []

  const symbolMatch = searchQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0)

  if (symbolMatch.length !== 1) {
    return sortedTokens
  }

  const exactMatches: Token[] = []
  const symbolSubstrings: Token[] = []
  const rest: Token[] = []

  // sort tokens by exact match -> substring on code match -> rest
  for (const token of sortedTokens) {
    if (token.code?.toLowerCase() === symbolMatch[0]) {
      exactMatches.push(token)
    } else if (token.code?.toLowerCase().startsWith(symbolMatch[0])) {
      symbolSubstrings.push(token)
    } else {
      rest.push(token)
    }
  }

  return [...exactMatches, ...symbolSubstrings, ...rest]
}
