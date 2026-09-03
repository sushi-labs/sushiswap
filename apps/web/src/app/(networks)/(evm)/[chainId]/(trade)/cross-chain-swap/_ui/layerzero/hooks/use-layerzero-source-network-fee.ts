import { useQuery } from '@tanstack/react-query'
import {
  type LayerZeroFeeClient,
  type LayerZeroSourceNetworkFeeEstimate,
  estimateLayerZeroSourceNetworkFee,
} from 'src/lib/swap/layerzero/source-network-fee'
import type { LayerZeroQuote } from 'src/lib/swap/layerzero/types'
import { serialize } from 'wagmi'

export type LayerZeroSourceNetworkFee =
  | LayerZeroSourceNetworkFeeEstimate
  | { status: 'connect-wallet' | 'loading' | 'unavailable' }

export function useLayerZeroSourceNetworkFee({
  quote,
  enabled,
  publicClient,
}: {
  quote: LayerZeroQuote | undefined
  enabled: boolean
  publicClient: LayerZeroFeeClient | undefined
}): LayerZeroSourceNetworkFee {
  const connected = Boolean(quote?.sourceAddress && quote.recipient)
  const query = useQuery({
    // Include all send parameters, fee cap, and accounts; never reuse an
    // estimate for a different transfer or serialize raw bigint query keys.
    queryKey: ['layerzero-source-network-fee', serialize(quote)],
    queryFn: () => {
      if (!quote) throw new Error('No LayerZero quote')
      return estimateLayerZeroSourceNetworkFee({ quote, publicClient })
    },
    enabled: enabled && connected,
    staleTime: 30_000,
    refetchInterval: 30_000,
    retry: false,
  })

  if (!connected) return { status: 'connect-wallet' }
  if (!enabled || query.isError) return { status: 'unavailable' }
  if (!query.data) return { status: 'loading' }
  return query.data
}
