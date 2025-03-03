import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { SupportedNetwork } from '~aptos/_common/config/chains'
import { tokenlists } from '~aptos/_common/config/tokenlists'
import type { Token } from '~aptos/_common/lib/types/token'
import { useNetwork } from './use-network'

const fetchCommonTokensQueryFn = async ({
  network,
}: { network: SupportedNetwork }) => {
  const baseTokens = tokenlists[network].tokens

  // Define a set of allowed symbols for filtering
  const allowedSymbols = new Set([
    'APT',
    'lzWBTC',
    'lzUSDC',
    'lzUSDT',
    'lzWETH',
  ])

  return baseTokens.reduce<Record<string, Token>>(
    (acc, { address, decimals, name, symbol: _symbol, logoURI, ...rest }) => {
      let symbol: string = _symbol

      if ('panoraSymbol' in rest) {
        symbol = rest.panoraSymbol
      }

      // Only include tokens with the allowed symbols
      if (allowedSymbols.has(symbol)) {
        acc[address] = {
          name,
          decimals,
          symbol,
          address,
          logoURI,
        }
      }
      return acc
    },
    {},
  )
}

export function useCommonTokens() {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['common-tokens', { network }],
    queryFn: () => fetchCommonTokensQueryFn({ network }),
    placeholderData: keepPreviousData,
  })
}
