import type { KvmToken } from 'sushi/kvm'

const alwaysTrue = () => true

export function createTokenFilterFunction<T extends KvmToken>(
  search: string,
): (tokens: T) => boolean {
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

export function filterTokens<T extends KvmToken>(
  tokens: T[],
  search: string,
): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const tokenComparator = () => {
  return (tokenA: KvmToken, tokenB: KvmToken): number => {
    if (tokenA.symbol && tokenB.symbol) {
      return tokenA.symbol.toLowerCase() < tokenB.symbol.toLowerCase() ? -1 : 1
    } else {
      return tokenA.symbol ? -1 : tokenB.symbol ? -1 : 0
    }
  }
}

export function getSortedTokensByQuery(
  tokens: KvmToken[] | undefined,
  searchQuery: string,
): KvmToken[] {
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

  const exactMatches: KvmToken[] = []
  const symbolSubstrings: KvmToken[] = []
  const rest: KvmToken[] = []

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
