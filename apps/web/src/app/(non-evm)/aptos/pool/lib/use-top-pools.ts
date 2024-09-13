import {
  TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { tokenlists } from '~aptos/(common)/config/tokenlists'
import { Token } from '~aptos/(common)/lib/types/token'

interface UseTopPools {
  enabled?: boolean
}

export type TopPool = TopNonEvmPools[number] & { token0: Token; token1: Token }

export function useTopPools(
  { enabled = true }: UseTopPools = { enabled: true },
) {
  const tokens = useMemo(
    () =>
      tokenlists.mainnet.tokens.reduce<Record<string, Token>>(
        (
          acc,
          { address, decimals, name, symbol: _symbol, logoURI, ...rest },
        ) => {
          let symbol: string = _symbol

          if ('panoraSymbol' in rest) {
            symbol = rest.panoraSymbol
          }

          acc[address] = {
            name,
            decimals,
            symbol,
            address,
            logoURI,
          }
          return acc
        },
        {},
      ),
    [],
  )

  return useQuery({
    queryKey: ['pools', { chainId: 'aptos' }],
    queryFn: async () => {
      const pools = await getTopNonEvmPools({ chainId: 'aptos' })

      return pools.map((pool) => ({
        ...pool,
        token0: tokens?.[pool.token0Address],
        token1: tokens?.[pool.token1Address],
      })) as TopPool[]
    },
    enabled: Boolean(enabled),
  })
}
