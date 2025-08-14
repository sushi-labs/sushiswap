import type { KadenaToken } from '~kadena/_common/types/token-type'

const alwaysTrue = () => true

export function createTokenFilterFunction<T extends KadenaToken>(
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

  return ({ tokenName, tokenSymbol }: T): boolean =>
    Boolean(
      (tokenSymbol && matchesSearch(tokenSymbol)) ||
        (tokenName && matchesSearch(tokenName)),
    )
}

export function filterTokens<T extends KadenaToken>(
  tokens: T[],
  search: string,
): T[] {
  return tokens.filter(createTokenFilterFunction(search))
}

export const tokenComparator = () => {
  return (tokenA: KadenaToken, tokenB: KadenaToken): number => {
    if (tokenA.tokenSymbol && tokenB.tokenSymbol) {
      return tokenA.tokenSymbol.toLowerCase() < tokenB.tokenSymbol.toLowerCase()
        ? -1
        : 1
    } else {
      return tokenA.tokenSymbol ? -1 : tokenB.tokenSymbol ? -1 : 0
    }
  }
}

export function getSortedTokensByQuery(
  tokens: KadenaToken[] | undefined,
  searchQuery: string,
): KadenaToken[] {
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

  const exactMatches: KadenaToken[] = []
  const symbolSubstrings: KadenaToken[] = []
  const rest: KadenaToken[] = []

  // sort tokens by exact match -> subtring on symbol match -> rest
  tokens.map((token) => {
    if (token.tokenSymbol?.toLowerCase() === symbolMatch[0]) {
      return exactMatches.push(token)
    } else if (
      token.tokenSymbol
        ?.toLowerCase()
        .startsWith(searchQuery.toLowerCase().trim())
    ) {
      return symbolSubstrings.push(token)
    } else {
      return rest.push(token)
    }
  })

  return [...exactMatches, ...symbolSubstrings, ...rest]
}
